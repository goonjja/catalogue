angular.module('directives.busymodal', ['templates.common'])

.directive(
    'busymodal', function () {

    return {
        templateUrl: 'directives/busymodal.tpl.html',
        replace: true,
        restrict: 'E',
        scope: {
            show: '@'
        },
        transclude: true,

        link: function (scope, element, attrs) {
            $(element).modal({
                backdrop: 'static',
                keyboard: false,
                show: false
            });
            scope.$watch('show', function (value, oldValue) {
                if (value === 'true') {
                    $(element).modal('show');
                } else {
                    $(element).modal('hide');
                }
            });
        }
    };
});