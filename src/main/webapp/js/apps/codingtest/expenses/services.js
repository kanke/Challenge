
var services = angular.module('ngdemo.services', ['ngResource']);

services.factory('ExpensesFactory', function ($resource) {
    return $resource('/expenses', {}, {
        query: { method: 'GET', isArray: true },
        create: { method: 'POST' }
    })
});
