// spotify:album:31hI5dQfm3EiNfzEPeny5k - dirty projectors
// spotify:album:0hLNDK6qqmScdwxU7kvnXn - cloud nothings

$(function(){

	$(document).on('click', '.expand', function(e){
		e.preventDefault();
		$(this)
			.closest('.list-group-item').toggleClass('expanded')
			.siblings().removeClass('expanded');

		$('[data-deferred-iframe]', $(this).closest('.list-group-item')).each(function(){
			var $this = $(this);
			var params = $.extend({src:$this.data('deferred-iframe')},$this.data('deferred-iframe-params'))
			var $next = $('<iframe>', params);
			$this.replaceWith($next);
		})
	})

	var ei = 0,
		examples = [
			'spotify:album:31hI5dQfm3EiNfzEPeny5k', // dirty projectors
			'spotify:album:052mYLfLyJmIk0eQ0FL100', // wild beasts
			'spotify:album:1VmWdRTS027iMB7uQ161EI', // teen
			'spotify:album:6FIFqclBriPCb0SjWDaHIk', // grizzly bear
		];

	$('#example').on('click', function(e){
		e.preventDefault();
		$('#uri').val(examples[ei]).change();

		ei = (ei+1) % examples.length;

		if(!$('#prior').val()) $('#prior').val("because I clicked the example button")
	})

	$('[data-loading-text]').click(function () {
	    var btn = $(this)
	    btn.button('loading')
	});

	$('#uri').on('change',function(){
		var $this = $(this), 
			$result = $('#query-result');

		$this.closest('.form-group').removeClass('has-success has-error')

		var query = $this.val();

		if(!query) return $result.text('');

		$result.html('<i class="glyphicon glyphicon-refresh"></i>')

		$.get('http://ws.spotify.com/lookup/1/.json',{uri:query})
		.then(function(data){

			$result
				.text(data.album.name + ' - ' + data.album.artist)
				.prepend('<i class="glyphicon glyphicon-ok" ></i> ');

			$this.closest('.form-group').addClass('has-success')

		})
		.fail(function(){
			$result.html('<i class="glyphicon glyphicon-remove" ></i>');
			$this.closest('.form-group').addClass('has-error')
		})

	})

	// // search/add form
	// $('form').on('submit', function(e){
	// 	e.preventDefault();

	// 	var query = $('.query').val();

	// 	// test
	// 	query = 'spotify:album:0hLNDK6qqmScdwxU7kvnXn'

	// 	if(query){
	// 		$
	// 		.get('http://ws.spotify.com/lookup/1/.json',{uri:query})
	// 		.then(function(data){
	// 			//render

	// 		})
	// 	}

		
	// })
})