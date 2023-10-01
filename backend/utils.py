def check_authorization(required_user_id, current_user_id):
    return current_user_id == required_user_id