'use strict';

angular.module('svc.notifications', [])

.factory('notifications', function ($rootScope) {
    var notifications = {
        'STICKY': [],
        'ROUTE_CURRENT': [],
        'ROUTE_NEXT': []
    };
    var notificationsService = {
        blockScreen: false
    };

    notificationsService.STICKY = "STICKY";
    notificationsService.CURRENT = "ROUTE_CURRENT";
    notificationsService.NEXT = "ROUTE_NEXT";

    var addNotification = function (notificationsArray, notificationObj) {
        if (!angular.isObject(notificationObj)) {
            throw new Error("Only object can be added to the notification service");
        }
        notificationsArray.push(notificationObj);
        return notificationObj;
    };

    var createAndAddNotification = function (type, message, scope) {
        var arr = notifications.ROUTE_CURRENT;
        if (scope && angular.isString(scope))
            arr = notifications[scope];
        addNotification(arr, {
            type: type,
            message: message
        });
    }

    $rootScope.$on('$routeChangeSuccess', function () {
        notifications.ROUTE_CURRENT.length = 0;
        notifications.ROUTE_CURRENT = angular.copy(notifications.ROUTE_NEXT);
        notifications.ROUTE_NEXT.length = 0;
    });

    notificationsService.getCurrent = function () {
        return [].concat(notifications.STICKY, notifications.ROUTE_CURRENT);
    };

    notificationsService.pushSticky = function (notification) {
        return addNotification(notifications.STICKY, notification);
    };

    notificationsService.pushForCurrentRoute = function (notification) {
        return addNotification(notifications.ROUTE_CURRENT, notification);
    };

    notificationsService.pushForNextRoute = function (notification) {
        return addNotification(notifications.ROUTE_NEXT, notification);
    };



    notificationsService.info = function (msg, scope) {
        createAndAddNotification('info', msg, scope);
    };

    notificationsService.error = function (msg, scope) {
        createAndAddNotification('error', msg, scope);
    };
    notificationsService.success = function (msg, scope) {
        createAndAddNotification('success', msg, scope);
    };

    notificationsService.remove = function (notification) {
        angular.forEach(notifications, function (notificationsByType) {
            var idx = notificationsByType.indexOf(notification);
            if (idx > -1) {
                notificationsByType.splice(idx, 1);
            }
        });
    };

    notificationsService.removeAll = function () {
        angular.forEach(notifications, function (notificationsByType) {
            notificationsByType.length = 0;
        });
    };

    return notificationsService;
});