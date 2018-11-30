$(function(){
    var address = {
        addressItems:{},
        editFlg: false,
        repeatFlg: false
    };

    address.addressItems.name = com.focusPage("#name1");
    address.addressItems.phone = com.focusPage("#phone1");
    address.addressItems.province = com.focusPage("#province");
    address.addressItems.city = com.focusPage("#city");
    address.addressItems.proper = com.focusPage("#proper");
    address.addressItems.address = com.focusPage("#address");
    var userAddressPopUp = com.focusPage('#userAddressPopUp');

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
                $('#resultListAddress').css({'width':'96%','margin':'0 auto','height':'560px','marigin-top':'20px'})
            }
        };

        /*表格头*/
        var createTableTitle = function(){
            var $ulTitle = $('<ul></ul>').addClass('flex-table');
            var $liTitle = $('<li></li>').addClass('line table-title');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index'));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col3');

            var titleName = '姓名,电话,地址';

            $.each(titleName.split(','), function (i, v) {
                var $cell = $('<div></div>').addClass('cell').html(v);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action').html($('<div>操作</div>').addClass('cell option'));

            $liTitle.append($indexWrap).append($contentWrap).append($optionWrap).appendTo($ulTitle);
            return $ulTitle;
        };

        /*表格体*/
        var creatLine = function (i, v, lastFlag) {
            var $liLine = $('<li></li>').addClass('line');
            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(i + 1));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col3');

            var propertyArr = [
                [v.name,'grey'],
                [v.phone,'grey'],
                // [v.status =="0" ? "启用" : "禁用",'red'],
                [v.province+v.city+v.proper+v.address,'grey']
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

            var $update = $('<li></li>').append($('<a></a>').html('编辑'));

            $btnUl.append($update);
            $btnGroup.append($btn).append($btnUl).appendTo($cellOption);

            $cellOption.appendTo($optionWrap);

            $liLine.append($indexWrap).append($contentWrap).append($optionWrap);

            $update.click(function(){
                clearForm('form2');
                editBrand(v);
                openlayer(function(index, layero){
                    if(com.validate('form2'))
                        return;
                    //编辑
                    updateData(v, function(){
                        com.clearValidator("#aid", true);
                        com.clearValidator("#name", true);
                        com.clearValidator();
                        layer.closeAll();
                    });
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
        }
    })();

    doSearcher();

    function doSearcher() {
        com.post(api.store.queryAddressByUid, {"address.uid": userAddressPopUp.attr("data-uid")}, function (res) {
            displayFunc.init('resultListAddress', res.addresses);
        });
    }

    function addline(lineindex) {
        var $line = $('<li></li>').addClass('line');
        var $indexWrap = $('<div></div>').addClass('line-wrap order').append($('<div></div>').addClass('cell index').text(lineindex));
        var $lineInfoWrap = $('<div></div>').addClass('line-wrap content col1');
        var $optWrap = $('<div></div>').addClass('line-wrap action');
        var _lineInfoSet = [{cellClass : "info", hasInput : !0}];
        var $btncheck = $('<a class="color-green green" style="font-size: 18px"><i class="icon-ok"></i></a>');
        var $btndel = $('<a class="color-red red" style="font-size: 18px"><i class=" icon-remove"></i></a>');

        $.each(_lineInfoSet, function (i, v) {
            var $input;
            var $cell = $('<div></div>').addClass('cell ' + v.cellClass);
            if (v.hasInput) {
                $input = $('<input>').prop({'type': 'text', 'autocomplete': 'off'}).addClass('editable v_required');
                $cell.append($input);
            }
            $cell.appendTo($lineInfoWrap);
        });

        $btndel.click(function (e) {
            com.focusPage('#list').empty();
            addline(1).addClass('current').appendTo('#list');
        });
        return $line;
    }

    addline(1).addClass('current').appendTo('#list');

    function editBrand(v){
        com.clearValidator();
        address.addressItems.name.val(v.name);
        address.addressItems.phone.val(v.phone);
        address.addressItems.province.val(v.province);
        address.addressItems.city.val(v.city);
        address.addressItems.proper.val(v.proper);
        address.addressItems.address.val(v.address);
    }

    function updateData(v,callback){
        var $layer = com.focusPage('#layerAdd2');
        var name = com.focusPage("#name1").val();
        var province = com.focusPage("#province").val();
        var city = com.focusPage("#city").val();
        var proper = com.focusPage("#proper").val();
        var address = com.focusPage("#address").val();
        com.post(api.store.updateBaseAddress, {
            "muser.unionId": userAddressPopUp.attr("data-unionid"),
            'address.aid':v.aid,
            "address.name": name,
            "address.province": province,
            "address.city": city,
            "address.proper": proper,
            "address.address":address
        }, function(res){
            callback();
        });
    }

    function clearForm(formId){
        var $form = com.focusPage("#"+formId);
        var error = com.focusPage('.alert-error', $form);
        var success = com.focusPage('.alert-success', $form);
        com.focusPage('.control-group').removeClass("success").removeClass("error");
        com.focusPage(".ok").remove();
        com.focusPage(".help-inline").remove();
        success.hide();
        error.hide();
        com.focusPage("span.checked",$form).removeClass("checked");
        com.focusPage("tr.edit-on").removeClass("edit-on");
        $form.removeClass("edit-item");
        com.focusPage(".extra-wrap .control-group:not(.hide)").remove();//去掉辅助项
        com.focusPage('input[type="hidden"]',$form).val('');
        document.getElementById(formId).reset();
    }

    function openlayer(callback){
        layer.open({
            type: 1,
            title:"                                              ",
            content: com.focusPage('#layerAdd2'),
            area: ( $(window).width()*0.6 < 620 ?  $(window).height()*0.6 : 620 )+"px",
            maxmin: false,
            btn: ['确定', '取消'],
            yes: function(index, layero){
                callback(index,layero);
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

    com.focusPage('.layui-layer-content').css('overflow', 'hidden');
    com.focusPage('#showAddress').css('height', '680px');
    com.focusPage('#showAddress').css('overflow-y', 'scroll');
    
});
