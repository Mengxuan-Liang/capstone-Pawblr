import os
from flask import Flask, request, session, redirect,jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from flask_wtf.csrf import CSRFProtect, generate_csrf
from flask_login import LoginManager
from .models import db, User,Message
from .api.user_routes import user_routes
from .api.auth_routes import auth_routes
from .api.post_routes import post_routes
from .api.comment_routes import comment_routes
from .api.image_routes import image_routes
from .api.label_routes import label_routes
from .api.like_routes import like_routes
from .api.follow_routes import follow_routes
from .api.reblog_routes import reblog_routes
from .api.message_routes import message_routes
from .seeds import seed_commands
from .config import Config
from flask_socketio import SocketIO, emit,join_room,leave_room


app = Flask(__name__, static_folder='../react-vite/dist', static_url_path='/')
socketio = SocketIO(app, cors_allowed_origins="*")
# socketio = SocketIO(app, cors_allowed_origins="https://capstone-dumblr.onrender.com")

# Setup login manager
login = LoginManager(app)
login.login_view = 'auth.unauthorized'

# This function is triggered when the 'message' event is received from the client
@socketio.on('message')
def handle_message(data):
    # print('DATAAAAA@@@',data)
    msg = data['message']
    username = data['username']
    print(f"Message: {msg} from {username}")
    # Broadcast the message and username to all clients
    emit('chat_message', {'message': msg, 'username': username}, broadcast=True)

# This function handles joining a chat room
@socketio.on('join_room')
def join_room_chat(data):
    room = data['room']
    join_room(room)
    print(f"User joined room: {room}")

# This function handles leaving a chat room
@socketio.on('leave_room')
def leave_room_chat(data):
    room = data['room']
    leave_room(room)
    print(f"User left room: {room}")
    
@socketio.on('join_private_room')
def handle_join_private_room(data):
    print(f"****************************Received data: {data}")
    if not isinstance(data, dict):
        print("********************Data is not a dictionary")
        return

    room = data.get('room')
    if not room:
        print("**********************Room is missing")
        return

    join_room(room)
    print(f"######............#################……………................……………User joined room: {room}")

@socketio.on('leave_private_room')
def handle_leave_private_room(data):
    room = data['room']
    leave_room(room)
    print(f"User left room: {room}")

@socketio.on('private_message')
def handle_private_message(data):
    print('^^^^^^^^^^^^^^^^^^^^^^^^^^Received private message:', data)
    room = data['recipient_room']
    message_content = data['message']
    sender = data['username']
    recipient = data['recipient']
    
    # Save the message to the database
    sender_user = User.query.filter_by(username=sender).first()
    recipient_user = User.query.filter_by(username=recipient).first()
    new_message = Message(sender_id=sender_user.id, recipient_id=recipient_user.id, content=message_content, room=room)
    db.session.add(new_message)
    db.session.commit()
    
    # Emit the message to the room
    emit('private_message', {'message': message_content, 'username': sender}, room=room)


if __name__ == '__main__':
    import eventlet
    eventlet.monkey_patch()
    # Run the app using eventlet
    # PORT = int(os.environ.get('PORT', 8000))  # Render provides the PORT environment variable
    socketio.run(app, host='0.0.0.0', port=443, debug=True)

@login.user_loader
def load_user(id):
    return User.query.get(int(id))

# Tell flask about our seed commands
app.cli.add_command(seed_commands)

app.config.from_object(Config)
app.register_blueprint(user_routes, url_prefix='/api/users')
app.register_blueprint(auth_routes, url_prefix='/api/auth')
app.register_blueprint(post_routes, url_prefix='/api/posts')
app.register_blueprint(comment_routes, url_prefix='/api/comments')
app.register_blueprint(image_routes, url_prefix='/api/images')
app.register_blueprint(label_routes, url_prefix='/api/labels')
app.register_blueprint(like_routes, url_prefix='/api/likes')
app.register_blueprint(follow_routes, url_prefix='/api/follow')
app.register_blueprint(reblog_routes, url_prefix='/api/reblog')
app.register_blueprint(message_routes, url_prefix='/api/messages')
db.init_app(app)
Migrate(app, db)

# Application Security
# CORS(app, resources={r"/*": {"origins": "*"}})
CORS(app, resources={r"/*": {"origins": ["https://capstone-dumblr.onrender.com", "http://localhost:5173"]}})



# Since we are deploying with Docker and Flask,
# we won't be using a buildpack when we deploy to Heroku.
# Therefore, we need to make sure that in production any
# request made over http is redirected to https.
# Well.........
@app.before_request
def https_redirect():
    if os.environ.get('FLASK_ENV') == 'production':
        if request.headers.get('X-Forwarded-Proto') == 'http':
            url = request.url.replace('http://', 'https://', 1)
            code = 301
            return redirect(url, code=code)


@app.after_request
def inject_csrf_token(response):
    response.set_cookie(
        'csrf_token',
        generate_csrf(),
        secure=True if os.environ.get('FLASK_ENV') == 'production' else False,
        samesite='Strict' if os.environ.get(
            'FLASK_ENV') == 'production' else None,
        httponly=True)
    return response


@app.route("/api/docs")
def api_help():
    """
    Returns all API routes and their doc strings
    """
    acceptable_methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    route_list = { rule.rule: [[ method for method in rule.methods if method in acceptable_methods ],
                    app.view_functions[rule.endpoint].__doc__ ]
                    for rule in app.url_map.iter_rules() if rule.endpoint != 'static' }
    return route_list


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def react_root(path):
    """
    This route will direct to the public directory in our
    react builds in the production environment for favicon
    or index.html requests
    """
    if path == 'favicon.ico':
        return app.send_from_directory('public', 'favicon.ico')
    return app.send_static_file('index.html')


@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')
