
function like(idPost){

actual=document.getElementById('numLikes['+idPost+']').innerHTML;
document.getElementById('numLikes['+idPost+']').innerHTML= " "+(parseInt(actual)+1)+"";
document.getElementById('megusta['+idPost+']').innerHTML='<a class="color2" href="javascript:dislike('+idPost+');" > Ya no me gusta</a>';
var dataSerialized="proceso=like&idPost="+idPost;
$.ajax({
  url: 'post_actions.php',
  data: dataSerialized,
  type: 'POST',
  success: function(data) {
   
  }
});
$(".selfLike-"+idPost).show();

var content_new = $("#likeContainer_"+idPost).data('content');
content_new = content_new.replace("display:none;", "display:block;");
$("#likeContainer_"+idPost).attr('data-content',content_new);

var popover = $("#likeContainer_"+idPost).data('popover');
if(popover){
    popover.options.content = content_new;
}

}

function dislike(idPost){

actual=document.getElementById('numLikes['+idPost+']').innerHTML;
document.getElementById('numLikes['+idPost+']').innerHTML= " "+(parseInt(actual)-1)+"";
document.getElementById('megusta['+idPost+']').innerHTML='<a class="color2" href="javascript:like('+idPost+');"> Me gusta</a>';
var dataSerialized="proceso=dislike&idPost="+idPost;
$.ajax({
  url: 'post_actions.php',
  data: dataSerialized,
  type: 'POST',
  success: function(data) {
   
  }
});
$(".selfLike-"+idPost).hide();

var content_new = $("#likeContainer_"+idPost).data('content');
content_new = content_new.replace("display:block;", "display:none;");
$("#likeContainer_"+idPost).attr('data-content',content_new);


var popover = $("#likeContainer_"+idPost).data('popover');
if(popover){
    popover.options.content = content_new;
}

}

function autoResize(este){
    var newheight;
    var newwidth;

    if(este){
        newheight=este.contentWindow.document.body.scrollHeight;
        newwidth=este.contentWindow.document.body.scrollWidth;
    }

   este.height= (newheight) + "px";
  
  
}