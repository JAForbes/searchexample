filters = {
	tags: ['mountains','beach','sunny','cold','happy'],
	people: ['Zak Dawson','Henry Dawson','James Forbes'],
}

function SearchModel() { 

	var intros = {
		people: 'of',
		tags: 'tagged',
	}
	var each = {
		tags: '#',
	}

	function compare(input,compare){
		//use whatever regex or comparison etc just return boolean
		return input.toLowerCase()[0] == compare.toLowerCase()[0]
	}

	function suggest(query){
		var grouped = {};
		_(filters).map(function(values,filterType){
			var similar = _(values).filter(function(value){
				return compare(value,query)
			});
			if(similar.length > 0){
				grouped[filterType] = similar;
			}
		})
		return grouped;
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
			choices = _(choices).map(function(choice){ return [each[type]] + choice })
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