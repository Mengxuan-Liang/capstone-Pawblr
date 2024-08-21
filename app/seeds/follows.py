from app.models import db, environment, SCHEMA, follow
from sqlalchemy.sql import text

def seed_follows():
    follow_entries = [
        {'follower_id':1, 'followee_id':2},
        {'follower_id':1, 'followee_id':3},
        {'follower_id':2, 'followee_id':1},
        {'follower_id':3, 'followee_id':1},
    ]

    for entry in follow_entries:
        db.session.execute(follow.insert().values(entry))
    db.session.commit()


def undo_follows():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.follows RESTART IDENTITY CASCADE;"
        )
    else:
        db.session.execute(text("DELETE FROM follows"))

    db.session.commit()