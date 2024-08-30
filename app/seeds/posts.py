from app.models import db, environment, SCHEMA, Post
from sqlalchemy.sql import text

def seed_posts():
    post1 = Post(
        # title='some title in post 1',
        text = "As virtuous men passe mildly away, And whisper to their soules, to goe, Whilst some of their sad friends doe say, The breath goes now, and some say, no: So let us melt, and make no noise, No teare-floods, nor sigh-tempests move, T'were prophanation of our joyes To tell the layetie our love.",
        user_id = 1,
    )
    post4 = Post(
        # title='some title in post 2',
        text = "Moving of th'earth brings harmes and fears, Men reckon what it did and meant, But trepidation of the spheares, Though greater farre, is innocent.",
        user_id = 1,
    )
    post7 = Post(
        # title='some title in post 3',
        text = "Dull sublunary lovers love (Whose soul is sense) cannot admit Absence, because it doth remove Those things which elemented it.",
        user_id = 1,
    )
    post2 = Post(
        # title='some title in post 3',
        text = "Once upon a midnight dreary, while I pondered, weak and weary, Over many a quaint and curious volume of forgotten lore",
        user_id = 2,
    )
    post5 = Post(
        # title='some title in post 3',
        text = "While I nodded, nearly napping, suddenly there came a tapping, As of some one gently rapping, rapping at my chamber door.",
        user_id = 2,
    )
    post8 = Post(
        # title='some title in post 3',
        text = 'Tis some visiter, I muttered, tapping at my chamber door— Only this and nothing more.',
        user_id = 2,
        # img='https://res.cloudinary.com/dhukvbcqm/image/upload/v1724805733/capstone/download_3_mq2d7d.jpg'
    )
    post3 = Post(
        # title='some title in post 3',
        text = '“Hope” is the thing with feathers - That perches in the soul - And sings the tune without the words - And never stops - at all -',
        user_id = 3,
        #  img='https://res.cloudinary.com/dhukvbcqm/image/upload/v1724805734/capstone/5a0d342841ff207b763869482e2ca816e2e592f0_tligx2.jpg'
    )
    post6 = Post(
        # title='some title in post 3',
        text = 'And sweetest - in the Gale - is heard - And sore must be the storm - That could abash the little Bird That kept so many warm -',
        user_id = 3,
    )
    post9 = Post(
        # title='some title in post 3',
        text = 'I’ve heard it in the chillest land - And on the strangest Sea - Yet - never - in Extremity, It asked a crumb - of me.',
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