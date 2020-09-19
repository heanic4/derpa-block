angular.module("slider-directive", []).directive("slider", ["$http", function ($http) {

    return {
        restrict: "AE",
        scope: {
            settings: "=slider"
        },
        link: function link(scope, element, attr) {

            scope.safeApply = function (fn) {
                var phase = this.$root.$$phase;
                if (phase == '$apply' || phase == '$digest') {
                    if (fn && (typeof (fn) === 'function')) {
                        fn();
                    }
                } else {
                    this.$apply(fn);
                }
            };

            scope.settings.element = element;

            scope.bgo = {

            };

            if (scope.settings.onInit) {
                scope.settings.onInit();
            }

        },
        templateUrl: "/Slider/slider-directive.html"
    };
}]);

angular.module("slider-directive").controller("slider-controller", ["$scope", function ($scope) {

    $scope.settings.apply = $scope.safeApply;

    if ($scope.settings.width == null) {
        $scope.settings.width = 100;
    }

    if ($scope.settings.height == null) {
        $scope.settings.height = 20;
    }

    $scope.min = 0;
    $scope.max = $scope.settings.width - $scope.settings.height;

    $scope.settings.perc = ($scope.settings.value - $scope.settings.min) / ($scope.settings.max - $scope.settings.min);

    $scope.buttonLeft = $scope.max * $scope.settings.perc;


    $scope.setButtonLocation = function () {
        $($scope.settings.element[0]).find(".slider-button").css({ left: Math.round($scope.buttonLeft) + "px" });

        $scope.settings.value = ($scope.buttonLeft / $scope.max) * ($scope.settings.max - $scope.settings.min) + $scope.settings.min;
    };


    $scope.onMove = function (evt) {
        $scope.buttonLeft = Math.max(0, Math.min($scope.max, $scope.buttonLeft + (evt.pageX - $scope.startX)));
        $scope.startX = evt.pageX;
        $scope.setButtonLocation();
        $scope.safeApply();
    };

    $scope.onUpOut = function (evt) {
        $(document.body).unbind("mousemove", $scope.onMove);
        $(document.body).unbind("mouseup", $scope.onUpOut);
        $scope.safeApply();

        if ($scope.settings.onEndEdit) {
            $scope.settings.onEndEdit();
        }
    }

    $scope.clickBar = function (evt) {
        $scope.startX = event.pageX;
        $(document.body).mousemove($scope.onMove);
        $(document.body).mouseup($scope.onUpOut);
        $scope.buttonLeft = Math.max(0, Math.min($scope.max, evt.pageX - $($scope.settings.element[0]).find(".slider").offset().left - ($scope.settings.height * .5)));
        $scope.setButtonLocation();
    }

    $scope.settings.getBackgroundObject = function () {
        return $scope.bgo;
    }

    if ($scope.settings.onInitialized) {
        $scope.settings.onInitialized($scope);
    }

    if ($scope.bgo != null) {
        $scope.setButtonLocation();
    }
    else {
        $scope.settings.onInit = function () {
            $scope.setButtonLocation();
        }
    }
}]);