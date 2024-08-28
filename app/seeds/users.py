from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_users():
    john = User(
        username='John Donne', email='john@aa.io', password='password',  profileImage='https://res.cloudinary.com/dhukvbcqm/image/upload/v1724687622/capstone/612tkxoqAtL_i1uath.jpg')
    allan = User(
        username='Allan Poe', email='allan@aa.io', password='password', profileImage='https://res.cloudinary.com/dhukvbcqm/image/upload/v1724687622/capstone/28c2cdadd53140ed9a8ff8b0b37bbf9b_ywud0n.webp')
    emily = User(
        username='Emily Dickinson', email='emily@aa.io', password='password', profileImage='https://res.cloudinary.com/dhukvbcqm/image/upload/v1724687622/capstone/cute-corgi-dog-cartoon-illustration-funny-sitting-puppy_517059-178_mmjsil.avif')

    db.session.add(john)
    db.session.add(allan)
    db.session.add(emily)
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
