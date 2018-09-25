define([], function() {

    var userInfoService = function($sessionStorage) {

        var userInfo = null;

        this.userName = "";

        this.loginUserInfo = {}

        this.getUserInfo = function() {
            return $sessionStorage.userInfo;
        }

        this.setUserInfo = function(userInfo) {
            $sessionStorage.userInfo = userInfo[0];
            window.loginUserInfo = userInfo[0];
        }

        this.clearUserInfo = function() {
            $sessionStorage.userInfo = null;
        }

    }

    return userInfoService;

});