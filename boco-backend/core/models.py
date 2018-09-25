import uuid

from django.contrib.auth.base_user import AbstractBaseUser
from django.db import models
from django.utils import timezone

from core.managers import BaseManager, CustomUserManager


class BaseModelMixin(models.Model):
    """
        BaseModelMixin
        This represents the BaseModel for the project without any creation, modification
        or deletion history.
        Inherits : `models.Model`

    """
    """ Project level variables """
    deleted = models.DateTimeField(db_index=True, null=True, blank=True)
    last_modified_at = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)
    objects = BaseManager()

    """
        delete
            Method to delete BaseModel Object

        * Overrides delete method by updating deleted with current time
    """
    def delete(self, *args, **kwargs):
        super().delete(*args, **kwargs)

    class Meta:
        abstract = True


class BaseModel(BaseModelMixin, models.Model):
    """
        BaseModel
        This represents the BaseModel for the project with all creation, modification
        or deletion history.
        Inherits : `BaseModelMixin`

    """
    # """ Project level variables """
    # history = History(inherit=True)

    class Meta:
        abstract = True
        ordering = ['last_modified_at']


class User(BaseModelMixin, AbstractBaseUser):
    """
        User
            This class define model used to store user entity details.
            Inherits : `BaseModelMixin`, `AbstractBaseUser`
            properties : permissions, is_staff
    """
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(null=False, blank=False)
    mobile_number = models.CharField(max_length=15)
    date_joined = models.DateTimeField(default=timezone.now)
    is_active = models.BooleanField(default=True)
    jwt_secret = models.UUIDField(default=uuid.uuid4)
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, app_label):
        return self.is_admin
