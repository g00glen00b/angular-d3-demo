/*jslint nomen: true*/
(function(angular, d3, _) {
  "use strict";
  
  angular.module("d3App.directives", []).directive("barChart", function() {
    var directive = { };
     
    directive.restrict = 'AE';
    directive.scope = {
      x: '=?',
      y: '=barChart',
      options: '=?'
    };
     
    directive.link = function(scope, elements, attr) {
      scope.svg = null;
      scope.container = null;
       
      scope.getX = function() {
        var x = null;
        if (scope.x) {
          x = scope.x;
        } else {
          x = _.keys(scope.y);
        }
        return x;
      };
       
      scope.getOptions = function() {
        return _.merge({
          width: 1000,
          height: 400,
          margin: {
            top: 10,
            right: 10,
            bottom: 30,
            left: 50
          }  
        }, scope.options || { });
      };
       
      scope.initialize = function() {
        scope.svg = d3.select(elements[0]).append("svg").attr("class", "chart");
        scope.container = scope.svg.append("g");
        scope.container.append("g").attr("class", "x");
        scope.container.append("g").attr("class", "y");
        scope.setSvgSize();
      };
       
      scope.setSvgSize = function() {
        var options = scope.getOptions();
        scope.container.attr("transform", "translate(" + options.margin.left + ", " + options.margin.right + ")");
        scope.svg.attr('viewBox','0 0 '+ (options.width + options.margin.left + options.margin.right) + ' ' +
            (options.height + options.margin.top + options.margin.bottom))
          .attr('preserveAspectRatio','xMinYMin');
        scope.redraw();
      };

      scope.redraw = function() {
        var x, y, xAxis, yAxis, dataset, options = scope.getOptions(), xValues = scope.getX(), yValues = scope.y;
        if (xValues && yValues) {
          x = d3.scale.ordinal().domain(xValues).rangeRoundBands([ 0, options.width ], 0);
          y = d3.scale.linear().domain([0, d3.max(yValues)]).range([ options.height, 0]);
          xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(5);
          yAxis = d3.svg.axis().scale(y).orient("left").ticks(2); 
        
          scope.container.selectAll("g.x").attr("transform", "translate(0, " + options.height + ")").call(xAxis);
          scope.container.selectAll("g.y").call(yAxis);
          dataset = scope.container.selectAll(".bar").data(yValues);
          dataset.enter().append("rect").attr("class", "bar");
          dataset.transition().attr("x", function(d, i) {
            return i * x.rangeBand();
          }).attr("width", function() {
            return x.rangeBand() - 5;
          }).attr("height", function(d) {
            return options.height - y(d);
          }).attr("y", function(d) {
            return y(d);
          });
          dataset.exit().remove();
        }
      };
       
      /**
       * Watch model changes
       */
      scope.$watch('x', scope.redraw);
      scope.$watch('y', scope.redraw);
      scope.$watch('options', scope.setSvgSize);
       
      scope.initialize();
    };
     
    return directive; 
  });
}(angular, d3, _));
