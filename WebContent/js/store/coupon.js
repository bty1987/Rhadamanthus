
$(function(){
    var coupon = {
        couponItems:{},
        editFlg: false,
        repeatFlg: false,
        couponData: []
    };

    coupon.couponItems.mgoods = com.focusPage("#mgoods");
    coupon.couponItems.title = com.focusPage("#title");
    coupon.couponItems.vprice = com.focusPage("#vprice");
    coupon.couponItems.type = com.focusPage("#type");

    var displayFunc  = (function(){
        /*表格样式*/
        var renderList = function(tableId,listData){
            var $tableWrap = com.focusPage('#' + tableId);

            if(listData && listData.length){

                var $ulTitle = createTableTitle();
                var $ulData = $('<ul></ul>').addClass('flex-table');
                $tableWrap.append($ulTitle).append($ulData);

                $.each(listData,function(i, v){
                    var $liLine = creatLine(i, v, i == listData.length - 1);
                    $liLine.appendTo($ulTitle);
                });
            }
        };

        /*表格头*/
        var createTableTitle = function(){
            var $ulTitle = $('<ul></ul>').addClass('flex-table');
            var $liTitle = $('<li></li>').addClass('line table-title');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>'));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col5');
            var titleName ='商品名字,劵标题,劵值,类型,状态';

            $.each(titleName.split(','), function (i, v) {
                var $cell = $('<div></div>').addClass('cell').html(v);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action').html($('<div>操作</div>').addClass('cell option'));

            $liTitle.append($indexWrap)
                .append($contentWrap)
                .append($optionWrap)
                .appendTo($ulTitle);

            return $ulTitle;
        };
        /*表格体*/
        var creatLine = function (i, v, lastFlag) {
            var $liLine = $('<li></li>').addClass('line');
            var id = i + 1;
            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(id));
            var $contentWrap = $('<div></div>').addClass('line-wrap content col5');
            var propertyArr = [
                [v.mgoods.title,'grey'],
                [v.title,'grey'],
                [v.value,'grey'],
                [v.type =="0" ? "劵值" : "折扣",'red'],
                [v.status =="0" ? "启用" : "禁用",'red']
            ];

            $.each(propertyArr, function (i, v) {
                var $cell = $('<div></div>').addClass('cell ' + v[1]).html(v[0]);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action');
            var $cellOption = $('<div></div>').addClass('cell option');

            var $btnGroup = $('<div></div>').addClass('btn-group');
            var $btn = $('<button></button>').addClass('btn btn-primary dropdown-toggle').attr('data-toggle', 'dropdown').append('操作').append('<i class="icon-angle-down"></i>');
            var $btnUl = $('<ul></ul>').addClass('dropdown-menu').addClass(lastFlag ? 'bottom-up' : '');
            var $btnStart = $('<li></li>').append($('<a></a>').html('启用'));
            var $btnBan = $('<li></li>').append($('<a></a>').html('禁用'));
            var $update = $('<li></li>').append($('<a></a>').html('编辑'));

            $btnUl.append($update).append($btnStart).append($btnBan);

            $btnGroup.append($btn).append($btnUl).appendTo($cellOption);

            $cellOption.appendTo($optionWrap);

            $liLine.append($indexWrap).append($contentWrap).append($optionWrap);

            //编辑
            $update.click(function(){
                com.focusPage("#mgood").hide();
                editBrand(v);
                openlayer("编辑", function(index, layero){
                    if(com.validate('form'))
                        return;
                    updateData(v, function(){
                        layer.closeAll();
                    });
                });
            });

            /*状态启用*/
            $btnStart.click(function(){
                startStatus(v.cid, v.status, function(){
                    layer.closeAll();
                    layer.msg('启用成功',{icon:1});
                });
            });

            /*状态禁用*/
            $btnBan.click(function(){
                stopStatus(v.cid, v.status, function(){
                    layer.closeAll();
                    layer.msg('禁用成功',{icon:1});
                });
            });
            return $liLine;
        };

        return {
            init : function(tableId,listData){
                com.focusPage('#' + tableId).html(null);
                renderList(tableId,listData);
            },
            drawLine : function(v){
                return creatLine(v);
            }
        };
    })();

    autoFill(api.store.queryBaseMgoodsByPinyin, "mgoods", "gid", "name");

    /*分页*/
    var _condArr = ["mgoodsno"];
    var couponSeacher = new Searcher();
    couponSeacher.init( _condArr, "condList", api.store.pageCouponScope, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "couponPostData", null, false, null, function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addQuotationVersion').css('margin', '0px 3px');
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        $adda.click(function(){
            com.focusPage("#mgood").show();
            com.cleanItems(coupon.couponItems);
            openlayer("添加", function(index, layero){
                if(com.validate('form1')){
                    return;
                }
                if (coupon.couponData.length == 0) {
                        com.focusPage("#mgoods").addClass('popover-notitle').attr({
                            "data-rel": "popover",
                            "data-placement": "right",
                            "data-original-title": "",
                            "title": "",
                            "data-content": "请填写正确的品牌"
                        }).popover('show');
                        return;
                }
                saveData();
            });
        });
        return [$adda];
    }, 'resultList');

    function autoFill(url, id, key, value) {
        com.focusPage('input[name=' + id + ']').typeahead({
            url: url,
            list: [],
            postData: {},
            source: function (query, process) {
                var options = $.extend({"mgoods.pinyin": query}, this.options.postData);
                com.post(this.options.url, options, $.proxy(this.options.callback, this));
            }, matcher: function (item) {
                return true;
            }, callback: function (data) {
                coupon.couponData = [];
                coupon.couponData = data.autoFillKeyValue;
                this.flprocess(coupon.couponData, 'key', 'value');
            },
            isResultTypeMap: true,
            flupdater: function (k, v) {
                com.focusPage('input[name=' + id + ']').attr('data-cid',k);
                return v;
            }
        });
    }

    function openlayer(name, callback){
        //var layer = $('#layerAdd');
        layer.closeAll();
        layer.open({
            type: 1,
            title:name,
            content: com.focusPage('#layerAdd'),
            area: ( $(window).width()*0.6 < 620 ?  $(window).height()*0.6 : 620 )+"px",
            maxmin: false,
            zIndex:9000,
            btn: ['确定', '取消'],
            yes: function(index, layero){
                callback(index, layero);
            },
            btn2: function(index, layero){
                //按钮【按钮二】的回调
                com.clearValidator();
            },
            cancel: function(){
                //右上角关闭回调
            }
        });
    }

    /*状态信息验证*/
    function startStatus(id, status, callback){
        if(status == "1"){
            com.post(api.store.updateCouponScopeForStatus,{
                "coupon.cid":id,
                "coupon.status":"0"
            },function(res){
                callback();
                couponSeacher.doSearch();
            });
        }else{
            layer.alert('已经启用', {
                icon: 0,
                skin: 'layer-ext-moon' //该皮肤由layer.seaning.com友情扩展。关于皮肤的扩展规则，去这里查阅
            });
        }
    }

    function stopStatus(id, status, callback){
        if(status == "0"){
            com.post(api.store.updateCouponScopeForStatus,{
                "coupon.cid":id,
                "coupon.status":"1"
            },function(res){
                callback();
                couponSeacher.doSearch();
            });
        }else{
            layer.alert('已经禁用', {
                icon: 0,
                skin: 'layer-ext-moon'
            });
        }
    }

    /*添加信息*/
    function saveData(callback){
        if(coupon.couponItems.type.val() == 0){
            var regex = /^[0-9]+\.{0,1}[0-9]{0,2}$/;
            if(!regex.test(coupon.couponItems.vprice.val())){
                layer.msg("请输入正确的劵值");
                return;
            }
        }

        if(coupon.couponItems.type.val() == 1){
            var postDiscountRex =/^(1\.0{1,2}|1|0\.[0-9]{1,2})$/;
            if(!postDiscountRex.test(coupon.couponItems.vprice.val())){
                layer.msg("请输入正确的折扣价");
                return;
            }
        }
        var $layer = com.focusPage('#layerAdd');
        var nameid = $layer.find('input[id="mgoods"]').attr("data-cid");
        com.post(api.store.addCouponScope, {
            "coupon.mgoods.gid": nameid,
            "coupon.title":coupon.couponItems.title.val(),
            "coupon.value":coupon.couponItems.vprice.val(),
            "coupon.type":coupon.couponItems.type.val()
        }, function(res){
            couponSeacher.doSearch();
            layer.closeAll();
        });
    }

    function updateData(v, callback){
        if(coupon.couponItems.type.val() == 0){
            var regex =  /^[0-9]+\.{0,1}[0-9]{0,2}$/;
            if(!regex.test(coupon.couponItems.vprice.val())){
                layer.msg("请输入正确的劵值");
                return;
            }
        }

        if(coupon.couponItems.type.val() == 1){
            var postDiscountRex =/^(1\.0{1,2}|1|0\.[0-9]{1,2})$/;
            if(!postDiscountRex.test(coupon.couponItems.vprice.val())){
                layer.msg("请输入正确的折扣价");
                return;
            }
        }

        var $layer = com.focusPage('#layerAdd');
        var nameid = $layer.find('input[id="mgoods"]').attr("data-cid");
        
        com.post(api.store.updateCouponScope, {
            'coupon.cid':v.cid,
            "coupon.mgoods.gid": nameid,
            "coupon.title": coupon.couponItems.title.val(),
            "coupon.value": coupon.couponItems.vprice.val(),
            "coupon.type": coupon.couponItems.type.val()
        }, function(res){
            callback();
            couponSeacher.doSearch();
        });
    }

    function editBrand(v){
        coupon.couponItems.title.val(v.title);
        coupon.couponItems.vprice.val(v.value);
        coupon.couponItems.type.val(v.type);
    }
});
