import uuid
from .db import db
from datetime import datetime
from sqlalchemy.orm import relationship

def gen_uuid():
    return str(uuid.uuid4())

class Image(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=gen_uuid, unique=True, nullable=False)
    name = db.Column(db.String(255), nullable=False)
    docker_id = db.Column(db.String(255), nullable=False)
    author_id = db.Column(db.String(255), db.ForeignKey('user.id'), nullable=False)
    author = relationship('User')
    createdAt = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    modifiedAt = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)