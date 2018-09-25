define([], function(){

    function signatureController($scope, $http, appConstants, workOrderCache, authenticateUser, customerCache, userInfoService) {

        var cachedData = workOrderCache.getWorkOrderDetail();

        var cachedUserData = userInfoService.getUserInfo();

        var getPNGData = function() {

            return $("#signature").jSignature("getData", "image");
        }

        $scope.comments = "";

        $scope.signature_bs64_string = "";

        $scope.getImageData = function() {
            
            $http.get(appConstants.signatureApi + cachedData.id + "/signature/", authenticateUser.getHeaderObject()).then(function(response) {
                $scope.comments = response.data.comments ? response.data.comments: "";
                $scope.signature_bs64_string = response.data.signature_bs64_string ? response.data.signature_bs64_string: "";
                $("#signatureImage").attr('src', "data:" + $scope.signature_bs64_string);
                if($scope.signature_bs64_string.length) {
                    $scope.isEditMode = false;
                }
                
            });
        }

        $scope.getImageData();

        $scope.editSignatureData = function() {
            $("#signature").jSignature("reset")
            $scope.isEditMode = true;
            $scope.comments = "";
            $scope.signature_bs64_string = "";
        }

        $scope.setSignatureData = function() {

            window.showLoader();

            $scope.signature_bs64_string = getPNGData();

            var data = {
                "has_additional_comments": ($scope.comments.length > 0)? "true": "false",
                "comments": $scope.comments,
                "signature_bs64_string": $scope.signature_bs64_string[0] + "," + $scope.signature_bs64_string[1]
            };

            $http.put(appConstants.signatureApi + cachedData.id + "/signature/", data, authenticateUser.getHeaderObject()).then(function(response){
                var data = response;
                $("#signatureImage").attr('src', "data:" + response.data.signature_bs64_string);
                window.hideLoader();
                $scope.isEditMode = false;
            }, function(response) {
                var data = response;
                console.dir(data.response);
            });
        }
    }

    return signatureController;

});