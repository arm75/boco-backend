import json

import pytest
from django.test import Client
from django.utils import timezone
from django_fakery import factory
from rest_framework import status as status_code

import core.models as core_models
import workorder.models as workorder_model


@pytest.fixture()
def client(db):
    user_data = {
        'email': 'boco@test.com',
        'username': 'boco_user',
        'password': 'boco1234',
    }

    user = create_user(**user_data)
    client = Client()
    client.force_login(user)
    return client


def _get_or_fake(model, lookup, **kwargs):
    o, _ = factory.g_m(model, lookup=lookup)(**kwargs)
    return o


def create_user(**kwargs):
    default_kwargs = {
        'is_active': True,
        'is_superuser': False,
    }
    default_kwargs.update(kwargs)
    email = default_kwargs.pop('email')
    password = default_kwargs.pop('password')
    user = _get_or_fake(core_models.User, {'email': email}, **default_kwargs)
    user.set_password(password)
    user.save()
    return user


@pytest.mark.django_db
class TestBoco(object):

    def test_create_customer(self, client):
        customer_data = {
            "email": "1003@1003.com",
            "contact_number": "1234567909",
            "poc": "Shashank",
            "address": "Mountain View, CA",
            'company_name': 'ABC',
        }
        url = '/customers/'
        response = Client().post(url,
                                 data=json.dumps(customer_data),
                                 content_type="application/json",
                                 )
        assert response.status_code == status_code.HTTP_201_CREATED

    def test_create_sub_contractor(self, client):
        sub_contractor_data = {
            "email": "1003@1003.com",
            "contact_number": "1234567909",
            "poc": "Shashank",
            "address": "Mountain View, CA",
            'sub_contractor_name': 'ABC',
        }
        url = '/subcontractors/'
        response = Client().post(url,
                                 data=json.dumps(sub_contractor_data),
                                 content_type="application/json",
                                 )
        assert response.status_code == status_code.HTTP_201_CREATED

    def test_create_work_order(self, client):
        current_date = timezone.now()
        work_order_data = {
            "work_order_num": "1001",
            "customer_po_num": "1234567",
            "work_order_by": "Shashank",
            "date_of_order": str(current_date),
            "date_work_started": str(current_date),
        }
        url = '/workorders/'
        response = Client().post(url,
                                 data=json.dumps(work_order_data),
                                 content_type="application/json",
                                 )
        assert response.status_code == status_code.HTTP_201_CREATED

    def test_update_work_order(self, client):
        current_date = timezone.now()
        work_order_data = {
            "work_order_num": "1001",
            "customer_po_num": "1234567",
            "work_order_by": "Shashank",
            "date_of_order": str(current_date),
            "date_work_started": str(current_date),
        }
        url = '/workorders/'
        create_response = Client().post(
            url,
            data=json.dumps(work_order_data),
            content_type="application/json",
        )
        assert create_response.status_code == status_code.HTTP_201_CREATED
        work_order_id = create_response.data.get('id')
        customer = _get_or_fake(workorder_model.Customer, {'company_name': 'ABC'})
        sub_contractor = _get_or_fake(workorder_model.Customer, {'sub_contractor_name': 'ABC'})
        update_data = {
            "description": "Testing update serializer",
            "customer": customer.id,
            "sub_contractor": sub_contractor.id,
            "other_requirements": "No other requirement",
            "has_additional_comments": "true",
            "comments": "no comments in here"
        }

        update_url = '/workorders/{0}/'.format(work_order_id)
        update_response = Client().put(
            update_url,
            data=json.dumps(update_data),
            content_type="application/json",
        )
        assert update_response.status_code == status_code.HTTP_200_OK
