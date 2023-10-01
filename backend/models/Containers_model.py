import uuid
from .db import db
from datetime import datetime
from sqlalchemy.orm import relationship

def gen_uuid():
    return str(uuid.uuid4())

class Container(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=gen_uuid, unique=True, nullable=False)
    docker_id = db.Column(db.String(255), nullable=False)
    container_name = db.Column(db.String(255), nullable=False)
    author_id = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)
    author = relationship('User')
    subdomain = db.Column(db.String(255), nullable=True)
    image_id = db.Column(db.String(36), db.ForeignKey('image.docker_id'), nullable=False)
    image = relationship('Image')
    vnc_port = db.Column(db.Integer, nullable=False)
    ssh_port= db.Column(db.Integer, nullable=False)
    ws_port= db.Column(db.Integer, nullable=False)
    vnc_url = db.Column(db.String(255), nullable=False)
    vnc_host = db.Column(db.String(255), nullable=False)
    state = db.Column(db.String(20), nullable=False, default='Stopped')
    createdAt = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    modifiedAt = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)