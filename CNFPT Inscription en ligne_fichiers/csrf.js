document.observe('dom:loaded', function() {
	// propagation du token pour la protection contre CSRF
	$$('form').each(
		function(elt) {
			var sessionToken = document.getElementById('token').getAttribute("value");
			if(sessionToken !== 'undefined'){
				var inputToken = document.createElement("input");
				inputToken.value = sessionToken;
				inputToken.type = "hidden";
				inputToken.name = "data[token]";
				inputToken.autocomplete = 'off';
				elt.appendChild(inputToken);
			}
		}
	);
});