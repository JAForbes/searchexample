filters = {
	tags: ['mountains','beach','sunny','cold','happy'],
	people: ['Zak Dawson','Henry Dawson','James Forbes'],
}

function SearchModel() { 

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
		return '#'+_(chosen).map(function(values,type){
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

	return {
		suggest: suggest,
		toURL: toURL,
		fromURL: fromURL,
	}
}