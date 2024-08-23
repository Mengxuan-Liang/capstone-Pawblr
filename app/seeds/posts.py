from app.models import db, environment, SCHEMA, Post
from sqlalchemy.sql import text

def seed_posts():
    post1 = Post(
        # title='some title in post 1',
        text = 'Mark but this flea, and mark in this, ',
        user_id = 1,
    )
    post2 = Post(
        # title='some title in post 2',
        text = 'How little that which thou deniest me is;',
        user_id = 1,
        img = 'post2.jpg'
    )
    post3 = Post(
        # title='some title in post 3',
        text = 'It sucked me first, and now sucks thee,',
        user_id = 1,
    )
    post4 = Post(
        # title='some title in post 3',
        text = 'And in this flea our two bloods mingled be',
        user_id = 2,
    )
    post5 = Post(
        # title='some title in post 3',
        text = "Thou know’st that this cannot be said",
        user_id = 2,
    )
    post6 = Post(
        # title='some title in post 3',
        text = 'A sin, nor shame, nor loss of maidenhead,',
        user_id = 2,
    )
    post7 = Post(
        # title='some title in post 3',
        text = 'Yet this enjoys before it woo,',
        user_id = 3,
    )
    post8 = Post(
        # title='some title in post 3',
        text = 'And pampered swells with one blood made of two,',
        user_id = 3,
    )
    post9 = Post(
        # title='some title in post 3',
        text = 'And this, alas, is more than we would do.',
        user_id = 3,
    )

    db.session.add_all([
        post1, 
        post2,
        post3,
        post4, 
        post5,
        post6,
        post7, 
        post8,
        post9,
    ])
    db.session.commit()

def undo_posts():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.posts RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM posts"))

    db.session.commit()