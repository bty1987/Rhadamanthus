/**
 * Created by Administrator on 2017/5/7 0023.
 */


jQuery(function($) {

    if (jQuery().datepicker) {
        $('.date-picker').datepicker({
            autoclose:true,
            format: 'yyyy-mm-dd',//yyyy-mm-dd hh:ii,
        });
    }

    var manifest = {
        saveBtn:  $("#saveBtn"),
        cancellBtn: $("#cancelBtn"),
        manifestItems: {
            orderId : $("#orderId"),
            customerName : $("#customer"),
            des : $("#comment"),
        },
        record: {},
        validator: {
            num: {
                type: "v_num",
                regex: /^[0-9]*[1-9][0-9]*$/,
                errorMsg: "数量输入内容格式错误"
            }
        }

    };

    $.extend(com.validator, manifest.validator);

    var $layerSubmit = $('#layerSubmit');
    //$('input[name="receiverId"]').typeahead({
    //    url: api.system.queryApproveUserForNameByType,//获取下拉列表的接口
    //    list: [],
    //    postData: {
    //        "approveUser.type" : 11
    //    },//获取下拉列表的参数
    //    source: function (query, process) {
    //        var options = $.extend({"user.userNamePinYin": query}, this.options.postData);
    //        com.post(this.options.url, options, $.proxy(this.options.callback, this));
    //    }, matcher: function (item) {
    //        return true;
    //    }, callback: function(data){
    //        this.options.list = data["autoFillKeyValue"];
    //        this.flprocess(this.options.list,["key"], ["value"]);
    //    },
    //    isResultTypeMap : true //必填值为true，获取key，value的标识，
    //    , flupdater: function(k,v){//下拉列表选中时的一些处理，必填对选中项的key和value做处理
    //        return v;
    //    }
    //});

    com.post(api.inventory.queryStorehouseForSelf, {}, function(res){

        var storehousesStatus = [];

        $.each(res.storehouses,function(i,v){
            if(v.status==0){
                storehousesStatus.push(v);
            }
        })

        manifest.storehouses = storehousesStatus;
    }, null, false);

    //添加一条空行
    addline(1).addClass('current').appendTo('#list');

    $('#addSaleOrder').click(function(){

        if(com.validate('list', 'bottom')){
            return;
        }

        var num = $('.line', '#list').length;

        var returnFlag = false;
        var $lines = $('.line', '#list');
        $lines.each(function(){
            var $this = $(this);
        });

        if(returnFlag) return;

        var $line = addline(num + 1);
        $line.appendTo('#list');
    });

    $('#submitSaleOrder').click(function(){

        if(com.validate('list','bottom')){
            return;
        }

        var options = {};

        var $lines = $('li.line', '#list');
        if(!checkInfo()) return;//校验日期
		if(!$lines.length){
            layer.msg('请填写商品');
            return;
        }

        var returnFlag = false;
        $lines.each(function(){

            var $this = $(this);
        });

        if(returnFlag) return;

        if(manifest.totalSum < 0){
            layer.msg("当前录入订单总数小于0",{time:3000});
            return false;
        }

        approvalUtils.initqueryApprovalUser("approver",11);

        openSubmitlayer(function(index,layero){

            var _approval = $('#approver')

            var radios = _approval.find('input:checked').attr('userid');

            if ( radios == null || radios == "") {
                layer.msg('请选择审批人', {time: 3e3});
                return false;
            }

            var manifestTime = $('[name="date"]', '#form').val();//– 货单时间
            var comment = $('#comment').val();//– 备注

            //var receiverId = $('[name="receiverId"]','#form').attr("data-typeahead-key");

            //if(receiverId==undefined || receiverId==null || receiverId==""){
            //    layer.msg('审批人填写不正确',{time:3e3});
            //    return false;
            //}

            options = {
                "approval.receiverId":radios,
                "approval.comment": comment,
                "approvalManifestDB.manifestTime": manifestTime,
                "approvalManifestDB.comment":comment,
                "approvalManifestDB.attachment": ""//– 附件路径
            };


            var $list = $('li.line', '#list');


            $list.length && $list.each(function(i){
                var $this = $(this);

                options["approvalManifestDBItems["+i+"].goods.gid"] = $this.attr('data-pgid');//– 商品id
                options["approvalManifestDBItems["+i+"].color.cid"] = $this.find('.color select').val();//– 颜色id
                options["approvalManifestDBItems["+i+"].format.fid"] = $this.find('.format select').val();//– 规格id

                options["approvalManifestDBItems["+i+"].instorehouse.shId"] = $this.find('.instorehouse select').val();// – 仓库ID
                options["approvalManifestDBItems["+i+"].outstorehouse.shId"] = $this.find('.outstorehouse select').val();//– 仓库ID

                options["approvalManifestDBItems["+i+"].num"] = $this.find('.number input').val();//– 数量
                options["approvalManifestDBItems["+i+"].comment"] = $this.find('.des input').val();// – 说明

            });

            com.post(api.approval.submitApprovalForManifestDB, options, function(data){
                layer.closeAll();
                layer.msg('提交申请成功!', {time:2e3});

                $('#list').empty();
                $('[name="date"]','#form').val(null);
                //$('[name="receiverId"]',"#form").val(null);
                $('#comment').val(null);

                $('#approver').empty()
                //添加一条空行
                addline(1).addClass('current').appendTo('#list');

            }, function(e){
                com.showAlert(com.warning, e.errorMsg);
            });
        });



    });

//补款审批

    function openSubmitlayer(callback) {
        layer.closeAll();
        layer.open({
            type: 1,
            skin: 'layui-layer-lan',
            title: "调拨",
            content: $layerSubmit,
            area: ( $(window).width() * 0.6 < 600 ? $(window).height() * 0.6 : 600 ) + "px",
            maxmin: false,
            zIndex: 9000,
            btn: ['提交', '取消'],
            yes: function (index, layero) {
                callback(index, layero);
            },
            btn2: function (index, layero) {
                //按钮【按钮二】的回调
                $('#approver').empty();
            },
            cancel: function () {
                //右上角关闭回调
                $('#approver').empty();
            }
        });
    }

    //添加一个空行
    function addline(lineindex){

        var $line = $('<li></li>').addClass('line');
        var $indexWrap = $('<div></div>').addClass('line-wrap order').append($('<div></div>').addClass('cell index').text(lineindex));
        var $lineInfoWrap = $('<div></div>').addClass('line-wrap content col10');
        var $optWrap= $('<div></div>').addClass('line-wrap action');
        var _lineInfoSet = [
            {cellClass : "no"},//编号
            {cellClass : "name", hasInput : !0},//名称
            {cellClass : "color",hasSelectColor:!0},//颜色
            {cellClass : "format",hasSelectFormat:!0},//规格
            {cellClass : "measurementUnit"},//单位
            {cellClass : "instorehouse", hasSelect : !0},//仓库
            {cellClass : "outstorehouse", hasSelect : !0},//仓库
            {cellClass : "number", hasInput : !0},//数量
            {cellClass : "pieceNum"},//件数
            {cellClass : "des", hasInput : !0},//备注
        ];

        var $btncheck = $('<a class="green" style="font-size: 18px"><i class="icon-ok"></i></a>');
        var $btndel = $('<a class="red" style="font-size: 18px"><i class=" icon-remove"></i></a>');

        $.each(_lineInfoSet, function(i, v){
            var $input;
            var $cell = $('<div></div>').addClass('cell '+ v.cellClass);
            if(v.hasInput){
                $input = $('<input>').prop({'type' : 'text', 'autocomplete' : 'off'}).addClass('editable');
                if(v.cellClass == "name"){
                    $input.addClass('v_required');
                }
                if(v.cellClass == "number"){
                    $input.addClass('v_num');
                }
                if(v.cellClass == "des"){
                    $input.attr('maxlength', '128');
                }
                $cell.append($input);
            }

            if(v.hasSelect){
                $select = $('<select class="v_required"></select>');
                $select.bindData(manifest.storehouses,"shId","name");
                $cell.append($select);
            }
            if(v.hasSelectColor){
                $select = $('<select class="v_required"></select>');
                $cell.append($select);
            }
            if(v.hasSelectFormat){
                $select = $('<select class="v_required"></select>');
                $cell.append($select);
            }
            $cell.appendTo($lineInfoWrap);

        });

        $lineInfoWrap.find('.name input').typeahead({
            url: api.inventory.queryGoodsByName,
            list: [],
            postData: {},
            source: function (query, process) {
                var params = $.extend({"goods.name" : query,"goods.pinyin" : query,"goods.no":query}, this.options.postData);
                com.post(this.options.url, params, $.proxy(this.options.callback, this));
            }, matcher: function (item) {
                return true;
            }, callback: function(data){
                this.options.list = data['goodes'];
                this.flprocess(this.options.list,'gid', 'name');
            },
            isResultTypeMap : true

            , flupdater: function(k,v){
                //k: key, v:value
                var list = this.options.list;
                $.each(list, function(index, val){
                    if(val.gid == k){
                        $lineInfoWrap.find('.no').text(val.no);
                        $lineInfoWrap.find('.measurementUnit').text(val.measurementUnit);
                        $lineInfoWrap.find('.pieceNum').text(val.pieceNum);
                        $line.attr('data-pgid',val.gid);
                        $line.attr('data-gid',val.gid+'_'+lineindex);

                            com.post(api.inventory.queryColorForEnableByGid,{
                                "color.gid": val.gid
                            },function(res){
                                $('li[data-gid="'+val.gid+'_'+lineindex+'"] .color select').bindData(res.colors,"cid","name");
                            });
                            com .post(api.inventory.queryFormatForEnableByGid,{
                                "format.gid": val.gid
                            },function(res){
                                $('li[data-gid="'+val.gid+'_'+lineindex+'"] .format select').bindData(res.formats,"fid","info");
                            });
                    }

                });

                return v;
            }

        });

        $optWrap.append($('<div></div>').addClass('cell option').append($btncheck).append($btndel));

        $line.append($indexWrap).append($lineInfoWrap).append($optWrap);

         $btncheck.click(function(e){
             e.stopPropagation();

             if(com.validate('list', 'bottom')){
                 return;
             }


         });

         $btndel.click(function(e){
             e.stopPropagation();
             $line.remove();
             reorder();
         });

        return $line;

    }
    //重排序
    function reorder(){
        var $list = $('.line', '#list');
        $list.length && $list.each(function(i){
            var $this = $(this);
            $this.find('.index').text(i + 1);
        });
    }
    //校验日期
    function checkInfo(){

        var flag = true;

        var date = $('[name="date"]','#form');
        if(!date.val()){
            date.focus().select();

            date.addClass('popover-notitle').attr({
                "data-rel" : "popover",
                "data-placement" : "bottom",
                "data-original-title" : "",
                "title" : "",
                "data-content" : ""

            }).popover('show');

            flag =  false;
        }else{
            date.popover('destroy');
        }

        return flag;

    }

});
