from app.models import db, environment, SCHEMA, Post
from sqlalchemy.sql import text

def seed_posts():
    post1 = Post(
        # title='some title in post 3',
        text = "Paws & Tents: My First Camping Adventure",
        user_id = 5,
        img='https://res.cloudinary.com/dhukvbcqm/image/upload/v1725663641/capstone/IMG_0773_jegzj3.jpg'
    )
    post2 = Post(
        # title='some title in post 3',
        text = "A Dog’s Day Out",
        user_id = 6,
        img='https://res.cloudinary.com/dhukvbcqm/image/upload/v1725663644/capstone/IMG_0770_ahl68m.jpg'
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
    post10 = Post(
        # title='some title in post 3',
        text = "How to Care for Plants: Tips from a Dog with a Green Paw.",
        user_id = 7,
        img='https://res.cloudinary.com/dhukvbcqm/image/upload/v1725663638/capstone/IMG_0761_baarhe.jpg'
    )
    post11 = Post(
        # title='some title in post 3',
        text = 'My Daily Routine: Eat, Play, Love',
        user_id = 8,
        img='https://res.cloudinary.com/dhukvbcqm/image/upload/v1725663644/capstone/IMG_0782_wknqcy.jpg'
    )
    post12= Post(
        # title='some title in post 3',
        text = 'The World Through My Nose: A Dog’s Guide to Smelling Everything',
        user_id = 9,
        img='https://res.cloudinary.com/dhukvbcqm/image/upload/v1725663638/capstone/IMG_0762_fbkdcp.jpg'
    )
    post13 = Post(
        # title='some title in post 3',
        text = 'Life with My Human: A Dog’s Perspective',
        user_id = 10,
        img='https://res.cloudinary.com/dhukvbcqm/image/upload/v1725663639/capstone/IMG_0767_ifmdbc.jpg'
    )
    post14 = Post(
        # title='some title in post 3',
        text = "A Day in the Life: My Adventures as a Curious Pup",
        user_id = 11,
        img='https://res.cloudinary.com/dhukvbcqm/image/upload/v1725663638/capstone/IMG_0768_lqljes.jpg'
    )
    post15 = Post(
        # title='some title in post 3',
        text = "Barking Up the Right Tree: My Tips for a Happy Dog Life",
        user_id = 1,
        img='https://res.cloudinary.com/dhukvbcqm/image/upload/v1725663639/capstone/IMG_0769_whcb0f.jpg'
    )
    post16 = Post(
        # title='some title in post 2',
        text = "Paws and Relax: My Favorite Napping Spots",
        user_id = 2,
        img='https://res.cloudinary.com/dhukvbcqm/image/upload/v1725663642/capstone/IMG_0777_tpjhce.jpg'
    )
    post17 = Post(
        # title='some title in post 3',
        text = "From Puppy to Pro: My Journey Learning New Tricks",
        user_id = 3,
        img='https://res.cloudinary.com/dhukvbcqm/image/upload/v1725663643/capstone/IMG_0775_g7lhar.jpg'
    )
    post18 = Post(
        # title='some title in post 3',
        text = "My Life in Treats: The Best Snacks I've Ever Had",
        user_id = 4,
        img='https://res.cloudinary.com/dhukvbcqm/image/upload/v1725663639/capstone/IMG_0764_mx39tb.jpg'
    )
    post19 = Post(
        text = "Pawsitively perfect day with my favorite furball.",
        user_id = 1,
        img='https://res.cloudinary.com/dhukvbcqm/image/upload/v1725234088/capstone/IMG_0759_ru4wty.jpg'
    )
    post20 = Post(
        # title='some title in post 2',
        text = "Fetch goals: Always chasing my dreams (and balls).",
        user_id = 2,
        img='https://res.cloudinary.com/dhukvbcqm/image/upload/v1725234088/capstone/IMG_0758_bgevs3.jpg'
    )
    post21 = Post(
        # title='some title in post 2',
        text = "A Day in the Life: My Adventures as a Curious Pup",
        user_id = 10,
        img='https://res.cloudinary.com/dhukvbcqm/image/upload/v1725663638/capstone/IMG_0768_lqljes.jpg'
    )
    # post21 = Post(
    #     # title='some title in post 3',
    #     text = "Paws & Tents: My First Camping Adventure",
    #     user_id = 5,
    #     img='https://res.cloudinary.com/dhukvbcqm/image/upload/v1725665464/capstone/IMG_9663_3_niaxxc.heic'
    # )
    # post22 = Post(
    #     # title='some title in post 3',
    #     text = "Paws & Tents: My First Camping Adventure",
    #     user_id = 5,
    #     img='https://res.cloudinary.com/dhukvbcqm/image/upload/v1725665430/capstone/IMG_9106_3_m7s3oc.heic'
    # )
    # post23 = Post(
    #     # title='some title in post 3',
    #     text = "Paws & Tents: My First Camping Adventure",
    #     user_id = 5,
    #     img='https://res.cloudinary.com/dhukvbcqm/image/upload/v1725665426/capstone/IMG_8994_3_zu4ivn.heic'
    # )
    # post24 = Post(
    #     # title='some title in post 3',
    #     text = "Paws & Tents: My First Camping Adventure",
    #     user_id = 5,
    #     img='https://res.cloudinary.com/dhukvbcqm/image/upload/v1725665356/capstone/IMG_3621_3_ffffwc.heic'
    # )
    # post25 = Post(
    #     # title='some title in post 3',
    #     text = "Paws & Tents: My First Camping Adventure",
    #     user_id = 5,
    #     img='https://res.cloudinary.com/dhukvbcqm/image/upload/v1725665458/capstone/IMG_9307_3_d4yaeg.heic'
    # )
    # post26 = Post(
    #     # title='some title in post 3',
    #     text = "Paws & Tents: My First Camping Adventure",
    #     user_id = 5,
    #     img='https://res.cloudinary.com/dhukvbcqm/image/upload/v1725665344/capstone/IMG_2510_3_wl5m63.heic'
    # )
    # post27 = Post(
    #     # title='some title in post 3',
    #     text = "Paws & Tents: My First Camping Adventure",
    #     user_id = 5,
    #     img='https://res.cloudinary.com/dhukvbcqm/image/upload/v1725665242/capstone/IMG_0027_3_jwnvxx.heic'
    # )

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
        post10,
        post11,
        post12,
        post13,
        post14,
        post15,
        post16,
        post17,
        post18,
        post19,
        post20,
        post21,
        # post22,
        # post23,
        # post24,
        # post25,
        # post26,
    ])
    db.session.commit()

def undo_posts():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.posts RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM posts"))

    db.session.commit()