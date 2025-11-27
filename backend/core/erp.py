from fastapi import APIRouter
from datetime import datetime
from models.db import users_db, attendance_db

router = APIRouter(prefix="/erp", tags=["ERP"])


# ----------------------------- USERS MODULE ----------------------------- #

@router.post("/users")
def add_user(data: dict):
    """
    Add a new ERP user.
    Required: { "id": "CSE001", "name": "John Doe", "dept": "CSE" }
    """
    if not all(k in data for k in ["id", "name", "dept"]):
        return {"success": False, "message": "Missing fields (id, name, dept required)"}

    if users_db.find_one({"id": data["id"]}):
        return {"success": False, "message": "User ID already exists"}

    users_db.insert_one(data)
    return {"success": True, "message": "User added successfully"}


@router.get("/users")
def get_users():
    return {"success": True, "users": list(users_db.find({}, {"_id": 0}))}


@router.delete("/users/{id}")
def delete_user(id: str):
    users_db.delete_one({"id": id})
    return {"success": True, "message": "User deleted"}


# ------------------------ MANUAL ATTENDANCE ----------------------------- #

@router.post("/attendance")
def mark_attendance(data: dict):
    """
    Manually push a new timeline entry.
    Example:
      { "id": "CSE001", "type": "IN" }
      { "id": "CSE001", "type": "OUT", "date": "2025-01-01" }
    """
    if not all(k in data for k in ["id", "type"]):
        return {"success": False, "message": "Missing fields (id, type required)"}

    if data["type"] not in ("IN", "OUT"):
        return {"success": False, "message": "type must be IN or OUT"}

    today = data.get("date") or datetime.now().strftime("%Y-%m-%d")
    time_str = datetime.now().strftime("%I:%M %p")

    entry = attendance_db.find_one({"id": data["id"], "date": today})

    if not entry:
        attendance_db.insert_one({
            "id": data["id"],
            "date": today,
            "timeline": [{"time": time_str, "type": data["type"]}],
            "last_seen": datetime.now().timestamp(),
        })
    else:
        attendance_db.update_one(
            {"id": data["id"], "date": today},
            {
                "$push": {"timeline": {"time": time_str, "type": data["type"]}},
                "$set": {"last_seen": datetime.now().timestamp()},
            },
        )

    return {"success": True, "message": "Attendance updated"}


@router.get("/attendance/{date}")
def get_attendance_by_date(date: str):
    rows = list(attendance_db.find({"date": date}, {"_id": 0}))
    return {"success": True, "rows": rows}


@router.get("/attendance/user/{user_id}")
def get_user_attendance(user_id: str):
    rows = list(
        attendance_db.find({"id": user_id}, {"_id": 0}).sort("date", -1)
    )
    return {"success": True, "records": rows}


# ----------------------------- ANALYTICS -------------------------------- #

@router.get("/analytics/overview")
def analytics_overview():
    today = datetime.now().strftime("%Y-%m-%d")
    total_users = users_db.count_documents({})

    today_records = attendance_db.find({"date": today})
    present_today = 0
    absent_today = 0

    for rec in today_records:
        if len(rec.get("timeline", [])) > 0 and rec["timeline"][0]["type"] == "IN":
            present_today += 1
        else:
            absent_today += 1

    all_records = list(attendance_db.find({}))
    total_days_present = 0

    for rec in all_records:
        if len(rec.get("timeline", [])) > 0 and rec["timeline"][0]["type"] == "IN":
            total_days_present += 1

    total_days = len(all_records)
    overall_rate = round((total_days_present / total_days) * 100, 1) if total_days > 0 else 0

    return {
        "success": True,
        "today": today,
        "total_users": total_users,
        "present_today": present_today,
        "absent_today": absent_today,
        "overall_attendance_rate": overall_rate,
    }


@router.get("/analytics/by-user")
def analytics_by_user():
    users = list(users_db.find({}, {"_id": 0}))
    result = []

    for user in users:
        uid = user["id"]
        records = list(attendance_db.find({"id": uid}, {"_id": 0}))

        present_days = 0
        for rec in records:
            if len(rec.get("timeline", [])) > 0 and rec["timeline"][0]["type"] == "IN":
                present_days += 1

        total_days = len(records)
        rate = round((present_days / total_days) * 100, 1) if total_days > 0 else 0.0

        result.append({
            "id": uid,
            "name": user.get("name"),
            "department": user.get("dept"),
            "present_days": present_days,
            "total_days": total_days,
            "attendance_rate": rate,
        })

    result.sort(key=lambda x: x["attendance_rate"], reverse=True)
    return {"success": True, "stats": result}
