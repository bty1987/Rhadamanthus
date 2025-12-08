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

        com.post(api.data.queryGoodsPackage,{"goodsPackage.pid": gid},function(res){

            if(!res.goodsPackages || res.goodsPackages.length == 0){
                container.html('<div class="alert alert-warning"><i class="icon-warning-sign"></i> 该套餐暂无商品明细</div>');
                model.modal("show");
                return;
            }

            // 创建列表容器
            var $listGroup = $('<ul></ul>').addClass('list-group').css('margin-bottom', '0');

            $.each(res.goodsPackages, function(i, v){
                // 创建列表项
                var $item = $('<li></li>').addClass('list-group-item').css({
                    'margin-bottom': '10px',
                    'border-radius': '4px',
                    'border-left': '4px solid #87b87f'
                });

                // 商品标题行
                var $header = $('<div></div>').css({
                    'display': 'flex',
                    'justify-content': 'space-between',
                    'align-items': 'center',
                    'margin-bottom': '10px',
                    'padding-bottom': '8px',
                    'border-bottom': '1px solid #e7e7e7'
                });

                var $title = $('<h4></h4>').css({
                    'margin': '0',
                    'color': '#478fca',
                    'font-size': '15px',
                    'font-weight': 'bold'
                }).html('<i class="icon-gift orange"></i> 套餐商品 ' + (i + 1));

                var $goodsName = $('<span></span>').css({
                    'color': '#666',
                    'font-size': '14px'
                }).html(v.goods.name);

                $header.append($title).append($goodsName);

                // 商品属性列表
                var $properties = $('<div></div>').addClass('row').css({
                    'margin': '0'
                });

                var list = [
                    ["商品编号", v.goods.no, "blue"],
                    ["条形码", v.goods.barcode, "grey"],
                    ["颜色", v.color.name, "green"],
                    ["规格", v.format.info, "purple"],
                    ["单位", v.goods.measurementUnit, "orange"]
                ];

                $.each(list, function(j, k){
                    var $col = $('<div></div>').addClass('col-xs-12 col-sm-6').css({
                        'padding': '5px 10px'
                    });

                    var $label = $('<span></span>').css({
                        'display': 'inline-block',
                        'width': '80px',
                        'font-weight': 'bold',
                        'color': '#555'
                    }).html(k[0] + ': ');

                    var $value = $('<span></span>').addClass(k[2]).html(k[1] || '-');

                    $col.append($label).append($value);
                    $properties.append($col);
                });

                // 组装列表项
                $item.append($header).append($properties);
                $listGroup.append($item);
            });

            // 添加统计信息
            var $footer = $('<div></div>').addClass('alert alert-info').css({
                'margin-top': '10px',
                'margin-bottom': '0'
            }).html('<i class="icon-info-sign"></i> 共包含 <strong>' + res.goodsPackages.length + '</strong> 个套餐商品');

            container.append($listGroup).append($footer);

            model.modal("show");
        });
    }

};