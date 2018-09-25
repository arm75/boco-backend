define(["appModuleRouting", 
        "loginController", 
        "authenticateUser", 
        "workOrderController", 
        "createWorkOrderController", 
        "appConstants",
        "workOrderCache",
        "descriptionController",
        "customerScreenDescriptionController",
        "subContractorScreenDescriptionController",
        "logoutController",
        "supplierController",
        "equipmentController",
        "supplierCache",
        "stockController",
        "rentalController",
        "timeEntryController",
        "signatureController",
        "mainController",
        "resetPasswordController",
        "createUserController",
        "userInfoService"
    ], function(
            appModuleRouting, 
            loginController, 
            authenticateUser, 
            workOrderController, 
            createWorkOrderController, 
            appConstants,
            workOrderCache,
            descriptionController,
            customerScreenDescriptionController,
            subContractorScreenDescriptionController,
            logoutController,
            supplierController,
            equipmentController,
            supplierCache,
            stockController,
            rentalController,
            timeEntryController,
            signatureController,
            mainController,
            resetPasswordController,
            createUserController,
            userInfoService) {

    var appModule = {
        init : function() {
            var appModule = angular.module("appModule", ["ngRoute", "ngCookies", "ngStorage", "ngMap", 'ngMaterial']);

            appModule.controller("loginController", loginController);

            appModule.controller("workOrderController", workOrderController);

            appModule.controller("createWorkOrderController", createWorkOrderController);
            
            appModule.controller("descriptionController", descriptionController);

            appModule.controller("customerScreenDescriptionController", customerScreenDescriptionController);

            appModule.controller("subContractorScreenDescriptionController", subContractorScreenDescriptionController);

            appModule.controller("logoutController", logoutController);

            appModule.controller("supplierController", supplierController);

            appModule.controller("equipmentController", equipmentController);

            appModule.controller("rentalController", rentalController);
            
            appModule.controller("stockController", stockController);

            appModule.controller("timeEntryController", timeEntryController);

            appModule.controller("signatureController", signatureController);

            appModule.controller("mainController", mainController);

            appModule.controller("resetPasswordController", resetPasswordController);

            appModule.controller("createUserController", createUserController);

            appModule.service("authenticateUser", authenticateUser);

            appModule.service("customerCache", workOrderCache);

            appModule.service("workOrderCache", workOrderCache);

            appModule.service("userInfoService", userInfoService);

            appModule.constant("appConstants", appConstants);

            appModuleRouting.initializeAngularRouting();
            
            angular.bootstrap(document, ["appModule"]);
        }
    }

    return appModule;
});