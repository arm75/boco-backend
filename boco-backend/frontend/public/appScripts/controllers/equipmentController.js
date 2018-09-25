define([], function(){

    function equipmentController($scope, $http, appConstants, workOrderCache, authenticateUser, customerCache) {

        var cachedData = workOrderCache.getWorkOrderDetail();

        $scope.cost = "";
        $scope.item_name = "";

        $scope.equipmentList = [];
        $scope.workOrderEquipmentInfo = [];

        $scope.getWorkOrderEquipments = function() {
            $http.get(appConstants.equipmentApi + cachedData.id + "/equipments/", authenticateUser.getHeaderObject()).then(function(response) {
                if(response.data.length) {
                    $scope.workOrderEquipmentInfo = response.data;

                    for(i=0; i< $scope.workOrderEquipmentInfo.length; i++) {
                        $scope.workOrderEquipmentInfo[i].equipment = $scope.workOrderEquipmentInfo[i];
                        $scope.workOrderEquipmentInfo[i].mappingId = $scope.workOrderEquipmentInfo[i].id;
                    }
                } else {
                    $scope.workOrderEquipmentInfo = [];
                }
            })
        }

        $scope.getAllEquipments = function() {
            $http.get(appConstants.getEquipmentList, authenticateUser.getHeaderObject()).then(function(response) {
                if(response.data.length) {
                    $scope.equipmentList = response.data;
                }
            })
        };

        $scope.equipmentSortOrder = 0;
        $scope.equipmentCostSortOrder = 0;

        $scope.sortByField = function(fieldName) {
            if(fieldName == "item_name") {
                if($scope.equipmentSortOrder == 0) {
                    $scope.equipmentSortOrder = 1;
                } else if ($scope.equipmentSortOrder == 1){
                    $scope.equipmentSortOrder = -1;
                } else {
                    $scope.equipmentSortOrder = 1;
                }

                $scope.sortData($scope.workOrderEquipmentInfo, fieldName, $scope.equipmentSortOrder, "String");

                $scope.equipmentCostSortOrder = 0;

            } else if(fieldName == "cost")  {
                if($scope.equipmentCostSortOrder == 0) {
                    $scope.equipmentCostSortOrder = 1;
                } else if($scope.equipmentCostSortOrder == 1){
                    $scope.equipmentCostSortOrder = -1;
                } else {
                    $scope.equipmentCostSortOrder = 1;
                }

                $scope.sortData($scope.workOrderEquipmentInfo, fieldName, $scope.equipmentCostSortOrder);

                $scope.equipmentSortOrder= 0;
            }
        }

        $scope.sortData = function(array, fieldName, order, fieldType) {
            array = array.sort(function(a, b) {
                if(fieldType == "String") {
                    if(order == 1)  {
                        return a.equipment[fieldName] > b.equipment[fieldName];
                    } else return b.equipment[fieldName] > a.equipment[fieldName];
                } else {
                    if(order == 1)  {
                        return a.equipment[fieldName] - b.equipment[fieldName];
                    } else return b.equipment[fieldName] - a.equipment[fieldName];
                }                
            });
        }

        $scope.getAllEquipments();
        $scope.getWorkOrderEquipments();
        
        $scope.addEquipmentData = function() {

            // If Same data already Exists in the Grid, do Nothing

//            if($scope.workOrderEquipmentInfo.length > 0) {
//                if($scope.workOrderEquipmentInfo.filter((equipmentObj) => $scope.compareObjects(equipmentObj.equipment)).length > 0){
//                    $scope.clearData();
//                    alert("Value already exists", "error");
//                    return;
//                }
//            }

            var data = {
                item_name: $scope.item_name,
                workorder: workOrderCache.getWorkOrderDetail().id,
                cost: $scope.cost
            }

            var existingequipmentObject = [];

            if($scope.equipmentList.length > 0) {
                existingequipmentObject =  $scope.equipmentList.filter((equipmentObj) => $scope.compareObjects(equipmentObj));
            }

            if(existingequipmentObject.length > 0) {

                let addEquipmentToWorkOrderData = {
                    "equipment": existingequipmentObject[0].id,
                    "workorder": workOrderCache.getWorkOrderDetail().id
                };

                data.equipment = existingequipmentObject[0].id;

                $http.post(appConstants.equipmentApi + cachedData.id + "/equipments/", data, authenticateUser.getHeaderObject()).then(function(response){
                    
                    var equipmentData = response.data;
                    equipmentData.equipment = response.data;
                    equipmentData.mappingId = response.data.id;
                    $scope.workOrderEquipmentInfo.push(equipmentData);

                    $scope.clearData();
                    window.hideLoader();
                    alert("Equipment details added/updated successfully")
                }, function(response) {
                    $scope.clearData();
                    window.hideLoader();
                    alert(response.data, "error");
                });

                return;
            }

            $http.post(appConstants.addEquipment, data, authenticateUser.getHeaderObject()).then(function(response) {
                window.showLoader();
                var existingequipmentObject = [];
                if(response.status == 200 || response.status == 201) {
                    var equipmentId = response.data.id;
                      
                    let addEquipmentToWorkOrderData = {
                        "equipment": equipmentId,
                        "workorder": workOrderCache.getWorkOrderDetail().id
                    };

                    data.equipment = equipmentId;

                    $scope.equipmentList.push(response.data);

                    $http.post(appConstants.equipmentApi + cachedData.id + "/equipments/", data, authenticateUser.getHeaderObject()).then(function(response){
                        
                        var equipmentData = response.data;
                        equipmentData.equipment = response.data;
                        equipmentData.mappingId = response.data.id;
                        $scope.workOrderEquipmentInfo.push(equipmentData);

                        $scope.clearData();
                        window.hideLoader();
                        alert("Equipment details added/updated successfully")
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

        $scope.removeEquipment = function(selectedEquipmentId) {

            window.showLoader();

            var objectIndex = -1;
            var index = -1;

            $scope.workOrderEquipmentInfo.filter((equipmentObj) => {
                index = index + 1;
                if(equipmentObj.equipment.id == selectedEquipmentId) {
                    objectIndex = index;
                }
            });

            $http.delete(appConstants.equipmentApi + cachedData.id + "/equipments/" + $scope.workOrderEquipmentInfo[objectIndex].mappingId + "/", authenticateUser.getHeaderObject()).then(function(response) {
                if(response.status == 204) {
                    window.hideLoader();
                    $scope.workOrderEquipmentInfo.splice(objectIndex, 1);
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
            $scope.item_name = "";
        }

        $scope.fillEquipmentData = function(equipment) {
            if($scope.item_name.indexOf("-") > -1) {
                var data = $scope.item_name.split(" - ");
                var object = $scope.equipmentList.filter((equipmentInfo) => equipmentInfo.item_name == data[0] && equipmentInfo.cost == data[1])[0]
                $scope.cost = parseFloat(object.cost);
                $scope.item_name = object.item_name;
            }
        }

        $scope.compareObjects = function(obj) {
            if(obj.item_name == $scope.item_name) {
                return true;
            } else return false;
        }

        $scope.compareAllObjects = function(obj) {
            if(obj.item_name == $scope.item_name && $scope.cost == obj.cost) {
                return true;
            } else return false;
        }

    }

    return equipmentController;

});