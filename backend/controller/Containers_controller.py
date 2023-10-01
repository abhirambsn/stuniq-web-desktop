import docker
import os, binascii, random
client = docker.from_env()

ws_range = range(1002, 11002)
ssh_range = range(11003, 21003)
vnc_range = range(21004, 31004)

def build_image(user, baseImg, packages, desktop, username, password, timezone, memory):
    image = client.images.build(
        path = "./files",
        dockerfile="./Dockerfile.template",
        tag = f"{user}-{baseImg}-{desktop}",
        buildargs = {
            "baseImg": baseImg,
            "packages": packages,
            "desktop": desktop,
            "username": username,
            "password": password,
            "timezone": timezone
        },
        nocache=True,
        rm=True
    )

    img_name = image[0].tags[0]
    img_id = image[0].id
    return True, img_name, img_id

def delete_image(id, force=False):
    try:
        client.images.remove(image=id, force=force)
        return True, "Image Deleted Successfully"
    except Exception as e:
        return False, str(e)

def create_user_volume(user):
    volume = client.volumes.create(
        name=f"{user}-data",
        driver="local"
    )
    return volume.name

def run_container(user, image_name):
    vnc_port = random.choice(vnc_range)
    ssh_port = random.choice(ssh_range)
    ws_port = random.choice(ws_range)
    container_name = f"{user}-{binascii.b2a_hex(os.urandom(6)).decode()}"
    image = client.images.get(image_name)
    container = client.containers.run(
        image_name, 
        detach=True, 
        cap_add=['SYS_ADMIN', 'NET_ADMIN'], 
        hostname=container_name, 
        name=container_name,
        ports = {
            "8003": ws_port,
            "22": ssh_port,
            "5900": vnc_port
        },
        privileged=True,
        restart_policy={"Name": "on-failure", "MaximumRetryCount": 3},
        shm_size=2048,
        volumes={
            f"{user}-data": {
                'bind': "/data",
                "mode": 'rw'
            }
        }
    )
    state = "Running"

    return True, container.id, vnc_port, container_name, state, image.id, ws_port, ssh_port

def stop_container(container_id):
    container = client.containers.get(container_id)
    container.stop()
    return True

def get_logs(container_id):
    logs = client.containers.get(container_id).logs(timestamps=True)
    return logs

def delete_container(container_id):
    container = client.containers.get(container_id)
    container.remove()
    return True