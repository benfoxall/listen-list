// spotify:album:31hI5dQfm3EiNfzEPeny5k - dirty projectors
// spotify:album:0hLNDK6qqmScdwxU7kvnXn - cloud nothings

$(function(){

	$('#query').on('change',function(){
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

	// search/add form
	$('form').on('submit', function(e){
		e.preventDefault();

		var query = $('.query').val();

		// test
		query = 'spotify:album:0hLNDK6qqmScdwxU7kvnXn'

		if(query){
			$
			.get('http://ws.spotify.com/lookup/1/.json',{uri:query})
			.then(function(data){
				//render

			})
		}

		
	})
})