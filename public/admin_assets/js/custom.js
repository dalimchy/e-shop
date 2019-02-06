function selectMenuIcon(ele){
    var value = $(ele).find('i').attr('class');
    $('#menuIconName').val(value);
    $('#v_s_i').html('<i class="'+value+'" ></i>');
    $('#v_s_i').show();
    Custombox.close();
}

function updateMenu(ele,type){
    if(type == 'status'){
        if($(ele).attr('data-status') == 'active'){
            var data = {type:"status",id:$(ele).parent('td').attr('data-id'),value:0}
            ajaxMenuUpdata(data);
            $(ele).removeClass('btn-success').addClass('btn-danger').attr('data-status', 'inactive').text('In-Active');
        }else{
            var data = {type:"status",id:$(ele).parent('td').attr('data-id'),value:1}
            ajaxMenuUpdata(data)
            $(ele).removeClass('btn-danger').addClass('btn-success').attr('data-status', 'active').text('Active');
        }
    }
}


function ajaxMenuUpdata(data){
    $.ajax({
        type: "POST",
        url: '/dashboard/menu/menu_update',
        data: data,
        error: function() {
            return false;
         },
         success: function(res) {
             if(res.msg == 'success'){
                 return true;
            }
        }
    });
}