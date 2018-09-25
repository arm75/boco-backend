define([], function(){

    var logoutController = function($scope, $location, $http, $cookies, $sessionStorage, authenticateUser, appConstants, workOrderCache){

        $scope.logoutUser = function() {
            authenticateUser.clearAuthenticationToken();
            workOrderCache.clearCachedWorkOrder();
            $sessionStorage.$reset();
            $location.path("/");
        }
    }

    return logoutController;
});
