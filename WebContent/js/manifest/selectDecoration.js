
$(function(){

    var $popup = $('#viewDecoration');
    var orderId = $popup.attr('data-orderId');
    if(orderId==""||orderId==null||orderId==0){
        layer.alert('订单不存在', {
            icon: 0,
            skin: 'layer-ext-moon' //该皮肤由layer.seaning.com友情扩展。关于皮肤的扩展规则，去这里查阅
        },function(){
            layer.closeAll();
        })
    }else{
        com.post(api.decoration.queryDecorationOrderForCommonByOrderId,{
            "decorationOrder.orderId": orderId
        },function(res){
            var $table = $('table.table');
            $table.css({'margin-top':'6%'})
            var $td = $('table.table td');
            $td.css('text-align','right');
            var $th = $('table.table th');
            $th.css('text-align','center');
            var v = res.decorationOrder;
            $table.find('#villageName').next().text(v.village.villageName+" "+ v.houseNumber);
            $table.find('#designDepartment').next().text(v.designDepartment);
            $table.find('#businessDepartment').next().text(v.businessDepartment);
            $table.find('#houseArea').next().text(v.houseArea+"m²");
            $table.find('#measureTime').next().text(v.measureTime==null||""?"----":v.measureTime);
            $table.find('#status').next().text(v.status);

            $table.find('#customerName').next().text(v.customer.customerName);
            $table.find('#designer').next().text(v.designer);
            $table.find('#salesman').next().text(v.salesman);
            $table.find('#orderTotalPrice').next().text(v.orderTotalPrice);
            $table.find('#contractTime').next().text(v.contractTime==null||""?"----":v.contractTime);
        },function(){
            var $table = $('table.table');
            $table.remove();
            layer.alert('订单不存在', {
                icon: 0,
                skin: 'layer-ext-moon'
            },function(){
                layer.closeAll();
            })
        });
    }

});
