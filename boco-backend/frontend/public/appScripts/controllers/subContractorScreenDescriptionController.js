define([], function(){

    var subContractorScreenDescriptionController = function($scope, workOrderCache, $http, $location, appConstants, authenticateUser, $mdDialog) {

        var cachedData = workOrderCache.getWorkOrderDetail();

        $scope.markerSubContractorPositionData = workOrderCache;

        var self = this;

        $scope.subContractorList = [];

        $scope.isSubContractorInEditMode = false;

        $scope.sub_contractor_details = {
            sub_contractor_name: "",
            address: "",
            email: "",
            contact_number: "",
            poc: ""
        }

        $scope.subContractorNameSortOrder = 0;
        $scope.subContractorAddressSortOrder = 0;
        $scope.subContractorEmailSortOrder = 0;
        $scope.contactNumberSortOrder = 0;
        $scope.pocSortOrder = 0;

        $scope.sortByField = function(fieldName) {
            if(fieldName == "sub_contractor_name") {
                if($scope.subContractorNameSortOrder == 0) {
                    $scope.subContractorNameSortOrder = 1;
                } else if ($scope.subContractorNameSortOrder == 1){
                    $scope.subContractorNameSortOrder = -1;
                } else {
                    $scope.subContractorNameSortOrder = 1;
                }

                $scope.sortData($scope.allSubContractor, fieldName, $scope.subContractorNameSortOrder, "String");

                $scope.subContractorAddressSortOrder = 0;
                $scope.subContractorEmailSortOrder = 0;
                $scope.contactNumberSortOrder = 0;
                $scope.pocSortOrder = 0;
            }

            if(fieldName == "address") {
                if($scope.subContractorAddressSortOrder == 0) {
                    $scope.subContractorAddressSortOrder = 1;
                } else if ($scope.subContractorAddressSortOrder == 1){
                    $scope.subContractorAddressSortOrder = -1;
                } else {
                    $scope.subContractorAddressSortOrder = 1;
                }

                $scope.sortData($scope.allSubContractor, fieldName, $scope.subContractorAddressSortOrder, "String");

                $scope.subContractorNameSortOrder = 0;
                $scope.subContractorEmailSortOrder = 0;
                $scope.contactNumberSortOrder = 0;
                $scope.pocSortOrder = 0;
            }

            if(fieldName == "email") {
                if($scope.subContractorEmailSortOrder == 0) {
                    $scope.subContractorEmailSortOrder = 1;
                } else if ($scope.subContractorEmailSortOrder == 1){
                    $scope.subContractorEmailSortOrder = -1;
                } else {
                    $scope.subContractorEmailSortOrder = 1;
                }

                $scope.sortData($scope.allSubContractor, fieldName, $scope.subContractorEmailSortOrder, "String");

                $scope.subContractorNameSortOrder = 0;
                $scope.subContractorAddressSortOrder = 0;
                $scope.contactNumberSortOrder = 0;
                $scope.pocSortOrder = 0;
            }

            if(fieldName == "contact_number") {
                if($scope.subContractorNameSortOrder == 0) {
                    $scope.subContractorNameSortOrder = 1;
                } else if ($scope.subContractorNameSortOrder == 1){
                    $scope.subContractorNameSortOrder = -1;
                } else {
                    $scope.subContractorNameSortOrder = 1;
                }

                $scope.sortData($scope.allSubContractor, fieldName, $scope.subContractorNameSortOrder, "String");

                $scope.subContractorNameSortOrder = 0;
                $scope.subContractorAddressSortOrder = 0;
                $scope.subContractorEmailSortOrder = 0;
                $scope.pocSortOrder = 0;
            }

            if(fieldName == "poc") {
                if($scope.pocSortOrder == 0) {
                    $scope.pocSortOrder = 1;
                } else if ($scope.pocSortOrder == 1){
                    $scope.pocSortOrder = -1;
                } else {
                    $scope.pocSortOrder = 1;
                }

                $scope.sortData($scope.allSubContractor, fieldName, $scope.pocSortOrder, "String");

                $scope.subContractorNameSortOrder = 0;
                $scope.subContractorAddressSortOrder = 0;
                $scope.contactNumberSortOrder = 0;
                $scope.subContractorEmailSortOrder = 0;
            }
        }

        $scope.sortData = function(array, fieldName, order, fieldType) {
            array = array.sort(function(a, b) {
                if(fieldType == "String") {
                    if(order == 1)  {
                        return a[fieldName] > b[fieldName];
                    } else return b[fieldName] > a[fieldName];
                } else {
                    if(order == 1)  {
                        return a[fieldName] - b[fieldName];
                    } else return b[fieldName] - a[fieldName];
                }                
            });
        }

        $scope.searchValue = "";

        $scope.cancelAddContractor = function() {
            $scope.isSubContractorInEditMode = false;
            $scope.clearSubContractor();
        }
        
        //$scope.sub_contractor_details = cachedData.sub_contractor_details;

        $scope.getSubContractorList =  function() {
            $http.get(appConstants.getAllSubContractors, authenticateUser.getHeaderObject()).then(function(response) {
                if(response.data.length) {
                    $scope.subContractorList = response.data;
                    //$scope.sub_contractor_details = response.data[0];
                } else {
                }
            }, function() {
                alert("No data available");
            })
        }

        $scope.getSubContractorList();

        $scope.updateGoogleMapsForContractor = function() {
            if($scope.sub_contractor_details) {
                $scope.markerSubContractorPosition = [$scope.sub_contractor_details.address_latitude, $scope.sub_contractor_details.address_longitude];
            }
        }

        $scope.formatTelephoneNumberForContractor = function() {
            if ($scope.sub_contractor_details && $scope.sub_contractor_details.contact_number) {
                var telData = $scope.sub_contractor_details.contact_number.toString().replace(/-|x/g, '');
                var formattedTel = telData.substring(0, 3) + "-" + telData.substring(3, 6) + "-" + telData.substring(6, 10);
                $scope.sub_contractor_details.contact_number = formattedTel;
            }
        }

        $scope.searchSubContractor = function(showAlert = 0) {
            if($scope.searchValue != "") {
                var serachData = $scope.subContractorList.filter((contractor) => contractor.sub_contractor_name == $scope.searchValue);

                if(serachData.length) {

                    $scope.sub_contractor_details.sub_contractor_name = serachData[0].sub_contractor_name;
                    $scope.sub_contractor_details.address = serachData[0].address;
                    $scope.sub_contractor_details.email = serachData[0].email;
                    $scope.sub_contractor_details.contact_number = serachData[0].contact_number;
                    $scope.sub_contractor_details.poc = serachData[0].poc;
                    $scope.markerSubContractorPosition = [serachData[0].address_latitude, serachData[0].address_longitude];
                    $scope.searchValue = "";
                    
                } else {
                    $http.get(appConstants.getSelectedSubContractor + "sub_contractor_name=" + $scope.searchSubContractorName, authenticateUser.getHeaderObject()).then(function(response) {
                        if(response.data[0]) {
                            $scope.sub_contractor_details = response.data[0];
                            cachedData.sub_contractor_details = response.data[0];
                            workOrderCache.updateSubContractorDetails(response.data[0]);
                            $scope.searchSubContractorName = "";
                            $scope.markerSubContractorPosition = [$scope.sub_contractor_details.address_latitude, $scope.sub_contractor_details.address_longitude];
                        } else {
                            $scope.searchSubContractorName = "";
                            alert("No such sub contractor exists", "error");
                        }
                    })
                }
            } else {
                $scope.searchSubContractorName = "";
                alert("Enter sub contractor name to search", "error");
            }
        };

        $scope.allSubContractorName = [];
        $scope.allSubContractor = [];

        $scope.searchSubContractorNameFromListIndex = function(id, searchByName = false) {
            for(let i=0; i < $scope.allSubContractor.length; i++) {
                if(searchByName) {
                    if($scope.allSubContractor[i].sub_contractor_name == id){
                        return i;
                    }
                } else {
                    
                    if($scope.allSubContractor[i].id == id){
                        return i;
                    }
                }
                
            }
            return -1;
        }

        $scope.getAllSubContractors = function() {
            $scope.allSubContractorName = [];
            $scope.allSubContractor = [];
            $http.get(appConstants.subContractorApi + cachedData.id + "/subcontractors/", authenticateUser.getHeaderObject()).then(function(response) {
                $scope.allSubContractor = response.data;
                for(let i=0; i < response.data.length; i++) {
                    $scope.allSubContractorName.push(response.data[i].sub_contractor_name);
                }
            })
        }

        $scope.saveSubContractorButton = function() {

            var subContractorDetails = {
                sub_contractor_name: $scope.sub_contractor_details.sub_contractor_name,
                address: $scope.sub_contractor_details.address,
                email: $scope.sub_contractor_details.email,
                contact_number: $scope.sub_contractor_details.contact_number.toString().replace(/-|x/g, ''),
                poc: $scope.sub_contractor_details.poc
            };

            if(cachedData.sub_contractor_details == null) {
                cachedData.sub_contractor_details = {
                    sub_contractor_name: "",
                    address: "",
                    email: "",
                    contact_number: "",
                    poc: ""
                }
            }

            var existingContractorData = $scope.allSubContractor.filter((contractor) => {
                if(contractor.sub_contractor_name == $scope.sub_contractor_details.sub_contractor_name) {
                    return contractor;
                }
            });

            if(existingContractorData.length > 0) {
                alert("Sub Contractor with same name cannot be added.", "error");
                return;
            }

            var existingSubcontractor = $scope.subContractorList.filter((contractor) => {
                if(contractor.sub_contractor_name == $scope.sub_contractor_details.sub_contractor_name) {
                    return contractor;
                }
            });

            if(existingSubcontractor.length > 0) {

                var addSubContractorToWorkOrder = {
                    work_order: cachedData.id,  
                    sub_contractor: existingSubcontractor[0].id
                }
                $http.put(appConstants.addNewSubContractor + existingSubcontractor[0].id + "/", subContractorDetails, authenticateUser.getHeaderObject()).then(function(response) {
                    
                    var objectIndex = -1;
                    var index = -1;
                    $scope.subContractorList.filter((contractor) => {
                        index = index + 1;
                        if(contractor.id == existingSubcontractor[0].id) {
                            objectIndex = index;
                        }
                    });

                    $scope.subContractorList.splice(objectIndex, 1);

                    $scope.subContractorList.push(response.data);


                    $http.post(appConstants.saveDescription + cachedData.id + "/subcontractors/", addSubContractorToWorkOrder, authenticateUser.getHeaderObject()).then(function(response) {
                        if(response.status == 201) {
                            $scope.allSubContractor.push(response.data);
                            $scope.sub_contractor_details = response.data;
                            alert("Sub contractor details added/updated successfully")
                            $scope.clearSubContractor();
                            $scope.isSubContractorInEditMode = false;
                        }
                    }, function(response) {
                        var data = response.data;
                    });
                });

            } else {
                $http.post(appConstants.addNewSubContractor, subContractorDetails, authenticateUser.getHeaderObject()).then(function(response) {
                    if(response.data.id) {
                        $scope.allSubContractor.push(response.data);
                        $scope.formatTelephoneNumberForContractor();
                        $scope.updateGoogleMapsForContractor();
                        
                        var addSubContractorToWorkOrder = {
                            work_order: cachedData.id,  
                            sub_contractor: response.data.id
                        }

                        $http.post(appConstants.saveDescription + cachedData.id + "/subcontractors/", addSubContractorToWorkOrder, authenticateUser.getHeaderObject()).then(function(response) {
                            if(response.status == 201) {
                                $scope.subContractorList.push(response.data);
                                $scope.sub_contractor_details = response.data;
                                alert("Sub contractor details added/updated successfully")
                                $scope.clearSubContractor();
                                $scope.isSubContractorInEditMode = false;
                            }
                        }, function(response) {
                            var data = response.data;
                        });
                    } else {
                        alert("Error adding/updating sub contractor details", "error")
                    }
                }, function(response) {
                    var adata = response.data;
                })
            }
        };

        $scope.clearSubContractor = function() {
            $scope.sub_contractor_details = {
                sub_contractor_name: "",
                address: "",
                email: "",
                contact_number: "",
                poc: ""
            }
        }

        $scope.addNewSubContractor = function() {
            $scope.isSubContractorInEditMode = true;
        }

        $scope.initializePage = function() {
            if($scope.sub_contractor_details) {
                $scope.updateGoogleMapsForContractor();
                $scope.formatTelephoneNumberForContractor();
            }
            $scope.getAllSubContractors();
            $scope.searchSubContractorName = "asdsadasda";
        }

        $scope.removeSubContractor = function(subContractor) {
            window.showLoader();
            var objectIndex = -1;
            var index = -1;
            $scope.allSubContractor.filter((contractor) => {
                index = index + 1;
                if(contractor.id == subContractor) {
                    objectIndex = index;
                }
            });

            $http.delete(appConstants.subContractorApi + cachedData.id + "/subcontractors/" + subContractor + "/", authenticateUser.getHeaderObject()).then(function(response) {
                if(response.status == 204) {
                    window.hideLoader();
                    $scope.allSubContractor.splice(objectIndex, 1);
                    alert("Sub contractor details successfully deleted.", "info");
                }
            }, function(response) {
                window.hideLoader();
                alert(response.data, "error");
            });
        }

        $scope.initializePage();

        function DialogController($scope, $mdDialog) {
            $scope.hide = function() {
              $mdDialog.hide();
            };
        
            $scope.cancel = function() {
              $mdDialog.cancel();
            };
        
            $scope.answer = function(answer) {
              $mdDialog.hide(answer);
            };
          }

        $scope.showDialog = function(contractor, event) {

            $scope.markerSubContractorPosition = [contractor.address_latitude, contractor.address_longitude];

            workOrderCache.setMarker($scope.markerSubContractorPosition);

            $mdDialog.show({
                controller: subContractorScreenDescriptionController,
                templateUrl: './partials/dialogInfo.html',
                targetEvent: event,
                clickOutsideToClose:true, // Only for -xs, -sm breakpoints.
            }).then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });
        }

        $scope.save = function() {
            $mdDialog.cancel($scope.item);
          };
          
          $scope.close = function(){
            $mdDialog.cancel(undefined);
          };

        if($scope.sub_contractor_details) {
            if($scope.sub_contractor_details.sub_contractor_name) {
            }
        }
    }
    
    return subContractorScreenDescriptionController;
})


        