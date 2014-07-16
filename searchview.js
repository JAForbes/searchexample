//Simplified version of a search view

function SearchView(){
	$el = $('body');
	var chosen = {};
	
	var events = {
		'input keyup':'keyup',
		'input keydown': 'keydown',
		'#results click':'resultsClick'
	}

	function initialize(){
		var html = div({id:'search'},
		
			input({type:'text'}),
			p({id:'description'},'Search friends, tags and dates'),
			div({id:'results'})
		)
		
		$el.html(html);
		$results = $el.find('#results')
		$description = $el.find('#description')

		bindEvents();
	}

	function bindEvents(){
		_(events).each(function(callback,name){
			var el = name.split(' ')[0];
			var event = name.split(' ')[1];
			var that = this;
			$el.find(el).on(event,function(e){
				on[callback].call(that,e)
			});
		})
	}

	function suggestions(query){
		var suggested = searchModel.suggest(query);

		var html = _(suggested).map(function(matches,type){
			return [
				p(type),
				ul(
					_(matches).map(function(match){
						return li({group:type},match)
					})
				)
			].join('')
		});

		$results.html(html);
	}

	function choose(group,val){
		chosen[group] = chosen[group] || [];
		chosen[group].push(val);

		describe(chosen);
	}

	function describe(chosen){
		var desc = searchModel.describe(chosen);
		$description.text(desc);
	}

	function navigate(){
		window.location.hash = '/' + searchModel.toURL(chosen);
	}

	on = {
		keyup: function(e){
			var $this = $(e.currentTarget);
			var val = $this.val();
			suggestions(val);
		},

		keydown: function(e){
			var ENTER = 13;
			if (e.keyCode == ENTER) {
				navigate();
			}
		},

		resultsClick: function(e){
			var $target = $(e.target);
			if ($target.is('li')){
				var group = $target.attr('group');
				var val = $target.text();
				
				choose(group,val);
			}
		}
	}

	initialize();
}

$(function(){
	searchModel = new SearchModel()
	new SearchView()
})