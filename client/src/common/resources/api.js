'use strict';

angular.module('res.api', ['restangular', 'svc.notifications'])

.config(function (RestangularProvider) {
    RestangularProvider.setBaseUrl("api");

//    RestangularProvider.setOnElemRestangularized(function (elem, isCollection, route) {
//        if (!isCollection && route === "networks") {
//            elem.addRestangularMethod('flows', 'get', 'flows');
//            elem.addRestangularMethod('hosts', 'get', 'hosts');
//        }
//        return elem;
//    });
})

.value('version', '0.1')

.factory('api', function (Restangular, notifications) {
    Restangular.setErrorInterceptor(function (res) {
        var err = res.data.error;
        if (angular.isObject(res.data.error) && 'message' in res.data.error)
            err = res.data.error.message;
        notifications.error(err, notifications.CURRENT);
    });
    return Restangular;
});