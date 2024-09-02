from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_users():
    bella = User(
        username='Bella', email='bella@aa.io', password='password',profileImage='https://res.cloudinary.com/dhukvbcqm/image/upload/v1725234083/capstone/IMG_0743_ug5iyw.jpg')
    luna = User(
        username='Luna', email='luna@aa.io', password='password', profileImage='https://res.cloudinary.com/dhukvbcqm/image/upload/v1725234083/capstone/IMG_0742_fx9cin.jpg')
    nova = User(
        username='Nova', email='nova@aa.io', password='password', profileImage='https://res.cloudinary.com/dhukvbcqm/image/upload/v1725234082/capstone/IMG_0741_sjf3el.jpg')
    milo = User(
        username='Zoe', email='zoe@aa.io', password='password', profileImage='https://res.cloudinary.com/dhukvbcqm/image/upload/v1725234082/capstone/IMG_0740_fduzfl.jpg')
    baloo = User(
        username='Baloo', email='baloo@aa.io', password='password', profileImage='https://res.cloudinary.com/dhukvbcqm/image/upload/v1717366270/IMG_0228_w1h6bw.jpg')
    cooper = User(
        username='Cooper', email='cooper@aa.io', password='password', profileImage='https://res.cloudinary.com/dhukvbcqm/image/upload/v1725234083/capstone/IMG_0744_jyd9an.jpg')
    demo = User (
        username='demo', email='demo@aa.io', password='password', profileImage='https://res.cloudinary.com/dhukvbcqm/image/upload/v1724973068/capstone/download_n3qjos.png'
    )
    db.session.add(bella)
    db.session.add(luna)
    db.session.add(nova)
    db.session.add(milo)
    db.session.add(baloo)
    db.session.add(cooper)
    db.session.add(demo)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))
        
    db.session.commit()
