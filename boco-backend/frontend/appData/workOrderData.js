(function(workOrderData) {

    workOrderData.dataService = function() {

        var getWorkOrderOnSerach = {
            "id": "95eeeaba-ce52-4d52-a98f-a62751e71963",
            "work_order_num": 1001,
            "customer_po_num": 1234567,
            "work_order_by": "Shashank",
            "status": "CREATED",
            "created": "2018-02-11T03:07:47.691015Z",
            "date_work_started": "2018-02-11T03:07:47.691015Z",
            "date_of_order": "2018-02-11T03:07:47.691015Z"
        }

        var detailedWorkOrders = [{
            "id": "95eeeaba-ce52-4d52-a98f-a62751e71963",
            "work_order_num": 1001,
            "customer_po_num": 1234567,
            "work_order_by": "Shashank",
            "created": "2018-02-11T03:07:47.691015Z",
            "date_work_started": "2018-02-11T03:07:47.691015Z",
            "date_of_order": "2018-02-11T03:07:47.691015Z",
            "description": "Testing update serializer",
            "other_requirements": "1234",
            "customer": "de5b6961-0d80-4ad9-97af-86762349c5bf",
            "sub_contractor": null,
            "has_additional_comments": true,
            "comments": "no comments in heretttt",
            "status": "STARTED",
            "created": "2018-02-11T09:00:04.912358Z",
            "customer_details": {
                "company_name": "Mayank Gupta",
                "id": "de5b6961-0d80-4ad9-97af-86762349c5bf",
                "email": "1003@1003.com",
                "contact_number": 1234567909,
                "poc": "Shashank",
                "address": "Mountain View, CA",
                "address_latitude": "37.38605170",
                "address_longitude": "-122.08385110",
                "created": "2018-02-11T17:56:33.106465Z"
            },
            "sub_contractor_details": {
                "sub_contractor_name": "Mayank Gupta",
                "id": "de5b6961-0d80-4ad9-97af-86762349c5bf",
                "email": "1003@1003.com",
                "contact_number": 1234567909,
                "poc": "Shashank",
                "address": "Mountain View, CA",
                "address_latitude": "37.38605170",
                "address_longitude": "-122.08385110",
                "created": "2018-02-11T17:56:33.106465Z"
            }
        },{
            "id": "5545d298-2c35-4735-94fa-b8745417ba56",
            "work_order_num": 1002,
            "customer_po_num": 1234567,
            "work_order_by": "Mayank",
            "created": "2018-02-11T09:00:04.912358Z",
            "date_work_started": "2018-02-11T03:07:47.691015Z",
            "description": "Testing update serializer",
            "other_requirements": "1234",
            "customer": "de5b6961-0d80-4ad9-97af-86762349c5bf",
            "sub_contractor": null,
            "has_additional_comments": true,
            "comments": "no comments in heretttt",
            "status": "STARTED",
            "created": "2018-02-11T09:00:04.912358Z",
            "customer_details": {
                "company_name": "Mayank Gupta",
                "id": "de5b6961-0d80-4ad9-97af-86762349c5bf",
                "email": "1003@1003.com",
                "contact_number": 1234567909,
                "poc": "Shashank",
                "address": "Mountain View, CA",
                "address_latitude": "37.38605170",
                "address_longitude": "-122.08385110",
                "created": "2018-02-11T17:56:33.106465Z"
            },
            "supplier_details": {
                "sub_contractor_name": "Mayank Gupta",
                "id": "de5b6961-0d80-4ad9-97af-86762349c5bf",
                "email": "1003@1003.com",
                "contact_number": 1234567909,
                "poc": "Shashank",
                "address": "Mountain View, CA",
                "address_latitude": "37.38605170",
                "address_longitude": "-122.08385110",
                "created": "2018-02-11T17:56:33.106465Z"
            }
        }];

        var allWorkOrder = [
            {
                "id": "95eeeaba-ce52-4d52-a98f-a62751e71963",
                "work_order_num": 1001,
                "customer_po_num": 1234567,
                "work_order_by": "Shashank",
                "status": "CREATED",
                "created": "2018-02-11T03:07:47.691015Z",
                "date_work_started": "2018-02-11T03:07:47.691015Z"
            },
            {
                "id": "5545d298-2c35-4735-94fa-b8745417ba56",
                "work_order_num": 1002,
                "customer_po_num": 1234567,
                "work_order_by": "Mayank",
                "status": "STARTED",
                "created": "2018-02-11T09:00:04.912358Z",
                "date_work_started": "2018-02-11T03:07:47.691015Z"
            },
            {
                "id": "0fae8985-34c7-47c1-8b42-93c3f5771679",
                "work_order_num": 1003,
                "customer_po_num": 1234567,
                "work_order_by": "Meha",
                "status": "CREATED",
                "created": "2018-02-11T15:03:09.200479Z",
                "date_work_started": "2018-02-11T03:07:47.691015Z"
            }
        ];

        var getWorkOrderByNumber = function(workOrderNumber) {
            return allWorkOrder.find( workOrder => workOrder.work_order_num == workOrderNumber );
        }

        var getSelectedCustomerDetails = {
            "company_name": "Updated Customer",
            "id": "de5b6961-0d80-4ad9-97af-86762349c5bf",
            "email": "1003@1003.com",
            "contact_number": 1234567909,
            "poc": "Shashank",
            "address": "Mountain View, CA",
            "address_latitude": "37.38605170",
            "address_longitude": "-122.08385110",
            "created": "2018-02-11T17:56:33.106465Z"
        };

        var getAllWorkOrdersFunction = function() {
            return detailedWorkOrders;
        };

        var getDetailedWorkOrder = function(workOrderNumber) {
            return detailedWorkOrders.find( workOrder => workOrder.work_order_num == workOrderNumber );
        };

        return {
            getSelectedCustomerDetails: getSelectedCustomerDetails,
            getAllWorkOrdersList: detailedWorkOrders,
            getWorkOrderByNumber: getWorkOrderByNumber,
            getDetailedWorkOrder: getDetailedWorkOrder

        }
    }();


})(module.exports)