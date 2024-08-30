from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, User, follow

follow_routes = Blueprint("follow", __name__)


# Follow User: POST /api/follow
@follow_routes.route("", methods=["POST"])
@login_required
def follow_user():
    data = request.get_json()
    followee_id = data.get("followee_id")

    # Prevent users from following themselves
    if followee_id == current_user.id:
        return jsonify({"error": "Cannot follow yourself"}), 400

    # Check if the followee exists
    user_to_follow = User.query.get(followee_id)
    if user_to_follow is None:
        return jsonify({"error": "User not found"}), 404

    # Check if the user is already following the followee
    if current_user in user_to_follow.followers:
        return jsonify({"error": "Already following this user"}), 400

    # Add the follow relationship
    current_user.following.append(user_to_follow)
    db.session.commit()
    return jsonify({"message": "Followed successfully"}), 200


# Unfollow User: DELETE /api/follow
@follow_routes.route("", methods=["DELETE"])
@login_required
def unfollow_user():
    data = request.get_json()
    followee_id = data.get("followee_id")

    # Prevent users from unfollowing themselves
    if followee_id == current_user.id:
        return jsonify({"error": "Cannot unfollow yourself"}), 400

    # Check if the followee exists
    user_to_unfollow = User.query.get(followee_id)
    if user_to_unfollow is None:
        return jsonify({"error": "User not found"}), 404

    # Check if the user is actually following the followee
    if current_user not in user_to_unfollow.followers:
        return jsonify({"error": "Not following this user"}), 400

    # Remove the follow relationship
    current_user.following.remove(user_to_unfollow)
    db.session.commit()
    return jsonify({"message": "Unfollowed successfully"}), 200


# Check Follow Status: GET /api/follow/status
@follow_routes.route("/status", methods=["GET"])
@login_required
def follow_status():
    if not current_user.is_authenticated:
        return {"error": "User not authenticated"}, 401
    user = User.query.get(current_user.id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    follows = current_user.following.all()
    return jsonify({"follows": [user.to_dict() for user in follows]})
    # return{'message':"hell"}


# followee_id = request.args.get('followee_id')

# # Check if the followee exists
# user_to_check = User.query.get(followee_id)
# if user_to_check is None:
#     return jsonify({"error": "User not found"}), 404

# # Check if the current user is following the followee
# is_following = current_user in user_to_check.followers
# return jsonify({"is_following": is_following}), 200
