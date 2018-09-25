define([], function() {

    var workOrderCache = function($sessionStorage) {

        var cachedWorkOrder = null;

        this.markerSubContractorPosition = [];

        this.setMarker = function(marker) {
            this.markerSubContractorPosition = marker;
        }

        this.getMarker = function(marker) {
            return this.markerSubContractorPosition;
        }

        this.clearCachedWorkOrder = function() {
            cachedWorkOrder = null;
        };
        
        this.saveWorkOrderDetails = function(workOrderData) {
            cachedWorkOrder = workOrderData
            $sessionStorage.cachedWorkOrder = cachedWorkOrder;
        };

        this.updateCustomerDetails = function(customerDetails) {
            if($sessionStorage.cachedWorkOrder) {
                cachedWorkOrder.customer_details = customerDetails;
                $sessionStorage.cachedWorkOrder.customer_details = customerDetails;
            }
        }

        this.updateSubContractorDetails = function(subContractorDetails) {
            if($sessionStorage.cachedWorkOrder) {
                cachedWorkOrder.sub_contractor_details = subContractorDetails;
                $sessionStorage.cachedWorkOrder.sub_contractor_details = subContractorDetails;
            }
        }

        this.getWorkOrderDetail = function() {
            if(cachedWorkOrder) {
                return cachedWorkOrder;
            } else {
                cachedWorkOrder = $sessionStorage.cachedWorkOrder;
                return cachedWorkOrder;
            }
        }
    }
        
    return workOrderCache;
});
    