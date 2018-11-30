
$(function(){

    var $popup = com.focusPage('#viewOrder');
    var orderId = $popup.attr('data-id');
    if(orderId==0){
        layer.alert('客户ID为0', {
            icon: 0,
            skin: 'layer-ext-moon' //该皮肤由layer.seaning.com友情扩展。关于皮肤的扩展规则，去这里查阅
        },function(){
            layer.closeAll();
        })
    }else{
        com.post(api.data.queryCustomerById,{
            "customer.id": orderId
        },function(res){
            var $table = com.focusPage('table.table');
            $table.css({'margin-left': '10%','margin-top':'6%'});
            var $td = $('table.table td');
            $td.css({'text-align':'right','width':'40%'});
            var $th = $('table.table th');
            $th.css('text-align','center');
            var v = res.customer;
            $table.find('#id').next().text(v.id);
            $table.find('#customerName').next().text(v.customerName);
            $table.find('#gender').next().text(v.gender);
            $table.find('#phone').next().text(v.phone);
            $table.find('#qq').next().text(v.qq==null||""?"----":v.qq);
            $table.find('#wechat').next().text(v.wechat==null||""?"----":v.wechat);

            $table.find('#email').next().text(v.email==null||""?"----":v.email);
            $table.find('#address').next().text(v.address);
            $table.find('#relationshipType').next().text(v.relationshipType);
            $table.find('#balance').next().text(v.balance==null||""?"----":v.balance);
        },function(){
            var $table = $('table.table');
            $table.remove();
            layer.alert('客户不存在', {
                icon: 0,
                skin: 'layer-ext-moon'
            },function(){
                layer.closeAll();
            })
        });
    }

});

