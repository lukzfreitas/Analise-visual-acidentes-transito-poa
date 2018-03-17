app.directive('hgChart', function () {
	return {
		restrict: 'E',
		template: '<div></div>',
		scope: {
			options: '='
		},
		link: function (scope, element) {
			Highchars.chart(element[0], scope.options);
		}
	};
})