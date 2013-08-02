'use strict';

angular.module('registry.create', ['res.api', 'svc.notifications', 'svc.busy'])

.config(function ($routeProvider) {

})

.controller('RegCreateCtrl', function ($scope, $rootScope, api, $location, notifications, busy) {
    $scope.regName = '';

    $scope.save = function () {
        var reg = {
            name: $scope.regName
        };
        notifications.info('Создан реестр: ' + reg.name, notifications.CURRENT);
//        busy.handle(api.all('networks').post(net)).then(function (net) {
//            $location.path("/registry/" + net.guid);
//        }, function (err) {
//            notifications.error('Не удалось сохранить. ', notifications.CURRENT);
//        });
    }
});