function selectMenuIcon(ele){
    var value = $(ele).find('i').attr('class');
    $('#menuIconName').val(value);
    $('#v_s_i').html('<i class="'+value+'" ></i>');
    $('#v_s_i').show();
    Custombox.close();
}