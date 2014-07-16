function Filters(){

	var filters = {
		tags: ['mountains','beach','sunny','cold','happy'],
		people: ['Zak Dawson','Henry Dawson','James Forbes'],
		events: ['Christmas Day','New Years Day']
	}

	function compare(input,compare){
		//use whatever regex or comparison etc just return boolean
		return input.toLowerCase()[0] == compare.toLowerCase()[0]
	}

	function matchDates(query){
		var filter = new DateFilter()
		return filter.format(query);
	}

	function dateRange(dates){
		if(dates.length > 1){
			return _(dates).min() +'-'+_(dates).max()
		}
	}

	function groupDates(grouped,query,chosen){
		if(!chosen.ranges){
			var dates = matchDates(query);
			var ranges;

			if(dates.length > 0){
				if(chosen && chosen.dates){
					dates = dates.concat(chosen.dates)
				}
				grouped.dates = dates;
				var range = dateRange(dates);
				range && (ranges = [range]);

			}
			if(ranges){
				grouped.ranges = ranges;
			}
		}
		if(grouped.ranges){
			delete chosen.dates;
			delete grouped.dates;
		}
	}

	//returns all the matching values, grouped by result type based on a query
	function grouped(query,chosen){
		var grouped = {};
		_(filters).map(function(values,filterType){

			var similar = _(values).filter(function(value){
				return compare(value,query)
			});
			if(similar.length > 0){
				grouped[filterType] = similar;
			}
		})


		groupDates(grouped,query,chosen)
		return grouped;
	}

	return {
		grouped: grouped
	}
}


function SearchModel() { 

	var filters = new Filters()
	var displays = new Displays();

	var intros = {
		people: 'of',
		tags: 'tagged',
		dates: 'taken on',
		ranges: 'taken between',
		events: 'taken during',
	}
	var each = {
		tags: '#',
	}

	function suggest(query,chosen){
		return filters.grouped(query,chosen);
	}

	function toURL(chosen){
		return _(chosen).map(function(values,type){
			return type+'/' + values.join('+').replace(/\s/g,'_');
		}).join('/');
	}

	function fromURL(url){
		var chosen = {};
		var split = url
		.replace(/\_/g,' ')
		.replace(/#/g,'')
		.split('/');
		_(split).each(function(value,i){
			var type = i%2 ==0 && value;
			if(type){
				chosen[type] = split[i+1].split('+');
			}  
		})
		return chosen;
	}

	function describe(chosen){
		var descriptions = _(chosen).map(function(choices,type){
			choices = _(choices).map(function(choice){
				return [each[type]] + displays[type](choice);
			})

			return ' '+intros[type]+' '+ describeList(choices)
		})
		return 'Photos'+descriptions;
	}

	/*
		Converts a list of n elements into the following forms
		A
		A and B
		A, B and C
		A, B, C, ... and D
	*/
	function describeList(list){

		A = list.slice(0,1)
		B = list.slice(1,-1)
		C = list.slice(-1)

		var and;
		var commas;
		if(A[0] != C[0]) { and = ' and ' }
		if(B.length > 0) {commas = A.concat(B).join(', ') }

		str = [commas || A]+[and && and + C]
		return str;
	}

	return {
		suggest: suggest,
		toURL: toURL,
		fromURL: fromURL,
		describe: describe,
	}
}