define([], function(){

    window.calculateTimeDifference = function(timeIn, timeOut) {
        var startTime=moment(timeIn, "HH:mm");
        var endTime=moment(timeOut, "HH:mm");
        var duration = moment.duration(endTime.diff(startTime));
        var hours = parseInt(duration.asHours());
        var minutes = parseInt(duration.asMinutes())-hours*60;
        return (hours + ' Hours and '+ minutes +' Minutes')
    }

    function timeEntryController($scope, $http, appConstants, workOrderCache, authenticateUser, customerCache, userInfoService) {

        var cachedData = workOrderCache.getWorkOrderDetail();

        full_name = userInfoService.getUserInfo().first_name + " " + userInfoService.getUserInfo().last_name;
        $scope.employee_name = full_name;
        $scope.date = "";
        $scope.time_in = "";
        $scope.time_out = "";
        $scope.work_type = "";

        $scope.timeEntryList = [];

        $scope.addTimeEntryData = function() {

        window.showLoader();

            var data = {
                workorder: cachedData.id,
                employee_name: $scope.employee_name,
                date: $scope.date,
                time_in: document.getElementById("timeIn").value,
                time_out: document.getElementById("timeOut").value,
                work_type: $scope.work_type
            }

            // added code to restrict negative time entry.
            // TODO: Alert not showing up.
            var startTime=moment(data.time_in, "HH:mm");
            var endTime=moment(data.time_out, "HH:mm");
            var duration = moment.duration(endTime.diff(startTime));
            var hours = parseInt(duration.asHours());
            var minutes = parseInt(duration.asMinutes())-hours*60;

            if (hours<0 || minutes <0){
                window.hideLoader();
                alert("Please select correct time range.", "error");
            }else{
                $http.post(appConstants.timeEntryApi + cachedData.id + "/time-entry/", data, authenticateUser.getHeaderObject()).then(function(response){
                    $scope.timeEntryList.push(response.data)
                    $scope.clearData();
                    window.hideLoader();
                    alert("Time entry added successfully");
                }, function(response) {
                    $scope.clearData();
                    window.hideLoader();
                    alert(response.data, "error");
                });
            }
      }

        $scope.getAllTimeEntry = function() {
            $http.get(appConstants.timeEntryApi + cachedData.id + "/time-entry/", authenticateUser.getHeaderObject()).then(function(response) {
                if(response.data.length) {
                    $scope.timeEntryList = response.data;
                }
            })
        };

        $scope.employeeNameSortOrder = 0;

        $scope.sortByField = function(fieldName) {
            if(fieldName == "employee_name") {
                if($scope.employeeNameSortOrder == 0) {
                    $scope.employeeNameSortOrder = 1;
                } else if ($scope.employeeNameSortOrder == 1){
                    $scope.employeeNameSortOrder = -1;
                } else {
                    $scope.employeeNameSortOrder = 1;
                }

                $scope.sortData($scope.timeEntryList, fieldName, $scope.employeeNameSortOrder, "String");
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

        $scope.getAllTimeEntry();
        
        

        $scope.removeTimeEntry = function(selectedTimeEntry) {
            window.showLoader();

            var count = -1;

            $scope.timeEntryList.filter((timeEntryObject) => {
                count++;
                if(timeEntryObject.id == selectedTimeEntry){
                    $scope.timeEntryList.splice(count, 1)
                }
            })

            $http.delete(appConstants.timeEntryApi + cachedData.id + "/time-entry/" + selectedTimeEntry + "/", authenticateUser.getHeaderObject()).then(function(response) {

                if(response.status == 204) {
                    window.hideLoader();
                    alert("Time entry successfully deleted.", "info");
                }
            }, function(response) {
                $scope.clearData();
                window.hideLoader();
                alert(response.data, "error");
            });
        }

        $scope.clearData = function() {
            $scope.date = "";
            document.getElementById("timeIn").value = "";
            document.getElementById("timeOut").value = "";
            $scope.work_type = "";
        }

        $scope.compareObjects = function(obj) {
            if(obj.company_name == $scope.company_name && $scope.ticket_number == obj.ticket_number) {
                return true;
            } else return false;
        }

        $scope.compareAllObjects = function(obj) {
            if(obj.company_name == $scope.company_name && $scope.ticket_number == obj.ticket_number && $scope.cost == obj.cost) {
                return true;
            } else return false;
        }

        $scope.calculateAndReturnTimeDifference = function(timeIn, timeOut) {
            return window.calculateTimeDifference(timeIn, timeOut);
        }

    }

    return timeEntryController;

});
