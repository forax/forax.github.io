(function() {
	if( typeof window.addEventListener === 'function' ) {
                console.log('init');
		var areas = document.querySelectorAll( 'textarea' );

		for( var i = 0, len = areas.length; i < len; i++ ) {
			var element = areas[i];

                        if (element.attributes.autoeval != undefined) {
                          var name = element.attributes.autoeval.value;
                          var e = document.getElementById(name);
                          console.log("found " + e);
                          (function(element, e) {
                            element.addEventListener('keyup', function(event) {
		                e.innerHTML = element.value;
                                console.log("modified !" + element.value);
                              }, false);
                           })(element, e);
                        }

                        if (element.attributes.autostyle != undefined) {
                          var frame = frames[element.attributes.autostyle.value];
                          
                          (function(element, frame) {
                            var listener = function(event) {
                              var doc = (frame.contentWindow || frame.contentDocument);
                              if (doc.document) doc = doc.document;

                              var head = doc.head;
                              console.log("head " + head);

		              head.innerHTML = "<style>" + element.value + "</style>";
                              console.log("modified !" + element.value);
                            };

                            element.addEventListener('keyup', listener, false);
                            frame.addEventListener('load', listener, false);
                            
                           })(element, frame);
                        }
		}
	}
})();

