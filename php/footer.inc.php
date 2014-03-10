  <script src="/js/jquery-1.10.2.js"></script>
  <script src="/js/bootstrap.min.js"></script> 
  <script src="/js/autocomplete/jquery.autocomplete.js"></script>
  <script type="text/javascript">
jQuery(function(){
// https://github.com/devbridge/jQuery-Autocomplete
	$('#street').autocomplete({ 
		serviceUrl: '/php/search.json.php',
		dataType: 'jsonp',
		noCache: true,
		onSelect: function (suggestions) {
			console.log('Jetzt Karte öffnen mit: ' + suggestions.value + ', ' + suggestions.data);
		},
		onSearchStart: function (query) {
			console.log("onSearchStart: " + JSON.stringify(query));
		},
		onSearchError: function (query, jqXHR, textStatus, errorThrown) {
			console.log("onSearchError: " + JSON.stringify(jqXHR));
			console.log("onSearchError: " + JSON.stringify(textStatus));
			console.log("onSearchError: " + JSON.stringify(errorThrown));
		},
		onSearchComplete: function (query, suggestions) {
			console.log("onSearchComplete: " + JSON.stringify(suggestions));
		}
	});

	});  
  </script>
</body>
</html>
