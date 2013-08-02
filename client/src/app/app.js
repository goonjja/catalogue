'use strict';

// root app module which depends on submodules
// each submodule equals to some section
angular.module('app', [
    'restangular',
    'svc.notifications',
    'svc.busy',
    'registry',
    'directives.location',
    'directives.busymodal',
    'templates.app',
    'templates.common'
])

.config(function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider.when('/', {
        redirectTo: '/registry/list'
    });
    //$routeProvider.otherwise({
    //  redirectTo: '/'
    //});
})

.controller('AppCtrl', function ($scope, notifications, busy) {
    $scope.notifications = notifications;
    $scope.busy = busy;

    $scope.$on('$routeChangeError', function (event, current, previous, rejection) {
        notifications.error("Путь не найден");
    });
    $scope.removeNotification = function (notification) {
        notifications.remove(notification);
    }
});