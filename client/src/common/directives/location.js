angular.module('directives.location', [])

.directive(
    'location', ['$location', function ($location) {

        return function (scope, elm, attrs) {
            function update() {
                var children = elm.children();
                for (var i = 0; i < children.length; i++) {
                    var li = angular.element(children[i]);
                    // get first anchor's href and compare with current location
                    var links = li.find("a");
                    if (links.length != 0) {
                        var link = links[0];
                        var path = link.href.substr(link.href.indexOf("#") + 1);
                        if ($location.path().indexOf(path) != -1)
                            li.addClass("active");
                        else
                            li.removeClass("active");
                    }
                }
            }

            // watch for location change
            scope.$watch(function () {
                return $location.path();
            }, function (path) {
                update();
            });

            // update menu items
            update();
        }
    }]);