define([], function(){

    function supplierController($scope, $http, appConstants, workOrderCache, authenticateUser, customerCache) {

        var cachedData = workOrderCache.getWorkOrderDetail();

        $scope.cost = "";
        $scope.ticket_number = "";
        $scope.company_name = "";

        $scope.supplierList = [];
        $scope.workOrderSupplierInfo = [];

        $scope.getWorkOrderSuppliers = function() {
            $http.get(appConstants.supplierApi + cachedData.id + "/suppliers/", authenticateUser.getHeaderObject()).then(function(response) {
                if(response.data.length) {
                    $scope.workOrderSupplierInfo = response.data;

                    for(i=0; i< $scope.workOrderSupplierInfo.length; i++) {
                        $scope.workOrderSupplierInfo[i].supplier =  $scope.workOrderSupplierInfo[i]
                        $scope.workOrderSupplierInfo[i].mappingId = $scope.workOrderSupplierInfo[i].id;
                    }
                } else {
                    $scope.workOrderSupplierInfo = [];
                }
            })
        }

        $scope.getAllSuppliers = function() {
            $http.get(appConstants.getSupplierList, authenticateUser.getHeaderObject()).then(function(response) {
                if(response.data.length) {
                    $scope.supplierList = response.data;
                }
            })
        };

        $scope.supplierSortOrder = 0;
        $scope.supplierTicketSortOrder = 0;
        $scope.supplierCostSortOrder = 0;

        $scope.sortByField = function(fieldName) {
            if(fieldName == "company_name") {
                if($scope.supplierSortOrder == 0) {
                    $scope.supplierSortOrder = 1;
                } else if ($scope.supplierSortOrder == 1){
                    $scope.supplierSortOrder = -1;
                } else {
                    $scope.supplierSortOrder = 1;
                }

                $scope.sortData($scope.workOrderSupplierInfo, fieldName, $scope.supplierSortOrder, "String");

                $scope.supplierCostSortOrder = 0;
                $scope.supplierTicketSortOrder = 0;

            } else if(fieldName == "ticket_number") {
                if($scope.supplierTicketSortOrder == 0) {
                    $scope.supplierTicketSortOrder = 1;
                } else if($scope.supplierTicketSortOrder == 1){
                    $scope.supplierTicketSortOrder = -1;
                } else {
                    $scope.supplierTicketSortOrder = 1;
                }

                $scope.sortData($scope.workOrderSupplierInfo, fieldName, $scope.supplierTicketSortOrder);

                $scope.supplierSortOrder= 0;
                $scope.supplierCostSortOrder = 0;

            } else if(fieldName == "cost")  {
                if($scope.supplierCostSortOrder == 0) {
                    $scope.supplierCostSortOrder = 1;
                } else if($scope.supplierCostSortOrder == 1){
                    $scope.supplierCostSortOrder = -1;
                } else {
                    $scope.supplierCostSortOrder = 1;
                }

                $scope.sortData($scope.workOrderSupplierInfo, fieldName, $scope.supplierCostSortOrder);

                $scope.supplierSortOrder= 0;
                $scope.supplierTicketSortOrder = 0;
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

        $scope.getAllSuppliers();
        $scope.getWorkOrderSuppliers();
        
        $scope.addSupplierData = function() {

            // If Same data already Exists in the Grid, do Nothing

            if($scope.workOrderSupplierInfo.length > 0) {
                if($scope.workOrderSupplierInfo.filter((supplierObj) => $scope.compareAllObjects(supplierObj.supplier)).length > 0){
//                    $scope.clearData();
//                    alert("Value already exists", "error");
//                    return;
                }
            }

            var data = {
                company_name: $scope.company_name,
                workorder: workOrderCache.getWorkOrderDetail().id,
                ticket_number: $scope.ticket_number,
                cost: $scope.cost
            }

            var existingSupplierObject = [];

            if($scope.supplierList.length > 0) {
                existingSupplierObject =  $scope.supplierList.filter((supplierObj) => $scope.compareObjects(supplierObj));
            }

            if(existingSupplierObject.length > 0) {

                data.supplier = existingSupplierObject[0].id;

                $http.post(appConstants.supplierApi + cachedData.id + "/suppliers/", data, authenticateUser.getHeaderObject()).then(function(response){

                    var supplierData = response.data;
                    supplierData.supplier = response.data;
                    supplierData.mappingId = response.data.id;
                    $scope.workOrderSupplierInfo.push(supplierData);

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

            $http.post(appConstants.addSupplier, data, authenticateUser.getHeaderObject()).then(function(response) {
                window.showLoader();
                var existingSupplierObject = [];
                if(response.status == 200 || response.status == 201) {
                    var supplierId = response.data.id;

                    data.supplier = supplierId;

                    $scope.supplierList.push(response.data);

                    $http.post(appConstants.supplierApi + cachedData.id + "/suppliers/", data, authenticateUser.getHeaderObject()).then(function(response){
                        
                        var supplierData = response.data;
                        supplierData.supplier = response.data;
                        supplierData.mappingId = response.data.id;
                        $scope.workOrderSupplierInfo.push(supplierData);

                        $scope.clearData();
                        window.hideLoader();
                        alert("Supplier details added/updated successfully")
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

        $scope.removeSupplier = function(selectedSupplierId) {
            window.showLoader();

            var objectIndex = -1;
            var index = -1;

            $scope.workOrderSupplierInfo.filter((supplierObj) => {
                index = index + 1;
                if(supplierObj.supplier.id == selectedSupplierId) {
                    objectIndex = index;
                }
            });

            $http.delete(appConstants.supplierApi + cachedData.id + "/suppliers/" + $scope.workOrderSupplierInfo[objectIndex].mappingId + "/", authenticateUser.getHeaderObject()).then(function(response) {
                if(response.status == 204) {
                    window.hideLoader();
                    $scope.workOrderSupplierInfo.splice(objectIndex, 1);
                    alert("Supplier details successfully deleted.", "info");
                }
            }, function(response) {
                $scope.clearData();
                window.hideLoader();
                alert(response.data, "error");
            })
        }

        $scope.clearData = function() {
            $scope.cost = "";
            $scope.ticket_number = "";
            $scope.company_name = "";
        }

        $scope.fillSupplierData = function(supplier) {
            if($scope.company_name.indexOf("-") > -1) {
                var data = $scope.company_name.split(" - ");
                var object = $scope.supplierList.filter((supplierInfo) => supplierInfo.company_name == data[0] && supplierInfo.ticket_number == data[1] && supplierInfo.cost == data[2])[0]
                $scope.cost = parseFloat(object.cost);
                $scope.ticket_number = parseFloat(object.ticket_number);
                $scope.company_name = object.company_name;
            }
        }

        $scope.compareObjects = function(obj) {
            if(obj.company_name == $scope.company_name) {
                return true;
            } else return false;
        }

        $scope.compareAllObjects = function(obj) {
            if(obj.company_name == $scope.company_name && $scope.ticket_number == obj.ticket_number) {
                return true;
            } else return false;
        }

    }

    return supplierController;

});