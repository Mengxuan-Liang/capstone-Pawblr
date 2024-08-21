from app.models import db, environment, SCHEMA, Comment
from sqlalchemy.sql import text

def seed_comments():
    comment1 = Comment(
        text='some text in comment 1',
        post_id = 1,
        user_id = 1,
        parent_comment_id = 2
    )
    comment2 = Comment(
        text='some text in comment 2',
        post_id = 2,
        user_id = 2,
        parent_comment_id = 1
    )
    comment3 = Comment(
        text='some text in comment 3',
        post_id = 3,
        user_id = 3,
    )


    db.session.add_all([
        comment1,
        comment2,
        comment3
    ])
    db.session.commit()

def undo_comments():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.comments RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM comments"))

    db.session.commit()