define([], function() {

    //var serverUrl = "http://ec2-18-188-116-168.us-east-2.compute.amazonaws.com:5000/"
    //var serverUrl = "http://localhost/api/"
    var serverUrl = "http://localhost:8000/"

    var appConstants = {
        authenticateUserUrl: serverUrl + "api-token-auth/",
        getWorkOrder: serverUrl + "workorders/?",
        createWorkOrder: serverUrl + "workorders/",
        getRandomWorkOrder: serverUrl + "workorders/getNextNumber/",
        getDetailedWorkorder: serverUrl + "getdetailedworkorder/",
        saveDescription: serverUrl + "workorders/",
        updateCustomerDetails: serverUrl + "customers/",
        addNewCustomer: serverUrl + "customers/",
        getAllWorkOrders: serverUrl + "getallworkorders",
        getSelectedCustomer: serverUrl + "customers/?",
        getAllCustomers: serverUrl + "customers/",

        getWorkOrderList: serverUrl + "workorders/list/",

        updateSubContractorDetails: serverUrl + "subcontractors/",
        getAllSubContractors: serverUrl + "subcontractors/",
        addNewSubContractor: serverUrl + "subcontractors/",
        getSelectedSubContractor: serverUrl + "subcontractors/?",
        subContractorApi: serverUrl + "workorders/",

        supplierApi: serverUrl + "workorders/",
        getSupplierList: serverUrl + "suppliers/",
        addSupplier: serverUrl + "suppliers/",

        getEquipmentList: serverUrl + "equipments/",
        equipmentApi: serverUrl + "equipments/",
        addEquipment: serverUrl + "equipments/",

        stockApi: serverUrl + "workorders/",
        addStock: serverUrl + "stocks/",
        getStockList: serverUrl + "stocks/",

        rentalApi: serverUrl + "workorders/",
        getRentalList: serverUrl + "rentals/",
        addRental : serverUrl + "rentals/",
        

        equipmentApi: serverUrl + "workorders/",
        getEquipmentList: serverUrl + "equipments/",
        addEquipment: serverUrl + "equipments/",

        getTimeEntryList: serverUrl + "time-entry/",
        timeEntryApi: serverUrl + "workorders/",

        workOrderApi: serverUrl + "workorders/",

        signatureApi: serverUrl + "workorders/",
        createUser: serverUrl + "users/",
        resetPassword: serverUrl + "users/",
        getUser: serverUrl + "users/?"

    }

    return appConstants;

});
