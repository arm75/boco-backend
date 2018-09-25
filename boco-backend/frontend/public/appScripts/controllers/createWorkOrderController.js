define([], function(){

    var createWorkOrderController = function($scope, $http, $cookies, authenticateUser, appConstants, workOrderCache, $location) {

        window.showLoader();

        authenticateUser.redirectToLoginIfUnauthenticated();

        $scope.workOrderNumber = "";
        $scope.poNumber = "";
        $scope.workOrderBy = "";
        $scope.dateOfOrder = "";
        $scope.dateWorkStarted = "";

        $scope.getRandomWorkOrder = function() {

            window.hideLoader();

            $http.get(appConstants.getRandomWorkOrder, authenticateUser.getHeaderObject()).then(function(response) {
                $scope.workOrderNumber = response.data.work_order_number;
            })
        }

        $scope.createWorkOrder = function() {

            window.showLoader();

            var requestData = {
                "work_order_num": $scope.workOrderNumber,
                "customer_po_num": $scope.poNumber,
                "work_order_by": $scope.workOrderBy,
                "date_of_order": new Date($scope.dateOfOrder),
                "date_work_started":  new Date($scope.dateWorkStarted)
            };

            $http.post(appConstants.createWorkOrder, requestData, authenticateUser.getHeaderObject()).then(function(response) {
                workOrderCache.saveWorkOrderDetails(response.data);
                var responseData = response.data;
                window.hideLoader();
                if(response.data.status == "CREATED") {
                    $location.path("description");
                } else {
                    alert("Error creating work order", "error")
                }
            }, function() {
                window.hideLoader();
                alert("Error creating work order", "error")
            })
        }

        $scope.getRandomWorkOrder();

        $scope.resetPassword = function() {

            $location.path("/resetpassword");
        }
    }

    

    return createWorkOrderController;
});