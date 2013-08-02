'use strict';
angular.module('registry', [
    'registry.create',
    'registry.list'
])

.config(function ($routeProvider) {
    $routeProvider.when('/registry', {
        redirectTo: '/registry/list'
    });

    $routeProvider.when('/registry/create', {
        templateUrl: 'registry/create/create.tpl.html',
        controller: 'RegCreateCtrl'
    });
    
    $routeProvider.when('/registry/list', {
        templateUrl: 'registry/list/list.tpl.html',
        controller: 'RegListCtrl'
    });
});