from flask.cli import AppGroup
from .users import seed_users, undo_users

from app.models.db import db, environment, SCHEMA

from .posts import seed_posts, undo_posts
from .comments import seed_comments, undo_comments
from .labels import seed_labels, undo_labels
from .likes import seed_likes, undo_likes
from .follows import seed_follows, undo_follows
from .postlabels import seed_postlabels, undo_postlabels

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo
        # command, which will  truncate all tables prefixed with
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_users()
        undo_postlabels()
        undo_follows()
        undo_labels()
        undo_comments()
        undo_likes()
        undo_posts()
    seed_users()
    seed_posts()
    seed_comments()
    seed_labels()
    seed_likes()
    seed_postlabels()
    seed_follows()
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    undo_postlabels()
    undo_follows()
    undo_posts()
    undo_comments()
    undo_labels()
    undo_likes()
    # Add other undo functions here
