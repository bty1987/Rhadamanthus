$(function(){

    var $layeradd = $('#layerAdd');

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
        function createLine(i, v, lastFlag) {
            var $liLine = $('<li></li>').addClass('line');
            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(i + 1));
            var $contentWrap = $('<div></div>').addClass('line-wrap content col7');
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
                    changeQuoteTypeStatus(v.qiid, 0,(v.status == 0) ,function(){
                        layer.closeAll();
                        layer.msg('启用成功', {icon: 1, time: 2e3});
                    });
                });
            });

            //禁用功能
            $btnStop.click(function () {
                layer.confirm('是否禁用？', {
                    btn: ['确定', '取消'] //按钮
                }, function (index, layero) {
                    changeQuoteTypeStatus(v.qiid,1,(v.status == 1) ,function () {
                    layer.closeAll();
                    layer.msg('禁用成功', {icon: 1, time: 2e3});
                    });
                });
            });

            $btnEdit.click(function () {
                if(v.status == 1){
                    layer.msg("禁用状态下不允许修改");
                    return false;
                }

                productionUtils.clearForm("form1");
                editOnly();

                $layeradd.find('input[name = "name"]').val(v.name);
                $layeradd.find('input[name = "format"]').val(v.format);
                $layeradd.find('select[name = "measureunit"] option[text = '+v.measurementunit+']');
                $layeradd.find('input[name = "unitprice"]').val(v.unitprice);
                $layeradd.find('select[name = "quoteType"]').val(v.quoteType.qtid);

                openlayer("添加",function(){
                    saveData(v.qiid,function(){
                        layer.closeAll();
                        searcher.doSearch();
                    })
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
                return createLine(v);
            }
        };

    })();

    var searcher = new Searcher();
    var _arr = ['p_quoteItemName','p_quotetype'];
    searcher.init(_arr,"condList",api.production.pageQuoteItem,function (data) {

        displayFunc.init('resultList', data);

    },"pagenation", "quoteItemPostData", null, false, null,function () {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-danger pull-left').attr('name', 'add').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        $adda.click(function () {
            productionUtils.clearForm("form1");
            closeEditReadOnly();
            openlayer("添加",function(){
                saveData(null,function(){
                    layer.closeAll();
                    searcher.doSearch();
                })
            });
        });

        return [$adda];

    },'resultList');

    function openlayer(layerType,callback) {
        layer.closeAll();
        layer.open({
            type: 1,
            title: layerType,
            content: $layeradd,
            area: ( $(window).width() * 0.6 < 620 ? $(window).height() * 0.6 : 620 ) + "px",
            maxmin: false,
            zIndex: 9000,
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                callback(index,layero);
            },
            btn2: function (index, layero) {
                //按钮【按钮二】的回调
            },
            cancel: function () {
                //右上角关闭回调;
            }
        });
    }

    /*btnType:0 启用功能,1 禁用功能
     statusFlag:当前状态是否与想要完成的功能相冲 */
    function changeQuoteTypeStatus(id,btnType,statusFlag ,callback) {

        if(!statusFlag){
            com.post(api.production.updateQuoteItemForStatus, {
                "quoteItem.qiid": id,
                "quoteItem.status": btnType
            }, function (res) {
                callback();
                searcher.doSearch();
            });
        }else{
            layer.alert(btnType == 0 ? '已经启用':'已经禁用', {
                icon: 0,
                skin: 'layer-ext-moon'
            });
        }
    }
    
    function editOnly() {
        $layeradd.find('input[name="name"]').attr('disabled', 'disabled');
        $layeradd.find('select[name="measureunit"]').attr('disabled', 'disabled');
        $layeradd.find('select[name="quoteType"]').attr('disabled', 'disabled');
    }

    function closeEditReadOnly() {
        $layeradd.find('input[name="name"]').removeAttr('disabled');
        $layeradd.find('select[name="measureunit"]').removeAttr('disabled');
        $layeradd.find('select[name="quoteType"]').removeAttr('disabled');
    }
    //绑定报价类型
    com.post(api.production.queryQuoteType,{},function (res) {
        $('select[name = "quoteType"]').bindData(res.quoteTypes,"qtid","name");
    });

    //绑定单位
    com.post(api.data.queryMeasurementUnit,{},function(res){
        $('select[name = "measureunit"]').bindData(res.measurementUnits,"id","name");
    });

    //添加方法
    function saveData(id,callback) {
        var name = $layeradd.find('input[name="name"]').val();
        var format = $layeradd.find('input[name="format"]').val();
        var measureunit = $layeradd.find('select[name="measureunit"] option:selected').text();
        var unitprice = $layeradd.find('input[name = "unitprice"]').val();
        var quoteType = $layeradd.find('select[name="quoteType"]').val();

        com.clearValidator();
        if(com.validate("layerAdd",null)){
            return false;
        }

        if(id){
            com.post(api.production.updateQuoteItem,{
                "quoteItem.qiid" : id,
                "quoteItem.format" : format,
                "quoteItem.unitprice" : unitprice
            },function () {
                callback();
                layer.msg("编辑成功",{icon: 1, time: 2e3});
            });
        }else{
            com.post(api.production.addQuoteItem,{
                "quoteItem.name" : name,
                "quoteItem.format" : format,
                "quoteItem.measurementunit" : measureunit,
                "quoteItem.unitprice" : unitprice,
                "quoteItem.quoteType.qtid" : quoteType
            },function () {
                callback();
                layer.msg("添加成功",{icon: 1, time: 2e3});
            });
        }

    }

});
