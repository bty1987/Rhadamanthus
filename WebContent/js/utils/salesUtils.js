var salesUtils = {

    addspan: function (px, name, value) {
        var $10pxdiv = $('<div></div>').css({
            'display': 'inline-block',
            'margin-left': '10px'
        });
        var $40pxdiv = $('<div></div>').css({
            'display': 'inline-block',
            'margin-left': '40px'
        });
        var $nameSpan = $('<b></b>').html(name);
        var $valueSpan = $('<span></span>').text(value);

        if (px == '40') {
            return $40pxdiv.append($nameSpan).append($valueSpan);
        } else if (px == '10') {
            return $10pxdiv.append($nameSpan).append($valueSpan);
        } else if (px == '0') {
            return $10pxdiv.append($('<h3></h3>').html(value));
        }
    },
    showPackage: function(model, container, gid){
        
        container.html('');
        
        com.post(api.inventory.queryPackage,{"goodsPackage.pid": gid},function(res){
            $.each(res.goodsPackages, function(i, v){
                var list = [
                    ["商品编号: ", v.goods.no],
                    ["商品名称: ", v.goods.name],
                    ["条形码: ", v.goods.barcode],
                    ["颜色: ", v.color.name],
                    ["规格: ", v.format.info],
                    ["单位: ", v.goods.measurementUnit]
                ];
                $.each(list,function(j, k){
                    container.append(salesUtils.addspan(40,k[0], k[1]));
                });
            });
            
            model.modal("show");
        });
    }

};