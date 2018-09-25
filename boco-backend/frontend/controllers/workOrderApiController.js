(function(apiController) {

    apiController.init = function(app) {

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
                "company_name": "Mayank Gupta Demo",
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
                "sub_contractor_name": "Mayank Gupta Demo",
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

        var bodyParser = require('body-parser');  
        var express = require("express");

        var workOrderData = require("../appData/workOrderData");

        var router = express.Router();
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());

        router.get('/customer/:data', function(req, res) {

            res.send({
                customerDetails: getSelectedCustomerDetails
            });

        });

        router.get('/getdetailedworkorder/:workordernumber', function(req, res) {

            res.json(workOrderData.dataService.getDetailedWorkOrder(req.params.workordernumber));

        });

        router.get('/getWorkOrder/:workordernumber', function(req, res) {

            res.json(workOrderData.dataService.getDetailedWorkOrder(req.params.workordernumber));

        });

        router.get('/workorders/:workordernumber', function(req, res) {

            res.json(workOrderData.dataService.getDetailedWorkOrder(req.params.workordernumber));

        });

        router.get('/getrandomworkorder', function(req, res) {
            res.send({
                randomWorkOrder: 1003
            });
        });

        router.get('/getrandomworkorder', function(req, res) {
            res.send({
                randomWorkOrder: 1003
            });
        });

        router.get("/getallworkorders", function(req, res) {
            res.send({
                allWorkOrderDetails: detailedWorkOrders
            });
        });

        router.post("/createWorkOrder", function(req, res) {

            var requestData = {
                "work_order_num": req.body.work_order_num,
                "customer_po_num": req.body.customer_po_num,
                "work_order_by": req.body.work_order_by,
                "created": req.body.date_of_order,
                "date_work_started": req.body.date_work_started,
                "date_of_order": req.body.date_of_order,
                "status": "Created"
            }

            res.send(requestData);
        })

        router.post("/saveDescription", function(req, res) {
            res.send({
                success: true
            });
        })

        router.post("/updateCustomerDetails", function(req, res) {
            res.send({
                id:3424,
                success: "Customer Details Updated"
            })
        })

        router.post("/addNewCustomer", function(req, res) {
            res.send({
                id: 763241,
                success: "New Customer Added"
            })
        })

        

        app.use('/api', router);

        return app;

        
    }

})(module.exports);