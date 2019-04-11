/**
 * Created by Administrator on 2017/4/6.
 */

$(function () {

    /**
     * 回调函数必须提供 init(tableId, result.list)方法 tableId ，用来显示的div的id result.list
     * 列表的json数组
     */
    var goodsPricePopUp = com.focusPage('#goodsPricePopUp');

    var validator = {
        num: {
            type: "v_num",
            regex: /^(\d+|\d+\.[0-9]{1,4})$/,
            errorMsg: "数量输入内容格式错误"
        },
        priceType: {
            type: "v_priceType",
            regex: /^(0([\.]?\d*[0-9]+)|0|1)$/,
            errorMsg: "结算值在0-1之间"
        }
    };

    $.extend(com.validator, validator);


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

        var createTableTitle = function () {

            var $ulTitle = $('<ul></ul>').addClass('flex-table');
            var $liTitle = $('<li></li>').addClass('line table-title');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html(
                $('<div></div>').addClass('cell index'));
            var $contentWrap = $('<div></div>').addClass(
                'line-wrap  content col7');

            var titleName = '价格说明,进价,售价,结算类型,结算值,类型';

            $.each(titleName.split(','), function (i, v) {
                var $cell = $('<div></div>').addClass('cell').html(v);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action')
                .html($('<div>操作</div>').addClass('cell option'));

            $liTitle.append($indexWrap).append($contentWrap)
                .append($optionWrap).appendTo($ulTitle);

            return $ulTitle;
        };

        var creatLine = function (i, v, lastFlag) {

            var $liLine = $('<li></li>').addClass('line');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html(
                $('<div></div>').addClass('cell index').html(i + 1));
            var $contentWrap = $('<div></div>').addClass(
                'line-wrap  content col7');

            var propertyArr = [
                // v.gid,
                [v.name,'grey'],
                [v.purchase,'blue'],
                [v.selling,'blue'],
                [v.ctype == "0" ? "底价" : "点位",'red'],
                [v.cvalue,'blue'],
                [v.type == "0" ? "正价" : "特价",'red']
            ];

            $.each(propertyArr, function (i, v) {
                var $cell = $('<div></div>').addClass('cell '+ v[1]).html(v[0]);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action');
            var $cellOption = $('<div></div>').addClass('cell option');

            var $btnGroup = $('<div></div>').addClass('btn-group');
            var $btn = $('<button></button>').addClass(
                'btn btn-primary dropdown-toggle').attr('data-toggle', 'dropdown')
                .append('操作').append('<i class="icon-angle-down"></i>');
            var $btnUl = $('<ul></ul>').addClass('dropdown-menu').addClass(
                lastFlag ? 'bottom-up' : '');

            var $btnDelete = $('<li></li>').append($('<a></a>').html('删除'));

            $btnUl.append($btnDelete);

            $btnGroup.append($btn).append($btnUl).appendTo($cellOption);

            $cellOption.appendTo($optionWrap);

            $liLine.append($indexWrap).append($contentWrap).append($optionWrap);

            $btnDelete.click(function () {
                layer.confirm('是否确定删除？', {
                    btn: ['确定', '取消']
                    // 按钮
                }, function (index, layero) {
                    deleteManifestTemplate(v.pid, function () {
                        layer.msg('删除成功', {icon:1});
                        doSearcher();
                    });
                }, function (e) {
                    com.showAlert(com.error, e.errorMsg);
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
        }
    })();

    function doSearcher() {
        com.post(api.inventory.queryPriceByGid, {
            "price.gid": goodsPricePopUp.attr('data-gid')
        }, function (res) {
            displayFunc.init('resultListPrice', res.prices);
        })
    }

    doSearcher();

    function addline(lineindex) {

        var $line = $('<li></li>').addClass('line');
        var $indexWrap = $('<div></div>').addClass('line-wrap order').append($('<div></div>').addClass('cell index').text(lineindex));
        var $lineInfoWrap = $('<div></div>').addClass('line-wrap content col7');
        var $optWrap = $('<div></div>').addClass('line-wrap action');
        var _lineInfoSet = [
            {cellClass : "name", hasInput : !0},//名称
            {cellClass : "purchase", hasInput : !0},//名称
            {cellClass : "selling", hasInput : !0},//名称
            {cellClass : "ctype", hasSelect : !0},//名称
            {cellClass : "cvalue", hasInput : !0},//名称
            {cellClass : "type", hasSelect : !0}
        ];
        var $btncheck = $('<a class="color-green green" style="font-size: 18px"><i class="icon-ok"></i></a>');
        var $btndel = $('<a class="color-red red" style="font-size: 18px"><i class=" icon-remove"></i></a>');
        $.each(_lineInfoSet, function (i, v) {
            var $input;
            var $select;
            var $cell = $('<div></div>').addClass('cell ' + v.cellClass);
            if (v.hasInput) {
                $input = $('<input>').prop({'type': 'text', 'autocomplete': 'off'}).attr('data-toggle','popover').attr('data-placement','bottom').addClass('editable v_required');
                $cell.append($input);
            }
            if(v.hasSelect){
                $select = $('<select style="width: 100%;"></select>');
                $cell.append($select);
            }
            if(v.cellClass == "purchase" || v.cellClass == "selling"){
                $input.addClass('v_float');
            }

            $cell.appendTo($lineInfoWrap);

        });

        $optWrap.append($('<div></div>').addClass('cell option').append($btncheck).append($btndel));

        $line.append($indexWrap).append($lineInfoWrap).append($optWrap);

        com.post(api.ds.manifest,{},function(res){
            $lineInfoWrap.find('.ctype select').bindData(res.priceTypes,'key','value');
            $lineInfoWrap.find('.type select').bindData(res.type, 'key','value');
        });

        $btncheck.click(function (e) {
            e.stopPropagation();
            if($lineInfoWrap.find('.ctype select').val() == 0){
                $lineInfoWrap.find('.cvalue input').removeClass('v_priceType').addClass('v_float');
            }else if($lineInfoWrap.find('.ctype select').val() == 1){
                $lineInfoWrap.find('.cvalue input').removeClass('v_float').addClass('v_priceType');
            }

            if(com.validate('addPrice','bottom')){
                return;
            }
            var gid = $(this).parents('li.line.current').attr('data-gid');
            var options = {
                "price.gid":goodsPricePopUp.attr('data-gid'),
                "price.name": $lineInfoWrap.find('.name input').val(),
                "price.purchase": $lineInfoWrap.find('.purchase input').val(),
                "price.selling": $lineInfoWrap.find('.selling input').val(),
                "price.ctype": $lineInfoWrap.find('.ctype select').val(),
                "price.cvalue": $lineInfoWrap.find('.cvalue input').val(),
                "price.type": $lineInfoWrap.find('.type select').val()
            };


            //if(checkRowValue($line)){
                com.post(api.inventory.addPrice,options,function(){
                    com.focusPage('#list').empty();
                    addline(1).addClass('current').appendTo(com.focusPage('#list'));
                    com.post(api.inventory.queryPriceByGid,{
                        "price.gid":goodsPricePopUp.attr('data-gid')
                    },function(data){
                        displayFunc.init('resultListPrice',data.prices);
                        doSearcher();
                    })
                },function(e){
                    com.showAlert(com.error, e.errorMsg);
                });
            //}

        });

        $btndel.click(function (e) {

            com.focusPage('#list').empty();

            addline(1).addClass('current').appendTo(com.focusPage('#list'));

        });

        return $line;

    }
    addline(1).addClass('current').appendTo(com.focusPage('#list'));

    function deleteManifestTemplate(id, callback) {
        com.post(api.inventory.deletePrice, {
            "price.pid": id
        }, function (res) {
            callback();
            doSearcher();
        })
    }

    function checkRowValue($line){

        var flag = true;
        var numRex = /^(\d+|\d+\.[0-9]{1,4})$/;//只为正数的，包括(小数)

        var name = $line.find('.name input');
        if(!name.val()){
            name.focus().select();

            name.addClass('popover-notitle').attr({
                "data-rel" : "popover",
                "data-placement" : "top",
                "data-original-title" : "",
                "title" : "",
                "data-content" : "请填写价格信息"

            }).popover('show');

            flag =  false;
        }else{
            name.popover('destroy');
        }

        var purchase = $line.find('.purchase input');

        if(!purchase.val() ){
            purchase.focus().select();

            purchase.addClass('popover-notitle').attr({
                "data-rel" : "popover",
                "data-placement" : "top",
                "data-original-title" : "",
                "title" : "",
                "data-content" : "请填写进价"

            }).popover('show');

            flag =  false;
        }else{
            purchase.popover('destroy');
        }

        if(!checkNumFormat(purchase,'进价格式错误')){
            flag = false;
        }


        var selling = $line.find('.selling input');
        if(!selling.val()){
            selling.focus().select();

            selling.addClass('popover-notitle').attr({
                "data-rel" : "popover",
                "data-placement" : "top",
                "data-original-title" : "",
                "title" : "",
                "data-content" : "请填写售价"

            }).popover('show');

            flag =  false;
        }else{
            selling.popover('destroy');
        }

        if(!checkNumFormat(selling,'售价格式错误')){
            flag = false;
        }


        var ctype = $line.find('.ctype select');
        var cvalue = $line.find('.cvalue input');


        if(cvalue.val() == null || cvalue.val() == ""){
            cvalue.focus().select();

            cvalue.addClass('popover-notitle').attr({
                "data-rel" : "popover",
                "data-placement" : "top",
                "data-original-title" : "",
                "title" : "",
                "data-content" : "请填写结算值"

            }).popover('show');

            flag =  false;
        }else{
            cvalue.popover('destroy');
        }

        //if(!checkNumFormat(cvalue,'结算值格式错误')){
        //    flag = false;
        //}

        if(!checkNum(ctype,cvalue)){
            flag = false;
        }

        return flag;
    }

    function checkNumFormat($input,message){

        var numRex = /^(\d+|\d+\.[0-9]{1,4})$/;

        if(!numRex.test($input.val())){
            $input.addClass('popover-notitle').attr({
                "data-rel" : "popover",
                "data-placement" : "top",
                "data-original-title" : "",
                "title" : "",
                "data-content" : message

            }).popover('show');

            return false;
        }else{
            $input.popover('destroy');
            return true;
        }
    }

    function checkNum($type,$input){
        if($type.val() == 0){
            var numRex = /^(\d+|\d+\.[0-9]{1,4})$/;

            if(!numRex.test($input.val())){
                $input.addClass('popover-notitle').attr({
                    "data-rel" : "popover",
                    "data-placement" : "top",
                    "data-original-title" : "",
                    "title" : "",
                    "data-content" : "结算值格式错误"

                }).popover('show');

                return false;
            }else{
                $input.popover('destroy');
                return true;
            }
        }else if($type.val() == 1){
            var reg = /^(0([\.]?\d*[0-9]+)|0|1)$/;
            var value = $input.val();
            if(!reg.test(value)){
                $input.addClass('popover-notitle').attr({
                    "data-rel" : "popover",
                    "data-placement" : "bottom",
                    "data-original-title" : "",
                    "title" : "",
                    "data-content" : "结算值在0-1之间"

                }).popover('show');

                return false;
            }else{
                $input.popover('destroy');
                return true;
            }

        }

    }

    com.focusPage('.layui-layer-content').css('overflow', 'hidden');
    com.focusPage('#showPrice').css('height', '560px');
    com.focusPage('#resultListPrice').css({
        'width': '96%',
        'margin': '0 auto',
        'height': '560px',
        'marigin-top': '20px',
        'overflow-y': 'scroll'
    });
    com.focusPage('#addPrice').css({'width': '96%', 'margin': '0 auto', 'margin-top': '15px'})

});
