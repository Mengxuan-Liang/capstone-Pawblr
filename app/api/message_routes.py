from flask import Blueprint, jsonify
from app.models import User,Message

message_routes = Blueprint('messages', __name__)
# REST endpoint to fetch messages
@message_routes.route('/<username>', methods=['GET'])
def get_messages(username):
    # print('am i here??????')
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    received_messages = Message.query.filter_by(recipient_id=user.id).all()
    sent_messages = Message.query.filter_by(sender_id=user.id).all()
    # room = Message.query
    # print('@@@@@@@@received messages',received_messages[0])
    
    messages = [
        {'sender': User.query.get(msg.sender_id).username, 'content': msg.content, 'room': msg.room} for msg in received_messages + sent_messages
    ]
    # print('!!!',messages)
    return jsonify({'messages': messages})