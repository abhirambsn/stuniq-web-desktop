from flask import request, jsonify, Blueprint
from models.User_model import User
from controller.extensions import bcrypt
from controller import Auth_controller as authctl
from flask_jwt_extended import create_access_token, unset_jwt_cookies, jwt_required, current_user
from models.Image_model import Image
from models.Containers_model import Container
from models.db import db

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/login', methods=["POST"])
def login():
    if request.method == "POST":
        body = request.get_json()
        email = body['email']
        password = body['password']

        user = User.query.filter_by(email=email).first()
        if user and bcrypt.check_password_hash(user.password, password):
            access_token = create_access_token(identity=user.email)
            return jsonify({"message": "Login Successful", "token": access_token}), 200
        else:
            return jsonify({"message": "Login Unsuccessful", "token": None}), 401
    else:
        return jsonify({"message": "Method not allowed"}), 405

@auth_bp.route('/register', methods=["POST"])
def register():
    if request.method == "POST":
        body = request.get_json()
        name = body['name']
        email = body['email']
        password = body['password']

        result = authctl.create_user(name, email, password)
        return jsonify({"message": result[1]}), 201 if result[0] else 400
        
    else:
        return jsonify({"message": "Method not allowed"}), 405

@auth_bp.route('/', methods=["GET", "PUT"])
@jwt_required()
def profile():
    if request.method == "GET":
        tot_img_count = Image.query.filter_by(author_id=current_user.id).count()
        inuse_img_count = Container.query.filter_by(author_id=current_user.id, state="Running").distinct(Container.image_id).count()
        inuse_container_count = Container.query.filter_by(author_id=current_user.id, state="Running").count()
        tot_container_count = Container.query.filter_by(author_id=current_user.id).count()
        user = {
            "email": current_user.email,
            "name": current_user.name,
            "createdAt": current_user.createdAt,
            "stats": {
                "total_images": tot_img_count,
                "inuse_images": inuse_img_count,
                "total_containers": tot_container_count,
                "running_containers": inuse_container_count
            }
        }
        return jsonify({"user": user}), 200
    elif request.method == "PUT":
        body = request.get_json()
        if "id" in body.keys() or "email" in body.keys() or "createdAt" in body.keys() or "modifiedAt" in body.keys():
            return jsonify({"message": "Cannot update fixed attributes"}), 400
        
        if body.get('password', False):
            body['password'] = bcrypt.generate_password_hash(body['password']).decode('utf-8')

        user = User.query.filter_by(email=current_user.email).first()
        try:
            for (k,v) in body.enumerate():
                setattr(user, k, v)
            db.session.commit()
            return jsonify({"message": "User updated successfully"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": str(e)}), 400

@auth_bp.route('/logout', methods=["POST"])
@jwt_required()
def logout():
    response = jsonify({"message": "Logout Successful"})
    unset_jwt_cookies(response)
    return response, 200