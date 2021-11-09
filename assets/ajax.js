function fetchComments(gist) {
  var request;
  if (window.XMLHttpRequest) {
    request = new XMLHttpRequest();
  } else {
    request = new ActiveXObject("Microsoft.XMLHTTP");
  }

  request.onreadystatechange = function () {
    if (request.readyState != 4) {
      return;
    }
    if (request.status != 200) {
      alert("error (" + request.status + ") " + request.statusText);
      return;
    }
    
    var comments = eval("(" + request.responseText + ")");
    var output='<div id="comments" class="comments-area">' + '\n' +
               '<ol class="comment-list">' + '\n';
    for (var i = 0; i < comments.length; i++) {
      var comment = comments[i];
      var date = new Date(comment.updated_at);
      var dateText = date.toUTCString();
      output += '  <li id="comment-1" class="comment even thread-even depth-1">' + '\n' +
                '    <article id="div-comment-1" class="comment-body">' + '\n' +
                '      <footer class="comment-meta">' + '\n' +
                '        <div class="comment-author vcard">' +
                '          <img alt="avatar" src="' + comment.user.avatar_url + '" class="avatar avatar-74 photo avatar-default" width="74" height="74" />' + '\n' + 
                '          <b class="fn"><a href="https://github.com/' + comment.user.login + '" rel="external nofollow" class="url">' + comment.user.login + '</a></b>' + '\n' +
                '          <span class="says">writes:</span>' + '\n' +  
                '        </div><!-- .comment-author -->' + '\n' +
                '        <div class="comment-metadata">' + '\n' +
		'          <time datetime="' + comment.updated_at + '">' + dateText + '</time>' + '\n' +
                '        </div><!-- .comment-metadata -->' + '\n' +
                '      </footer><!-- .comment-meta -->' + '\n' +
                '      <div class="comment-content">' + '\n' +
		'        <p>' + markdown.toHTML(comment.body) + '</p>' + '\n' +
                '      </div><!-- .comment-content -->' + '\n' +
                '    </article><!-- .comment-body -->' + '\n' +
                '  </li><!-- #comment-## -->' + '\n';
    }
    output += '</ol><!-- .comment-list -->' + '\n' +
              '</div><!-- #comments -->' + '\n';
    document.getElementById("comments").innerHTML = output;
  };

  request.open("GET", 'https://api.github.com/gists/' + gist + '/comments', true);
  request.send(null);
}


















