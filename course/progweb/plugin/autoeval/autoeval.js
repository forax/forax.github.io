(function() {
	if( typeof window.addEventListener === 'function' ) {
        console.log('init autoeval');
		var areas = document.querySelectorAll( 'textarea' );

                var pretty = function(val) {
                  if (Array.isArray(val)) {
                    return "[" + val +  "]";
                  }
                  if (val instanceof Function) {
                    return val;
                  }
                  if (val instanceof Object) {
                    return JSON.stringify(val);
                  }
                  return val;
                }

		for( var i = 0, len = areas.length; i < len; i++ ) {
			var element = areas[i];

                        // evaluate the content of the textarea as JavaScript
                        if (element.attributes.autoeval != undefined) {
                          var name = element.attributes.autoeval.value;
                          var e = document.getElementById(name);
                          if (e == undefined) {
                            console.log("autoeval " + name + " not found");
                            continue;
                          }
                          (function(element, e) {
                            element.addEventListener('keyup', function(event) {
		                        e.innerHTML = element.value;
                                //console.log("modified !" + element.value);
                              }, false);
                           })(element, e);
                        }


                        // 
                        if (element.attributes.autojsstyle != undefined) {
                          var name = element.attributes.autojsstyle.value;
                          var e = document.getElementById(name);
                          if (e == undefined) {
                            console.log("autojsstyle " + name + " not found");
                            continue;
                          }
                          var once = element.attributes['once'] != undefined;

                          (function(element, e, once) {
                            var running = false;
                            var listener = function(event) {
                              if (once) {
                                if (running) {
                                  return;
                                }
                                running = true;
                              }
                              
                              e.innerHTML = element.value;
                              
                            };
                            element.addEventListener('keyup', listener, false);
                            Reveal.addEventListener( 'slidechanged', listener);
                          })(element, e, once);
                        }

                        // evaluate the CSS style of a frame
                        if (element.attributes.autostyle != undefined) {
                          var frame = frames[element.attributes.autostyle.value];
                          if (frame == undefined) {
                            console.log("unknown frame " + element.attributes.autostyle.value);
                          }
                          
                          (function(element, frame) {
                            var listener = function(event) {
                              var doc = (frame.contentWindow || frame.contentDocument);
                              if (doc.document) doc = doc.document;

                              var head = doc.head;
                              //console.log("head " + head);

		                      head.innerHTML = "<style>" + element.value + "</style>";
                              //console.log("modified !" + element.value);
                            };

                            element.addEventListener('keyup', listener, false);
                            frame.addEventListener('load', listener, false);
                            
                           })(element, frame);
                        }

                        // evaluate a JavaScript script and trap console.log
                        if (element.attributes.autojslog != undefined) {
                          var name = element.attributes.autojslog.value;
                          var e = document.getElementById(name);
                          if (e == undefined) {
                            console.log("autojslog " + name + " not found");
                            continue;
                          }
                          var once = element.attributes['once'] != undefined;

                          (function(element, e, once) {
                            var running = false;
                            var listener = function(event) {
                              if (once) {
                                if (running) {
                                  return;
                                }
                                running = true;
                              }
                              e.innerHTML = "";
                              var console = { log: function(msg) {
                                var text = pretty(msg);
                                e.appendChild(document.createTextNode(text));
                                e.appendChild(document.createElement("br"));
                              } }; 
                              try {
                                eval(element.value);
                              } catch(err) {
                                var error = document.createElement("div");
                                error.setAttribute("class", "autojserror");
                                error.appendChild(document.createTextNode(err));
                                e.appendChild(error);
                              }
                            };
                            element.addEventListener('keyup', listener, false);
                            Reveal.addEventListener( 'slidechanged', listener);
                          })(element, e, once);
                        }

                        // evaluate a JS script that draw on a canvas
                        if (element.attributes.autojscanvas != undefined) {
                          var canvasId = element.attributes.autojscanvas.value;
                          var canvas = document.getElementById(canvasId);
                          if (canvas == undefined) {
                            console.log("autojscanvas " + canvasId + " not found");
                            continue;
                          }
                          var once = element.attributes['once'] != undefined; 
                          //console.log("found " + canvasId + " " + element + " " + once);

                          (function(element, canvas, once) {
                            var running = false;
                            var listener = function(isKeyListener, event) {
                              var animations = {};
                              if (once) {
                                //console.log("running " + running);
                                if(running) {
                                  //console.log("snippet for " + canvasId + " already running");
                                  //if (isKeyListener) {
                                  //   Objetcts.key(animations).forEach(function(key) { animations[key](); });
                                     
                                    
                                  //} else {
                                    return;
                                  //}
                                }
                                running = true;  
                              }

                              var context = canvas.getContext("2d");
                              context.clearRect(0, 0, canvas.width, canvas.height);
                              try {
                                eval(element.value);
                              } catch(err) {
                                console.log(err);
                              }
                            };
                            element.addEventListener('keyup', listener.bind(undefined, true), false);
                            Reveal.addEventListener( 'slidechanged', listener.bind(undefined, false));
                          })(element, canvas, once);
                        }


                        // 
                        if (element.attributes.autojs != undefined) {
                          var name = element.attributes.autojs.value;
                          var e = document.getElementById(name);
                          //console.log("found " + e);

                          var trimSemicolon = function(text) {
                            if (text[text.length - 1] == ';') {
                              return text.substring(0, text.length - 1);
                            }
                            return text;
                          };

                          (function(element, e) {
                            var listener = function(event) {
                              e.innerHTML = "";
                              var array = element.value.split('\n').map(function(line, num) {
                                var instr = line.trim();
                                if (instr == "") {
                                  return line;
                                }
                                if (instr.startsWith("var") ||
                                    instr.startsWith("let") ||
                                    instr.startsWith("const")) {
                                  var index = instr.indexOf('=');
                                  if (index == -1) {
                                    return line;
                                  } else {
                                    var init = trimSemicolon(instr.substring(index + 1));
                                    return instr.substring(0, index) + "= tap(" + num + ", " + init + ");"; 
                                  }
                                }
   
                                if (instr.startsWith("console.") ||
                                    instr.startsWith("return") ||
                                    instr.startsWith("if") ||
                                    instr.startsWith("while") ||
                                    instr.startsWith("for") ||
                                    instr.startsWith("}") ||
                                    instr.startsWith("//")) {
                                  return line;
                                }
                                return "tap(" + num + ", " + trimSemicolon(instr) + ");"; 
                              });

                              array.forEach(function(line) {
                                var div = document.createElement("div");
                                div.setAttribute("class", "autojsresult");
                                div.appendChild(document.createTextNode(String.fromCharCode(160)));
                                e.appendChild(div);
                              });

                              var content = array.join('\n');
                              //window.console.log(content);

                              var tap = function(num, val) {
                                  var div = e.childNodes[num];
                                  var text = pretty(val);
                                  div.replaceChild(document.createTextNode(text), div.childNodes[0]);
                                  return val;
                              };
                              eval(content);
                            };
                            element.addEventListener('keyup', listener, false);
                            Reveal.addEventListener( 'slidechanged', listener);
                          })(element, e);
                        }
		}
	}
})();

