idComentario=0;
idComentario++;

idComment=0;
idComment++;

postId=0;
postId++;

var HagoPost=0;
var tarea=0;
var carpeta=new Object();
var path="";
var path_names = "";
var enriquecido=0;
var scrolling= 0;
var defaultid= 0;

if ($('#file-uploader-demo1').length > 0) {
  var uploader = new qq.FileUploader({
    element: document.getElementById('file-uploader-demo1'),
    action: 'valum/server/php.php',
    debug: false,
    template: '<div class="qq-uploader">' + 
      '<div class="qq-upload-drop-area"><span>Drop files here to upload</span></div>' +
      '<div class="qq-upload-button" style="vertical-align:middle; width:125px; font-size:13px;"><i class="color2 icon-adjuntar"></i> Adjuntar archivos</div> <span style="vertical-align: super;">MÁX. 100Mb</span>' +
      '<ul  id=\'ullista\' class="qq-upload-list"></ul>' +
    '</div>',
    multiple: true,
    allowedExtensions: ['jpg', 'jpeg', 'gif', 'png', 'bmp', 'tiff', 'zip', 'rar', '7z', 'ace', 'mp3', 'ogg', 'ogm', 'm4a', 'aac', 'wma', 'wav', 'aiff', 'flac', 'alac', 'ape', 'm4v', 'mp4', 'avi', 'wmv', 'mov', '3gp', 'mkv', 'rmbv', 'rmv', 'vob', 'mpeg', 'mpg', 'mpeg2', 'mpg2', 'doc', 'docx', 'odt', 'xls', 'xlsx', 'ods', 'csv', 'ppt', 'pptx', 'odp', 'pdf', 'xps','rap','gmk','mpp','pod', 'aia', 'apk'],
    onSubmit: function(id, fileName) {
      HagoPost=1;
    },
    onComplete: function(id, fileName, responseJSON) {
      var fileNameServer = responseJSON['filename'];
      path+=fileNameServer+'qqq';
      path_names+=fileName+'qqq';
      HagoPost= 0;
    },
    showMessage:function(message){
      alert("El archivo es muy grande");
    }
  });
}



function clicke(quien) {
      if(HagoPost > 0) {
        alert('El archivo se esta cargando, espere un momento...');
        return;
      } 
}

function toggle(id) {
  defaultid= id;
  document.getElementById("li["+id+"]").setAttribute("class", "active");
  document.getElementById("li["+(id+1)%4+"]").setAttribute("class", "");
  document.getElementById("li["+(id+2)%4+"]").setAttribute("class", "");
  document.getElementById("li["+(id+3)%4+"]").setAttribute("class", "");

  if(id == 3) {
    //es hashtag
    hashtags(id);
    return;
  }

  traeMasPosts(id, 0);
}

function togglePost(id) {
  document.getElementById("liPost["+id+"]").setAttribute("class", "active");
  document.getElementById("liPost["+(id+1)%2+"]").setAttribute("class", "");
  
  if(id == 1) {
    //es tarea
    /*GAMIFICATION:START*/
    $('#gamificacionPuntos').show();
    /*GAMIFICATION:END*/
    $('#multiplesGrupos').attr('checked', true);
    multiplesGrupos();
    /*GAMIFICATION:START*/
    $('#checkboxmultiplesGrupos').hide();
    $('#textomultiplesGrupos').show();
    /*GAMIFICATION:END*/
    tarea=1;
    document.getElementById('fechaEntregaDiv').style.display='block';
    if(document.getElementById('fechaInicioDiv'))
      document.getElementById('fechaInicioDiv').style.display='block';
    if(document.getElementById('tipoTareaDiv'))
      document.getElementById('tipoTareaDiv').style.display='block';
    /*GAMIFICATION:START*/
    $('.toggleTarea').css('display','block');
    /*GAMIFICATION:END*/
    //if(document.getElementById('divParciales'))
      //document.getElementById('divParciales').style.display='block';
  } else {
    /*GAMIFICATION:START*/
    if(!jQuery.isEmptyObject(carpeta)){
      $.each(carpeta, function(idgrupo, element) {
        cambiarimgPOSTSelectedMuro(idgrupo);
        $('#medallero-'+idgrupo).hide();
      });
    }
    $('#gamificacionPuntos').hide();
    $('#gamingDivTareaMuro').hide();
    cleanGamification();
    $('#textomultiplesGrupos').show();
    /*GAMIFICATION:END*/
    resetMultiples();
    tarea=0;
    /*GAMIFICATION:START*/
    $('#checkboxmultiplesGrupos').show();
    $('#textomultiplesGrupos').hide();
    $('.toggleTarea').css('display','none');
    /*GAMIFICATION:END*/
    document.getElementById('fechaEntregaDiv').style.display='none';
    if(document.getElementById('divParciales'))
      document.getElementById('divParciales').style.display='none';

    if(document.getElementById('tipoTareaDiv'))
      document.getElementById('tipoTareaDiv').style.display='none';
  }
}

function seleccionarCarpeta(idGrupo) {
  //Inicializamos el modal
  $('#myModal').modal('show');

  var dataString= 'proceso=modalCarpetas&idGrupo='+idGrupo;
  $.ajax({
    type:'POST',
    url:'post_actions.php',
    data:dataString,
    cache:false,
    success:function(res) { 
      document.getElementById('modalContent').innerHTML=res;
      $("#example").treeview(); //para las carpetas
    }
  });
}

function carpetaEscogida(idGrupo) {
  document.getElementById('carpeta_seleccionada['+idGrupo+']').innerHTML=document.getElementById('cambia').innerHTML;
  document.getElementById('modalContent').innerHTML='';
  $('#myModal').modal('hide');
  grupoCarpeta=new Object();
  grupoCarpeta.id=idGrupo;
  grupoCarpeta.idSocial=document.getElementById('usuario_social_grupo['+idGrupo+']').value;
  grupoCarpeta.nombre=encodeURIComponent(document.getElementById('nombre_grupo['+idGrupo+']').value);
  grupoCarpeta.idTema=quie;

  if(document.getElementById('checkbox_grupo['+idGrupo+']').checked) {
    carpeta[grupoCarpeta.id]=grupoCarpeta;
  }
}

function checkedGrupo(idGrupo) {
  if(document.getElementById('checkbox_grupo['+idGrupo+']').checked) {
    grupoCarpeta=new Object();
    grupoCarpeta.id=idGrupo;
    grupoCarpeta.idSocial=document.getElementById('usuario_social_grupo['+idGrupo+']').value;
    grupoCarpeta.nombre=encodeURIComponent(document.getElementById('nombre_grupo['+idGrupo+']').value);
    grupoCarpeta.idTema=0;
    carpeta[idGrupo]=grupoCarpeta;
    ponderacionSelected(idGrupo);
    /*GAMIFICATION:START*/
    if($('#gamificacionPuntos').is(":visible")&&$('#toggleGamification').prop('checked')){
      $('#medallero-'+idGrupo).show();
    }
    /*GAMIFICATION:END*/
  } else {
    /*GAMIFICATION:START*/
    $('#medallero-'+idGrupo).hide();
    /*GAMIFICATION:END*/
    //tenemos que poner una variable bandera para que no los tomemos en cuenta...       
    delete carpeta[idGrupo];
  }
}

function ponderacionSelected(idGrupo){  //actualiza el valor de la ponderacion de las carpetas
  if(document.getElementById('checkbox_grupo['+idGrupo+']').checked) {
    grupoCarpeta = carpeta[idGrupo];
    var e = document.getElementById('idponde['+idGrupo+']');
    var strUser = e.options[e.selectedIndex].value;
    grupoCarpeta.ponderacion = strUser;
    carpeta[idGrupo]=grupoCarpeta;
  }
}

function resetMultiples() {
  $('#gruposAEscoger li input').each(function(datos){ $(this).attr('checked',false); });
  $(".pondetarea").each(function() { $(this).val("-1000"); });
  $("#fechaEntrega").appendDtpicker({
                                        "locale":"es",
                                        "calendarMouseScroll": false, 
                                        "dateFormat": "YYYY-MM-DD hh:mm",
                                        "current": "<?php echo date('Y-m-d 23:59:59'); ?>",
                                        "minuteInterval":30});
  $('#multiplesGrupos').attr('checked', false);
  /*GAMIFICATION:START*/
  $('#toggleGamification').prop('checked',false);
  /*GAMIFICATION:END*/
  multiplesGrupos();
  carpeta=new Object();
}

function toggleSinAccion(id) {
  defaultid= id;
  document.getElementById("li["+id+"]").setAttribute("class", "active");
  document.getElementById("li["+(id+1)%4+"]").setAttribute("class", "");
  document.getElementById("li["+(id+2)%4+"]").setAttribute("class", "");
  document.getElementById("li["+(id+3)%4+"]").setAttribute("class", "");
  document.getElementById("li["+(id+3)%4+"]").setAttribute("class", "");
}

function hashtags(id) {
  var dataSerialized="proceso=hashtags";

  $.ajax({
    url: 'post_actions.php',
    data: dataSerialized,
    type: 'POST',
    cache: true,
    beforeSend: function() {
      document.getElementById("loadpost").innerHTML="<div style='margin:0 0 5px 20px;'><div align='center'><img src='new_design/img/ajax-loader2.gif' /></div></div>";
      document.getElementById("reloadpost").innerHTML="<div style='margin:0 0 5px 20px;'><div align='center'><img src='new_design/img/ajax-loader2.gif' /></div></div>";
    },
    complete: function() {
      document.getElementById("loadpost").innerHTML="";
      document.getElementById("reloadpost").innerHTML='';
      document.getElementById("li["+id+"]").setAttribute("class", "active");
    },
    success: function(data) {  
      document.getElementById("allPosts").innerHTML=data;
    }
  });
}

function traeMasPosts(id, indice) {
  var dataSerialized="proceso=posts&categoria="+id+"&indice="+indice;

  $.ajax({
    url: 'post_actions.php',
    data: dataSerialized,
    type: 'POST',
    beforeSend: function() {
      document.getElementById("loadpost").innerHTML="<div style='margin:0 0 5px 20px;'><div align='center'><img src='new_design/img/ajax-loader2.gif' /></div></div>";
      if(indice !== 0) {
        document.getElementById("reloadpost").innerHTML="<div style='margin:0 0 5px 20px;'><div align='center'><img src='new_design/img/ajax-loader2.gif' /></div></div>";
      }
    },
    complete: function() {
      document.getElementById("loadpost").innerHTML="";
      if(indice !== 0) {
        document.getElementById("reloadpost").innerHTML='';
      }
      document.getElementById("li["+id+"]").setAttribute("class", "active");
    },
    success: function(data) {
      //On success
      //alert(data);
      if(indice === 0) {
        document.getElementById("allPosts").innerHTML=data;
      } else {
        document.getElementById("allPosts").innerHTML=document.getElementById("allPosts").innerHTML+data;
      }
      $('.myGallery').galleryView({
        filmstrip_position: 'right',
        panel_animation: 'crossfade',
        panel_width: 445,
        panel_height: 225,
        panel_scale: 'fit'
      });
      var math = document.getElementsByClassName("math-tex");
      MathJax.Hub.Queue(["Typeset",MathJax.Hub,math]);
      MathJax.Hub.Queue(["Rerender",MathJax.Hub,math]);
    }
  });
}

function borrarPost(id, tipo) {
  var dataSerialized="proceso=borrarPost&idPost="+id;
  var confirmacion = "¿Seguro quiere borrar esta publicación?";
  if(tipo != 0)
  {
    confirmacion = "¿Seguro quiere borrar esta publicación y su contenido de la plataforma?";
  }

  if(confirm(confirmacion)) {
    $.ajax({
      url: 'post_actions.php',
      data: dataSerialized,
      type: 'POST',
      success: function(data) {
        //On success
        document.getElementById("post["+id+"]").innerHTML="";
      }
    });
  }
}

var Mycontenido='';
var etec=0;

function confirmacionPost() {
  etec=1;
  Mycontenido = document.getElementById('postArea').value;
  if(Mycontenido == '') {
    alert('Debes incluir texto en tu publicación');
  } else {
    $('#muronews').html('<div style="font-family:verdana;padding:20px;border-radius:10px;border:10px solid #9b9b9b;'+
      '<p align="center"<H2>Este contenido sera visible para todo público en la plataforma </H2><break>'+
      '<p align="left"><H3>¿Deseas continuar?</H3></p>'+
      '<div align="right" id="loading"><a href="javascript:hacerPost();" class="btn btn-small btn-primary disable"><H3>Sí</H3></a>&nbsp;'+ '<break><a href="javascript:cancelarPost();" class="btn btn-small btn-warning"><H3>No</H3></a></div>'+
    '</div>');
  }
}

function cancelarPost() {
  $('#muronews').html('<div class="row paddingPost " id="muronews">'+
    '<div class="well" >'+
    '<textarea name="publicacion"  class="tagged_text span12 input-xlarge" placeholder="Comparte con tus compañeros"  id="postArea" ></textarea>'+
    '<br/>'+
    '<div class="row-fluid">'+
    '<div class="span8" >'+
    '<span id="file-uploader-demo1" ></span>'+
    '</div>'+
    '<div class="span4" >'+
    '<a class="btn btn-small btn-success pull-right" href="#" onclick="confirmacionPost()"><h4>Publicar</h4></a>'+
    '</div>'+
    '</div>'+
    '</div>'+
  '</div>');  
  path=''; 
  path_names = '';
  var uploader = new qq.FileUploader({
    element: document.getElementById('file-uploader-demo1'),
    action: 'valum/server/php.php',
    debug: true,
    template: '<div class="qq-uploader">' + '<div class="qq-upload-button"><img src="new_design/img/documento.png" width"30" height"25" alt="Fotos" /></div>' +
      '<ul  id=\'ullista\' class="qq-upload-list"></ul>' +
    '</div>',
    multiple: true,
    allowedExtensions: ['jpg', 'jpeg', 'gif', 'png', 'bmp', 'tiff', 'zip', 'rar', '7z', 'ace', 'mp3', 'ogg', 'ogm', 'm4a', 'aac', 'wma', 'wav', 'aiff', 'flac', 'alac', 'ape', 'm4v', 'mp4', 'avi', 'wmv', 'mov', '3gp', 'mkv', 'rmbv', 'rmv', 'vob', 'mpeg', 'mpg', 'mpeg2', 'mpg2', 'doc', 'docx', 'odt', 'xls', 'xlsx', 'ods', 'csv', 'ppt', 'pptx', 'odp', 'pdf', 'xps','mpp','pod', 'aia', 'apk'],
    onSubmit: function(id, fileName){
        
      HagoPost=1;
    },
    onComplete: function(id, fileName, responseJSON){
      var fileNameServer = responseJSON['filename'];
      path+=fileNameServer+'qqq';
      path_names+=fileName+'qqq';
      HagoPost= 0;
    }
  });    
}

function postEnriquecido() {
  if($('#checkEnriquecido').attr('checked') == 'checked') {
    //LATIN!
    enriquecido=1;
    CKEDITOR.replace( 'postArea',{
      filebrowserImageUploadUrl: 'valum/server/php.php',
      filebrowserUploadUrl: 'valum/server/php.php?CKEditor=postArea&CKEditorFuncNum=1&langCode=es',
    });
  } else {
    enriquecido=0;
    //window.setTimeout(function(){CKEDITOR.instances.postArea.setData(''); },10);
    for(name in CKEDITOR.instances) {
      CKEDITOR.instances[name].destroy() ;
    }
    var html = $($('#postArea').val()).text();
    $('#postArea').val(html);
  }
}

function hacerPost() {
  var fEntregaT = $("#fechaEntrega").val();
  
  /*GAMIFICATION:START*/ 
  var puntos = $('#scorePOST').val() != ''? $('#scorePOST').val() : -1;
  var excelencia = -1;
  var puntajeExcelencia = -1;
  if($('#puntajeExcelenciaPostCheckbox').attr('checked') == 'checked'){
    if($('#puntajeExcelenciaPost').val()==''){
      alert('Debe especificar el puntaje a obtener por excelencia.');
      return;
    }
    excelencia = $('#calificacionMinimaPost option:selected').val();
    puntajeExcelencia = $('#puntajeExcelenciaPost').val();
  }
  /*GAMIFICATION:END*/

 if(HagoPost > 0) {
    alert('El archivo se esta cargando, espere un momento...');
    return;
  }
    
    path_names=escape(path_names);
  
  if(etec == 1) {
    var contenido = Mycontenido;
  } else {
    if(enriquecido == 1) {
      //LATIN!
      for(instance in CKEDITOR.instances) {
        CKEDITOR.instances[instance].updateElement();
      }
    }


    var contentPost = $('#postArea').val();
    contentPost = contentPost.replace(/<[\/]{0,1}(body|BODY)[^><]*>/g,"");
    contentPost = contentPost.replace("<body>", "<p>");
    contentPost = contentPost.replace("</body>", "</p>");

    var contenido=encodeURIComponent(contentPost);
    
  }

  if(contenido.length == 0) {
    alert('Por favor escribe algo en la caja de comentarios para poder publicar.'); 
    return;
  }

  carpetaStringify=JSON.stringify(carpeta);
  if(document.getElementById('forzarAMultiples')) {
    if(carpetaStringify == '{}') {
      alert('Debes publicar al menos a un '+window.labelGrupo+'.');
      document.getElementById('multiplesGrupos').checked=1;
      multiplesGrupos();
      return;
    }
  }
  
  var dataSerialized="proceso=hacerPost&contenido="+contenido+"&carpeta="+carpetaStringify+"&path="+path+'&path_names='+path_names+'&enriquecido='+enriquecido;
  if(tarea == 1) {
    //tenemos una tarea muchachos
    if($('#fechaEntrega').val() == '') {
      alert('Es necesario poner una fecha de entrega a la tarea antes de publicarla.');
      return;
    }

    tiempoEntrega=new Date(fEntregaT);
    actual=new Date();
    if(tiempoEntrega<actual){
      alert("La fecha de entrega que quieres asignarle a la tarea ya pas\363");
      return;
    }

    if(carpetaStringify == '{}') {
      alert('Una tarea tiene que ir dirigida al menos a un '+window.labelGrupo+'.');
      return;
    }

    var tipoTarea=0;
    if($('#tipoTarea').length>0)
      tipoTarea=$('#tipoTarea').val();

    /*GAMIFICATION:START*/
    // - Added to var:dataString theses params:fk_idmedal,puntos,excelencia,puntajeExcelencia,idgrupo.
    /*GAMIFICATION:END*/

    var dataSerialized="proceso=hacerPost&contenido="+contenido+"&carpeta="+carpetaStringify+"&path="+path+'&path_names='+path_names+'&fechaEntrega='+$('#fechaEntrega').val()+'&fechaInicio='+$('#fechaInicio').val()+'&enriquecido='+enriquecido+'&tipoTarea='+tipoTarea+"&puntos="+puntos+"&excelencia="+excelencia+"&puntajeExcelencia="+puntajeExcelencia+"&idgrupo=";
    dataSerialized = ($('#diasRetraso').length > 0 && $('#diasRetraso').is(":checked"))?dataSerialized+'&diasRetraso='+$('#diasRetraso').val():dataSerialized;

  }

  /*GAMIFICATION:START*/
  if($('#gamificacionPuntos').is(":visible")){
    $('#gamingDivTareaMuro').hide();
    cleanGamification();
    if($('#toggleGamification').prop('checked')){
      if(!jQuery.isEmptyObject(carpeta)){
        $.each(carpeta, function(idgrupo, element) {
          $('#medallero-'+idgrupo).hide();
          cambiarimgPOSTSelectedMuro(idgrupo);
        });
      }
    }
  }
  /*GAMIFICATION:END*/

  carpeta=new Object();
  
  if(document.getElementById('gruposAEscoger')) {
    resetMultiples();
  }

  /*GAMIFICATION:START*/
  if($('#gamificacionPuntos').is(":visible")){
    $('#multiplesGrupos').attr('checked', true);
    multiplesGrupos();
  }
  /*GAMIFICATION:END*/

  $.ajax({
    url: 'post_actions.php',
    data: dataSerialized,
    type: 'POST',
    beforeSend: function(){
      $('#botonPublicar').html('<img src="images/ajax-loader.gif" />');
    },
    success: function(data) {
      $('#ullista').html('');
      path ='';
      path_names ='';
      $('#botonPublicar').html('<a class="btn btn-small btn-success botonPersonalizadoBootstrap" id="publicarATag" href="javascript:hacerPost();">Publicar</a>');
      //console.log(data);
      if(enriquecido == 1) {
        //LATIN!
        CKEDITOR.instances.postArea.setData('');
      }

      document.getElementById("allPosts").innerHTML=data+document.getElementById("allPosts").innerHTML;
      $('.myGallery').galleryView({
        filmstrip_position: 'right',
        panel_animation: 'crossfade',
        panel_width: 445,
        panel_height: 225,
        panel_scale: 'fit'
      });
      var math = document.getElementsByClassName("math-tex-new");
      console.log(math);
      MathJax.Hub.Queue(["Typeset",MathJax.Hub,math]);
      MathJax.Hub.Queue(["Rerender",MathJax.Hub,math]);
      
      if(etec == 1) {
        $('#muronews').html('<div class="row paddingPost " id="muronews">'+
                '<div class="well" >'+
                    '<textarea name="publicacion"  class="tagged_text span12 input-xlarge" placeholder="Comparte con tus compañeros"  id="postArea" ></textarea>'+
                    '<br/>'+
                    '<div class="row-fluid">'+
                    '<div class="span8" >'+
                      '<span id="file-uploader-demo1" ></span>'+
                    '</div>'+
                      '<div class="span4" >'+
                    '<a class="btn btn-small btn-success pull-right" href="#" onclick="confirmacionPost()"><h4>Publicar</h4></a>'+
                  '</div>'+
                '</div>'+
                '</div>'+
             '</div>');
        path="";
        path_names = "";
        var uploader = new qq.FileUploader({
          element: document.getElementById('file-uploader-demo1'),
          action: 'valum/server/php.php',
          debug: true,
          template: '<div class="qq-uploader">' + '<div class="qq-upload-button"><img src="new_design/img/documento.png" width"30" height"25" alt="Fotos" /></div>' +
            '<ul  id=\'ullista\' class="qq-upload-list"></ul>' +
          '</div>',
          multiple: true,
          onSubmit: function(id, fileName) {
            HagoPost=1;
          },
          onComplete: function(id, fileName, responseJSON) {
            var fileNameServer = responseJSON['filename'];
            path+=fileNameServer+'qqq';
            path_names+=fileName+'qqq';
            HagoPost= 0;
          }
        });
      }
      //On success
      document.getElementById("postArea").value="";
      $('#selcGrupoPond option[value=0]').attr('selected', 'selected');
      $('#divSelParcial').html('');
      document.getElementById('divSelParcial').style.display='none';

    }
  });
}

var normalize = (function() {
  var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç",
  to = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
  mapping = {};

  for(var i = 0, j = from.length; i < j; i++ )
  mapping[ from.charAt( i ) ] = to.charAt( i );

  return function( str ) {
    var ret = [];
    for( var i = 0, j = str.length; i < j; i++ ) {
      var c = str.charAt( i );
      if(mapping.hasOwnProperty( str.charAt( i ))) {
        ret.push( mapping[ c ] );
      } else {
        ret.push(c);
      }
    }
    return ret.join('');
  }
})();

/*
  function buscarCurso(nombreBuscar) {
    if(nombreBuscar) {
      nombre = normalize(nombreBuscar);
    } else {
      nombre = normalize($('#buscarProgramasModulos').val());
    }

    buscar = $('input[name=radioBuscar]:checked').val();

    if(nombre == "") {
      $(".periodos").css('display', 'block');
      $(".grupos").css('display', 'block');
    } else {
      $(".periodos").css('display', 'none');
    }
    $(".collapse").collapse('hide');
    $(".chevron").removeClass('icon-chevron-down');
    $(".chevron").addClass('icon-chevron-right');
    $(".brr li").show();
    periodoPrevio = -1;

    if(nombre.length > 0) {
      nombre = nombre.toUpperCase();
      contadorGrupos = ($('.nombreEscondido').length)-1;

      $.each($('.nombreEscondido'), function(index, element) {
        value = normalize($(element).val().toUpperCase());
        periodo = $(element).attr('data-periodo');

        if(periodoPrevio == -1) {
          periodoPrevio = periodo;
        }

        if(buscar == 1) {
          if(value.search(nombre) >= 0) {
            $("#periodo"+periodo).css('display', 'block');
            if($("#dash_"+periodo).length > 0) {
              $("#dash_"+periodo).collapse('show');
              $("#dash_"+periodo).css('height', 'auto');
            } else {
              $("#dash_"+periodo+"_actuales").collapse('show');
              $("#dash_"+periodo+"_actuales").css('height', 'auto');
            }
            $("#chevron"+periodo).removeClass('icon-chevron-right');
            $("#chevron"+periodo).addClass('icon-chevron-down');
          } else {
            $(element).parent().parent().parent().parent().hide();//Ocultando li
          }
        } else if(buscar == 0 && (periodo != periodoPrevio || index == contadorGrupos)) {
          nombrePeriodo = normalize($('#nombrePeriodo'+periodoPrevio).val().toUpperCase());

          if(nombrePeriodo.search(nombre) >= 0) {
            $("#periodo"+periodoPrevio).css('display', 'block');
            $('.periodo-'+periodoPrevio).css('display', 'block');

            if($("#dash_"+periodoPrevio).length > 0) {
              $("#dash_"+periodoPrevio).collapse('show');
              $("#dash_"+periodoPrevio).css('height', 'auto');
            } else {
              $("#dash_"+periodoPrevio+"_actuales").collapse('show');
              $("#dash_"+periodoPrevio+"_actuales").css('height', 'auto');
            }
            $("#chevron"+periodoPrevio).removeClass('icon-chevron-right');
            $("#chevron"+periodoPrevio).addClass('icon-chevron-down');
          }

          periodoPrevio = periodo;
        }
      });
    }
  }
*/
function borrarComentario(id, idPost) {
  var dataSerialized="proceso=borrarComentario&idComentario="+id;

  if(confirm("¿Seguro quiere borrar este comentario?")) {
    numeroComentarios = parseInt($('#numeroComentarios'+idPost).html());
    $('#numeroComentarios'+idPost).html(--numeroComentarios);
    $.ajax({
      url: 'post_actions.php',
      data: dataSerialized,
      type: 'POST',
      success: function(data) {
        //On success
        document.getElementById("comentario["+id+"]").innerHTML="";
      }
    });
  }
}

//Hacer Post
function createDiv(id) {
  $.ajax({
    url: 'ajax/test.html',
    success: function(data) {
      //On success
      document.getElementById(id).innerHTML="";
    }
  });

  var textoPost = document.myForm.publicacion.value;
  if(textoPost == "") {
    alert("No has escrito nada");
  } else {
    idComentario++;
    //Agregar Post
    var post = "<div id='post["+postId+"]'>"+
           "<div class='row paddingPost'>"+
         "<div class='span1'>"+
         "<a href'#' name='imagenPost'><img src='img/foto.png' width='50' height='40' alt='Imagen Post' /></a></div>"+
         "<div class='span11'>"+
         "<a class='nombres' href'#'>Gerardo Saenz</a>"+
         "<a href='#'><img src='img/documento.png' width'30' height'25' alt='icono post'/></a>"+
         "<a class='nombres' href'#'>Juan Cantu</a>"+
         "<button class='close' onclick='borrarPost("+postId+")'>&times;</button><br />"+
         "<p id='postTexto'>"+textoPost+"</p>"+
       "</div>"+
       //Video
           "<br><div class='row paddingVideo'>"+
           "<div class='span3'>"+
       "<video controls width='150' height='100' poster='img/foto-video.png'>"+  
         "</video>" +     
           "</div>"+
         "<div class='span8'>"+
         "<a href='#'</a>Descripcion del video</a><br>"+
           "www.youtube.com"+
           "</div>"+
           "</div>"+ 
           "<div class='row paddingVideo'>" + 
          //Comentario Agradecer
           " <div class='span4'>"+
         "<a href'Comentar'>Comentar</a>"+
         "<span style='padding-left:18px;'><a href'Comentar'>Agradecer</a></span>"+
         "</div>"+
           "</div>"+
           "<a class='row paddingVideo' href='#' data-toggle='collapse' data-target='#mostrar'>Ver Todos los Comentarios</a>"+
           "<div id='comentarios' style='padding-left:10%;'>"+
           "<div class='well'>"+ 
            //Comentario WELL
       "<div class='collapse in' id='mostrar'>"+
         "<div id='hacerComentario["+idComentario+"]'"+
          //PRIMER POST
           "</div>" +
           "</div>"+
           "</div>"+
            //Comentario Postear
           "<form name='formComentario'>"+
           "<div class='paddingPost'>"+ 
           "<input type='text' name='comentario' class='span12' placeholder='Escribe un comentario'>"+
           "<a class='btn btn-small btn-primary pull-right' onclick='agregarComentario(1)'> Comentar </a>"+
         "</div>"+
           "</form>"+ 
           "</div>"+
           "</div>"+
           "</div>"+//row padddingVideo 
           "</div>"+
           "<hr />";
           
           
    document.getElementById("post[1]").innerHTML=post + document.getElementById("post[1]").innerHTML;
    textoPost="";
    postId++;
  }             
}

function agregarComentario(idPost,  idUsuario) {
  numeroComentarios = parseInt($('#numeroComentarios'+idPost).html());
  $('#numeroComentarios'+idPost).html(++numeroComentarios);

  var contenido=document.getElementById('comentario['+idPost+']').value;
  var dataSerialized="proceso=comentar&idPost="+idPost+"&contenido="+contenido+"&idUsuario="+idUsuario;

  $.ajax({
    url: 'post_actions.php',
    data: dataSerialized,
    type: 'POST',
    success: function(data) {
      //On success
      document.getElementById('comentario['+idPost+']').value="";
      document.getElementById('comentariosDiv['+idPost+']').innerHTML=document.getElementById('comentariosDiv['+idPost+']').innerHTML+data;
    }
  });
}

function verMas() {
  scrolling= scrolling+10;
  traeMasPosts(defaultid, scrolling);
}

function busqHashtag() {
  var bhash= $('#hashtext').val();
  bhash= bhash.replace('#','');
  
  if(bhash=='') {
    alert('Introduce un hashtag para realizar la busqueda.');
    return;
  }

  $.ajax({
    type: 'POST',
    url: 'post_actions.php',
    data: 'proceso=busqH&hash='+bhash,
    cache: false,
    success:function(res) {
      $('#busqHash').html(res);
      $('.myGallery').galleryView({
        filmstrip_position: 'right',
        panel_animation: 'crossfade',
        panel_width: 445,
        panel_height: 225,
        panel_scale: 'fit'
      });
    }
  });
}

//Funcion agregada Gsaenz 17/12/12
function busqHashtagReloaded() {
  var bhash= $('#hashtext').val();
  bhash= bhash.replace('#','');
  
  if(bhash == '') {
    alert('Introduce un hashtag para realizar la busqueda.');
    return;
  }

  $.ajax({
    type: 'POST',
    url: 'post_actions.php',
    data: 'proceso=buscaHashtag&hash='+bhash,
    cache: false,
    success:function(res) {
      $('#hashTagContainer').html(res);
      $('.myGallery').galleryView({
        filmstrip_position: 'right',
        panel_animation: 'crossfade',
        panel_width: 445,
        panel_height: 225,
        panel_scale: 'fit'
      });
    }
  });
}

function busqHashtagPost(hash) {
  hash= hash.replace('#','');
  
  $.ajax({
    type: 'POST',
    url: 'init.php',
    data: 'accion=busqH&hash='+hash,
    cache: false,
    success:function(res) {
      $('#busqHash').html(res);
      $('.myGallery').galleryView({
        filmstrip_position: 'right',
        panel_animation: 'crossfade',
        panel_width: 445,
        panel_height: 225,
        panel_scale: 'fit'
      });
    }
  });
}

//Creado por GSaenz 17/12/12
function busqHashtagPostReloaded(hash) {
  toggleSinAccion(3);
  bhash= hash.replace('#','');

  $.ajax({
    type: 'POST',
    url: 'post_actions.php',
    data: 'proceso=hashtags&hash='+bhash,
    cache: false,
    success:function(res) {
      $('#allPosts').html(res);
      $('.myGallery').galleryView({
        filmstrip_position: 'right',
        panel_animation: 'crossfade',
        panel_width: 445,
        panel_height: 225,
        panel_scale: 'fit'
      });
    }
  });
}

function GetURLPearson(un, ul1,ul2, ue, ui, i, ic,ik) {
    var urlInitial = "http://www.biblionline.pearson.com/Services/GenerateURLAccess.svc/GetUrl?firstname=" + un + "&lastname1=" + ul1 + "&lastname2=" + ul2 + "&email=" + ue + "&ip=" + ui + "&idInstitution=" + i + "&idCampus=" + ic + "&institutionKey=" + ik + "&$callback=successCall&$format=json";
    $.ajax({
        dataType: "jsonp",
        contentType: "application/json; charset=utf-8",
        url: urlInitial,
        jsonpCallback: "successCall",
        error: function () {
            alert("Error");
        },
        success: successCall
    });

    function parseJSON(jsonData) {
        return jsonData.Message;
    }

    function successCall(result) {  
        res = parseJSON(result.GetUrlAccessResult);
        location.replace(res); //Redirecciona a la página de la BV.
    }
};

function toggleGruposPeriodo(idPeriodo){
    $('.periodo_toggle_'+idPeriodo).slideToggle("fast","swing",null);
    
    if($('#pointer_'+idPeriodo).hasClass("icon-chevron-right")){
        $('#pointer_'+idPeriodo).removeClass("icon-chevron-right");
        $('#pointer_'+idPeriodo).addClass("icon-chevron-down");
    }
    else{
        $('#pointer_'+idPeriodo).removeClass("icon-chevron-down");
        $('#pointer_'+idPeriodo).addClass("icon-chevron-right");
    }
}

function elegirGrupo(grupo) {
  if(grupo == 0){
    $('#divSelParcial').html('');
      document.getElementById('divSelParcial').style.display='none';
  }else{
    $.ajax({
      type: 'POST',
      url: 'post_actions.php',
      data: 'proceso=parcial&grupo='+grupo,
      cache: false,
      success:function(res) {
        $('#divSelParcial').html(res);
        document.getElementById('divSelParcial').style.display='block';
        //$('#divSelParcial').style.display='block';
      }
    });
    }
}
