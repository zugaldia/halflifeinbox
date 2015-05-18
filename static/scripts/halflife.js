'use strict';

var app = angular.module('halfLife', ['ngRoute']);

app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'static/partials/main.html',
            controller: 'MainCtrl'
        });
        $routeProvider.otherwise({
            redirectTo: '/'
        });
    }
]);

app.controller('MainCtrl', ['$scope', '$log', function($scope, $log) {

    $scope.data = {
        // Checkboxes
        'avoidWeekends' : false,
        'startFirstDay': false,

        // Sample data
        'firstDay': 100,
        'lastDay': 10,
        'totalDays': 14,

        // Results
        'decayRate': null,
        'halfLife': null,
        'emailPlan': null};

    // Apparently we can only get a number
    var months =
        ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    /*
     * Trigger updates
     */

    $scope.$watch('data.firstDay', function(newValue, oldValue, scope) {
        $scope.updateExponentialDecay();
    });

    $scope.$watch('data.lastDay', function(newValue, oldValue, scope) {
        $scope.updateExponentialDecay();
    });

    $scope.$watch('data.totalDays', function(newValue, oldValue, scope) {
        $scope.updateExponentialDecay();
    });

    $scope.onAvoidWeekendsChange = function() {
        $scope.updateExponentialDecay();
    };

    $scope.onStartFirstDayChange = function() {
        $scope.updateExponentialDecay();
    };

    /*
     * Equation
     */

    $scope.getDecayRate = function(totalDays, lastDay, firstDay) {
        return (-1.0 / totalDays) * Math.log(1.0 * lastDay / firstDay);
    };

    $scope.getExponentialDecay = function(initialQuantity, decayRate, day) {
        return 1.0 * initialQuantity *  Math.exp(-1.0 * decayRate * day);
    };

    $scope.getHalfLife = function(decayRate) {
        return 1.0 * Math.log(2.0) / decayRate;
    };

    /*
     * Utils
     */

    $scope.isWeekend = function(today) {
        // Check for Saturday and Sunday
        return (
            today.getDay() === 6 ||
            today.getDay() === 0);
    };

    /*
     * Main method
     */

    $scope.updateExponentialDecay = function() {
        // Decay rate
        $scope.data.decayRate = $scope.getDecayRate(
            $scope.data.totalDays,
            $scope.data.lastDay,
            $scope.data.firstDay);
        
        // Half life
        $scope.data.halfLife = Math.ceil(
            $scope.getHalfLife($scope.data.decayRate));

        // Move the day one day up if we want to start on the first day.
        // Also, if we want to avoid weekends, we need to move that day
        // out of the weekend.
        var today = new Date();
        if ($scope.data.startFirstDay) {
            do {
                today.setDate(today.getDate() - 1);
            } while ($scope.data.avoidWeekends && $scope.isWeekend(today));
        }

        // Plan
        $scope.data.emailPlan = [];
        for (var day = 0; day < $scope.data.totalDays + 1; day++) {
            var remaining = Math.ceil(
                $scope.getExponentialDecay(
                    $scope.data.firstDay, $scope.data.decayRate, day));

            // Avoid weekends
            if ($scope.data.avoidWeekends) {
                while ($scope.isWeekend(today)) {
                    today.setDate(today.getDate() + 1);
                }
            }

            // Format the date
            var formattedDate = today.getUTCDate() + ' ' + months[today.getUTCMonth()];

            // Total emails to answer that day
            var totalDay = ($scope.data.emailPlan.length > 0 ?
                $scope.data.emailPlan[day-1].remaining - remaining : - 1);

            var dayPlan = {
                'day': day,
                'formattedDate': formattedDate,
                'remaining': remaining,
                'totalDay': totalDay};
            $scope.data.emailPlan.push(dayPlan);
            today.setDate(today.getDate() + 1);
        }
    };
}]);
