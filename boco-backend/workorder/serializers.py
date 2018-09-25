from django.db import transaction
from rest_framework import serializers

from .models import *
from core.models import User
from .utils import get_location_from_address
from .exceptions import CannotMarkCompleteWorkOrderError


class GetWorkOrderListingSerializer(serializers.ModelSerializer):
    """
    Serializer class to create and list workorders
    """

    class Meta:
        model = WorkOrder
        fields = (
            'id',
            'work_order_num',
        )
        extra_kwargs = {
            'id': {'read_only': True},
            'work_order_num': {'read_only': True},
         }


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = (
            'id',
            'email',
            'mobile_number',
            'username',
            'created',
            'is_staff',
            'is_active',
            'is_superuser',
            'is_admin',
            'first_name',
            'last_name',
        )
        extra_kwargs = {
            'id': {'read_only': True},
            'created': {'read_only': True},
            'is_staff': {'read_only': True},
            'is_active': {'read_only': True},
            'is_superuser': {'read_only': True},
            'is_admin': {'read_only': True},
        }

    def validate(self, validated_data):
        validated_data['is_staff'] = True
        validated_data['is_active'] = True
        validated_data['is_superuser'] = False
        validated_data['password'] = 'Boco123'
        return validated_data

    def create(self, validated_data):
        instance = super().create(validated_data)
        instance.set_password('Boco123')
        instance.save()
        return instance


class ActivateUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'is_active',
        )
        extra_kwargs = {
            'id': {'read_only': True},
            'username': {'read_only': True},
            'is_active': {'read_only': True},
        }

    def validate(self, validated_data):
        validated_data['is_active'] = True
        return validated_data


class ResetUserPasswordSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'password',
        )
        extra_kwargs = {
            'id': {'read_only': True},
            'username': {'read_only': True},
        }

    def update(self, instance, validated_data):
        password = validated_data.pop('password')
        instance.set_password(password)
        instance.save()
        return instance


class WorkOrderSerializer(serializers.ModelSerializer):
    """
    Serializer class to create and list workorders
    """

    customer_details = serializers.SerializerMethodField(read_only=True)

    def get_customer_details(self, workorder):
        if workorder.customer is not None:
            return RetreiveUpdateCustomerSerializer(workorder.customer).data
        return None

    class Meta:
        model = WorkOrder
        fields = (
            'id',
            'work_order_num',
            'customer_po_num',
            'work_order_by',
            'date_of_order',
            'date_work_started',
            'status',
            'created',
            'description',
            'other_requirements',
            'customer',
            'has_additional_comments',
            'comments',
            'customer_details',
        )
        extra_kwargs = {
            'id': {'read_only': True},
            'created': {'read_only': True},
            'status': {'read_only': True},
            'description': {'read_only': True},
            'other_requirements': {'read_only': True},
            'has_additional_comments': {'read_only': True},
            'comments': {'read_only': True},
            'customer_details': {'read_only': True},

        }


class RetreiveUpdateWorkOrderSerializer(serializers.ModelSerializer):
    """
    Serializer class to handle update retrieve of a workorder
    """

    customer_details = serializers.SerializerMethodField(read_only=True)

    def get_customer_details(self, workorder):
        if workorder.customer is not None:
            return RetreiveUpdateCustomerSerializer(workorder.customer).data
        return None

    class Meta:
        model = WorkOrder
        fields = (
            'id',
            'work_order_num',
            'customer_po_num',
            'work_order_by',
            'description',
            'other_requirements',
            'signature_bs64_string',
            'customer',
            'has_additional_comments',
            'comments',
            'status',
            'created',
            'customer_details',
            'date_of_order',
            'date_work_started',

        )
        extra_kwargs = {
            'id': {'read_only': True},
            'created': {'read_only': True},
            'work_order_num': {'read_only': True},
            'customer_po_num': {'read_only': True},
            'work_order_by': {'read_only': True},
            'status': {'read_only': True},
            'date_of_order': {'read_only': True},
            'date_work_started': {'read_only': True},

        }


class RetreiveUpdateWorkOrderSignaturesSerializer(serializers.ModelSerializer):
    """
    Serializer class to handle update retrieve of a workorder
    """

    class Meta:
        model = WorkOrder
        fields = (
            'id',
            'signature_bs64_string',
            'has_additional_comments',
            'comments',
            )
        extra_kwargs = {
            'id': {'read_only': True},
            }


class MarkWorkOrderCompleteSerializer(serializers.ModelSerializer):
    """
    Serializer class to handle update retrieve of a workorder
    """

    class Meta:
        model = WorkOrder
        fields = (
            'id',
            'is_complete',

        )
        extra_kwargs = {
            'id': {'read_only': True},
        }

    def validate(self, attrs):
        has_customer = self.instance.customer is not None
        has_sub_contractor = self.instance.sub_contractors is not None
        has_supplier = self.instance.suppliers.exists()
        has_stocks = self.instance.stocks.exists()
        has_rentsls = self.instance.rentals.exists()
        has_equipments = self.instance.equipments.exists()
        has_time_entries = self.instance.time_entries.exists()

        if (has_customer and has_sub_contractor and has_supplier and has_stocks and has_rentsls
            and has_equipments and has_time_entries and self.instance.signature_bs64_string is
        not None):
            return attrs

        raise CannotMarkCompleteWorkOrderError()
    

class CustomerSerializer(serializers.ModelSerializer):
    """
    Serializer class to create and list customers
    """
    latitude = None
    longitude = None
    # contacts = serializers.SerializerMethodField()

    # def get_contacts(self, customer):
    #     if customer.contacts is not None:
    #         return CustomerContactSerializer(customer.contacts, many=True).data
    #     return None

    class Meta:
        model = Customer
        fields = (
            'id',
            'email',
            'company_name',
            'address',
            'address_latitude',
            'address_longitude',
            'created',
            # 'contacts',
            'email',
            'contact_number',
            'poc',
        )
        extra_kwargs = {
            'id': {'read_only': True},
            'created': {'read_only': True},
            'address_latitude': {'read_only': True},
            'address_longitude': {'read_only': True},

        }

    def validate_address(self, address):
        location = get_location_from_address(address)
        self.longitude = location.get('lng')
        self.latitude = location.get('lat')
        return address

    def create(self, validated_data):
        with transaction.atomic():
            validated_data['address_latitude'] = self.latitude
            validated_data['address_longitude'] = self.longitude
            instance = super().create(validated_data)
            return instance


class RetreiveUpdateCustomerSerializer(serializers.ModelSerializer):
    """
    Serializer class to get and update a particular customer object.
    """

    latitude = None
    longitude = None

    # contacts = serializers.SerializerMethodField()

    # def get_contacts(self, customer):
    #     if customer.contacts is not None:
    #         return CustomerContactSerializer(customer.contacts, many=True).data
    #     return None

    class Meta:
        model = Customer
        fields = (
            'id',
            'email',
            'company_name',
            'address',
            'address_latitude',
            'address_longitude',
            'created',
            # 'contacts'
            'email',
            'contact_number',
            'poc',
        )
        extra_kwargs = {
            'id': {'read_only': True},
            'created': {'read_only': True},
            'address_latitude': {'read_only': True},
            'address_longitude': {'read_only': True},

        }

    def validate_address(self, address):
        location = get_location_from_address(address)
        self.longitude = location.get('lng')
        self.latitude = location.get('lat')
        return address

    def update(self, instance, validated_data):
        with transaction.atomic():
            validated_data['address_latitude'] = self.latitude
            validated_data['address_longitude'] = self.longitude
            instance = super().update(instance, validated_data)
            return instance


class CustomerContactSerializer(serializers.ModelSerializer):
    """
    Serializer class to add customer contacts
    """
    class Meta:
        model = CustomerContacts
        fields = (
            'id',
            'contact_number',
            'poc',
            'customer',

        )
        extra_kwargs = {
            'id': {'read_only': True},
            'created': {'read_only': True},
        }


class SubContractorSerializer(serializers.ModelSerializer):
    """
    Serializer class to create and list subcontractor objects
    """
    latitude = None
    longitude = None

    class Meta:
        model = SubContractor
        fields = (
            'id',
            'email',
            'contact_number',
            'poc',
            'sub_contractor_name',
            'address',
            'address_latitude',
            'address_longitude',
            'created',
        )
        extra_kwargs = {
            'id': {'read_only': True},
            'created': {'read_only': True},
            'address_latitude': {'read_only': True},
            'address_longitude': {'read_only': True},

        }

    def validate_address(self, address):
        location = get_location_from_address(address)
        self.longitude = location.get('lng')
        self.latitude = location.get('lat')
        return address

    def create(self, validated_data):
        with transaction.atomic():
            validated_data['address_latitude'] = self.latitude
            validated_data['address_longitude'] = self.longitude
            instance = super().create(validated_data)
            return instance


class RetreiveUpdateSubContractorSerializer(serializers.ModelSerializer):
    """
    Serializer class to handle update retrieve of a Subcontractor
    """
    latitude = None
    longitude = None

    class Meta:
        model = SubContractor
        fields = (
            'id',
            'email',
            'sub_contractor_name',
            'contact_number',
            'poc',
            'address',
            'address_latitude',
            'address_longitude',
            'created',
        )
        extra_kwargs = {
            'id': {'read_only': True},
            'created': {'read_only': True},
            'address_latitude': {'read_only': True},
            'address_longitude': {'read_only': True},

        }

    def validate_address(self, address):
        location = get_location_from_address(address)
        self.longitude = location.get('lng')
        self.latitude = location.get('lat')
        return address

    def update(self, instance, validated_data):
        with transaction.atomic():
            validated_data['address_latitude'] = self.latitude
            validated_data['address_longitude'] = self.longitude
            instance = super().update(instance, validated_data)
            return instance


class WorkOrderSubContractorSerializer(serializers.ModelSerializer):
    """
    Serializer class to create and list subcontractor objects
    """
    sub_contractor_name = serializers.ReadOnlyField(
        source='sub_contractor.sub_contractor_name'
    )
    email = serializers.ReadOnlyField(
        source='sub_contractor.email'
    )
    contact_number = serializers.ReadOnlyField(
        source='sub_contractor.contact_number'
    )
    poc = serializers.ReadOnlyField(
        source='sub_contractor.poc'
    )
    address = serializers.ReadOnlyField(
        source='sub_contractor.address'
    )
    address_latitude = serializers.ReadOnlyField(
        source='sub_contractor.address_latitude'
    )
    address_longitude = serializers.ReadOnlyField(
        source='sub_contractor.address_longitude'
    )

    class Meta:
        model = WorkOrderSubContractor
        fields = (
            'id',
            'sub_contractor',
            'work_order',
            'email',
            'sub_contractor_name',
            'contact_number',
            'poc',
            'address',
            'address_latitude',
            'address_longitude',
            'created',
        )
        extra_kwargs = {
            'id': {'read_only': True},
            'created': {'read_only': True},
            'email': {'read_only': True},
            'sub_contractor_name': {'read_only': True},
            'contact_number': {'read_only': True},
            'poc': {'read_only': True},
            'address': {'read_only': True},
            'address_latitude': {'read_only': True},
            'address_longitude': {'read_only': True},

        }


class SupplierSerializer(serializers.ModelSerializer):
    """
    Serializer class to create and list Suppliers
    """

    class Meta:
        model = Supplier
        fields = (
            'id',
            'company_name',
            'created',
        )
        extra_kwargs = {
            'id': {'read_only': True},
            'created': {'read_only': True},
        }


class RemoveSupplierSerializer(serializers.ModelSerializer):
    """
    Serializer class to handle delete request for supplier
    """

    class Meta:
        model = Supplier


class WorkorderSupplierSerializer(serializers.ModelSerializer):
    """
    Serializer class to add suppliers to workorder
    """
    company_name = serializers.ReadOnlyField(source='supplier.company_name')

    class Meta:
        model = WorkOrderSuppliers
        fields = (
            'id',
            'workorder',
            'supplier',
            'created',
            'company_name',
            'cost',
            'ticket_number',
        )
        extra_kwargs = {
            'id': {'read_only': True},
            'created': {'read_only': True},
        }


class StockSerializer(serializers.ModelSerializer):
    """
    Serializer class to create and list stocks
    """

    class Meta:
        model = Stock
        fields = (
            'id',
            'stock_type',
            'item_name',
            'cost',
            'created',
        )
        extra_kwargs = {
            'id': {'read_only': True},
            'created': {'read_only': True},
        }


class RemoveStockSerializer(serializers.ModelSerializer):
    """
    Serializer class to handle delete request for stock
    """

    class Meta:
        model = Stock


class WorkorderStockSerializer(serializers.ModelSerializer):
    """
    Serializer class to add stocks to workorder
    """
    stock_type = serializers.ReadOnlyField(source='stocks.stock_type')
    item_name = serializers.ReadOnlyField(source='stocks.item_name')
    cost = serializers.ReadOnlyField(source='stocks.cost')

    class Meta:
        model = BocoStock
        fields = (
            'id',
            'workorder',
            'stocks',
            'created',
            'stock_type',
            'item_name',
            'number_of_items',
            'cost',

        )
        extra_kwargs = {
            'id': {'read_only': True},
            'created': {'read_only': True},
        }


class EquipmentRentalSerializer(serializers.ModelSerializer):
    """
    Serializer class to create and list EquipmentRental
    """

    class Meta:
        model = EquipmentRental
        fields = (
            'id',
            'vendor_name',
            'created',
        )
        extra_kwargs = {
            'id': {'read_only': True},
            'created': {'read_only': True},
        }


class RemoveEquipmentRentalSerializer(serializers.ModelSerializer):
    """
    Serializer class to handle delete request for vendors
    """

    class Meta:
        model = EquipmentRental


class WorkorderEquipmentRentalSerializer(serializers.ModelSerializer):
    """
    Serializer class to add vendors to workorder
    """

    vendor_name = serializers.ReadOnlyField(source='equipment_rental.vendor_name')

    class Meta:
        model = WorkOrderEquipmentRental
        fields = (
            'id',
            'workorder',
            'equipment_rental',
            'created',
            'vendor_name',
            'ticket_number',
            'date',
            'cost',
        )
        extra_kwargs = {
            'id': {'read_only': True},
            'created': {'read_only': True},
        }


class EquipmentSerializer(serializers.ModelSerializer):
    """
    Serializer class to create and list Equipment
    """

    class Meta:
        model = Equipment
        fields = (
            'id',
            'item_name',
            'cost',
            'created',
        )
        extra_kwargs = {
            'id': {'read_only': True},
            'created': {'read_only': True},
        }


class RemoveEquipmentSerializer(serializers.ModelSerializer):
    """
    Serializer class to handle delete request for Equipment
    """

    class Meta:
        model = Equipment


class WorkorderEquipmentSerializer(serializers.ModelSerializer):
    """
    Serializer class to add vendors to workorder
    """
    item_name = serializers.ReadOnlyField(source='equipment.item_name')
    cost = serializers.ReadOnlyField(source='equipment.cost')

    class Meta:
        model = WorkorderEquipment
        fields = (
            'id',
            'workorder',
            'equipment',
            'created',
            'item_name',
            'cost',
        )
        extra_kwargs = {
            'id': {'read_only': True},
            'created': {'read_only': True},
        }


class WorkorderTimeEntrySerializer(serializers.ModelSerializer):
    """
    Serializer class to create and list TimeEntries
    """

    class Meta:
        model = WorkorderTimeEntry
        fields = (
            'id',
            'workorder',
            'employee_name',
            'date',
            'time_in',
            'time_out',
            'work_type',
            'created',
        )
        extra_kwargs = {
            'id': {'read_only': True},
            'created': {'read_only': True},
        }
