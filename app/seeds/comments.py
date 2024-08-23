from app.models import db, environment, SCHEMA, Comment
from sqlalchemy.sql import text

def seed_comments():
    comment1 = Comment(
        text='Oh stay, three lives in one flea spare',
        post_id = 1,
        user_id = 1,
        parent_comment_id = 2
    )
    comment2 = Comment(
        text='Where we almost, nay more than married are. ',
        post_id = 2,
        user_id = 2,
        parent_comment_id = 1
    )
    comment3 = Comment(
        text='This flea is you and I, and this',
        post_id = 3,
        user_id = 3,
    )
    comment4 = Comment(
        text='Our marriage bed, and marriage temple is;',
        post_id = 4,
        user_id = 1,
        parent_comment_id = 2
    )
    comment5 = Comment(
        text='Though parents grudge, and you, we are met, ',
        post_id = 5,
        user_id = 2,
        parent_comment_id = 1
    )
    comment6 = Comment(
        text='And cloistered in these living walls of jet.',
        post_id = 6,
        user_id = 3,
    )
    comment7 = Comment(
        text='Though use make you apt to kill me,',
        post_id = 7,
        user_id = 1,
        parent_comment_id = 2
    )
    comment8 = Comment(
        text='Let not to that, self-murder added be,',
        post_id = 8,
        user_id = 2,
        parent_comment_id = 1
    )
    comment9 = Comment(
        text='And sacrilege, three sins in killing three.',
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