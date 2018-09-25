from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from core.models import BaseModel


class SubContractor(BaseModel):
    """
    Model class for Sub Contractor
    """
    id = models.AutoField(primary_key=True, editable=False)
    sub_contractor_name = models.CharField(max_length=100)
    email = models.EmailField()
    contact_number = models.PositiveIntegerField()
    poc = models.CharField(max_length=50)
    address = models.CharField(max_length=200)
    address_latitude = models.DecimalField(decimal_places=8, max_digits=12)
    address_longitude = models.DecimalField(decimal_places=8, max_digits=12)

    class Meta:
        unique_together = ('sub_contractor_name', 'email')


class Customer(BaseModel):
    """
    Model class for Customer
    """
    id = models.AutoField(primary_key=True, editable=False)
    company_name = models.CharField(max_length=100)
    email = models.EmailField()
    contact_number = models.PositiveIntegerField()
    poc = models.CharField(max_length=50)
    address = models.CharField(max_length=200)
    address_latitude = models.DecimalField(decimal_places=8, max_digits=12)
    address_longitude = models.DecimalField(decimal_places=8, max_digits=12)

    class Meta:
        unique_together = ('company_name', 'email')


class CustomerContacts(BaseModel):
    id = models.AutoField(primary_key=True, editable=False)
    contact_number = models.PositiveIntegerField()
    poc = models.CharField(max_length=50, unique=True)
    customer = models.ForeignKey(
        Customer,
        related_name='contacts',
        on_delete=models.DO_NOTHING
    )


class WorkOrder(BaseModel):
    """
    Model class for workorder
    """
    id = models.AutoField(primary_key=True, editable=False)
    STATUS_CREATED = 'CREATED'
    STATUS_STARTED = 'STARTED'
    STATUS_IN_PROGRESS = 'IN_PROGRESS'
    STATUS_COMPLETED = 'COMPLETED'

    STATUS_CHOICES = (
        (STATUS_CREATED, 'Created'),
        (STATUS_STARTED, 'Started'),
        (STATUS_IN_PROGRESS, 'In Progress'),
        (STATUS_COMPLETED, 'Completed'),
    )

    status = models.CharField(choices=STATUS_CHOICES, max_length=100, default=STATUS_CREATED)
    work_order_num = models.PositiveIntegerField(validators=[
            MaxValueValidator(100000),
            MinValueValidator(1000),
        ],
        unique=True,
    )
    customer_po_num = models.PositiveIntegerField()
    work_order_by = models.CharField(max_length=100)
    date_of_order = models.DateTimeField()
    date_work_started = models.DateTimeField()
    description = models.CharField(max_length=500, null=True, blank=True)
    other_requirements = models.CharField(max_length=500, null=True, blank=True)
    customer = models.ForeignKey(
        Customer,
        related_name='customers',
        on_delete=models.DO_NOTHING,
        null=True,
        blank=True,
    )
    has_additional_comments = models.BooleanField(default=False)
    comments = models.CharField(
        max_length=500,
        null=True,
        blank=True,
    )
    is_complete = models.BooleanField(default=False)
    signature_bs64_string = models.TextField(null=True, blank=True)

    # class Meta:
    #     # unique_together = ('work_order_num', 'customer_po_num', 'work_order_by')


class WorkOrderSubContractor(BaseModel):
    id = models.AutoField(primary_key=True, editable=False)
    sub_contractor = models.ForeignKey(
        SubContractor,
        related_name='work_order',
        on_delete=models.DO_NOTHING,

    )
    work_order = models.ForeignKey(
        WorkOrder,
        related_name='sub_contractors',
        on_delete=models.DO_NOTHING,
    )

    class Meta:
        unique_together = ('sub_contractor', 'work_order')


class Supplier(BaseModel):
    """
    Model class for Supplier
    """
    id = models.AutoField(primary_key=True, editable=False)
    company_name = models.CharField(max_length=100, null=False, blank=False, unique=True)


class WorkOrderSuppliers(BaseModel):
    id = models.AutoField(primary_key=True, editable=False)
    workorder = models.ForeignKey(
        WorkOrder,
        related_name='suppliers',
        on_delete=models.DO_NOTHING,
    )
    supplier = models.ForeignKey(
        Supplier,
        related_name='workorders',
        on_delete=models.DO_NOTHING,
    )
    ticket_number = models.IntegerField(null=False, blank=False)
    cost = models.DecimalField(decimal_places=2, max_digits=10, null=False, blank=False)

    # class Meta:
    #     unique_together = ('workorder', 'supplier', 'ticket_number',)


class Stock(BaseModel):
    id = models.AutoField(primary_key=True, editable=False)

    STOCK_TYPE_MECHANICAL = 'MECHANICAL'
    STOCK_TYPE_ELECTRICAL = 'ELECTRICAL'

    STOCK_TYPE_CHOICES = (
        (STOCK_TYPE_MECHANICAL, 'Mechanical'),
        (STOCK_TYPE_ELECTRICAL, 'Electrical'),
    )
    stock_type = models.CharField(
        choices=STOCK_TYPE_CHOICES,
        max_length=15,
        default=STOCK_TYPE_MECHANICAL,
        null=False,
        blank=False,
    )
    item_name = models.CharField(max_length=100, null=False, blank=False)
    cost = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=False)

    class Meta:
        unique_together = ('stock_type', 'item_name', )


class BocoStock(BaseModel):
    id = models.AutoField(primary_key=True, editable=False)
    workorder = models.ForeignKey(
        WorkOrder,
        related_name='stocks',
        on_delete=models.DO_NOTHING,
    )
    stocks = models.ForeignKey(
        Stock,
        related_name='workorders',
        on_delete=models.DO_NOTHING,
    )
    number_of_items = models.PositiveIntegerField(null=False, blank=False)

    # class Meta:
    #     unique_together = ('workorder', 'stocks')


class EquipmentRental(BaseModel):
    """
    Model class for Vendor
    """
    id = models.AutoField(primary_key=True, editable=False)
    vendor_name = models.CharField(max_length=100, null=False, blank=False, unique=True)


class WorkOrderEquipmentRental(BaseModel):
    id = models.AutoField(primary_key=True, editable=False)
    workorder = models.ForeignKey(
        WorkOrder,
        related_name='rentals',
        on_delete=models.DO_NOTHING,
    )
    equipment_rental = models.ForeignKey(
        EquipmentRental,
        related_name='workorders',
        on_delete=models.DO_NOTHING,
    )
    ticket_number = models.IntegerField()
    cost = models.DecimalField(decimal_places=2, max_digits=10, null=False, blank=False)
    date = models.DateTimeField(null=False, blank=False)

    # class Meta:
    #     unique_together = ('workorder', 'equipment_rental', 'ticket_number')


class Equipment(BaseModel):
    id = models.AutoField(primary_key=True, editable=False)
    item_name = models.CharField(max_length=100, null=False, blank=False, unique=True)
    cost = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=False)


class WorkorderEquipment(BaseModel):
    id = models.AutoField(primary_key=True, editable=False)
    workorder = models.ForeignKey(
        WorkOrder,
        related_name='equipments',
        on_delete=models.DO_NOTHING,
    )
    equipment = models.ForeignKey(
        Equipment,
        related_name='workorders',
        on_delete=models.DO_NOTHING,
    )

    # class Meta:
    #     unique_together = ('workorder', 'equipment')


class WorkorderTimeEntry(BaseModel):
    id = models.AutoField(primary_key=True, editable=False)
    workorder = models.ForeignKey(
        WorkOrder,
        related_name='time_entries',
        on_delete=models.DO_NOTHING,
    )
    employee_name = models.CharField(max_length=100)
    date = models.DateField(null=False, blank=False)
    time_in = models.TimeField(null=False, blank=False)
    time_out = models.TimeField(null=False, blank=False)
    work_type = models.CharField(max_length=50, null=False, blank=False)

    # class Meta:
    #     unique_together = ('workorder', 'date', 'work_type', 'time_in', 'time_out')
