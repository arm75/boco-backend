from django.core.management import call_command
from django.core.management.base import BaseCommand
from django_fakery import factory

import core.models as core_models
import workorder.models as workorder_models


def _get_or_fake(model, lookup, **kwargs):
    o, _ = factory.g_m(model, lookup=lookup)(**kwargs)
    return o


class Command(BaseCommand):
    help = "Command to populate users, roles, permissions and other initial data"

    def add_arguments(self, parser):
        parser.add_argument(
            '--load_data',
            default=None,
            dest='load_data',
            nargs='?',
            help='Specifies if user want to populate initial data for fixtures.'
        )

    def handle(self, *arg, **options):

        user_data = {
            'username': 'boco_user',
            'password': 'boco1234'
        }

        self.create_user(**user_data)
        superuser_data = {
            'username': 'boco_admin',
            'password': 'boco1234'
        }
        self.create_superuser(**superuser_data)

    def create_user(self, **kwargs):
        default_kwargs = {
            'is_active': True,
            'is_staff': True,
            'is_superuser': False,
        }
        default_kwargs.update(kwargs)
        username = default_kwargs.pop('username')
        password = default_kwargs.pop('password')
        user = _get_or_fake(core_models.User, {'username': username}, **default_kwargs)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, **kwargs):
        default_kwargs = {
            'is_active': True,
            'is_superuser': True,
            'is_admin': True,
            'is_staff': True,
            'email': "b@b.com",
        }
        default_kwargs.update(kwargs)
        username = default_kwargs.pop('username')
        password = default_kwargs.pop('password')
        user = _get_or_fake(core_models.User, {'username': username}, **default_kwargs)
        user.set_password(password)
        user.save()
        return user
