(function(controllers) {

    var viewController = require("./viewController");
    var workOrderApiController = require("./workOrderApiController");
    var loginApiController = require("./loginApiController");

    controllers.init = function(app) {

        viewController.init(workOrderApiController.init(loginApiController.init(app)));
        
    }

})(module.exports)