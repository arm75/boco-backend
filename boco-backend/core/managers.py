from django.contrib.auth.models import UserManager
from django.db import models


class BaseQuerySet(models.query.QuerySet):
    """
    BaseQuerySet
        BaseQuerySet to handle queryset used in the app
        Inherits: `models.query.QuerySet`
    """

    def live(self):
        """
            live
                Method to fetch all active objects of the queryset entity
                :returns: all active instance for querySet entity
        """
        return self.filter(deleted__isnull=True)

    def modified(self):
        """
            modified
                Method to fetch all modified objects of the queryset entity from history model
                :returns: all modified instance for querySet entity
        """
        return self.exclude(history_type='-').exclude(history_type='~', deleted__isnull=False)

    def deleted(self, hard_deleted=False):
        """
            deleted
                Method to fetch deleted objects of the queryset entity from history model
                :returns: deleted instance for querySet entity
        """
        if hard_deleted:
            return self.filter(history_type='-')
        return self.filter(deleted__isnull=False)


class BaseManager(models.Manager):
    """
    BaseManager
        BaseManager to manage BaseQuery instance
        Inherits: `models.Manager`
    """

    def get_queryset(self, model=None, live_records=True):
        """
            get_queryset
                Method to fetch BaseQuerySet instance
                :returns: BaseQuerySet instance for model using self._db
        """
        # Use specified model while fetching deleted or modified objects
        # If model not specified, use default model
        if model is None:
            model = self.model
        base_queryset = BaseQuerySet(model, using=self._db)
        # if specified model is History model then return all records from History model
        # otherwise return all active records from specified model
        return base_queryset.live() if live_records else base_queryset

    def modified(self):
        """
            modified
                Method to fetch all modified objects of the queryset entity from history model
                :returns: all modified instance for querySet entity
        """
        return self.get_queryset(model=self.model.history.model, live_records=False).modified()

    def deleted(self, hard_deleted=False):
        """
            deleted
                Method to fetch deleted objects of the queryset entity from history model
                :returns: deleted instance for querySet entity
        """
        if hard_deleted:
            return self.get_queryset(
                model=self.model.history.model,
                live_records=False,
            ).deleted(hard_deleted=True)

        return self.get_queryset(model=self.model, live_records=False).deleted()


class CustomUserManager(UserManager, BaseManager):
    def get_by_natural_key(self, username):
        return self.get(username__iexact=username)

    def _create_user(self, username, password, **extra_fields):
        """
        Create and save a user with the given username and password.
        """
        if not username:
            raise ValueError('The given username must be set')
        username = self.model.normalize_username(username)
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(username, password, **extra_fields)

    def create_superuser(self, username, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(username, password, **extra_fields)
