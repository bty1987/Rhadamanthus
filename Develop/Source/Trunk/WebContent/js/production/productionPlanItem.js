/**
 * Created by Administrator on 2017/7/26 0026.
 */
jQuery(function ($) {

    var ppid = params["productionPlan.ppid"];
    var $productionStatus = params["production"];
    var $productionPlanStatus = params["productionPlan.status"]

    var displayFunc = (function () {
        var renderList = function(tableId,listData){
            var $tableWrap = $('#'+tableId);
            var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

            if(listData && listData.length){
                $.each(listData,function(i,v){

                    var $liLine = $('<li></li>').addClass('item-blue clearfix');
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $h3 = $('<h3></h3>').css({color:'grey',"font-weight":"bold"}).html(' ' + v.name);
                    var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');

                    var $btnDel = $('<a></a>').addClass(' btn btn-minier').html('删除');

                    var propertyArr = [
                        ["类型编号:", v.typeno, "grey"],
                        ["高:",v.height,"grey"],
                        ["宽:",v.width,"grey"],
                        ["厚:",v.thick,"grey"],
                        ["面积(平方米):",utils.accMul(parseFloat(utils.accDiv(v.height,100)),parseFloat(utils.accDiv(v.width,100))),"grey"],
                        //["颜色:",v.color,"grey"],
                        //["单价:",v.unitprice,"grey"],
                        ["数量:",v.num,"grey"],
                        //["总价:",v.total,"grey"],
                        ["说明:",v.comment,"grey"],
                    ];

                    $.each(propertyArr, function (index,value) {
                        var $liProperty = $('<li></li>').css({"border-bottom":"0px"});
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).css({color:value[2]}).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    $btnDiv.append($btnDel);
                    $btnDiv.appendTo($h3);
                    $liLine.appendTo($ul);
                    $liLine.append($h3).append($ulProperty);
                    hidBtn($btnDel,$productionPlanStatus);

                    $btnDel.click(function () {
                        layer.confirm('是否删除？', {
                            btn: ['确定', '取消'] //按钮
                        }, function (index, layero) {
                            var ppiid = v.ppiid;
                            deleteProductionPlanItem(ppiid);
                        }, function () {
                        });
                    });

                });
                $ul.appendTo($tableWrap);
            }
        };
        return {
            init : function(tableId,listData){
                $('#' + tableId).html(null);
                renderList(tableId,listData);
            }
        }
    })();

    var searcher  = new Searcher();
    searcher.init([],'condList',api.production.pageProductionPlanItemByPpid,function (data) {
        displayFunc.init('resultList', data);
    },"pagenation","productionPlanItemPostData",{"productionPlanItem.productionPlan.ppid" :ppid},false,null,function () {
        var $adda = $('<a></a>').addClass('btn btn-xs btn-info pull-left').attr('name', 'add').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);
        hidBtn($adda,$productionPlanStatus);

        $adda.click(function () {
        	 $('#layerAddItem').find('input').val("");
            addProductionPlanItem(function (index,lyero) {
                if(submitValidate() && checkFormat()){
                    addItem();
                    layer.closeAll();
                }
            });
        });

        var $back = $('<a></a>').addClass('btn btn-xs pull-left').attr('name', 'back').css("margin", "0px 3px");
        var $backi = $('<i></i>').addClass('m-icon-swapleft').appendTo($back);
        var $backspan = $('<span></span>').text('返回').appendTo($back);
        $back.click(function () {
            com.switchPage(api.index.productionPlanIndex.url);
        });
        return [$adda,$back];

    });

    function submitValidate() {
        var flag = true;
        var $name = $('#itemName');
        var $height = $('#height');
        var $width = $('#width');
        var $thick = $('#thick');
        var $num = $('#num');

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
        if(!$height.val()){
            $height.focus().select();
            $height.addClass('popover-notitle').attr({
                "data-rel" : "popover",
                "data-placement" : "top",
                "data-original-title" : "",
                "title" : "",
                "data-content" : "请填写高"
            }).popover('show');
            flag =  false;
        }else{
            $height.popover('destroy');
        }
        if(!$width.val()){
            $width.focus().select();
            $width.addClass('popover-notitle').attr({
                "data-rel" : "popover",
                "data-placement" : "top",
                "data-original-title" : "",
                "title" : "",
                "data-content" : "请填写宽"
            }).popover('show');
            flag =  false;
        }else{
            $width.popover('destroy');
        }
        if(!$thick.val()){
            $thick.focus().select();
            $thick.addClass('popover-notitle').attr({
                "data-rel" : "popover",
                "data-placement" : "top",
                "data-original-title" : "",
                "title" : "",
                "data-content" : "请填写厚"
            }).popover('show');
            flag =  false;
        }else{
            $thick.popover('destroy');
        }
        if(!$num.val()){
            $num.focus().select();
            $num.addClass('popover-notitle').attr({
                "data-rel" : "popover",
                "data-placement" : "top",
                "data-original-title" : "",
                "title" : "",
                "data-content" : "请填写数量"
            }).popover('show');
            flag =  false;
        }else{
            $num.popover('destroy');
        }
        return flag;
    }

    function addProductionPlanItem(callback){
        layer.closeAll();
        layer.open({
            type: 1,
            skin: 'layui-layer-lan',
            title: "新增",
            content: $('#layerAddItem'),
            area: ( $(window).width() * 0.6 < 620 ? $(window).height() * 0.6 : 620 ) + "px",
            maxmin: true,
            zIndex: 9999,
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                callback(index,layero)
            },
            btn2: function (index, layero) {
                //按钮【按钮二】的回调
            },
            cancel: function () {
                //右上角关闭回调
            }
        });
    }

    function deleteProductionPlanItem(id) {
        if(id){
            com.post(api.production.deleteProductionPlanItem,{
                "productionPlanItem.ppiid":id
            },function (res) {
                searcher.doSearch();
                layer.closeAll();
                layer.msg('删除成功');
            },function () {
                layer.msg('删除失败')
            })
        }
    }
    
    function addItem() {
        var option = [];
        option["productionPlanItem.productionPlan.ppid"] = ppid;
        option["productionPlanItem.typeno"] = $('#typeno').val();
        option["productionPlanItem.name"] = $('#itemName').val();
        option["productionPlanItem.height"] = $('#height').val();
        option["productionPlanItem.width"] = $('#width').val();
        option["productionPlanItem.thick"] = $('#thick').val();
        option["productionPlanItem.color"] = $('#color').val();
        option["productionPlanItem.unitprice"] = $('#unitprice').val();
        option["productionPlanItem.num"] = $('#num').val();
        option["productionPlanItem.total"] = $('#total').val();
        option["productionPlanItem.comment"] = $('#comment').val();
        com.post(api.production.addProductionPlanItem,option,function (res) {
            layer.msg("添加成功");
            searcher.doSearch();
        },function () {
            layer.msg("添加失败");
        })

    }

    function checkFormat(){
        var flag = true;
        ////检验长宽高
        var $height = $('#height');
        var heightRex = /^(\d+|\d+\.[0-9]{1,4})$/;
        if(!heightRex.test($height.val()) || parseFloat($height.val())<0){
        	$height.focus().select();
        	$height.addClass('popover-notitle').attr({
                "data-rel" : "popover",
                "data-placement" : "right",
                "data-original-title" : "",
                "title" : "",
                "data-content" : "高 格式输入错误"
            }).popover('show');
            flag= false;
        }else{
        	$height.popover('destroy');
        }

        var $width = $('#width');
        var widthRex = /^(\d+|\d+\.[0-9]{1,4})$/;
        if(!widthRex.test($width.val()) || parseFloat($width.val())<0){
        	$width.focus().select();
        	$width.addClass('popover-notitle').attr({
                "data-rel" : "popover",
                "data-placement" : "right",
                "data-original-title" : "",
                "title" : "",
                "data-content" : "宽 格式输入错误"
            }).popover('show');
            flag= false;
        }else{
        	$width.popover('destroy');
        }

        var $thick = $('#thick');
        var thickRex = /^(\d+|\d+\.[0-9]{1,4})$/;
        if(!thickRex.test($thick.val()) || parseFloat($thick.val())<0){
        	$thick.focus().select();
        	$thick.addClass('popover-notitle').attr({
                "data-rel" : "popover",
                "data-placement" : "right",
                "data-original-title" : "",
                "title" : "",
                "data-content" : "厚 格式输入错误"
            }).popover('show');
            flag= false;
        }else{
        	$thick.popover('destroy');
        }

        var $num = $('#num');
        var numRex = /^(\d+|\d+\.[0-9]{1,4})$/;
        if(!numRex.test($num.val()) || parseFloat($num.val())<0){
        	$num.focus().select();
        	$num.addClass('popover-notitle').attr({
                "data-rel" : "popover",
                "data-placement" : "right",
                "data-original-title" : "",
                "title" : "",
                "data-content" : "数量格式输入错误"
            }).popover('show');
            flag= false;
        }else{
        	$num.popover('destroy');
        }
        return flag;
    }

    function hidBtn(btnId,otherStatus){
        btnId.removeClass('hide');
        if ($productionStatus == 5 || $productionStatus == 4 || $productionStatus == 3) {
            btnId.addClass('hide');
        }else if(otherStatus != 0 ){
            btnId.addClass('hide');
        }

    }

});