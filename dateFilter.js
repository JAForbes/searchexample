function DateFilter(){
	
	var DAY_AS_MILLIS = 84600000;

	var months = ['January', 'February', 'March', 'April', 'May', 'June','July', 'August', 'September', 'October', 'November', 'December'];
	var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
	var ends = { 1:'st', 2:'nd', 3:'rd', 21:'st', 22:'nd', 23:'rd', 31:'st'};

	var idAttribute = 'date_filter_id';

	var regexs = {
		iso8601: /(\d{4})(-|_|\.)(\d{1,2})(-|_|\.)(\d{1,2})/, //2014-12-02
		pretty: /(\d{1,2})(?:th|st|nd|rd) (?:of ){0,1}(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)?(?:\w*) {0,1}(\d{4}){0,1}/, //5th of January 2014
		shortPretty : /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec) (\d)(?:th|st|nd|rd)? (\d{4})/, //Jan 5 2012
		month: /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/,
		day: /(mon|tue|wed|thu|fri|sat|sun)/,
		today: /to/,
		yesterday: /yest/,
		month: /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/,
		christmas: /chris/,
	};

	var formatters = {
		iso8601:iso8601,
		pretty:pretty,
		shortPretty:shortPretty,
		month:month,
		day: day,
		today: today,
		yesterday: yesterday,
		month: month,
		christmas: christmas,
	}

	var	shortMonths = months.map(function(val){ return val.slice(0,3).toLowerCase(); });
	var	shortDays = days.map(function(val){ return val.slice(0,3).toLowerCase(); })
	

	function day(query,match){
		var day = shortDays.indexOf(match[0]);
		var date = getDayOfWeek(day);
		return date.getTime();
	}

	function christmas(query,match){
		console.log('christmas')
		return new Date('2014-12-25').getTime()
	}

	/*
		Turns a day index into a date object.
		Always in the past.
	*/
	function getDayOfWeek(dayIndex){
		var today = new Date();
		var delta = today.getDay() - dayIndex;
		if(delta < 0){
		  delta += 7;
		}
		today.setDate(today.getDate() - delta)
		return today;
	}

	function month(query,match){
		var month = shortMonths.indexOf(match[0]);
		var begin = new Date();
		var end = new Date();
		begin.setDate(1);
		begin.setMonth(month);
		end.setDate(1);
		end.setMonth(month+1);
		end.setTime(end.getTime()-DAY_AS_MILLIS);//move back one day to get 31st/30th/28th/29th etc

		var value = {};
		value.after = end.getTime();
		value.before = begin.getTime();
		return value;
	}

	function iso8601(query,match){
		return new Date(match[0]).getTime();
	}

	function pretty(query,match){
		var year = match.slice(-1)[0] || new Date().getFullYear();
		var month = shortMonths.indexOf(match.slice(-2)[0]);
		var day = match.slice(-3)[0];
		return new Date(year,month,day).getTime();
	}

	function shortPretty(query,match){
		var year = match.slice(-1)[0];
		var month = shortMonths.indexOf(match.slice(-3)[0]);
		var day = match.slice(-2)[0];
		return new Date(year,month,day).getTime();
	}

	function today(query,match){
		return query,new Date().getTime();
	}

	function yesterday(query,match){
		var date = getNormalizedDate();
		date.setTime(date.getTime() - DAY_AS_MILLIS);
		return date.getTime();
	}

	//convert a string to a date
	function format(query){
		query = query.toLowerCase()
		return _(regexs).chain().map(function(regex,name){
			var match = query.match(regex)
			if(match){
				return formatters[name](query,match);
			}
		}).compact().value()
	}

	return {
		format:format
	}
}