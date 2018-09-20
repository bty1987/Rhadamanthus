
$(function(){
    var muser = {
        muserItems:{},
        editFlg: false,
        repeatFlg: false
    };

    muser.muserItems.name = $("#name");
    muser.muserItems.phone = $("#phone");
    muser.muserItems.unionvid = $("#unionvid");
    muser.muserItems.gender = $("#gender");
    muser.muserItems.birthday = $("#birthday");

    var displayFunc  = (function(){
        /*表格样式*/
        var renderList = function(tableId,listData){
            var $tableWrap = $('#' + tableId);

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
            var titleName ='姓名,电话,性别,生日';

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
                [v.name,'grey'],
                [v.phone == null ? "无": v.phone ,'black'],
                [v.gender =="0" ? "女" : "男",'red'],
                [v.birthday == null ? "无" : v.birthday ,'red']
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
            var $address = $('<li></li>').append($('<a></a>').html('地址'));

            $btnUl
                .append($address)
                .append($update);
            $btnUl
                .append($address)
                .append($update);

            $btnGroup
                .append($btn)
                .append($btnUl)
                .appendTo($cellOption);

            $cellOption.appendTo($optionWrap);

            $liLine.append($indexWrap)
                .append($contentWrap)
                .append($optionWrap);

            //地址点击事件
            $address.click(function () {
                openLayerSwitch('userAddressPopUp', v.uid, v.unionId, '地址', 'views/store/address.html');
            });

            //编辑
            $update.click(function(){
                clearForm('form1');
                editBrand(v);
                openlayer(function(index, layero){
                    if(com.validate('form1'))
                        return;
                    //编辑
                    updateData(v, function(){
                        com.clearValidator("#uid", true);
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
                $('#' + tableId).html(null);
                renderList(tableId,listData);
            },
            drawLine : function(v){
                return creatLine(v);
            }
        };
    })();

    /*分页*/
    var _condArr = ["muserName"];
    var muserSeacher = new Searcher();
    muserSeacher.init( _condArr, "condList", api.store.pageMuser, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "muserPostData", null, false, null, function() {

    },'resultList');

    function openLayerSwitch(id, uid, unionid, title, url) {
        var $PopUp = $('#' + id);
        $PopUp.attr({'data-unionid': unionid});
        $PopUp.attr({'data-uid': uid});

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
                $PopUp.attr({'data-uid': null});
                $PopUp.attr({'data-unionid': null});
                $PopUp.empty();
                muserSeacher.doSearch();
            }
        });
    }

    function clearForm(formId){
        var $form = $("#"+formId);
        var error = $('.alert-error', $form);
        var success = $('.alert-success', $form);
        $('.control-group').removeClass("success").removeClass("error");
        $(".ok").remove();
        $(".help-inline").remove();
        success.hide();
        error.hide();
        $("span.checked",$form).removeClass("checked");
        $("tr.edit-on").removeClass("edit-on");
        $form.removeClass("edit-item");
        $(".extra-wrap .control-group:not(.hide)").remove();//去掉辅助项
        $('input[type="hidden"]',$form).val('');
        document.getElementById(formId).reset();
    }

    function openlayer(callback){
        layer.closeAll();
        layer.open({
            type: 1,
            //skin: 'layui-layer-lan',
            title:"                                              ",
            content: $('#layerAdd'),
            area: ( $(window).width()*0.6 < 620 ?  $(window).height()*0.6 : 620 )+"px",
            maxmin: false,
            zIndex:9000,
            btn: ['确定', '取消'],
            yes: function(index, layero){
                callback(index,layero);
            },
            btn2: function(index, layero){
                $(".dropdown-menu").css("z-index", 9999).css("top","38px");
                //按钮【按钮二】的回调
                com.clearValidator();
            },
            cancel: function(){
                $(".dropdown-menu").css("z-index", 9999).css("top","38px");
                //右上角关闭回调
            }
        });
    }

    $(".date-picker").datepicker({autoclose:!0}).on("show",function() {
        setTimeout(function() {
            $(".dropdown-menu").css("z-index", 9999).css("top","510px");
        }, 0)
    }).next().on(ace.click_event,function() {
        a(this).prev().focus()
    });

    function editBrand(v){
        com.clearValidator();
        muser.muserItems.name.val(v.name);
        muser.muserItems.phone.val(v.phone);
        muser.muserItems.gender.val(v.gender);
        muser.muserItems.birthday.val(v.birthday);
    }
    function updateData(v,callback){
        var $layer = $('#layerAdd');
        var phone = $("#phone").val();
        var name = $("#name").val();
        var gender = $("#gender").val();
        var birthday = $("#birthday").val();
        com.post(api.store.saveMuser, {
            "muser.unionId": v.unionId,
            "muser.phone": phone,
            "muser.name": name,
            "muser.gender": gender,
            "muser.birthday": birthday
        }, function(res){
            callback();
            muserSeacher.doSearch();
        });
    }
});

