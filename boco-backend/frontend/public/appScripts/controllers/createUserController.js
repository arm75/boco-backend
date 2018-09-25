define([], function(){

    var createUserController = function($scope, $http, $cookies, authenticateUser, appConstants, workOrderCache, $location) {

        $scope.email  = "";
        $scope.username = "";
        $scope.mobile_number  = "";
        $scope.first_name = "";
        $scope.last_name = "";

        $scope.formatTelephoneNumber = function() {

            if ($scope.mobile_number) {
                var telData = $scope.mobile_number.toString().replace(/-|x/g, '');
                var formattedTel = telData.substring(0, 3) + "-" + telData.substring(3, 6) + "-" + telData.substring(6, 10);
                $scope.mobile_number = formattedTel;
            }

        }

        $scope.createNewUser = function() {

            window.showLoader();

            var data = {
                "email": $scope.email,
                "username": $scope.username,
                "mobile_number": $scope.mobile_number,
                "first_name": $scope.first_name,
                "last_name": $scope.last_name
            };

            $http.post(appConstants.createUser, data, authenticateUser.getHeaderObject()).then(function(response) {
                window.hideLoader();
                $location.path("/");
                alert("User created successfully");
            })
        }

    }
    return createUserController;
});