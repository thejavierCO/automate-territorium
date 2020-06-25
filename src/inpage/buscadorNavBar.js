
jQuery(document).ready(function() {
           // var alCities = ['Post','Baltimore', 'Boston', 'New York', 'Tampa Bay', 'Toronto', 'Chicago', 'Cleveland', 'Detroit', 'Kansas City', 'Minnesota', 'Los Angeles', 'Oakland', 'Seattle', 'Texas'].sort();
            $('#buscadorNav').typeahead({
                source:function(typeahead, query){
                    alert(query);
                    return $.post('../alumnosencampus.php?idSocial=3177', { q: query }, function (data) {
                        alert(data);
                        return typeahead.process(data);
                                    }
                                );
                                                }
        });
        });

$(document).ready(function(){
    $(".buscador").keyup(function(){
    var searchbox = $(this).val();
    var dataString = 'searchword='+ searchbox;
    if(searchbox==''){
    document.getElementById('display').style.display='none';
    }
    else
    {
    $.ajax({
        type: "POST",
        url: "../serch.php",
        data: dataString,
        cache: false,
        beforeSend:function(objeto){
            $("#display").html('<center><img src="../images/ajax-loader.gif"/></center>').show();
        },
        success: function(html){
                $("#display").html(html).show(); }
            });
        }return false; 
    });
});


