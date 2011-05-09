//JQuery is required
$(document).ready(function(){
    
});

function test_request(){
    var url = $('#edit-url').val();
    var method = $('#edit-method').val();
    var paramets = $('#edit-paramats').val();
    if(method=='GET'){
        $.ajax({
            type: method,
            url: url+'?'+paramets,
            success: function(data) {
                $('#request-result').html(data);
            }
        });
    }else if(method=="POST"){
        var p = jQuery.parseJSON("{" + paramets + "}");
        $.ajax({
            type: method,
            url: url,
            data: p,
            success: function(data) {
                $('#request-result').html(data);
            },
            error: function(jqXHR, textStatus, errorThrown){
                $('#request-result').html(jqXHR);
            }
        });
    }
}
