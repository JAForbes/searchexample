function Displays(){
	function identity(val){
		return val;
	}

	function dates(time){
		return new Date(time*1).toISOString().slice(0,10);
	}

	function ranges(timeRange){
		var range = timeRange.split('-');
		var start = dates(range[0])
		var end = dates(range[1]);
		return start + ' and ' + end;
	}

	return {
		tags: identity,
		people: identity,
		dates: dates,
		ranges: ranges,
		events: identity,
	}
}