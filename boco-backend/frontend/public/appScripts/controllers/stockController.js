define([], function(){

    function stockController($scope, $http, appConstants, workOrderCache, authenticateUser, customerCache) {

        var cachedData = workOrderCache.getWorkOrderDetail();

        $scope.cost = "";
        $scope.stock_type = "MECHANICAL";
        $scope.item_name = "";
        $scope.number_of_items = "";

        $scope.stockList = [];
        $scope.workOrderStockInfo = [];

        $scope.itemSortOrder = 0;
        $scope.typeSortOrder = 0;
        $scope.numberSortOrder = 0;
        $scope.costSortOrder = 0;

        $scope.sortByField = function(fieldName) {
            if(fieldName == "item_name") {
                if($scope.itemSortOrder == 0) {
                    $scope.itemSortOrder = 1;
                } else if ($scope.itemSortOrder == 1){
                    $scope.itemSortOrder = -1;
                } else {
                    $scope.itemSortOrder = 1;
                }

                $scope.sortData($scope.workOrderStockInfo, fieldName, $scope.itemSortOrder, "String");

                $scope.supplierCostSortOrder = 0;
                $scope.typeSortOrder = 0;
                $scope.numberSortOrder = 0;

            } else if(fieldName == "stock_type") {
                if($scope.typeSortOrder == 0) {
                    $scope.typeSortOrder = 1;
                } else if($scope.typeSortOrder == 1){
                    $scope.typeSortOrder = -1;
                } else {
                    $scope.typeSortOrder = 1;
                }

                $scope.sortData($scope.workOrderStockInfo, fieldName, $scope.typeSortOrder, "String");

                $scope.itemSortOrder= 0;
                $scope.supplierCostSortOrder = 0;
                $scope.numberSortOrder = 0;

            } else if(fieldName == "cost")  {
                if($scope.costSortOrder == 0) {
                    $scope.costSortOrder = 1;
                } else if($scope.costSortOrder == 1){
                    $scope.costSortOrder = -1;
                } else {
                    $scope.costSortOrder = 1;
                }

                $scope.sortData($scope.workOrderStockInfo, fieldName, $scope.costSortOrder);

                $scope.itemSortOrder= 0;
                $scope.typeSortOrder = 0;
                $scope.numberSortOrder = 0;

            } else if(fieldName == "number_of_items")  {
                if($scope.numberSortOrder == 0) {
                    $scope.numberSortOrder = 1;
                } else if($scope.numberSortOrder == 1){
                    $scope.numberSortOrder = -1;
                } else {
                    $scope.numberSortOrder = 1;
                }

                $scope.sortData($scope.workOrderStockInfo, fieldName, $scope.numberSortOrder);

                $scope.itemSortOrder= 0;
                $scope.typeSortOrder = 0;
                $scope.costSortOrder = 0;
            }
        }

        $scope.getWorkOrderStocks = function() {
            $http.get(appConstants.stockApi + cachedData.id + "/stocks/", authenticateUser.getHeaderObject()).then(function(response) {
                if(response.data.length) {
                    $scope.workOrderStockInfo = response.data;

                    for(i=0; i< $scope.workOrderStockInfo.length; i++) {
                        $scope.workOrderStockInfo[i].stocks = $scope.workOrderStockInfo[i];
                        $scope.workOrderStockInfo[i].mappingId = $scope.workOrderStockInfo[i].id;
                    }
                } else {
                    $scope.workOrderStockInfo = []; 
                }
            }, function() {
                alert("No data available");
            })
        }

        $scope.getAllStocks = function() {
            $http.get(appConstants.getStockList, authenticateUser.getHeaderObject()).then(function(response) {
                if(response.data.length) {
                    $scope.stockList = response.data;
                }
            }, function() {
                alert("Error loading list of available stocks");
            })
        };

        $scope.getAllStocks();
        $scope.getWorkOrderStocks();

        $scope.sortData = function(array, fieldName, order, fieldType) {
            array = array.sort(function(a, b) {
                if(fieldType == "String") {
                    if(order == 1)  {
                        return a.stocks[fieldName] > b.stocks[fieldName];
                    } else return b.stocks[fieldName] > a.stocks[fieldName];
                } else {
                    if(order == 1)  {
                        return a.stocks[fieldName] - b.stocks[fieldName];
                    } else return b.stocks[fieldName] - a.stocks[fieldName];
                }                
            });
        }
        
        $scope.addStockData = function() {
//            if($scope.workOrderStockInfo.length > 0) {
//                if($scope.workOrderStockInfo.filter((stockObj) => $scope.compareObjects(stockObj.stocks)).length > 0){
//                    $scope.clearData();
//                    alert("Value already exists", "error");
//                    return;
//                }
//            }
            
            var data = {
                cost: $scope.cost,
                workorder: workOrderCache.getWorkOrderDetail().id,
                stock_type: $scope.stock_type,
                number_of_items: $scope.number_of_items,
                item_name: $scope.item_name
            }

            var existingStockObject = [];

            if($scope.stockList.length > 0) {
                existingStockObject =  $scope.stockList.filter((stockObj) => $scope.compareObjects(stockObj));
            }
            
            if(existingStockObject.length > 0) {

                data.stocks = existingStockObject[0].id;

                $http.post(appConstants.stockApi + cachedData.id + "/stocks/", data, authenticateUser.getHeaderObject()).then(function(response){
                    
                    var stockData = response.data;
                    stockData.stocks = response.data;
                    stockData.mappingId = response.data.id;
                    $scope.workOrderStockInfo.push(stockData);

                    $scope.clearData();
                    window.hideLoader();
                    alert("Stock details added/updated successfully")
                }, function(response) {
                    $scope.clearData();
                    window.hideLoader();
                    alert(response.data, "error");
                });

                return;
            } 

            $http.post(appConstants.addStock, data, authenticateUser.getHeaderObject()).then(function(response) {
                window.showLoader();
                if(response.status == 200 || response.status == 201) {
                    var stockId = response.data.id;

                    data.stocks = stockId;

                    $scope.stockList.push(response.data);

                    $http.post(appConstants.stockApi + cachedData.id + "/stocks/", data, authenticateUser.getHeaderObject()).then(function(response){
                       
                        var stockData = response.data;
                        stockData.stocks = response.data;
                        stockData.mappingId = response.data.id;
                        $scope.workOrderStockInfo.push(stockData);

                        $scope.clearData();
                        window.hideLoader();
                        alert("Stock details added/updated successfully")
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

        $scope.removeStock = function(selectedStockId) {
            window.showLoader();

            var objectIndex = -1;
            var index = -1;

            $scope.workOrderStockInfo.filter((stockObj) => {
                index = index + 1;
                if(stockObj.stocks.id == selectedStockId) {
                    objectIndex = index;
                }
            });
            
            $http.delete(appConstants.stockApi + cachedData.id + "/stocks/" + $scope.workOrderStockInfo[objectIndex].mappingId, authenticateUser.getHeaderObject()).then(function(response) {
                if(response.status == 204) {
                    window.hideLoader();
                    $scope.workOrderStockInfo.splice(objectIndex, 1);
                    alert("Stock details successfully deleted.", "info");
                }
            }, function(response) {
                $scope.clearData();
                window.hideLoader();
                alert(response.data, "error");
            })
        }

        $scope.clearData = function() {
            $scope.cost = "";
            $scope.item_name = "";
            $scope.number_of_items = "";
        }

        $scope.fillStockData = function(supplier) {
            if($scope.item_name.indexOf("-") > -1) {
                var data = $scope.item_name.split(" - ");
                var object = $scope.stockList.filter((stockInfo) => stockInfo.item_name == data[0] && stockInfo.number_of_items == data[1] && stockInfo.cost == data[2])[0]
                $scope.number_of_items = parseFloat(object.number_of_items);
                $scope.cost = parseFloat(object.cost);
                $scope.item_name = object.item_name;
                $scope.number_of_items = object.number_of_items;
            }
        }

        $scope.compareObjects = function(obj) {
            if(obj.item_name == $scope.item_name && obj.stock_type == $scope.stock_type) {
                return true;
            } else return false;
        }

        $scope.compareAllObjects = function(obj) {
            if(obj.item_name == $scope.item_name && $scope.stock_type == obj.stock_type && $scope.number_of_items == obj.number_of_items && $scope.cost == obj.cost) {
                return true;
            } else return false;
        }

    }

    return stockController;

});