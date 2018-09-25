define([], function(){

    var resetPasswordController = function($scope, $rootScope, $http, $cookies, authenticateUser, appConstants, workOrderCache, $location) {

        $scope.username  = "";
        $scope.userPassword = "";
        $scope.enterPassword  = "";

        $scope.changePassword = function() {

            var data = window.loginUserInfo;

            window.showLoader();

            if($scope.userPassword != $scope.enterPassword) {
                window.hideLoader();
                alert("Password fields should match", "error");
                return;
            }

            var data = {
                "password": $scope.userPassword
            };

            var rootData = $rootScope.userInfo;

            var configObject = {
                headers: {
                    "Authorization": window.authenticationToken,
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            };
            

            $http.put(appConstants.resetPassword + window.loginUserInfo.id + "/reset-password/", data, authenticateUser.getHeaderObject()).then(function(response) {
                window.hideLoader();
                $location.path("/");
                //alert("Password reset successful.");
            }, function(response) {
                var data = response;
                alert("Reset Password Failed", "error")
                window.hideLoader();

            })
        }

    }
    return resetPasswordController;
});