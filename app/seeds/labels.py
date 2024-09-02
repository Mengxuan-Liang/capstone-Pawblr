from app.models import db, environment, SCHEMA, Label
from sqlalchemy.sql import text

def seed_labels():
    label1 = Label(
        name = 'SelfiePro'
    )
    label2 = Label(
        name = 'Yum'
    )
    label3 = Label(
        name = 'FoodieLife'
    )
    label4 = Label(
        name = 'NapGoals'
    )
    label5 = Label(
        name = 'Explorer'
    )
    label6 = Label(
        name = 'PlayAllDay'
    )
    label7 = Label(
        name = 'AdventureDog'
    )
    label8 = Label(
        name = 'DogStyle'
    )
    label9 = Label(
        name = 'BestBuddies'
    )
    label10 = Label(
        name = 'RiseAndShine'
    )

    db.session.add_all([
        label1,
        label2,
        label3,
        label4,
        label5,
        label6,
        label7,
        label8,
        label9,
        label10
    ])
    db.session.commit()

def undo_labels():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.labels RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM labels"))

    db.session.commit()