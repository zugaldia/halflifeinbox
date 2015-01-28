'use strict';

angular.module('halfLife', ['ngRoute']).

config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'static/partials/main.html',
            controller: 'MainCtrl'
        });
        $routeProvider.otherwise({
            redirectTo: '/'
        });
    }
]).

controller('MainCtrl', ['$scope', '$log', function($scope, $log) {
    // Sample data
    $scope.firstDay = 100;
    $scope.lastDay = 10;
    $scope.totalDays = 14;

    // Results
    $scope.decayRate = null;
    $scope.halfLife = null;
    $scope.emailPlan = null;

    // Apparently we can only get a number
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    $scope.$watch('firstDay', function(newValue, oldValue, scope) {
        $scope.updateExponentialDecay();
    });

    $scope.$watch('lastDay', function(newValue, oldValue, scope) {
        $scope.updateExponentialDecay();
    });

    $scope.$watch('totalDays', function(newValue, oldValue, scope) {
        $scope.updateExponentialDecay();
    });

    $scope.getDecayRate = function(totalDays, lastDay, firstDay) {
        return (-1.0 / totalDays) * Math.log(1.0 * lastDay / firstDay);
    };

    $scope.getExponentialDecay = function(initialQuantity, decayRate, day) {
        return 1.0 * initialQuantity *  Math.exp(-1.0 * decayRate * day);
    };

    $scope.getHalfLife = function(decayRate) {
        return 1.0 * Math.log(2.0) / decayRate;
    };

    $scope.updateExponentialDecay = function() {
        $scope.decayRate = $scope.getDecayRate(
            $scope.totalDays, $scope.lastDay, $scope.firstDay);
        $scope.halfLife = Math.ceil(
            $scope.getHalfLife($scope.decayRate));

        var today = new Date();
        $scope.emailPlan = [];
        for (var day = 0; day < $scope.totalDays + 1; day++) {
            var remaining = Math.ceil(
                $scope.getExponentialDecay($scope.firstDay, $scope.decayRate, day));
            var expectedDate = today.getUTCDate() + ' ' + months[today.getUTCMonth()];
            var dayPlan = {
                'day': day,
                'expectedDate': expectedDate,
                'remaining': remaining};
            $scope.emailPlan.push(dayPlan);
            today.setDate(today.getDate() + 1);
        }
    };
}]);
