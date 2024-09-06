from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_users():
    bella = User(
        username='BellaThePuppy', email='bella@aa.io', password='password',profileImage='https://res.cloudinary.com/dhukvbcqm/image/upload/v1725234083/capstone/IMG_0743_ug5iyw.jpg')
    luna = User(
        username='LunaThePup', email='luna@aa.io', password='password', profileImage='https://res.cloudinary.com/dhukvbcqm/image/upload/v1725234083/capstone/IMG_0742_fx9cin.jpg')
    nova = User(
        username='NovaLovesBones', email='nova@aa.io', password='password', profileImage='https://res.cloudinary.com/dhukvbcqm/image/upload/v1725234082/capstone/IMG_0741_sjf3el.jpg')
    milo = User(
        username='MiloAndTails', email='milo@aa.io', password='password', profileImage='https://res.cloudinary.com/dhukvbcqm/image/upload/v1725234082/capstone/IMG_0740_fduzfl.jpg')
    baloo = User(
        username='BalooTheBear', email='baloo@aa.io', password='password', profileImage='https://res.cloudinary.com/dhukvbcqm/image/upload/v1717366270/IMG_0228_w1h6bw.jpg')
    cooper = User(
        username='CooperPupLife', email='cooper@aa.io', password='password', profileImage='https://res.cloudinary.com/dhukvbcqm/image/upload/v1725234083/capstone/IMG_0744_jyd9an.jpg')
    buddy = User(
        username='BuddyAndPaws', email='buddy@aa.io', password='password',profileImage='https://res.cloudinary.com/dhukvbcqm/image/upload/v1725662296/capstone/Screenshot_2024-09-06_at_6.35.26_PM_tsztza.png')
    daisy = User(
        username='DaisyDog', email='daisy@aa.io', password='password', profileImage='https://res.cloudinary.com/dhukvbcqm/image/upload/v1725662226/capstone/Screenshot_2024-09-06_at_6.36.05_PM_dedkwp.png')
    charlie = User(
        username='CharlieSniff', email='charlie@aa.io', password='password', profileImage='https://res.cloudinary.com/dhukvbcqm/image/upload/v1725662296/capstone/Screenshot_2024-09-06_at_6.35.55_PM_cqwkpm.png')
    penny = User(
        username='PennyAndDog', email='penny@aa.io', password='password', profileImage='https://res.cloudinary.com/dhukvbcqm/image/upload/v1725662295/capstone/Screenshot_2024-09-06_at_6.35.05_PM_x5qwtk.png')
    rusty = User(
        username='RustyTheDog', email='rusty@aa.io', password='password', profileImage='https://res.cloudinary.com/dhukvbcqm/image/upload/v1725662308/capstone/Screenshot_2024-09-06_at_6.35.15_PM_mdh4nx.png')
    demo = User (
        username='demo', email='demo@aa.io', password='password', profileImage='https://res.cloudinary.com/dhukvbcqm/image/upload/v1724973068/capstone/download_n3qjos.png'
    )
    db.session.add(bella)
    db.session.add(luna)
    db.session.add(nova)
    db.session.add(milo)
    db.session.add(baloo)
    db.session.add(cooper)
    db.session.add(buddy)
    db.session.add(daisy)
    db.session.add(charlie)
    db.session.add(penny)
    db.session.add(rusty)
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
