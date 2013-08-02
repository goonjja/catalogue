'use strict';

angular.module('svc.busy', [])

.factory('busy', function () {
    var asyncTasks = [];
    var service = {
        blockScreen: false
    };

    service.handle = function (restHandler) {
        var id = service.startAsyncTask();
        var callback = function () {
            service.stopAsyncTask(id);
        };
        // handle normal response and error
        restHandler.then(callback, callback);
        return restHandler;
    }

    service.startAsyncTask = function () {
        var id = new Date().getTime();
        asyncTasks[id] = true;
        service.blockScreen = true;
        return id;
    }
    service.stopAsyncTask = function (id) {
        if (id in asyncTasks)
            delete asyncTasks[id];
        if (asyncTasks.length == 0)
            service.blockScreen = false;
    }
    return service;
});