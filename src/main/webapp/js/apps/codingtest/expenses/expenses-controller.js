"use strict";

/******************************************************************************************

 Expenses controller

 ******************************************************************************************/

var app = angular.module("expenses.controller", []);

app.controller("ctrlExpenses", ["$rootScope", "$scope", "Restangular", function ExpensesCtrl($rootScope, $scope, Restangular) {
    // Update the headings
    $rootScope.mainTitle = "Expenses";
    $rootScope.mainHeading = "Expenses";

    // Update the tab sections
    $rootScope.selectTabSection("expenses", 0);

    $scope.dateOptions = {
        changeMonth: true,
        changeYear: true,
        dateFormat: "dd/mm/yy"
    };

    var loadExpenses = function () {
        // Retrieve a list of expenses via REST
        $Restangular.all("expenses").getList().then(function (expenses) {
            $scope.expenses = expenses;
        });
    }

    $scope.saveExpense = function () {
        if ($scope.expensesform.$valid) {
            // Post the expense via REST
            $Restangular.one("expenses").post(null, $scope.newExpense).then(function () {
                // Reload new expenses list
                loadExpenses();
            });
        }
    };

    $scope.clearExpense = function () {
        $scope.newExpense = {};
    };

    $scope.vat = 0.2;

    // Initialise scope variables
    loadExpenses();
    $scope.clearExpense();
}]);
