define([], function() {
    var descriptionController = function($scope, workOrderCache, $timeout, $http, $cookies, $location, appConstants, authenticateUser, $sessionStorage, userInfoService) {
        
        $scope.markerSubContractorPosition = [38.46583480, -91.02618380];
        
        var isSubContractorModified = false;
        authenticateUser.redirectToLoginIfUnauthenticated();

        var cachedData = workOrderCache.getWorkOrderDetail();

        $scope.googleMapsUrl = "AIzaSyAog2mjYSr6LJ2nMkQ2mOO7H4mrzizFqmY";


        $scope.work_order_num = cachedData.work_order_num;
        $scope.customer_po_num = cachedData.customer_po_num;
        $scope.work_order_by = cachedData.work_order_by;
        $scope.date_work_started = new Date(cachedData.date_work_started).toLocaleDateString("en-US");
        $scope.date_of_order = new Date(cachedData.date_of_order).toLocaleDateString("en-US");
        $scope.description = cachedData.description;
        $scope.other_requirements = cachedData.other_requirements;

        if($scope.description != "") {
            $scope.isInNonEditModeOfDescription = true;
        } else {
            $scope.isInNonEditModeOfDescription = false;
        }

        $scope.completeWorkOrder = function() {
            var data = {
                "is_complete": true
            }
            $http.put(appConstants.signatureApi + cachedData.id + "/completed/", data, authenticateUser.getHeaderObject()).then(function(response){
                var data = response;
                $scope.isWorkOrderComplete = false;
                alert("Work order completed.");
            });
        }
        

        $scope.logoutUser = function() {
            authenticateUser.clearAuthenticationToken();
            workOrderCache.clearCachedWorkOrder();
            $sessionStorage.$reset();
            userInfoService.clearUserInfo();
            $location.path("/");
        }

        $scope.resetPassword = function() {

            $location.path("/resetpassword");
        }

        $scope.editDescriptionButton = function() {
            $scope.isInNonEditModeOfDescription = false;
        };

        $scope.saveDescriptionButton = function() {

            window.showLoader();

            $scope.isInNonEditModeOfDescription = true;

            var descriptionData = {
                work_order_num: $scope.work_order_num,
                description: $scope.description,
                other_requirements: $scope.other_requirements
            }

            $http.put(appConstants.saveDescription + cachedData.id + "/", descriptionData, authenticateUser.getHeaderObject()).then(function(response) {
                window.hideLoader();
                if(response.status == 200) {
                    workOrderCache.saveWorkOrderDetails(response.data);
                    alert("Workorder description updated successfully", "info")
                } else {
                    alert("Error updating workorder description", "error")
                }
            }, function(response) {
                alert("Error updating workorder description", "error")
            });
        };
    }
    return descriptionController;
});