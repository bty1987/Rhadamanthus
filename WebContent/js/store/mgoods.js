$(function () {
    var mgoods = {
        items: {
            no: com.focusPage("#no"),
            name: com.focusPage("#name"),
            barcode: com.focusPage("#barcode"),
            mbrand: com.focusPage("#mbrand"),
            title: com.focusPage("#title"),
            price: com.focusPage("#price")
        },
        editFlg: !1,
        postParam: {},
        repeatFlg: !1,
        mbrandData: [],
        editflg:false
    };

    var displayFunc = (function () {
        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);

            if (listData && listData.length) {
                var $ulTitle = createTableTitle();
                var $ulData = $('<ul></ul>').addClass('flex-table');
                $tableWrap.append($ulTitle).append($ulData);

                $.each(listData, function (i, v) {
                    var $liLine = creatLine(i, v, i == listData.length - 1);

                    $liLine.appendTo($ulTitle);
                });
            }
        };

        //绘制表格头
        var createTableTitle = function () {
            var $ulTitle = $('<ul></ul>').addClass('flex-table');
            var $liTitle = $('<li></li>').addClass('line table-title');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>'));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col10');

            var titleName = '二维码,图片,编号,商品,条形码,品牌,标题,价格,状态';

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

        //绘制表格体
        var creatLine = function (i, v, lastFlag) {
            var $liLine = $('<li></li>').addClass('line');
            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(i + 1));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col10');
            //显示字段
            var propertyArr = [
                [v.no, 'blue'],
                [v.name, 'grey'],
                [v.barcode, 'blue'],
                [v.mbrand.name, 'grey'],
                [v.title, 'grey'],
                [v.price, 'grey'],
                [v.status == "0" ? "启用" : "禁用", 'red']
            ];

            var propertyArr2 = [
                [v.defaultImg, 'blue']
            ];

            var propertyArr3 = [
                [v.gid, 'blue']
            ];

            $.each(propertyArr3, function (i,v){
                var $imgDiv = $('<div></div>').addClass('cell').appendTo($contentWrap);
                $imgDiv.qrcode({
                    render: "canvas",
                    width: 100,
                    height: 100,
                    text: "http://fanglin.vip/wx/store?gid=" + v[0]
                });
            });

            $.each(propertyArr2, function (i, v) {
                var $imgDiv = $('<div></div>').addClass('cell').appendTo($contentWrap);
                var img = $('<img />');
                com.showImg(img, v[0], 50, 50, '', null, 0);
                img.appendTo($imgDiv);
            });

            $.each(propertyArr, function (i, v) {
                var $cell = $('<div></div>').addClass('cell ' + v[1]).html(v[0]);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action');
            var $cellOption = $('<div></div>').addClass('cell option');
            var $btnGroup = $('<div></div>').addClass('btn-group');
            var $btn = $('<button></button>').addClass('btn btn-primary dropdown-toggle').attr('data-toggle', 'dropdown').append('操作').append('<i class="icon-angle-down"></i>');
            var $btnUl = $('<ul></ul>').addClass('dropdown-menu').addClass(lastFlag ? 'bottom-up' : '');

            //操作按钮下面的选项
            var $btnEdit = $('<li></li>').append($('<a></a>').html('编辑'));
            var $btnColor = $('<li></li>').append($('<a></a>').html('颜色'));
            var $btnFormat = $('<li></li>').append($('<a></a>').html('规格'));
            var $btnPrice = $('<li></li>').append($('<a></a>').html('价格'));
            var $btnStart = $('<li></li>').append($('<a></a>').html('启用'));
            var $btnStop = $('<li></li>').append($('<a></a>').html('禁用'));
            var $btnImg = $('<li></li>').append($('<a></a>').html('图片'));

            //添加操作按钮下面的选项
            $btnUl.append($btnEdit).append($btnColor).append($btnFormat).append($btnPrice).append($btnStart).append($btnStop).append($btnImg);

            $btnGroup.append($btn).append($btnUl).appendTo($cellOption);

            $cellOption.appendTo($optionWrap);

            $liLine.append($indexWrap).append($contentWrap).append($optionWrap);

            //编辑点击事件
            $btnEdit.click(function () {
                edits(v);
            });

            //颜色点击事件
            $btnColor.click(function () {
                openLayerSwitch('goodsColorPopUp', v.gid, '颜色', 'views/store/mcolor.html', null);
            });
            //规格点击事件
            $btnFormat.click(function () {
                openLayerSwitch('goodsFormatPopUp', v.gid, '规格', 'views/store/mformat.html', null);
            });
            //商品图片
            $btnImg.click(function(){
                openLayerSwitch('goodsPicturePopUp', v.gid, '商品图片', 'views/store/picture.html', null);
            });
            //价格点击事件
            $btnPrice.click(function () {
                openLayerSwitch('goodsPricePopUp', v.gid, '价格', 'views/store/mprice.html', v.mbrand.name + "-" + v.name);
            });

            //状态启用事件
            $btnStart.click(function () {
                
                com.showConfirm("是否确认启用", function(){
                    com.focusPage('#layerAdd').attr('data-gid', v.gid);
                    com.focusPage('#layerAdd').attr('data-status', v.status);
                    
                    var id = com.focusPage('#layerAdd').attr('data-gid');
                    var status = com.focusPage('#layerAdd').attr('data-status');
                    
                    startGoodsStatus(id, status);
                });
            });
            
            //状态禁用事件
            $btnStop.click(function () {
                
                com.showConfirm("是否确认禁用", function(){
                    com.focusPage('#layerAdd').attr('data-gid', v.gid);
                    com.focusPage('#layerAdd').attr('data-status', v.status);
                    
                    var id = com.focusPage('#layerAdd').attr('data-gid');
                    var status = com.focusPage('#layerAdd').attr('data-status');
                    
                    stopGoodsStatus(id, status);
                });
            });
            
            return $liLine;
        };
        return {
            init: function (tableId, listData) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function (v) {
                return creatLine(v);
            }
        };
    })();

    autoFill(api.store.queryMbrandByName, "mbrand", "mbrands", "bid", "name");
    autoFill(api.store.queryMbrandByName, "mgoodsBrands", "mbrands", "bid", "name");

    var searcher = new Searcher();

    searcher.init(['mgoodsNo', 'mgoodsNames', 'mgoodsBarcodes', 'mgoodsBrands'], "condList", api.store.pageMgoods, function (data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "mgoodsPostData", null, false, null, function () {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'layerAdd').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        $adda.click(function () {
            com.cleanItems(mgoods.items);
            openlayer("添加", function (index, layero) {
                if (com.validate('form1')) {
                    return;
                }

                if(mgoods.mbrandData.length == 0){
                    com.focusPage("#mbrand").addClass('popover-notitle').attr({
                        "data-rel" : "popover",
                        "data-placement" : "right",
                        "data-original-title" : "",
                        "title" : "",
                        "data-content" : "请填写正确的品牌"
                    }).popover('show');
                    return;
                }
                saveData();
            });
        });
        return [$adda];
    });

    function openlayer(name, callback) {
        com.closePopup();
        layer.open({
            type: 1,
            title: name,
            content: com.focusPage('#layerAdd'),
            area: ( $(window).width() * 0.6 < 620 ? $(window).height() * 0.6 : 620 ) + "px",
            maxmin: false,
            zIndex: 9000,
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                callback(index, layero);
            },
            btn2: function (index, layero) {
                //按钮【按钮二】的回调
                closeEditReadOnly();
                com.clearValidator();
            },
            cancel: function () {
                //右上角关闭回调
                closeEditReadOnly();
                com.clearValidator();
            }
        });
    }

    function openLayerSwitch(id, gid, title, url, goodsName) {
        var $PopUp = com.focusPage('#' + id);
        $PopUp.attr({'data-gid': gid});
        if(goodsName != null){
            $PopUp.attr({'data-goodName': goodsName});
        }

        //弹出即全屏
        var index = layer.open({
            type: 1,
            skin: 'layui-layer-lan',
            title: title,
            content: $PopUp,
            area: ["1200px", ( $(window).height() * 0.84 < 800 ? $(window).height() * 0.84 : 800 ) + "px"],
            maxmin: false,
            zIndex: 9000,
            success: function (layer, index) {
                $PopUp.load(url);
            },
            end: function () {
                $PopUp.attr({'data-gid': null});
                $PopUp.empty();
                if($PopUp.attr("data-flag") == "true"){
                    searcher.doSearch();
                }
                $PopUp.attr({"data-flag" : false});
            }
        });
    }

    function saveData(id) {
        var $layer = com.focusPage('#layerAdd');
        var no = $layer.find('input[name="no"]').val();
        var name = $layer.find('input[name="name"]').val();
        var barcode = $layer.find('input[name="barcode"]').val();
        var brand = $layer.find('input[id="mbrand"]').attr("data-bid");
        var title = $layer.find('input[name="title"]').val();
        var price = $layer.find('input[name="price"]').val();

        if('input[id="mbrand"]' == null){
            $layer.find('input[id="mbrand"]').removeAttr("data-bid")
        }

        var opt = {
            "mgoods.no": no,
            "mgoods.name": name,
            "mgoods.barcode": barcode,
            "mgoods.mbrand.bid": brand,
            "mgoods.title": title,
            "mgoods.price": price,
            "mgoods.defaultImg": ""
        };

        com.post(api.store.addMgoods, opt, function (res) {
            if(com.validate('input[id="mbrand"]')){
                return;
            }
            searcher.doSearch();
            closeEditReadOnly();
            com.closePopup();
        });
    }

    function updateSaveData(v) {
        if(com.validate()){
            return;
        }
        var $layer = com.focusPage('#layerAdd');
        var name = $layer.find('input[name="name"]').val();
        var brand = $layer.find('input[name="mbrand"]').attr("data-bid");
        var title = $layer.find('input[name="title"]').val();
        var price = $layer.find('input[id="price"]').val();

        var opt = {
            "mgoods.gid": v.gid,
            "mgoods.name": name,
            "mgoods.mbrand.bid": brand,
            "mgoods.title": title,
            "mgoods.price": price
        };

        com.post(api.store.updateMgoods, opt, function (res) {
            searcher.doSearch();
            closeEditReadOnly();
            com.closePopup();
        });
    }

    function editReadOnly() {
        var $layerAdd = com.focusPage('#layerAdd');
        $layerAdd.find('input[name="no"]').attr('disabled', 'disabled');
        $layerAdd.find('input[name="barcode"]').attr('disabled', 'disabled');
        $layerAdd.find('input[name="mbrand"]').attr('disabled', 'disabled');
        $layerAdd.find('input[id="name"]').attr('disabled', 'disabled');
    }

    //状态启用
    function startGoodsStatus(id, status) {
        com.post(api.store.updateMgoodsForStatus, {
            "mgoods.gid": id,
            "mgoods.status": "0"
        }, function (res) {
            searcher.doSearch();
        });
    }

    //状态禁用
    function stopGoodsStatus(id, status) {
        com.post(api.store.updateMgoodsForStatus, {
            "mgoods.gid": id,
            "mgoods.status": "1"
        }, function (res) {
            searcher.doSearch();
        });
    }

    function edits(v) {
        editReadOnly();
        var no = com.focusPage('#layerAdd').find('input[name="no"]').val(v.no);
        var name = com.focusPage('#layerAdd').find('input[name="name"]').val(v.name);
        var barcode = com.focusPage('#layerAdd').find('input[name="barcode"]').val(v.barcode);
        var mbrand = com.focusPage('#layerAdd').find('input[id="mbrand"]').val(v.mbrand.name);
        var title = com.focusPage('#layerAdd').find('input[name="title"]').val(v.title);
        var price = com.focusPage('#layerAdd').find('input[name="price"]').val(v.price);

        com.focusPage('#mbrand').attr('data-bid', v.mbrand.bid);
        com.focusPage('#mbrand').attr('data-typeahead-key',v.mbrand.name);

        com.focusPage('#layerAdd').attr('data-gid', v.gid);
        openlayer("编辑", function () {
            updateSaveData(v);
        });
    }

    function autoFill(url, id, dataValue, key, value) {
        com.focusPage('input[name=' + id + ']').typeahead({
            url: url,
            list: [],
            postData: {},
            source: function (query, process) {
                var options = $.extend({"mbrand.name": query}, this.options.postData);
                com.post(this.options.url, options, $.proxy(this.options.callback, this));
            }, matcher: function (item) {
                return true;
            }, callback: function (data) {
                mgoods.mbrandData = [];
                mgoods.mbrandData = data.autoFillKeyValue;
                this.options.list = data[dataValue];
                this.flprocess(this.options.list, [key], [value]);
            },
            isResultTypeMap: true
            , flupdater: function (k, v) {
                com.focusPage('input[name=' + id + ']').attr('data-bid', k);
                return v;
            }
        });
    }

    function closeEditReadOnly() {
        var $layerAdd = com.focusPage('#layerAdd');
        $layerAdd.find('input[name="no"]').removeAttr('disabled');
        $layerAdd.find('input[name="name"]').removeAttr('disabled');
        $layerAdd.find('input[name="barcode"]').removeAttr('disabled');
        $layerAdd.find('input[name="mbrand"]').removeAttr('disabled');
        $layerAdd.find('input[name="mbrand"]').removeAttr('data-bid');
        $layerAdd.find('input[name="mbrand"]').removeAttr('data-typeahead-key');
        $layerAdd.find('input[name="title"]').removeAttr('disabled');
        // $layerAdd.find('input[name="price"]').removeAttr('disabled');
    }
});
