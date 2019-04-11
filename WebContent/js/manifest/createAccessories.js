jQuery(function () {

    if (jQuery().datepicker) {
        com.focusPage('.date-picker').datepicker({
            format: 'yyyy-mm-dd',//yyyy-mm-dd hh:ii,
            autoclose:true
        });
    }

    var accessories = {
        typeahead: {
            goodes: "goodes",
            goods: "goods",
            gid: "goods.gid",
            pricegid: "price.gid"
        },
        gids: null,
        gtype: null,
        userId: null,
        salesmanid: null,
        flag: true,
        fetchTime:null,
        
        postData: {},
    };

    //销售项区 自动赋值
    com.focusPage('#goodsName').typeahead({
        url: api.inventory.queryGoodsByName,
        list: [],
        postData: {},
        source: function (query, process) {
            var params = $.extend({
                "goods.name": query,
                "goods.pinyin": query,
                "goods.no": query
            }, this.options.postData);
            com.post(this.options.url, params, $.proxy(this.options.callback, this));
        }, matcher: function (item) {
            return true;
        }, callback: function (data) {
            accessories.flag = true;
            this.options.list = data['goodes'];
            this.flprocess(this.options.list, 'gid', 'name');
        },
        isResultTypeMap: true,
        flupdater: function (k, v) {

            var list = this.options.list;

            $.each(list, function (index, val) {
            	
                if (val.gid == k) {
                	
                	if(com.focusPage('li[data-gid="' + val.gid +'"]').length != 0){
                		com.showAlert(com.error, "商品已存在");
                		v = ""
                		return false;
                	}
                    
                    com.focusPage("#goodsHidden").attr('data-gid', val.gid).attr('data-type', val.type);
                    
                    com.focusPage('#goodsName').attr('data-name', val.name);
                    com.focusPage('#goodsNo').attr('data-no',val.no).val(val.no);
                    com.focusPage('#category').attr('data-category', val.category).val(val.category);
                    com.focusPage('#brand').attr('data-brand', val.brand).val(val.brand);
                    com.focusPage('#measurementUnit').attr('data-measurementUnit', val.measurementUnit).val(val.measurementUnit);
                }
            });

            return v;
        }
    });

    com.focusPage("#add").click(function () {
    	
    	if(com.validate("left", "left")){
    		return false;
    	}
    	
    	var gid = com.focusPage('#goodsHidden').attr('data-gid');
    	var type = com.focusPage('#goodsHidden').attr('data-type');
    	
    	var name = com.focusPage('#goodsName').attr('data-name');
    	var no = com.focusPage('#goodsNo').attr('data-no');
    	var category = com.focusPage('#category').val();
    	var brand = com.focusPage('#brand').val();
    	var measurementUnit = com.focusPage('#measurementUnit').val();
    	var num = com.focusPage('#num').val();
    	
        var $liList = $('<li></li>').addClass('list-group-item').attr("data-gid", gid).attr("data-num", num);
        var $h4 = $('<h4></h4>').html(name + ' ' + no).attr('gid', gid);

        var $delete = $('<div></div>').addClass('pull-right action-button').append($('<a></a>').addClass('btn btn-danger btn-minier').html('删除'));
        var $query = $('<div></div>').css('margin-right', '5px').addClass('pull-right action-button').append($('<a></a>').addClass('btn btn-primary btn-minier').html('查看')).click(function () {
            openPackageGoods(gid);
        });

        $h4.append($delete).appendTo($liList);
        if (accessories.gtype == 1) {
            $h4.append($query);
        }
        
        $liList.append(addSpan('品类 : ', 's_category', category, " ", 'b_category', null)).append(addSpan('品牌 : ', 's_brand', brand, " ", 'b_brand', null)).append(addSpan('单位 : ', 's_unit', measurementUnit, " ", 'b_unit', null)).append(addSpan('数量 : ', 's_number', num, 'red', 'b_number'));
        com.focusPage('#accessoriesItemList').append($liList);
        
        com.focusPage('#left').find('input').val("");
        com.focusPage('#left').find('select').empty();
        com.focusPage('#goodsName').removeAttr('data-name');
        com.focusPage('#category').removeAttr('data-category');
        com.focusPage('#brand').removeAttr('data-brand');
        com.focusPage('#measurementUnit').removeAttr('data-measurementUnit');
        
        $delete.click(function () {
        	
            var $this = $(this);
            
            $this.parents('.list-group-item').remove();
            
            com.focusPage('.list-group-item:last').css("border-bottom", "solid 1px");
        });
    });

    com.focusPage('#refresh').click(function () {
        com.focusPage('#left').find('input').popover('destroy').css('border-color', "#b5b5b5").val("");
        com.focusPage('#left').find('select').empty();
    });

    function addSpan(sValue, sclass, bValue, color, attrs, addData) {
        var $span = $('<span></span>').addClass(sclass);
        var $b = $('<b></b>');
        if (sValue != null) {
            $span.html(sValue);
        }
        if (bValue != null) {
            $b.html(bValue);
        }
        if (color != null) {
            $b.addClass(color + " " + attrs).attr('addData', addData);
        }
        $span.append($b);
        return $span;
    }
    
    com.focusPage('#orderId').on("change", function () {
    	
    	var orderId = com.focusPage('#orderId').val();

        var option = {
        	"decoration.orderId": orderId
        };
        
        com.post(api.decoration.queryDecorationForCommonByOrderId, option, function (data) {

            com.focusPage("#supervisorName").val(data.decoration.supervisor.userId != null ? data.decoration.supervisor.currentName : "---");
            com.focusPage("#orderAddr").val(data.decoration.house.village.name + " " + data.decoration.house.houseNumber);

            accessories.userId = data.decoration.supervisor.userId;
            
            accessories.postData["orderId"] = orderId;
            accessories.postData["accessories.supervisor.userId"] = data.decoration.supervisor.userId;
            accessories.postData["accessories.house.hid"] = data.decoration.house.hid;
            accessories.postData["accessories.dompanys"] = data.decoration.dompany;

        }, function (e) {
            com.showAlert(com.warning, "装修单不存在!");
            
            com.focusPage("#supervisorName").val(null);
            com.focusPage("#orderAddr").val(null);
        });
    });

    com.focusPage('#submit').click(function () {
    	
    	var $list = com.focusPage('.list-group-item');

        if($list.length == 0){
            com.showAlert(com.warning, "请添加辅料项！");
            return false;
        }
        
        if(com.validate('searchInfo', 'left')){
        	return false;
        }

        var _option = {
            "accessories.orderId": accessories.postData["orderId"],
            "accessories.supervisor.userId": accessories.postData["accessories.supervisor.userId"],
            "accessories.fetchTime": com.focusPage("#fetchTime").val()
        };

        $list && $list.length && $.each($list, function (i, v) {
            var $v = $(v);
            _option["accessoriesItems[" + i + "].goods.gid"] = $v.attr('data-gid');
            _option["accessoriesItems[" + i + "].num"] = $v.attr('data-num')
        });

        com.post(api.inventory.addAccessories, _option, function (data) {
            com.showAlert(com.info, "操作成功");

            com.focusPage('#salesItemList').empty();
            
            com.focusPage('.order_inputinfo').val(null);
            com.focusPage('[name="date"]', '#searchInfo').val(null);
        });
    });

    //查看套餐弹窗
    function openPackageGoods(gid) {
        var $popup = com.focusPage('#viewPopUp');
        $popup.attr({'data-gid': gid});
        //弹出即全屏
        var index = layer.open({
            type: 1,
            skin: 'layui-layer-molv',
            title: "查看套餐",
            content: $popup,
            area: ["1400px", ( $(window).height() * 0.84 < 720 ? $(window).height() * 0.84 : 720 ) + "px"],
            zIndex: 9000,
            btn: ['确定'],
            success: function (layer, index) {
                $popup.load("views/sales/viewSalesPackageGoods.html");
            },
            end: function () {
                $popup.attr('data-gid', null);
            }
        });
    }

});