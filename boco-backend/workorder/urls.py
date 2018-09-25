from django.conf.urls import url

from . import views

list_create_user = views.UserViewSet.as_view({
        'get': 'list',
        'post': 'create',
    })

activate_user = views.ActivateUserViewSet.as_view({
        'get': 'retrieve',
        'put': 'partial_update',
    })

reset_user_password = views.ResetUserPasswordViewSet.as_view({
        'put': 'partial_update',
    })

list_create_workorder = views.WorkOrderViewSet.as_view({
        'get': 'list',
        'post': 'create',
    })

list_workorder = views.GetWorkOrdersViewSet.as_view({
        'get': 'list',
    })

workorder_detail_update = views.RetreiveUpdateWorkOrderViewSet.as_view({
    'get': 'retrieve',
    'put': 'partial_update',
})

workorder_signature_update = views.RetreiveUpdateWorkOrderSignatureViewSet.as_view({
    'get': 'retrieve',
    'put': 'partial_update',
})

workorder_mark_completed = views.MarkCompletedWorkOrderViewSet.as_view({
    'put': 'partial_update',
})

list_create_customer = views.CustomerViewSet.as_view({
        'get': 'list',
        'post': 'create',
    })

customer_detail_update = views.RetreiveUpdateCustomerViewSet.as_view({
    'get': 'retrieve',
    'put': 'partial_update',
})

list_create_subcontractor = views.SubContractorViewSet.as_view({
        'get': 'list',
        'post': 'create',
    })

workorder_subcontractor = views.WorkSubContractorViewSet.as_view({
    'get': 'list',
    'post': 'create',
})

delete_workorder_subcontractor = views.WorkSubContractorViewSet.as_view({
    'delete': 'destroy',
})

subcontractor_detail_update = views.RetreiveUpdateSubContractorViewSet.as_view({
    'get': 'retrieve',
    'put': 'partial_update',
})

workorder_number_sequence = views.GetNextWorkOrderNumberViewSet.as_view({
    'get': 'retrieve',
})

list_create_supplier = views.SupplierViewSet.as_view({
        'get': 'list',
        'post': 'create',
    })

workorder_supplier = views.WorkOrderSupplierViewSet.as_view({
    'delete': 'destroy',
    'get': 'list',
    'post': 'create',
})

delete_workorder_supplier = views.WorkOrderSupplierViewSet.as_view({
    'delete': 'destroy',
})

list_create_stock = views.StockViewSet.as_view({
        'get': 'list',
        'post': 'create',
    })

workorder_stock = views.WorkOrderStockViewSet.as_view({
    'delete': 'destroy',
    'get': 'list',
    'post': 'create',
})

delete_workorder_stock = views.WorkOrderStockViewSet.as_view({
    'delete': 'destroy',
})

list_create_rentals = views.EquipmentRentalViewSet.as_view({
        'get': 'list',
        'post': 'create',
    })

workorder_rentals = views.WorkOrderEquipmentRentalViewSet.as_view({
    'delete': 'destroy',
    'get': 'list',
    'post': 'create',
})

delete_workorder_rentals = views.WorkOrderEquipmentRentalViewSet.as_view({
    'delete': 'destroy',
})

list_create_equipment = views.EquipmentViewSet.as_view({
        'get': 'list',
        'post': 'create',
    })

workorder_equipment = views.WorkOrderEquipmentViewSet.as_view({
    'delete': 'destroy',
    'get': 'list',
    'post': 'create',
})

delete_workorder_equipment = views.WorkOrderEquipmentViewSet.as_view({
    'delete': 'destroy',
})

workorder_time_entry = views.WorkOrderTimeEntryViewSet.as_view({
    'delete': 'destroy',
    'get': 'list',
    'post': 'create',
})

customer_contacts = views.CustomerContactViewSet.as_view({
    'delete': 'destroy',
    'get': 'list',
    'post': 'create',
})

export_summary = views.ExportSummaryViewSet.as_view({
    'get': 'retrieve',
})

urlpatterns = [
    url(r'^users/$', list_create_user),
    url(r'^users/(?P<pk>[a-z0-9-]+)/activate/$', activate_user),
    url(r'^users/(?P<pk>[a-z0-9-]+)/reset-password/$', reset_user_password),

    url(r'^workorders/$', list_create_workorder),
    url(r'^workorders/list/$', list_workorder),
    url(r'^workorders/(?P<pk>[a-z0-9-]+)/$', workorder_detail_update),

    url(r'^workorders/(?P<pk>[a-z0-9-]+)/summary/$', export_summary),

    url(r'^workorders/(?P<pk>[a-z0-9-]+)/signature/$', workorder_signature_update),
    url(r'^workorders/(?P<pk>[a-z0-9-]+)/completed/$', workorder_mark_completed),
    url(r'^workorders/getNextNumber/$', workorder_number_sequence),
    url(r'^customers/$', list_create_customer),
    url(r'^customers/(?P<pk>[a-z0-9-]+)/$', customer_detail_update),
    # url(r'^customers/(?P<customer_id>[a-z0-9-]+)/contacts/$', customer_contacts),
    url(r'^subcontractors/$', list_create_subcontractor),
    url(r'^subcontractors/(?P<pk>[a-z0-9-]+)/$', subcontractor_detail_update),
    url(r'^workorders/(?P<work_order_id>[a-z0-9-]+)/subcontractors/$', workorder_subcontractor),
    url(r'^workorders/(?P<work_order_id>[a-z0-9-]+)/subcontractors/(?P<pk>[a-z0-9-]+)/$',
        delete_workorder_subcontractor),
    url(r'^suppliers/$', list_create_supplier),
    url(r'^workorders/(?P<work_order_id>[a-z0-9-]+)/suppliers/$', workorder_supplier),
    url(r'^workorders/(?P<work_order_id>[a-z0-9-]+)/suppliers/(?P<pk>[a-z0-9-]+)/$',
        delete_workorder_supplier),
    url(r'^stocks/$', list_create_stock),
    url(r'^workorders/(?P<work_order_id>[a-z0-9-]+)/stocks/$', workorder_stock),
    url(r'^workorders/(?P<work_order_id>[a-z0-9-]+)/stocks/(?P<pk>[a-z0-9-]+)/$',
        delete_workorder_stock),

    url(r'^rentals/$', list_create_rentals),
    url(r'^workorders/(?P<work_order_id>[a-z0-9-]+)/rentals/$', workorder_rentals),
    url(r'^workorders/(?P<work_order_id>[a-z0-9-]+)/rentals/(?P<pk>[a-z0-9-]+)/$',
        delete_workorder_rentals),

    url(r'^equipments/$', list_create_equipment),
    url(r'^workorders/(?P<work_order_id>[a-z0-9-]+)/equipments/$', workorder_equipment),
    url(r'^workorders/(?P<work_order_id>[a-z0-9-]+)/equipments/(?P<pk>[a-z0-9-]+)/$',
        delete_workorder_equipment),

    url(r'^workorders/(?P<work_order_id>[a-z0-9-]+)/time-entry/$', workorder_time_entry),
    url(r'^workorders/(?P<work_order_id>[a-z0-9-]+)/time-entry/(?P<pk>[a-z0-9-]+)/$',
        workorder_time_entry),
]
