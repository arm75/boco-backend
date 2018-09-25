define([], function() {

    var supplierCache = function($sessionStorage) {

        var supplierData = null;

        this.getSupplierDataCache = function() {
            return $sessionStorage.supplierData;
        }

        this.setSupplierDataCache = function() {
            $sessionStorage.supplierData = supplierData;
        }

        this.clearSupplierCache = function() {
            $sessionStorage.supplierData = null;
        }

    }

    return supplierCache;

});