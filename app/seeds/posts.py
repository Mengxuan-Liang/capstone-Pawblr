from app.models import db, environment, SCHEMA, Post
from sqlalchemy.sql import text

def seed_posts():
    post1 = Post(
        text = "Pawsitively perfect day with my favorite furball.",
        user_id = 1,
        img='https://res.cloudinary.com/dhukvbcqm/image/upload/v1725234088/capstone/IMG_0759_ru4wty.jpg'
    )
    post2 = Post(
        # title='some title in post 2',
        text = "Fetch goals: Always chasing my dreams (and balls).",
        user_id = 2,
        img='https://res.cloudinary.com/dhukvbcqm/image/upload/v1725234088/capstone/IMG_0758_bgevs3.jpg'
    )
    post3 = Post(
        # title='some title in post 3',
        text = "I sniff, I eat, I conquer.",
        user_id = 3,
        img='https://res.cloudinary.com/dhukvbcqm/image/upload/v1725234085/capstone/IMG_0757_flvdgt.jpg'
    )
    post4 = Post(
        # title='some title in post 3',
        text = "Strutting my stuff in the latest paw-shion trends.",
        user_id = 4,
        img='https://res.cloudinary.com/dhukvbcqm/image/upload/v1725234084/capstone/IMG_0746_map2qp.jpg'
    )
    post5 = Post(
        # title='some title in post 3',
        text = "Just two best buds enjoying the water together.",
        user_id = 5,
        img='https://res.cloudinary.com/dhukvbcqm/image/upload/v1725234082/capstone/IMG_0737_b2lkzq.jpg'
    )
    post6 = Post(
        # title='some title in post 3',
        text = 'Float like a furball.',
        user_id = 6,
        img='https://res.cloudinary.com/dhukvbcqm/image/upload/v1725234082/capstone/IMG_0734_qdglxi.jpg'
    )
    post7 = Post(
        # title='some title in post 3',
        text = 'Morning stretches before a full day of barking at squirrels.',
        user_id = 1,
        img='https://res.cloudinary.com/dhukvbcqm/image/upload/v1725234084/capstone/IMG_0751_kf2mdc.jpg'
    )
    post8 = Post(
        # title='some title in post 3',
        text = 'Jet lag? Never heard of it. Ready to explore!',
        user_id = 2,
        img='https://res.cloudinary.com/dhukvbcqm/image/upload/v1725234085/capstone/IMG_0754_vreurg.jpg'
    )
    post9 = Post(
        # title='some title in post 3',
        text = "Nailed that Zoom meeting! Now, who’s got the treats?",
        user_id = 3,
        img='https://res.cloudinary.com/dhukvbcqm/image/upload/v1725234084/capstone/IMG_0750_wxekhm.jpg'
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