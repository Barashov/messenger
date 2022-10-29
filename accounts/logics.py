from .models import User


class UserLogic:
    @classmethod
    def is_user_exist(cls, username):
        user = User.objects.filter(username=username)
        return user.exists()
