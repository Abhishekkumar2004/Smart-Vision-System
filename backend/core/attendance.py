from datetime import datetime
from models.db import attendance_db

ATTENDANCE_COOLDOWN_MINUTES = 60

def record_attendance(user_id: str):
    now = datetime.now()
    today = now.strftime("%Y-%m-%d")
    time_str = now.strftime("%I:%M %p")

    # check record for today
    record = attendance_db.find_one({"id": user_id, "date": today})

    # first recognition of the day
    if not record:
        attendance_db.insert_one({
            "id": user_id,
            "date": today,
            "timeline": [{"time": time_str, "type": "IN"}],
            "last_seen": now.timestamp()
        })
        return

    # cooldown check
    last_seen = record.get("last_seen", 0)
    if now.timestamp() - last_seen < ATTENDANCE_COOLDOWN_MINUTES * 60:
        return  # ignore duplicate

    last_type = record["timeline"][-1]["type"]
    new_type = "OUT" if last_type == "IN" else "IN"

    attendance_db.update_one(
        {"id": user_id, "date": today},
        {
            "$push": {"timeline": {"time": time_str, "type": new_type}},
            "$set": {"last_seen": now.timestamp()}
        }
    )
