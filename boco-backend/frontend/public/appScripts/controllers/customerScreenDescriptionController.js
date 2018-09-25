define([], function() {

    var customerScreenDescriptionController = function($scope, workOrderCache, $http, $location, appConstants, authenticateUser, customerCache) {
        
        $scope.markerPosition = [38.46583480, -91.02618380];

        var self = this;

        self.isCustomerIdModified = false;

        $scope.googleMapsUrl = "AIzaSyAog2mjYSr6LJ2nMkQ2mOO7H4mrzizFqmY";

        var cachedData = workOrderCache.getWorkOrderDetail();

        $scope.customer_details = cachedData.customer_details;

        $scope.isInEditCustomerMode = true;

        $scope.pocArray = [];

        $scope.addPointOfContact = function() {
            $scope.pocArray.push("");
        }

        if ($scope.customer_details) {
            if ($scope.customer_details.company_name) {
                $scope.isInEditCustomerMode = false;
            }
        }

        $scope.updateGoogleMaps = function() {
            if ($scope.customer_details) {
                $scope.markerPosition = [$scope.customer_details.address_latitude, $scope.customer_details.address_longitude];
            }
        }

        $scope.updateGoogleMaps();

        $scope.formatTelephoneNumber = function() {

            if ($scope.customer_details && $scope.customer_details.contact_number) {
                var telData = $scope.customer_details.contact_number.toString().replace(/-|x/g, '');
                var formattedTel = telData.substring(0, 3) + "-" + telData.substring(3, 6) + "-" + telData.substring(6, 10);
                $scope.customer_details.contact_number = formattedTel;
            }

        }

        $scope.formatTelephoneNumber();

        $scope.editCustomerButton = function() {
            $scope.isInEditCustomerMode = true;
        };

        $scope.saveCustomerButton = function(isCustomerChanged = 0) {
            var customerDetails = {
                company_name: $scope.customer_details.company_name,
                address: $scope.customer_details.address,
                email: $scope.customer_details.email,
                contact_number: $scope.customer_details.contact_number.toString().replace(/-|x/g, ''),
                poc: $scope.customer_details.poc
            };

            if (cachedData.customer_details == null) {
                cachedData.customer_details = {
                    company_name: "",
                    address: "",
                    email: "",
                    contact_number: "",
                    poc: ""

                }
            }

            if ($scope.customer_details && $scope.customer_details.id) {
                $http.put(appConstants.updateCustomerDetails + $scope.customer_details.id + "/", customerDetails, authenticateUser.getHeaderObject()).then(function(response) {

                    if (response.data.id) {
                        workOrderCache.updateCustomerDetails(response.data);
                        $scope.customer_details = response.data;
                        $scope.formatTelephoneNumber();
                        $scope.allCustomers[$scope.searchCustomerNameFromListIndex(response.data.id)] = response.data;
                        $scope.updateGoogleMaps();
                        $scope.isInEditCustomerMode = false;

                        if (self.isCustomerIdModified) {

                            var addCustomerToWorkOrder = {
                                customer: response.data.id
                            }

                            $http.put(appConstants.saveDescription + cachedData.id + "/", addCustomerToWorkOrder, authenticateUser.getHeaderObject()).then(function(response) {
                                if (response.status == 200) {
                                    workOrderCache.saveWorkOrderDetails(response.data);
                                    alert("Customer details added/updated successfully", "info")
                                }
                            });
                        } else {
                            alert("Customer details added/updated successfully", "info");
                        }
                    } else {
                        alert("Error updating/adding customer details", "error")
                    }

                    self.isCustomerIdModified = false;
                }, function() {})
            } else {
                $http.post(appConstants.addNewCustomer, customerDetails, authenticateUser.getHeaderObject()).then(function(response) {
                    if (response.data.id) {
                        $scope.allCustomers.push(response.data);
                        $scope.customer_details = response.data;
                        $scope.formatTelephoneNumber();
                        workOrderCache.updateCustomerDetails(response.data);
                        $scope.updateGoogleMaps();
                        $scope.isInEditCustomerMode = false;

                        var addCustomerToWorkOrder = {
                            customer: response.data.id
                        }

                        $http.put(appConstants.saveDescription + cachedData.id + "/", addCustomerToWorkOrder, authenticateUser.getHeaderObject()).then(function(response) {
                            if (response.status == 200) {
                                workOrderCache.saveWorkOrderDetails(response.data);

                                alert("Customer details added/updated successfully", "info")
                            }
                        });
                    } else {
                        alert("Error updating/adding customer details", "error")
                    }
                    self.isCustomerIdModified = false;
                }, function() {})
            }
        };

        $scope.addCustomer = function() {
            $scope.customer_details = {};
            $scope.isInEditCustomerMode = true;
            cachedData.customer_details = {};
        }

        $scope.allCustomerName = [];
        $scope.allCustomers = [];

        $scope.searchCustomerNameFromListIndex = function(id, searchByName = false) {
            for (let i = 0; i < $scope.allCustomers.length; i++) {
                if (searchByName) {
                    if ($scope.allCustomers[i].company_name == id) {
                        return i;
                    }

                } else {
                    if ($scope.allCustomers[i].id == id) {
                        return i;
                    }
                }

            }
            return -1;
        }

        $scope.getAllCustomers = function() {
            $scope.allCustomerName = [];
            $scope.allCustomers = [];
            $http.get(appConstants.getAllCustomers, authenticateUser.getHeaderObject()).then(function(response) {
                $scope.allCustomers = response.data;
                for (let i = 0; i < response.data.length; i++) {
                    $scope.allCustomerName.push(response.data[i].company_name);
                }
            })
        }

        $scope.getAllCustomers();

        $scope.searchCustomerName = "";

        $scope.searchCustomer = function(showAlert = 0) {
            if ($scope.searchCustomerName != "") {
                if ($scope.allCustomerName.indexOf($scope.searchCustomerName) > -1) {

                    $scope.customer_details = $scope.allCustomers[$scope.searchCustomerNameFromListIndex($scope.searchCustomerName, true)];
                    cachedData.customer_details = $scope.customer_details;
                    workOrderCache.updateCustomerDetails($scope.customer_details)
                    $scope.isInEditCustomerMode = true;
                    self.isCustomerIdModified = true;
                    $scope.searchCustomerName = "";
                    $scope.markerPosition = [$scope.customer_details.address_latitude, $scope.customer_details.address_longitude];
                    $scope.searchCustomerName = "";
                } else {
                    $http.get(appConstants.getSelectedCustomer + "company_name=" + $scope.searchCustomerName, authenticateUser.getHeaderObject()).then(function(response) {
                        if (response.data[0]) {
                            $scope.customer_details = response.data[0];
                            cachedData.customer_details = response.data[0];
                            workOrderCache.updateCustomerDetails(response.data[0]);
                            $scope.isInEditCustomerMode = true;
                            self.isCustomerIdModified = true;
                            $scope.searchCustomerName = "";
                            $scope.getAllCustomers();
                            $scope.markerPosition = [$scope.customer_details.address_latitude, $scope.customer_details.address_longitude];
                            $scope.searchCustomerName = "";
                        } else {
                            $scope.searchCustomerName = "";
                            alert("No such customer exists", "error");
                        }
                    })
                }
            } else {
                $scope.searchCustomerName = "";
                alert("Enter company name to search", "info")
            }
        };
    }

    return customerScreenDescriptionController;
})