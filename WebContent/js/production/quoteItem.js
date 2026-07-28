$(function() {
    var quoteItem = {
        saveBtn: com.focusPage("#saveBtn"),
        cancelBtn: com.focusPage("#cancelBtn"),

        modals: {
            quoteItemModal: com.focusPage("#quoteItemModal")
        },
        items: {
            name: com.focusPage("#name"),
            format: com.focusPage("#format"),
            measureunit: com.focusPage("#measureunit"),
            unitprice: com.focusPage("#unitprice"),
            quoteType: com.focusPage("#quoteType")
        },
        editFlg: true,
    };

    quoteItem.saveBtn.bindClick(saveData);

    quoteItem.modals.quoteItemModal.on("hide.bs.modal", function(){
        quoteItem.items.name.removeAttr("disabled", "disabled");
        quoteItem.items.measureunit.removeAttr("disabled", "disabled");
        quoteItem.items.quoteType.removeAttr("disabled", "disabled");
        com.clearValidator();
        com.cleanItems(quoteItem.items);
    });

    var displayFunc = (function(){

        var renderList = function(tableID,listData){
            var $tableWrap = com.focusPage('#'+ tableID);

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
            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index blue').html(i + 1));
            var $contentWrap = $('<div></div>').addClass('line-wrap content col7');
            //显示字段
            var propertyArr = [
                [v.name,'grey'],
                [v.format,'blue'],
                [v.measurementunit,'grey'],
                [v.unitprice,'blue'],
                [v.quoteType.name,'red'],
                [constant.data().common.status.keys[v.status],'red']
            ];
            $.each(propertyArr,function (i,v) {
                var $cell = $('<div></div>').addClass('cell col-xs-2 '+v[1]+'').html(v[0]);
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
                changeQuoteTypeStatus(v.qiid, 0,v.status);
            });

            //禁用功能
            $btnStop.click(function () {
                changeQuoteTypeStatus(v.qiid, 1,v.status);
            });

            $btnEdit.click(function () {

                quoteItem.editFlg = false;
                quoteItem.items.qiid = v.qiid;
                quoteItem.items.name.attr("disabled", "disabled");
                quoteItem.items.measureunit.attr("disabled", "disabled");
                quoteItem.items.quoteType.attr("disabled", "disabled");

                quoteItem.items.name.val(v.name);
                quoteItem.items.format.val(v.format);
                quoteItem.items.measureunit.find("option:selected").text(v.measurementunit);
                quoteItem.items.unitprice.val(v.unitprice);
                quoteItem.items.quoteType.val(v.quoteType.qtid);

                quoteItem.modals.quoteItemModal.modal("show");
            });
            return $liLine;
        }
        return{
            init: function (tableId, listData) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function (v) {
                return createLine(v);
            }
        };
    })();

    var searcher = new Searcher();
    var _arr = ['production-quoteItem-name','production-quoteItem-type'];
    searcher.init(_arr,"condList",api.production.pageQuoteItem,function (data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "Workflow",null,false, null,function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addQuoteItem').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    com.focusPage("#addQuoteItem").click(function() {
        quoteItem.editFlg = true;

        quoteItem.modals.quoteItemModal.modal("show");
    });

        /*btnType:0 启用功能,1 禁用功能
         statusFlag:当前状态是否与想要完成的功能相冲 */
    function changeQuoteTypeStatus(id,btnType,statusFlag ) {

        var status = btnType == 0 ? "启用" : "禁用";

        if(statusFlag == btnType){
            com.showAlert(com.warning, "已"+status+"无需重复当前操作");
            return false;
        }

        com.post(api.production.updateQuoteItemForStatus, {
            "quoteItem.qiid": id,
            "quoteItem.status": btnType
        }, function (res) {
            com.showAlert(com.info, "已"+status);
            searcher.doSearch();
        });
    }

    //绑定报价类型
    com.post(api.production.queryQuoteType,{},function (res) {
        quoteItem.items.quoteType.bindData(res.quoteTypes,"qtid","name");
    });

    //绑定单位
    com.post(api.data.queryMeasurementUnit,{},function(res){
        quoteItem.items.measureunit.bindData(res.measurementUnits,"id","name");
    });

    //添加方法
    function saveData() {

        if (com.validate('quoteItemModal')) {
            return false;
        }
        var url;
        var options = {
            "quoteItem.name": quoteItem.items.name.val(),
            "quoteItem.format" : quoteItem.items.format.val(),
            "quoteItem.measurementunit" : quoteItem.items.measureunit.find("option:selected").text(),
            "quoteItem.unitprice" :  quoteItem.items.unitprice.val(),
            "quoteItem.quoteType.qtid" : quoteItem.items.quoteType.val()
        };

        quoteItem.editFlg ? url = api.production.addQuoteItem : url = api.production.updateQuoteItem, options["quoteItem.qiid"] =  quoteItem.items.qiid;

        com.post(url, options, function(res){
            com.closePopup();
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });
        quoteItem.modals.quoteItemModal.modal("hide");
    }
});