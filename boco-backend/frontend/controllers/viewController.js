(function(viewController) {

    viewController.init = function(app) {

        var express = require("express");
        var router = express.Router();

        app.get("/", function(req, res){
            res.sendfile('./views/layout.html');
        });

        app.get("/:name", function(req, res){
            res.sendfile('./views/layout.html');
        });

        app.get('/partials/:name', function (req, res) {
            var name = req.params.name;
            res.sendfile('./views/partials/' + name);
        });

        return app;
        
    }

})(module.exports);