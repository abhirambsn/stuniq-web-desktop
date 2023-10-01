from flask import Flask, request, jsonify
from models.db import db
from models.User_model import User
from backend.controller.extensions import bcrypt, jwt_manager, session
from datetime import datetime, timezone, timedelta
from flask_jwt_extended import get_jwt, create_access_token, get_jwt_identity
from flask_cors import CORS
import json


def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = "215fb79f1848d253c541f30f2e83a86965d178fed3594e7adf4df128a90fb2633af7bbded04ff63f4214cb1d896cd2e119a9f6da64c26a74d283911c32fb5a4f"
    app.config['SESSION_TYPE'] = 'filesystem'
    app.config['JWT_SECRET_KEY'] = "06973e058893087d8aa8d73513c35254e097b25fe75131ad53dacf6e06296227e58955fad64d4d00862ac73a6d089ce7d422c017bab866eb8893be4540884d41"

    cors = CORS(app)

    with app.app_context():
        db.init_app(app)
        bcrypt.init_app(app)
        jwt_manager.init_app(app)
        session.init_app(app)

        @app.after_request
        def refresh_expiring_jwts(response):
            try:
                exp_timestamp = get_jwt()["exp"]
                now = datetime.now(timezone.utc)
                target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
                if target_timestamp > exp_timestamp:
                    print(get_jwt_identity())
                    access_token = create_access_token(identity=get_jwt_identity())
                    data = response.get_json()
                    if type(data) is dict:
                        data["access_token"] = access_token 
                        response.data = json.dumps(data)
                return response
            except (RuntimeError, KeyError):
                # Case where there is not a valid JWT. Just return the original respone
                return response
        
        @jwt_manager.user_lookup_loader
        def user_lookup_callback(_jwt_header, jwt_data):
            identity = jwt_data["sub"]
            return User.query.filter_by(email=identity).one_or_none()

        from routes.Container_routes import container_bp
        from routes.Auth_routes import auth_bp
        app.register_blueprint(container_bp, url_prefix='/api/v1/weblab')
        app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')

        db.create_all()
    return app