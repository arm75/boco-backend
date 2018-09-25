define([], function() {

    var customerCache = function($sessionStorage) {

        var allCustomerList = null;

        this.getCustomerListDataCache = function() {
            return $sessionStorage.allCustomerList;
        }

        this.setCustomerListDataCache = function(allCustomerList) {
            $sessionStorage.allCustomerList = allCustomerList;
        }

        this.clearCustomerListCache = function() {
            $sessionStorage.allCustomerList = null;
        }

    }

    return customerCache;

});