from flask import request, jsonify, Blueprint
from flask_jwt_extended import jwt_required, current_user
from models.Containers_model import Container
from models.Image_model import Image
from models.db import db
from controller import Containers_controller as containerctl
from utils import check_authorization

container_bp = Blueprint('container_bp', __name__)

@container_bp.route('/images', methods=["GET"])
@jwt_required()
def get_images_by_user():
    images = Image.query.filter_by(author_id=current_user.id).all()
    print(images)
    responses = [{
            "docker_id": image.docker_id,
            "name": image.name,
            "createdAt": image.createdAt,
            "author": image.author.name
        } for image in images]
    
    return jsonify(responses), 200

@container_bp.route('/image/<id>', methods=["GET"])
@jwt_required()
def get_image_by_id(id):
    image = Image.query.filter_by(docker_id=id).first()
    response = {
            "docker_id": image.docker_id,
            "name": image.name,
            "createdAt": image.createdAt,
            "author": image.author.name
        }
    return jsonify(response), 200

@container_bp.route('/image/<id>', methods=["DELETE"])
@jwt_required()
def delete_img(id):
    image = Image.query.filter_by(docker_id=id).first()
    if not image:
        return jsonify({"message": "Image with the given ID is not found"}), 404
    auth_check = check_authorization(image.author_id, current_user.id)
    if not auth_check:
        return jsonify({"success": False, "message": "Unauthorized"}), 401
    ok, message = containerctl.delete_image(id, True)
    if not ok:
        return jsonify({"success": ok, "message": message}), 500
    db.session.delete(image)
    db.session.commit()
    return jsonify({"success": ok, "message": message}), 200

@container_bp.route('/image', methods=["POST"])
@jwt_required()
def create_image():
    body = request.get_json()
    print(current_user)
    result = containerctl.build_image(
        current_user.email.split("@")[0].lower(), 
        body['baseImg'], 
        body['packages'], 
        body['desktop'], 
        body['username'], 
        body['password'], 
        body['timezone'], 
        body.get('memory', 4096)
    )
    # Insert into Image Table
    new_image = Image(
        name=result[1],
        docker_id=result[2],
        author_id=current_user.id
    )
    try:
        db.session.add(new_image)
        db.session.commit()
        return jsonify({"success": result[0], "image_id": result[2], "image_name": result[1]}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": str(e)}), 400
    

@container_bp.route('/containers', methods=["GET"])
@jwt_required()
def get_container_by_user():
    containers = Container.query.filter_by(author_id=current_user.id).all()
    responses = [{
        "container_name": container.container_name,
        "docker_id": container.docker_id,
        "author": container.author.name,
        "subdomain": container.subdomain,
        "vnc_port": container.vnc_port,
        "vnc_host": container.vnc_host,
        "vnc_url": container.vnc_url,
        "ssh_port": container.ssh_port,
        "ws_port": container.ws_port,
        "state": container.state,
        "image_name": container.image.name,
        "image_author": container.image.author.name,
        "createdAt": container.createdAt
    } for container in containers]
    print(containers)
    return jsonify(responses), 200

@container_bp.route('/container', methods=["POST"])
@jwt_required()
def create_and_run_container():
    body = request.get_json()
    image_name = body['image_name']
    result = containerctl.run_container(
        current_user.email.split("@")[0].lower(), 
        image_name
    )

    hostname = request.host.split(":")[0]
    subdomain = f"{result[3]}.{hostname}"

    # Insert into Container Table
    new_container = Container(
        docker_id=result[1],
        vnc_port=result[2],
        author_id=current_user.id,
        state=result[4],
        container_name=result[3],
        vnc_host=hostname,
        subdomain=subdomain,
        image_id=result[5],
        ssh_port=result[7],
        ws_port=result[6],
        vnc_url=f"ws://{hostname}:{result[6]}"
    )
    try:
        db.session.add(new_container)
        db.session.commit()
        return jsonify({"success": result[0], "container_id": result[1], "vnc_host": request.host_url.replace("http://", "").replace("/:5000", ""), "vnc_port": result[2], "container_name": result[3], "status": result[4], "ssh_port":result[7],
        "ws_port":result[6]}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": str(e)}), 400

@container_bp.route('/container/<container_id>', methods=["GET"])
@jwt_required()
def get_container_by_id(container_id):
    container = Container.query.filter_by(docker_id=container_id).first()
    if not container:
        return jsonify({"message": "Container with the given ID is not found"}), 404
    check = check_authorization(container.author_id, current_user.id)
    if not check:
        return jsonify({"message": "Unauthorized"}), 401
    
    logs = containerctl.get_logs(container.docker_id)
    response = {
        "container_name": container.container_name,
        "docker_id": container.docker_id,
        "author": container.author.name,
        "subdomain": container.subdomain,
        "vnc_port": container.vnc_port,
        "vnc_host": container.vnc_host,
        "vnc_url": container.vnc_url,
        "ssh_port": container.ssh_port,
        "ws_port": container.ws_port,
        "state": container.state,
        "image_name": container.image.name,
        "image_author": container.image.author.name,
        "createdAt": container.createdAt,
        "logs": logs.decode()
    }
    return jsonify(response), 200
    
@container_bp.route('/container/<container_id>', methods=["PUT"])
@jwt_required()
def stop_container(container_id):
    container_check = Container.query.filter_by(docker_id=container_id).first()
    if not container_check:
        return jsonify({"message": "Container with the given ID is not found"}), 404
    auth_check = check_authorization(container_check.author_id, current_user.id)
    if not auth_check:
        return jsonify({"message": "Unauthorized"}), 401
    ok = containerctl.stop_container(container_id)
    container = Container.query.filter_by(docker_id=container_id).first()
    container.state = "Stopped"
    db.session.commit()
    return jsonify({"success": ok}), 200

@container_bp.route('/container/<container_id>', methods=["DELETE"])
@jwt_required()
def delete_container(container_id):
    container_check = Container.query.filter_by(docker_id=container_id).first()
    if not container_check:
        return jsonify({"message": "Container with the given ID is not found"}), 404
    auth_check = check_authorization(container_check.author_id, current_user.id)
    if not auth_check:
        return jsonify({"message": "Unauthorized"}), 401
    ok = containerctl.delete_container(container_id)
    container = Container.query.filter_by(docker_id=container_id).first()
    db.session.delete(container)
    db.session.commit()
    return jsonify({"success": ok}), 200