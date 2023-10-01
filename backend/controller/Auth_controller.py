from models.User_model import User
from .extensions import bcrypt
from models.db import db

def create_user(name, email, password):
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(
        name=name,
        email=email,
        password=hashed_password
    )

    try:
        db.session.add(new_user)
        db.session.commit()
        return True, "User created Successfully"
    except Exception as e:
        db.session.rollback()
        return False, str(e)

