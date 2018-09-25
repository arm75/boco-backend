import requests
from django.conf import settings

from . import exceptions as ex


def get_location_from_address(address):
    location = None
    try:
        url = 'https://maps.googleapis.com/maps/api/geocode/json'
        params = {'sensor': 'false', 'address': address, 'key': settings.GOOGLE_MAP_API_KEY}
        response = requests.get(url, params=params)
        results = response.json()['results']
        if response.json().get('status') == 'ZERO_RESULTS':
            address = "16 Williams Dr, Union, MO 63084"
            location = get_location_from_address(address)
        else:
            location = results[0]['geometry']['location']
    except Exception as e:
        print(e)
    return location
