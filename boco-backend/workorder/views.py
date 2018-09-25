from django.conf import settings
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions

from rest_framework.response import Response
from sequences import get_next_value

from . import serializers as workorder_serializers
from .models import *
from . import permissions as boco_permissions
from .mixins import PDFExportMixin
from core.models import User


class WorkOrderViewSet(viewsets.ModelViewSet):
    """
    Viewset to handle requests to create a workorder object or get list of objects.
    """
    model = WorkOrder
    queryset = WorkOrder.objects.all()

    permission_classes = (
        permissions.IsAuthenticated,
    )

    filter_backends = (DjangoFilterBackend,)

    # specify the fields on which filter support is required.
    filter_fields = ('work_order_by', 'work_order_num', 'customer_po_num',)

    serializer_class = workorder_serializers.WorkOrderSerializer


class UserViewSet(viewsets.ModelViewSet):
    """
    Viewset to handle requests to create a User object or get list of objects.
    """
    model = User
    queryset = User.objects.all()

    permission_classes = ()

    filter_backends = (DjangoFilterBackend,)

    # specify the fields on which filter support is required.
    filter_fields = ('username', 'email', 'mobile_number', 'is_active', 'is_staff',
                     'is_superuser', 'is_admin')

    serializer_class = workorder_serializers.UserSerializer


class ResetUserPasswordViewSet(viewsets.ModelViewSet):
    """
    Viewset to handle requests to reset a user password
    """
    model = User
    queryset = User.objects.all()

    permission_classes = (
        permissions.IsAuthenticated,
    )

    serializer_class = workorder_serializers.ResetUserPasswordSerializer


class ActivateUserViewSet(viewsets.ModelViewSet):
    """
    Viewset to handle requests to create a User object or get list of objects.
    """
    model = User
    queryset = User.objects.all()
    permission_classes = (
        permissions.IsAuthenticated,
        boco_permissions.IsSuperUser,
    )

    filter_backends = (DjangoFilterBackend,)

    # specify the fields on which filter support is required.
    filter_fields = ('username', 'email', 'mobile_number', 'is_active', 'is_staff',
                     'is_superuser', 'is_admin')

    serializer_class = workorder_serializers.ActivateUserSerializer

    def apply_queryset_filters(self, queryset):
        queryset = queryset.filter(is_active=False)
        return queryset


class GetWorkOrdersViewSet(viewsets.ModelViewSet):
    """
    Viewset to handle requests get list of objects.
    """
    model = WorkOrder
    queryset = WorkOrder.objects.all()

    filter_backends = (DjangoFilterBackend,)

    # specify the fields on which filter support is required.
    filter_fields = ('work_order_num',)

    permission_classes = (
        permissions.IsAuthenticated,
    )
    serializer_class = workorder_serializers.GetWorkOrderListingSerializer


class RetreiveUpdateWorkOrderViewSet(viewsets.ModelViewSet):
    """
    Viewset to handle following requests
        1. Retrieve a workorder object
        2. Update a workorder detail
    """
    model = WorkOrder
    serializer_class = workorder_serializers.RetreiveUpdateWorkOrderSerializer

    permission_classes = (
        permissions.IsAuthenticated,
    )

    def get_queryset(self):
        """
        Return active records
        :return queryset:
        """
        queryset = self.model.objects.all()
        return self.apply_queryset_filters(queryset)

    def apply_queryset_filters(self, queryset):
        if self.request.method == 'PUT':
            queryset = queryset.filter(is_complete=False)
        return queryset


class RetreiveUpdateWorkOrderSignatureViewSet(viewsets.ModelViewSet):

    model = WorkOrder
    serializer_class = workorder_serializers.RetreiveUpdateWorkOrderSignaturesSerializer

    permission_classes = (
        permissions.IsAuthenticated,
    )

    def get_queryset(self):
        """
        Return active records
        :return queryset:
        """
        queryset = self.model.objects.all()
        return self.apply_queryset_filters(queryset)

    def apply_queryset_filters(self, queryset):
        return queryset


class MarkCompletedWorkOrderViewSet(viewsets.ModelViewSet):
    """
    Viewset is used to mark a work order completed.
    """
    model = WorkOrder
    serializer_class = workorder_serializers.MarkWorkOrderCompleteSerializer

    permission_classes = (
        permissions.IsAuthenticated,
    )

    def get_queryset(self):
        """
        Return active records
        :return queryset:
        """
        queryset = self.model.objects.all()
        return self.apply_queryset_filters(queryset)

    def apply_queryset_filters(self, queryset):
        return queryset


class CustomerViewSet(viewsets.ModelViewSet):
    """
       Viewset to handle requests to create a customer object or get list of objects.
    """
    model = Customer
    queryset = Customer.objects.all()
    permission_classes = (
        permissions.IsAuthenticated,
    )
    filter_backends = (DjangoFilterBackend,)

    # specify the fields on which filter support is required.
    filter_fields = ('company_name',)

    serializer_class = workorder_serializers.CustomerSerializer


class RetreiveUpdateCustomerViewSet(viewsets.ModelViewSet):
    """
    Viewset to handle following requests
        1. Retrieve a customer object
        2. Update a customer detail
    """

    model = Customer
    serializer_class = workorder_serializers.RetreiveUpdateCustomerSerializer

    permission_classes = (
        permissions.IsAuthenticated,
    )

    def get_queryset(self):
        """
        Return active records
        :return queryset:
        """
        queryset = self.model.objects.all()
        return self.apply_queryset_filters(queryset)

    def apply_queryset_filters(self, queryset):
        return queryset


class SubContractorViewSet(viewsets.ModelViewSet):
    """
       Viewset to handle requests to create a subcontractor object or get list of objects.
    """
    model = SubContractor
    queryset = SubContractor.objects.all()

    permission_classes = (
        permissions.IsAuthenticated,
    )

    filter_backends = (DjangoFilterBackend,)

    # specify the fields on which filter support is required.
    filter_fields = ('sub_contractor_name', 'email', 'contact_number', 'poc',)

    serializer_class = workorder_serializers.SubContractorSerializer


class WorkSubContractorViewSet(viewsets.ModelViewSet):
    """
       Viewset to handle requests to create a subcontractor object or get list of objects.
    """
    model = WorkOrderSubContractor
    queryset = WorkOrderSubContractor.objects.all()

    permission_classes = (
        permissions.IsAuthenticated,
    )

    filter_backends = (DjangoFilterBackend,)

    # specify the fields on which filter support is required.
    filter_fields = ('sub_contractor', 'work_order',)

    serializer_class = workorder_serializers.WorkOrderSubContractorSerializer

    def get_queryset(self):
        """
        Return active records
        :return queryset:
        """
        queryset = self.model.objects.all()
        return self.apply_queryset_filters(queryset)

    def apply_queryset_filters(self, queryset):
        if self.request.method == 'PUT':
            queryset = queryset.filter(work_order__is_complete=False)
        workorder_id = self.kwargs.get('work_order_id')
        return queryset.filter(work_order__id=workorder_id)


class RetreiveUpdateSubContractorViewSet(viewsets.ModelViewSet):
    """
    Viewset to handle following requests
        1. Retrieve a subcontractor object
        2. Update a subcontractor detail
    """

    model = SubContractor
    serializer_class = workorder_serializers.RetreiveUpdateSubContractorSerializer

    permission_classes = (
        permissions.IsAuthenticated,
    )

    def get_queryset(self):
        """
        Return active records
        :return queryset:
        """
        queryset = self.model.objects.all()
        return self.apply_queryset_filters(queryset)

    def apply_queryset_filters(self, queryset):
        return queryset


class GetNextWorkOrderNumberViewSet(viewsets.ViewSet):

    permission_classes = (
        permissions.IsAuthenticated,
    )

    def retrieve(self, request, pk=None):
        next_workorder = {
            'work_order_number': get_next_value('WorkOrder', initial_value=1001)
        }

        return Response(next_workorder)


class SupplierViewSet(viewsets.ModelViewSet):
    """
       Viewset to handle requests to create a supplier object or get list of objects.
    """
    model = Supplier
    queryset = Supplier.objects.all()

    permission_classes = (
        permissions.IsAuthenticated,
    )

    filter_backends = (DjangoFilterBackend,)

    # specify the fields on which filter support is required.
    filter_fields = ('company_name',)

    serializer_class = workorder_serializers.SupplierSerializer


class WorkOrderSupplierViewSet(viewsets.ModelViewSet):
    """
       Viewset to handle requests to create a supplier object or get list of objects.
    """
    model = WorkOrderSuppliers
    queryset = WorkOrderSuppliers.objects.all()

    permission_classes = (
        permissions.IsAuthenticated,
    )

    filter_backends = (DjangoFilterBackend,)

    # specify the fields on which filter support is required.
    filter_fields = ('workorder',)

    serializer_class = workorder_serializers.WorkorderSupplierSerializer

    def get_queryset(self):
        """
        Return active records
        :return queryset:
        """
        queryset = self.model.objects.all()
        return self.apply_queryset_filters(queryset)

    def apply_queryset_filters(self, queryset):
        if self.request.method == 'PUT':
            queryset = queryset.filter(workorder__is_complete=False)
        workorder_id = self.kwargs.get('work_order_id')
        return queryset.filter(workorder__id=workorder_id)


class RemoveSupplierViewSet(viewsets.ModelViewSet):
    """
       Viewset to handle requests to create a subcontractor object or get list of objects.
    """
    model = Supplier
    queryset = Supplier.objects.all()

    permission_classes = (
        permissions.IsAuthenticated,
    )

    filter_backends = (DjangoFilterBackend,)

    serializer_class = workorder_serializers.RemoveSupplierSerializer

    def get_queryset(self):
        """
        Return active records
        :return queryset:
        """
        queryset = self.model.objects.all()
        return self.apply_queryset_filters(queryset)

    def apply_queryset_filters(self, queryset):
        return queryset


class StockViewSet(viewsets.ModelViewSet):
    """
       Viewset to handle requests to create a stock object or get list of objects.
    """
    model = Stock
    queryset = Stock.objects.all()

    permission_classes = (
        permissions.IsAuthenticated,
    )

    filter_backends = (DjangoFilterBackend,)

    # specify the fields on which filter support is required.
    filter_fields = ('item_name', 'stock_type',)

    serializer_class = workorder_serializers.StockSerializer


class WorkOrderStockViewSet(viewsets.ModelViewSet):
    """
       Viewset to handle requests to create a stock object or get list of objects in workorder.
    """
    model = BocoStock
    queryset = BocoStock.objects.all()

    permission_classes = (
        permissions.IsAuthenticated,
    )

    filter_backends = (DjangoFilterBackend,)

    # specify the fields on which filter support is required.
    filter_fields = ('workorder', 'stocks')

    serializer_class = workorder_serializers.WorkorderStockSerializer

    def get_queryset(self):
        """
        Return active records
        :return queryset:
        """
        queryset = self.model.objects.all()
        return self.apply_queryset_filters(queryset)

    def apply_queryset_filters(self, queryset):
        if self.request.method == 'PUT':
            queryset = queryset.filter(workorder__is_complete=False)
        workorder_id = self.kwargs.get('work_order_id')
        return queryset.filter(workorder__id=workorder_id)


class RemoveStockViewSet(viewsets.ModelViewSet):

    model = Stock
    queryset = Stock.objects.all()

    permission_classes = (
        permissions.IsAuthenticated,
    )

    filter_backends = (DjangoFilterBackend,)

    serializer_class = workorder_serializers.RemoveStockSerializer

    def get_queryset(self):
        """
        Return active records
        :return queryset:
        """
        queryset = self.model.objects.all()
        return self.apply_queryset_filters(queryset)

    def apply_queryset_filters(self, queryset):
        return queryset


class EquipmentRentalViewSet(viewsets.ModelViewSet):
    """
       Viewset to handle requests to create a vendors object or get list of objects.
    """
    model = EquipmentRental
    queryset = EquipmentRental.objects.all()

    permission_classes = (
        permissions.IsAuthenticated,
    )

    filter_backends = (DjangoFilterBackend,)

    # specify the fields on which filter support is required.
    filter_fields = ('vendor_name',)

    serializer_class = workorder_serializers.EquipmentRentalSerializer


class WorkOrderEquipmentRentalViewSet(viewsets.ModelViewSet):
    """
       Viewset to handle requests to create a vendor object or get list of objects in workorder.
    """
    model = WorkOrderEquipmentRental
    queryset = WorkOrderEquipmentRental.objects.all()

    permission_classes = (
        permissions.IsAuthenticated,
    )

    filter_backends = (DjangoFilterBackend,)

    # specify the fields on which filter support is required.
    filter_fields = ('workorder', 'equipment_rental')

    serializer_class = workorder_serializers.WorkorderEquipmentRentalSerializer

    def get_queryset(self):
        """
        Return active records
        :return queryset:
        """
        queryset = self.model.objects.all()
        return self.apply_queryset_filters(queryset)

    def apply_queryset_filters(self, queryset):
        if self.request.method == 'PUT':
            queryset = queryset.filter(workorder__is_complete=False)
        workorder_id = self.kwargs.get('work_order_id')
        return queryset.filter(workorder__id=workorder_id)


class RemoveEquipmentRentalViewSet(viewsets.ModelViewSet):

    model = EquipmentRental
    queryset = EquipmentRental.objects.all()

    permission_classes = (
        permissions.IsAuthenticated,
    )

    filter_backends = (DjangoFilterBackend,)

    serializer_class = workorder_serializers.RemoveEquipmentRentalSerializer

    def get_queryset(self):
        """
        Return active records
        :return queryset:
        """
        queryset = self.model.objects.all()
        return self.apply_queryset_filters(queryset)

    def apply_queryset_filters(self, queryset):
        return queryset


class EquipmentViewSet(viewsets.ModelViewSet):
    """
       Viewset to handle requests to create a vendors object or get list of objects.
    """
    model = Equipment
    queryset = Equipment.objects.all()

    permission_classes = (
        permissions.IsAuthenticated,
    )

    filter_backends = (DjangoFilterBackend,)

    # specify the fields on which filter support is required.
    filter_fields = ('item_name', 'cost')

    serializer_class = workorder_serializers.EquipmentSerializer


class WorkOrderEquipmentViewSet(viewsets.ModelViewSet):
    """
       Viewset to handle requests to create a equipment object or get list of objects in workorder.
    """
    model = WorkorderEquipment
    queryset = WorkorderEquipment.objects.all()

    permission_classes = (
        permissions.IsAuthenticated,
    )

    filter_backends = (DjangoFilterBackend,)

    # specify the fields on which filter support is required.
    filter_fields = ('workorder', 'equipment')

    serializer_class = workorder_serializers.WorkorderEquipmentSerializer

    def get_queryset(self):
        """
        Return active records
        :return queryset:
        """
        queryset = self.model.objects.all()
        return self.apply_queryset_filters(queryset)

    def apply_queryset_filters(self, queryset):
        if self.request.method == 'PUT':
            queryset = queryset.filter(workorder__is_complete=False)
        workorder_id = self.kwargs.get('work_order_id')
        return queryset.filter(workorder__id=workorder_id)


class RemoveEquipmentViewSet(viewsets.ModelViewSet):

    model = Equipment
    queryset = Equipment.objects.all()

    permission_classes = (
        permissions.IsAuthenticated,
    )

    filter_backends = (DjangoFilterBackend,)

    serializer_class = workorder_serializers.RemoveEquipmentSerializer

    def get_queryset(self):
        """
        Return active records
        :return queryset:
        """
        queryset = self.model.objects.all()
        return self.apply_queryset_filters(queryset)

    def apply_queryset_filters(self, queryset):
        return queryset


class WorkOrderTimeEntryViewSet(viewsets.ModelViewSet):
    """
       Viewset to handle requests to create a timeentry object or get list of objects in workorder.
    """
    model = WorkorderTimeEntry
    queryset = WorkorderTimeEntry.objects.all()

    permission_classes = (
        permissions.IsAuthenticated,
    )

    filter_backends = (DjangoFilterBackend,)

    # specify the fields on which filter support is required.
    filter_fields = ('workorder', 'employee_name', 'work_type')

    serializer_class = workorder_serializers.WorkorderTimeEntrySerializer

    def get_queryset(self):
        """
        Return active records
        :return queryset:
        """
        queryset = self.model.objects.all()
        return self.apply_queryset_filters(queryset)

    def apply_queryset_filters(self, queryset):
        if self.request.method == 'PUT':
            queryset = queryset.filter(workorder__is_complete=False)
        workorder_id = self.kwargs.get('work_order_id')
        return queryset.filter(workorder__id=workorder_id)


class CustomerContactViewSet(viewsets.ModelViewSet):

    model = CustomerContacts
    queryset = CustomerContacts.objects.all()

    permission_classes = (
        permissions.IsAuthenticated,
    )

    filter_backends = (DjangoFilterBackend,)

    # specify the fields on which filter support is required.
    filter_fields = ('customer', 'contact_number', 'poc')

    serializer_class = workorder_serializers.CustomerContactSerializer

    def get_queryset(self):
        """
        Return active records
        :return queryset:
        """
        queryset = self.model.objects.all()
        return self.apply_queryset_filters(queryset)

    def apply_queryset_filters(self, queryset):
        customer_id = self.kwargs.get('customer_id')
        return queryset.filter(customer__id=customer_id)


class ExportSummaryViewSet(
    PDFExportMixin,
    RetreiveUpdateWorkOrderViewSet,
):

    title = 'ITP Coversheet Form'
    download_filename = 'itp_coversheet.pdf'
    base_url = settings.MEDIA_ROOT
    http_method_names = ['get']

    def retrieve(self, request, *args, **kwargs):
        self.template_name = "summary.html"
        import pdb
        pdb.set_trace()
        response = super().retrieve(request, *args, **kwargs)
        kwargs['title'] = self.title
        kwargs['data'] = response.data
        return super().get(request, *args, **kwargs)