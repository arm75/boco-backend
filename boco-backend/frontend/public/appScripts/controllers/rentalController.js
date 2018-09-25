define([], function(){

    function rentalController($scope, $http, appConstants, workOrderCache, authenticateUser, customerCache) {

        var cachedData = workOrderCache.getWorkOrderDetail();

        $scope.vendor_name  = "";
        $scope.cost = "";
        $scope.ticket_number = "";
        $scope.date = "";

        $scope.rentalList = [];
        $scope.workOrderRentalInfo = [];

        $scope.getWorkOrderRentals = function() {
            $http.get(appConstants.rentalApi + cachedData.id + "/rentals/", authenticateUser.getHeaderObject()).then(function(response) {
                if(response.data.length) {
                    $scope.workOrderRentalInfo = response.data;

                    for(i=0; i< $scope.workOrderRentalInfo.length; i++) {
                        $scope.workOrderRentalInfo[i].rental = $scope.workOrderRentalInfo[i];
                        $scope.workOrderRentalInfo[i].rental.date = new Date($scope.workOrderRentalInfo[i].rental.date).toLocaleDateString("en-US");
                        $scope.workOrderRentalInfo[i].mappingId = $scope.workOrderRentalInfo[i].id;
                    }
                } else {
                    $scope.workOrderRentalInfo = [];
                }
            })
        }

        $scope.getAllRentals = function() {
            $http.get(appConstants.getRentalList, authenticateUser.getHeaderObject()).then(function(response) {
                if(response.data.length) {
                    $scope.rentalList = response.data;

                    $scope.rentalList.forEach(rental => {
                        rental.date = new Date(rental.date).toLocaleDateString("en-US");
                    });
                }
            })
        };

        $scope.vendorSortOrder = 0;
        $scope.vendorTicketSortOrder = 0;
        $scope.vendorCostSortOrder = 0;
        $scope.vendorDateSortOrder = 0;

        $scope.sortByField = function(fieldName) {
            if(fieldName == "vendor_name") {
                if($scope.vendorSortOrder == 0) {
                    $scope.vendorSortOrder = 1;
                } else if ($scope.vendorSortOrder == 1){
                    $scope.vendorSortOrder = -1;
                } else {
                    $scope.vendorSortOrder = 1;
                }

                $scope.sortData($scope.workOrderRentalInfo, fieldName, $scope.vendorSortOrder, "String");

                $scope.vendorTicketSortOrder = 0;
                $scope.vendorCostSortOrder = 0;
                $scope.vendorDateSortOrder = 0;

            } else if(fieldName == "ticket_number") {
                if($scope.vendorTicketSortOrder == 0) {
                    $scope.vendorTicketSortOrder = 1;
                } else if($scope.vendorTicketSortOrder == 1){
                    $scope.vendorTicketSortOrder = -1;
                } else {
                    $scope.vendorTicketSortOrder = 1;
                }

                $scope.sortData($scope.workOrderRentalInfo, fieldName, $scope.vendorTicketSortOrder);

                $scope.vendorSortOrder = 0;
                $scope.vendorCostSortOrder = 0;
                $scope.vendorDateSortOrder = 0;

            } else if(fieldName == "cost")  {
                if($scope.vendorCostSortOrder == 0) {
                    $scope.vendorCostSortOrder = 1;
                } else if($scope.vendorCostSortOrder == 1){
                    $scope.vendorCostSortOrder = -1;
                } else {
                    $scope.vendorCostSortOrder = 1;
                }

                $scope.sortData($scope.workOrderRentalInfo, fieldName, $scope.vendorCostSortOrder);

                $scope.vendorSortOrder = 0;
                $scope.vendorTicketSortOrder = 0;
                $scope.vendorDateSortOrder = 0;
                
            } else if(fieldName == "date")  {
                if($scope.vendorDateSortOrder == 0) {
                    $scope.vendorDateSortOrder = 1;
                } else if($scope.vendorDateSortOrder == 1){
                    $scope.vendorDateSortOrder = -1;
                } else {
                    $scope.vendorDateSortOrder = 1;
                }

                $scope.sortData($scope.workOrderRentalInfo, fieldName, $scope.vendorDateSortOrder);

                $scope.vendorSortOrder = 0;
                $scope.vendorTicketSortOrder = 0;
                $scope.vendorCostSortOrder = 0;
            }
        }

        $scope.sortData = function(array, fieldName, order, fieldType) {
            array = array.sort(function(a, b) {
                if(fieldType == "String") {
                    if(order == 1)  {
                        return a.supplier[fieldName] > b.supplier[fieldName];
                    } else return b.supplier[fieldName] > a.supplier[fieldName];
                } else {
                    if(order == 1)  {
                        return a.supplier[fieldName] - b.supplier[fieldName];
                    } else return b.supplier[fieldName] - a.supplier[fieldName];
                }                
            });
        }

        $scope.getAllRentals();
        $scope.getWorkOrderRentals();
        
        $scope.addRentalData = function() {

            // If Same data already Exists in the Grid, do Nothing

//            if($scope.workOrderRentalInfo.length > 0) {
//                if($scope.workOrderRentalInfo.filter((rentalObj) => $scope.compareAllObjects(rentalObj.rental)).length > 0){
//                    $scope.clearData();
//                    alert("Value already exists", "error");
//                    return;
//                }
//            }

            var data = {
                vendor_name: $scope.vendor_name,
                workorder: workOrderCache.getWorkOrderDetail().id,
                ticket_number: $scope.ticket_number,
                cost: $scope.cost,
                date: new Date($scope.date)
            }

            var existingRentalObject = [];

            if($scope.rentalList.length > 0) {
                existingRentalObject =  $scope.rentalList.filter((rentalObj) => $scope.compareObjects(rentalObj));
            }

            if(existingRentalObject.length > 0) {

                data.equipment_rental = existingRentalObject[0].id;

                let addSupplierToWorkOrderData = {
                    "equipment_rental": existingRentalObject[0].id,
                    "workorder": workOrderCache.getWorkOrderDetail().id
                };

                $http.post(appConstants.rentalApi + cachedData.id + "/rentals/", data, authenticateUser.getHeaderObject()).then(function(response){
                    
                    var rentalData = response.data;
                    rentalData.rental = response.data;
                    rentalData.mappingId = response.data.id;
                    $scope.workOrderRentalInfo.push(rentalData);

                    $scope.clearData();
                    window.hideLoader();
                    alert("Supplier details added/updated successfully")
                }, function(response) {
                    $scope.clearData();
                    window.hideLoader();
                    alert(response.data, "error");
                });

                return;
            }

            $http.post(appConstants.addRental, data, authenticateUser.getHeaderObject()).then(function(response) {
                window.showLoader();
                
                if(response.status == 200 || response.status == 201) {
                    var vendorId = response.data.id;

                    data.equipment_rental = vendorId;

                    $http.post(appConstants.rentalApi + cachedData.id + "/rentals/", data, authenticateUser.getHeaderObject()).then(function(response){
                        
                        $scope.rentalList.push(response.data);
                        
                        var rentalData = response.data;
                        rentalData.rental = response.data;
                        rentalData.mappingId = response.data.id;
                        $scope.workOrderRentalInfo.push(rentalData);

                        $scope.clearData();
                        window.hideLoader();
                        alert("Vendor details added/updated successfully")
                    }, function(response) {
                        $scope.clearData();
                        window.hideLoader();
                        alert(response.data, "error");
                    });
                    
                }
            }, function(response) {
                $scope.clearData();
                window.hideLoader();
                alert(response.data, "error");
            })
        }

        $scope.removeVendor = function(selectedVendorId) {
            window.showLoader();

            var objectIndex = -1;
            var index = -1;

            $scope.workOrderRentalInfo.filter((rentalObj) => {
                index = index + 1;
                if(rentalObj.rental.id == selectedVendorId) {
                    objectIndex = index;
                }
            });

            $http.delete(appConstants.rentalApi + cachedData.id + "/rentals/" + $scope.workOrderRentalInfo[objectIndex].mappingId, authenticateUser.getHeaderObject()).then(function(response) {
                if(response.status == 204) {
                    window.hideLoader();
                    $scope.workOrderRentalInfo.splice(objectIndex, 1);
                    alert("Vendor details successfully deleted.", "info");
                }
            }, function(response) {
                $scope.clearData();
                window.hideLoader();
                alert(response.data, "error");
            });
        }

        $scope.clearData = function() {
            $scope.cost = "";
            $scope.vendor_name = "";
            $scope.ticket_number = "";
            $scope.date = "";
        }

        $scope.fillRentalData = function(supplier) {
            if($scope.vendor_name.indexOf("-") > -1) {
                var data = $scope.vendor_name.split(" - ");
                var object = $scope.rentalList.filter((rentalInfo) => rentalInfo.vendor_name == data[0] && rentalInfo.ticket_number == data[1])[0]
                $scope.cost = parseFloat(object.cost)
                $scope.ticket_number = parseFloat(object.ticket_number);
                $scope.vendor_name = object.vendor_name;
                $scope.date = new Date(object.date);
            }
        }

        $scope.compareObjects = function(obj) {
            if(obj.vendor_name == $scope.vendor_name) {
                return true;
            } else return false;
        }

        $scope.compareAllObjects = function(obj) {
            if(obj.vendor_name == $scope.vendor_name && $scope.ticket_number == obj.ticket_number) {
                return true;
            } else return false;
        }

    }

    return rentalController;

});