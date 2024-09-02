from app.models import db, environment, SCHEMA, Comment
from sqlalchemy.sql import text

def seed_comments():
    comment1 = Comment(
        text='Woof',
        post_id = 1,
        user_id = 1,
        parent_comment_id = 2
    )
    comment2 = Comment(
        text='Ruff',
        post_id = 2,
        user_id = 2,
        parent_comment_id = 1
    )
    comment3 = Comment(
        text='Awoooooo',
        post_id = 3,
        user_id = 3,
    )
    comment4 = Comment(
        text='Woof',
        post_id = 4,
        user_id = 1,
        parent_comment_id = 2
    )
    comment5 = Comment(
        text='Ruff',
        post_id = 5,
        user_id = 2,
        parent_comment_id = 1
    )
    comment6 = Comment(
        text='AWOOOOOOOO',
        post_id = 6,
        user_id = 3,
    )
    comment7 = Comment(
        text='RUFFFFF',
        post_id = 7,
        user_id = 1,
        parent_comment_id = 2
    )
    comment8 = Comment(
        text='Awooooooo',
        post_id = 8,
        user_id = 2,
        parent_comment_id = 1
    )
    comment9 = Comment(
        text='WOOOF',
        post_id = 9,
        user_id = 3,
    )


    db.session.add_all([
        comment1,
        comment2,
        comment3,
        comment4,
        comment5,
        comment6,
        comment7,
        comment8,
        comment9

    ])
    db.session.commit()

def undo_comments():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.comments RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM comments"))

    db.session.commit()