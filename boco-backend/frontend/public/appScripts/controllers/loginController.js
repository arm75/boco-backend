define([], function(){

    var loginController = function($scope, $location, $http, $cookies, authenticateUser, appConstants, userInfoService, $rootScope){

        $scope.screenshotTargetOptions = {
            filename: "screenshotTarget.png",
            downloadText: "Click here to download",
            cancelText: "Click here to cancel download!!!"
        };

        $scope.createUser = function() {
            userInfoService.clearUserInfo();
            $location.path("/createuser");
        }
 

        $scope.userName = "";
        $scope.userPassword = "";
        $scope.isOpen = false;

         $scope.logoutUser = function() {
            authenticateUser.clearAuthenticationToken();
        }

        $scope.getUserData = function() {
            $http.get(appConstants.getUser + "username=" + userInfoService.userName, authenticateUser.getHeaderObject()).then(function(response) {
                userInfoService.setUserInfo(response.data);
                $rootScope.userInfo = response.data;
            })
        }

        $scope.authenticateUserLogin = function() {

            $cookies.put("token", "");

            

            var authenticationData = {
                "username": $scope.userName,
                "password": $scope.userPassword
            }

            $http.post(appConstants.authenticateUserUrl, authenticationData, {
                "headers": {
                    "Authorization": $cookies.get('token'),
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            }).then(function(response) {
                
                if(response.status == 200 && response.data.token.length > 0) {

                    userInfoService.userName = $scope.userName;

                    userInfoService.setUserInfo(response.data);

                    authenticateUser.setAuthenticationToken(response.data.token);

                    $scope.getUserData();
                    
                    $location.path("workorder");
                } else {
                    alert("Enter correct credentials", "error");
                }
            });          
        }


        $scope.username  = "";
        $scope.userPassword = "";
        $scope.enterPassword  = "";

        $scope.changePassword = function() {

            var data = window.loginUserInfo;

            window.showLoader();

            if($scope.userPassword != $scope.enterPassword) {
                //alert("Password fields should match", "error")
            }

            var data = {
                "password": $scope.password
            };

            var rootData = $rootScope.userInfo;

            $http.put(appConstants.resetPassword + window.loginUserInfo.id + "/reset-password/", data, authenticateUser.getHeaderObject()).then(function(response) {
                window.hideLoader();
                $location.path("/");
                //alert("Password reset successful.");
            }, function(response) {
                var data = response;
            })
        }
    }

    
    
    return loginController;
})
