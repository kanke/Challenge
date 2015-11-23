/******************************************************************************************

Angular Filters for use in common apps

******************************************************************************************/

var app = angular.module("alchemytec.filters", []);

// Filter for nice currency display - GBP symbol, commas every three places, 0 decimal places
// Usage: {{ 1235022 | sterling }}
//	outputs £12,350
app.filter("sterling", [ function() {
	return function(inputPence) {
		var inputPounds = new String(Math.round(Number(inputPence) / 100));
		var currency = "";

		while (inputPounds.length > 3) {
			// When we dump IE8 we can use negatives in substr, won't that be nice?
			currency = "," + inputPounds.substr(inputPounds.length - 3, 3) + currency;
			inputPounds = inputPounds.substr(0, inputPounds.length - 3);
		}
		currency = "\u00A3" + inputPounds + currency;

		return currency;
	};
} ]);

// Filter for percentage display
// Usage: {{ 34.5 | percentage }}
//	outputs 35%
// Usage: {{ 34.547 | percentage:2 }}
//	outputs 35.55%
app.filter("percentage", [ function() {
	return function(input, places) {
		places = places? places : 0;

		return (input? parseFloat(input) : 0).toFixed(places) + "%";
	};
} ]);

// Filter to make an arbitary range of values for use in ng-repeat
// Usage: ng-repeat="n in [] | range:10"
//	ensures ten sets of elements are created
app.filter("range", [ function() {
	return function(input, total) {
		total = parseInt(total, 10);
		
		for (var i=0; i<total; i++)
			input.push(i);

		return input;
	};
} ]);

// Filter to make an arbitary range of time values for use in ng-repeat
// Usage: ng-repeat="n in [] | timerange:6:18:15"
//	creates a range of times between 6am and 6pm at 15 minute intervals
app.filter("timerange", [ function() {
	return function(input, start, finish, gap) {
		var hours = start;
		var minutes = 0;

		while (hours <= finish) {
			input.push(("0" + hours).slice (-2) + ":" + ("0" + minutes).slice (-2));

			minutes += gap;
			if (minutes >= 60) {
				minutes = 0;
				hours++;
			}
			
			if ((hours >= finish) && minutes)
				break;
		}

		return input;
	};
} ]);

// Filter for totalling columns in an array
// Usage: {{ variable | total:'price' }}
//	output adds the price properties of every entry in the array variable
// Usage: {{ 34.547 | total:'price,vat' }}
//	output adds the price and vat properties of every entry in the array variable
app.filter("total", [ function() {
	return function(values, columns) {
		var total = 0;
		columns = columns.split(",");
		
		for (var u = 0; u < values.length; u++) {
			for (var p = 0; p < columns.length; p++)
				total += parseFloat(values[u][columns[p]]);
		}

		return total;
	};
} ]);

// Filter for reducing an array into a smaller array
// Usage: ng-repeat="row in columns | slice:2"
//	repeats columns[2] onwards
// Usage: ng-repeat="row in columns | slice:2,4"
//	repeats columns[2] to columns[6]
app.filter("slice", function() {
	return function(items, start, count) {
		start = start || 0;
		
		if (count)
			count = start + count;

		return (items || []).slice(start, count);
	};
});

// Filter for converting special characters into proper HTML entities
// Usage: {{ £300 | entities }}
//	outputs &pound;300
app.filter("comment", [ function() {
	return function(input) {
		input = he.encode(input);
		input = input.replace(/\n/g, "<br/>");

		return input;
	};
} ]);
