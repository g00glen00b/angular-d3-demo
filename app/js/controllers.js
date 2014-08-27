/*jslint nomen: true*/
(function(angular, _) {
  "use strict";
  
  angular.module("d3App.controllers").controller("HomeCtrl", function($scope) {
    
    $scope.set = {
      x: [ ],
      y: [ ]
    };
    
    $scope.n = 5;
    
    $scope.min = 0;
    
    $scope.max = 100;
    
    $scope.randomize = function() {
      $scope.set.x = [ ];
      $scope.set.y = [ ];
      _.times($scope.n, function(n) {
        $scope.set.x.push(n + 1);
        $scope.set.y.push(_.random($scope.min, $scope.max));
      });
    };
  });
  
}(angular, _));
