/**
 * Created by Administrator on 2017/7/19 0019.
 */
$(function(){
    var quoteItem = {
        $layerAdd : $('#layerAdd'),
    };

    var displayFunc = (function(){

        var renderList = function(tableID,listData){
            var $tableWrap = $('#'+ tableID);
            if(listData && listData.length){
                var $ulTitle = createTableTitle();
                var $ulData = $('<ul></ul>').addClass('flex-table');
                $tableWrap.append($ulTitle).append($ulData);
                $.each(listData,function(i,v){
                    var $liLine = createLine(i, v, i == listData.length - 1);
                    $liLine.appendTo($ulTitle);
                });
            }
        };
        //绘制表头
        var createTableTitle = function () {

            var $ulTitle = $('<ul></ul>').addClass('flex-table');
            var $liTitle = $('<li></li>').addClass('line table-title');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>'));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col7');

            var titleName = '名称,型号,单位,单价,类型,状态';

            $.each(titleName.split(','), function (i, v) {
                var $cell = $('<div></div>').addClass('cell col-xs-2').html(v);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action').html($('<div>操作</div>').addClass('cell option'));

            $liTitle.append($indexWrap).append($contentWrap).append($optionWrap).appendTo($ulTitle);

            return $ulTitle;
        };
        
        //绘制表体
        function createLine(i,v, lastFlag) {
            var $liLine = $('<li></li>').addClass('line');
            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(i + 1));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col7');
            //显示字段
            var propertyArr = [
                v.name,
                v.format,
                v.measurementunit,
                v.unitprice,
                v.quoteType.name,
                v.status == 0 ? '启用' : '禁用'
            ];
            $.each(propertyArr,function (i,v) {
                var $cell = $('<div></div>').addClass('cell col-xs-2').html(v);
                $cell.appendTo($contentWrap);
            });
            var $optionWrap = $('<div></div>').addClass('line-wrap action');
            var $cellOption = $('<div></div>').addClass('cell option');

            var $btnGroup = $('<div></div>').addClass('btn-group');
            var $btn = $('<button></button>').addClass('btn btn-primary dropdown-toggle').attr('data-toggle', 'dropdown').append('操作').append('<i class="icon-angle-down"></i>');
            var $btnUl = $('<ul></ul>').addClass('dropdown-menu').addClass(lastFlag ? 'bottom-up' : '');

            var $btnEdit = $('<li></li>').append($('<a></a>').html('编辑'));
            var $btnStart = $('<li></li>').append($('<a></a>').html('启用'));
            var $btnStop = $('<li></li>').append($('<a></a>').html('禁用'));
            $btnUl.append($btnEdit).append($btnStart).append($btnStop);
            $btnGroup.append($btn).append($btnUl).appendTo($cellOption);
            $cellOption.appendTo($optionWrap);

            $liLine.append($indexWrap).append($contentWrap).append($optionWrap);

            //启用功能
            $btnStart.click(function () {
                layer.confirm('是否启用？', {
                    btn: ['确定', '取消'] //按钮
                }, function (index, layero) {
                    var id = v.qiid;
                    var status = v.status;
                    startQuoteItemStatus(id,status);
                }, function () {

                });
            });

            //禁用功能
            $btnStop.click(function () {
                layer.confirm('是否禁用？', {
                    btn: ['确定', '取消'] //按钮
                }, function (index, layero) {
                    var id = v.qiid;
                    var status = v.status;
                    stopQuoteItemStatus(id,status);
                }, function () {

                });
            });

            $btnEdit.click(function () {
                /*if(v.status == 1){
                    layer.msg("禁用状态下不允许修改");
                    return;
                }*/
                editOnly();
                var $layeradd = $('#layerAdd');
                $layeradd.find('input[name = "name"]').val(v.name);
                $layeradd.find('input[name = "format"]').val(v.format);
                $layeradd.find('input[name = "measureunit"]').val(v.measurementunit);
                $layeradd.find('input[name = "unitprice"]').val(v.unitprice);
                $layeradd.find('select[name = "quoteType"]').val(v.quoteType.qtid);
                $layeradd.attr('qiid',v.qiid);
                 //展开弹窗
                openlayer(function () {
                    if(submitValidate() && checkRowValue() == true){
                        var qiid = $('#layerAdd').attr('qiid');
                        var format = $('#layerAdd').find('input[name = "format"]').val();
                        var unitprice = $('#layerAdd').find('input[name = "unitprice"]').val();
                        com.post(api.production.updateQuoteItem,{
                            "quoteItem.qiid" : qiid,
                            "quoteItem.format" : format,
                            "quoteItem.unitprice" : unitprice
                        },function () {
                            layer.closeAll();
                            $('#layerAdd').find('input').val("");
                            searcher.doSearch();
                            layer.msg("编辑成功");
                        },function () {
                            layer.msg("编辑失败");
                        });
                    }
                });

            });
            return $liLine;
        }
        return{
            init: function (tableId, listData) {
                $('#' + tableId).html(null);
                renderList(tableId, listData);

            },
            drawLine: function (v) {
                return creatLine(v);
            }
        };

    })();

    var searcher = new Searcher();
    var _arr = ['quoteItemName','quotetype'];
    searcher.init(_arr,"condList",api.production.pageQuoteItem,function (data) {
        displayFunc.init('resultList', data);
    },"pagenation", "quoteItemPostData", null, false, null,function () {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-danger pull-left').attr('name', 'add').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);
        $adda.click(function () {
            addOpenlayer();
        });
        return [$adda];
    },'resultList');

    function openlayer(callback) {
        layer.closeAll();
        layer.open({
            type: 1,
            title: "  ",
            content: $('#layerAdd'),
            area: ( $(window).width() * 0.6 < 620 ? $(window).height() * 0.6 : 620 ) + "px",
            maxmin: true,
            zIndex: 9999,
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                closeEditReadOnly();
                callback(index,layero);
            },
            btn2: function (index, layero) {
                //按钮【按钮二】的回调
                closeEditReadOnly();
                $('#layerAdd').find('input').val("");
            },
            cancel: function () {
                //右上角关闭回调;
                closeEditReadOnly();
                $('#layerAdd').find('input').val("");
            }
        });
    }

    function addOpenlayer() {
        layer.closeAll();
        layer.open({
            type: 1,
            title: " ",
            content: $('#layerAdd'),
            area: ( $(window).width() * 0.6 < 620 ? $(window).height() * 0.6 : 620 ) + "px",
            maxmin: true,
            zIndex: 9999,
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                if(submitValidate() && checkRowValue()){
                    addData();
                }
                //closeEditReadOnly();
            },
            btn2: function (index, layero) {
                //按钮【按钮二】的回调
                //closeEditReadOnly()
                $('#layerAdd').find('input').val("");
            },
            cancel: function () {
                //右上角关闭回调
                //closeEditReadOnly()
                $('#layerAdd').find('input').val("");
            }
        });
    }

    function startQuoteItemStatus(id,status) {
        if(status == 1){
            com.post(api.production.updateQuoteItemForStatus,{"quoteItem.qiid":id,"quoteItem.status":0},function(res){
                searcher.doSearch();
                layer.closeAll();
                layer.msg('启用成功', {icon: 1, time: 2e3});
            });
        }else{
            layer.alert('已经启用', {
                icon: 0,
                skin: 'layer-ext-moon'
            });
        }
    }

    function stopQuoteItemStatus(id,status) {
        if(status == 0){
            com.post(api.production.updateQuoteItemForStatus,{"quoteItem.qiid":id,"quoteItem.status":1},function(res){
                searcher.doSearch();
                layer.closeAll();
                layer.msg('禁用成功', {icon: 1, time: 2e3});
            });
        }else{
            layer.alert('已经禁用', {
                icon: 0,
                skin: 'layer-ext-moon'
            });
        }
    }
    
    function editOnly() {
        var $layer = $('#layerAdd');
        $layer.find('input[name="name"]').attr('disabled', 'disabled');
        $layer.find('input[name="measureunit"]').attr('disabled', 'disabled');
        $layer.find('select[name="quoteType"]').attr('disabled', 'disabled');
    }

    function closeEditReadOnly() {
        var $layer = $('#layerAdd');
        $layer.find('input[name="name"]').removeAttr('disabled');
        $layer.find('input[name="measureunit"]').removeAttr('disabled');
        $layer.find('select[name="quoteType"]').removeAttr('disabled');
    }
//绑定报价类型
    com.post(api.production.queryQuoteType,{},function (res) {
        $('select[name = "quoteType"]').bindData(res.quoteTypes,"qtid","name");
    });

    //表单校验*/
    function submitValidate() {
        var flag = true;
        var $name = $('input[name="name"]');
        var $format = $('input[name="format"]');
        var $measureunit = $('input[name="measureunit"]');
        var $unitprice = $('input[name="unitprice"]');

        if(!$name.val()){
            $name.focus().select();
            $name.addClass('popover-notitle').attr({
                "data-rel" : "popover",
                "data-placement" : "top",
                "data-original-title" : "",
                "title" : "",
                "data-content" : "请填写名称"
            }).popover('show');
            flag =  false;
        }else{
            $name.popover('destroy');
        }
        if(!$format.val()){
            $format.focus().select();
            $format.addClass('popover-notitle').attr({
                "data-rel" : "popover",
                "data-placement" : "top",
                "data-original-title" : "",
                "title" : "",
                "data-content" : "请填写型号"
            }).popover('show');
            flag =  false;
        }else{
            $format.popover('destroy');
        }
        if(!$measureunit.val()){
            $measureunit.focus().select();
            $measureunit.addClass('popover-notitle').attr({
                "data-rel" : "popover",
                "data-placement" : "top",
                "data-original-title" : "",
                "title" : "",
                "data-content" : "请填写单位"
            }).popover('show');
            flag =  false;
        }else{
            $measureunit.popover('destroy');
        }
        if(!$unitprice.val()){
            $unitprice.focus().select();
            $unitprice.addClass('popover-notitle').attr({
                "data-rel" : "popover",
                "data-placement" : "top",
                "data-original-title" : "",
                "title" : "",
                "data-content" : "请填写单价"
            }).popover('show');
            flag =  false;
        }else{
            $unitprice.popover('destroy');
        }
        return flag;
    }
    //校验数量输入格式
    function checkRowValue() {

        var flag = true;

        var pieceNum = $('#layerAdd').find('input[name = "unitprice"]');
        var numRex = /^(\d+|\d+\.[0-9]{1,4})$/;
        if (!(numRex.test(pieceNum.val()) && parseFloat(pieceNum.val()) >= 0)) {
            pieceNum.focus().select();
            pieceNum.addClass('tooltip-info').attr({
                "data-rel": "popover",
                "data-placement": "right",
                "data-original-title": "",
                "title": "",
                "data-content": "数量输入内容格式错误!"
            }).popover('show');
            flag = false;
        } else {
            pieceNum.popover('destroy');
        }

        return flag;
    }
    //添加方法
    function addData() {
        var name = $('#layerAdd').find('input[name="name"]').val();
        var format = $('#layerAdd').find('input[name="format"]').val();
        var measureunit = $('#layerAdd').find('input[name="measureunit"]').val();
        var unitprice = $('#layerAdd').find('input[name = "unitprice"]').val();;
        var quoteType = $('#layerAdd').find('select[name="quoteType"]').val();
        com.post(api.production.addQuoteItem,{
            "quoteItem.name" : name,
            "quoteItem.format" : format,
            "quoteItem.measurementunit" : measureunit,
            "quoteItem.unitprice" : unitprice,
            "quoteItem.quoteType.qtid" : quoteType
        },function () {
            layer.closeAll();
            layer.msg("添加成功");
            searcher.doSearch();
            $('#layerAdd').find('input').val("");
            $('#layerAdd').find('select').val(1);
        },function () {
            layer.msg("添加失败");
        });
    }


});
