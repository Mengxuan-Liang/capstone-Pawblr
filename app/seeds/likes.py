from app.models import db, environment, SCHEMA, Like
from sqlalchemy.sql import text

def seed_likes():
    like1 = Like(
        post_id = 1,
        user_id = 2
    )
    like2 = Like(
        post_id = 2,
        user_id = 3
    )
    like3 = Like(
        post_id = 3,
        user_id = 1
    )

    db.session.add_all([
        like1,
        like2,
        like3
    ])
    db.session.commit()

def undo_likes():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.likes RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM likes"))

    db.session.commit()