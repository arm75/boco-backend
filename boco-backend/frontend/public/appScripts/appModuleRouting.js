define([], function() {

    var routeInitializer = {

        initializeAngularRouting: function() {

            var appModule = angular.module("appModule");

            appModule.config(function($routeProvider, $locationProvider, $httpProvider, $sceDelegateProvider){

                $locationProvider.html5Mode(true);

                $httpProvider.interceptors.push(function ($q) {
                    return {
                        'response': function (response) {
                            return response;
                        },
                        'responseError': function (rejection) {
                            if(rejection.status === 401) {
                                location.reload();
                            }

                            if(rejection.config.url.indexOf('completed') > -1) {
                                alert("Cannot mark completed an incomplete workorder", "error");
                            } else {
                                alert("Something went wrong", "error");
                            }
                            
                            return $q.reject(rejection);
                        }
                    };
                });

                $httpProvider.defaults.headers.common = {};
                $httpProvider.defaults.headers.post = {};
                $httpProvider.defaults.headers.put = {};
                $httpProvider.defaults.headers.patch = {};
                $httpProvider.defaults.headers.get = {};

                $httpProvider.defaults.useXDomain = true;
                delete $httpProvider.defaults.headers.common['X-Requested-With'];

                $sceDelegateProvider.resourceUrlWhitelist(['self', /^http?:\/\/localhost:8000/]);

                $routeProvider.when("/", {
                    templateUrl: "./partials/login.html",
                    controller: "loginController"
                }).when("/workorder", {
                    templateUrl: "./partials/searchOrCreateWorkOrder.html",
                    controller: "workOrderController"
                }).when("/createworkorder", {
                    templateUrl: "./partials/createWorkOrder.html",
                    controller: "createWorkOrderController"
                }).when("/description", {
                    templateUrl: "./partials/description.html",
                    controller: "descriptionController"
                }).when("/createuser", {
                    templateUrl: "./partials/createNewUser.html",
                    controller: "createUserController"
                }).when("/resetpassword", {
                    templateUrl: "./partials/resetPassword.html",
                    controller: "resetPasswordController"
                });
            });

        }
    }

    return routeInitializer;
});
