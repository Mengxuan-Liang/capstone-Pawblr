from app.models import db, environment, SCHEMA, Post
from sqlalchemy.sql import text

def seed_posts():
    post1 = Post(
        title='some title in post 1',
        text = 'some text in post 1',
        user_id = 1,
    )
    post2 = Post(
        title='some title in post 2',
        text = 'some text in post 2',
        user_id = 2,
        img = 'post2.jpg'
    )
    post3 = Post(
        title='some title in post 3',
        text = 'some text in post 3',
        user_id = 3,
    )

    db.session.add_all([
        post1, 
        post2,
        post3
    ])
    db.session.commit()

def undo_posts():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.posts RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM posts"))

    db.session.commit()