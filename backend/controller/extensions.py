from flask_bcrypt import Bcrypt
from flask_session import Session
from flask_jwt_extended import JWTManager

bcrypt = Bcrypt()
jwt_manager = JWTManager()
session = Session()