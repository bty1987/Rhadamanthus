
jQuery(function () {
   // var returnBtn = $('#returnBtn');
    var puotation={
        typeahead: {
            quoteItems: "quoteItems",
            quoteItem :"quoteItem",
        },
        qiids:null,
        quoteTypes:null,
        flag:true,
        puotation:{},
        puotationItem:{},
    };
    //报价项区 自动赋值
    $('#left').find('#name').typeahead({
        url: api.production.queryQuoteItemByPinyin,
        list: [],
        postData: {},
        source: function (query, process) {
            var params = $.extend({"quoteItem.name" : query,"quoteItem.pinyin":query}, this.options.postData);
            com.post(this.options.url, params, $.proxy(this.options.callback, this));
        },
        matcher: function (item) {
            return true;
        },
        callback: function(data){
            puotation.flag = true;
            this.options.list = data['quoteItems'];
            this.flprocess(this.options.list,'qiid', 'name');
            $('.typeahead').css("left","33px");
        },
        isResultTypeMap : true,
        flupdater: function(k,v){
            //k---qiid  v---name
            $('#left').find('input').val("");
            $('#left').find('select').empty();
        	var priceOption = {};
            var $content = $('#left');
            puotation.qiids = k;
            //查询报价项信息
            var list = this.options.list;

            $.each(list, function(index,val){
                if(val.qiid == k){
                    $content.find('#name').val(val.name);
                    $content.find('#unitprice').val(val.unitprice);
                    $content.find('#brand').val(val.quoteType.name);
                    puotation.quoteTypes = val.quoteType.qtid;
                    $content.find('#format1').val(val.format);
                    $content.find('#measurementunit').val(val.measurementunit);
                    $content.find('#num').val(1);
                    $content.find('#total').val(utils.accMul(parseFloat($content.find('#unitprice').val()),parseFloat($content.find('#num').val())));
                    $content.find('#name').attr('data-name',val.name);
                }
            });
            return v;
        }
    });

    //点击添加按钮
    $("#add").click(function () {
        if(!calctotal()){return false}
        var $line=$('#left');
        var _name=$('#left').find('#name').attr('data-name')
        if(checkNum($line)==true && puotation.flag==true){
            var $liList = $('<li></li>').addClass('list-group-item');
            var $delete = $('<div></div>').addClass('pull-right action-button').append($('<a></a>').addClass('btn btn-minier btn-danger _delete').html('删除'));
            var $h4 = $('<h4></h4>').html(_name).attr('data-qutoName',_name);
            $h4.append($delete).appendTo($liList);
            $liList.append(addSpan(' 类型： ','s_brand',$('#brand').val()," ",'b_brand',puotation.quoteTypes)).
                append(addSpan(' 单位： ','s_unit',$('#measurementunit').val()," ",'b_unit',null)).
                append(addSpan(' 规格：','s_format',$('#format1').val()," ",'b_format',null)).
                append(addSpan(' 长度：','s_height',$('#height').val()," ",'b_height',null)).
                append(addSpan(' 宽度：','s_width',$('#width').val()," ",'b_width',null)).
                append(addSpan(' 厚度：','s_thick',$('#thick').val()," ",'b_thick',null)).
                append(addSpan(' 面积：','s_area',$('#area').val()," ",'b_area',null)).
                append(addSpan(' 售价：','s_unitprice',$('#unitprice').val(),'blue','b_unitprice',null)).
                append(addSpan(' 数量：','s_number',$('#num').val(),'red','b_number')).
                append(addSpan(' 总价：','s_total',$('#total').val(),'blue','b_total',null)).
                append(addSpan(' 备注：','s_remark',$('#remark').val()," ",'b_remark',null)).
                append(addSpan(' 特型：','s_specil',$('#specil').val()," ",'b_specil',null)).
                append($('<span></span>').text($('#bid').val()).attr("id","invisiblePurchase"));
                $('#puotationItemList').append($liList);
                //给最后一个li标签加上底框,除了最后一个li 其他的li均无底框
                //$('.list-group-item').css("border-bottom","none");
                //$('.list-group-item:last').css("border-bottom","grey solid 1px");
                //清空左侧
                $('#left').find('input').val("");
                $('#left').find('select').empty();

            $delete.click(function () {
                var $this = $(this);
                var $totals = $('#totals');

                var $liParent = $this.parent().parent();

                var deleteNum = -Number($liParent.find('.s_total').find('.b_total').text());
                var totalNum = parseFloat(utils.accAdd($totals.val(),deleteNum));
                $totals.val(totalNum);
                $liParent.remove();
                //$('.list-group-item:last').css("border-bottom","solid 1px");
            });
        }else if(puotation.flag == false){
            com.showAlert(com.warning,"商品信息不完善，请先完善商品信息");
        }
        $('#totals').val(cycTotals());
    });

    $('#refresh').click(function () {
        $('#left').find('input').val("");
        $('#left').find('select').empty();
    });

    function addSpan(sValue,sclass,bValue,color,attrs,addData) {
        var $span = $('<span></span>').addClass(sclass);
        if(sValue!=null){
            $span.html(sValue);
        }
        if(bValue!=null) {
            var $b = $('<b></b>').html(bValue);
        }
        if(color!=null){
            $b.addClass(color+" "+attrs).attr('addData',addData);
        }
        return $span.append($b);
    }


    $('#unitprice,#num').on("change",function () {
        calctotal();
    });

    $('#thick').on("blur",function () {
        var $width = $('#left').find('#width').val();
        var $height = $('#left').find('#height').val();
        $('#left').find('#area').val( utils.accMul(parseFloat($width),parseFloat($height)))
    });


    //计算报价项总价
    function calctotal(){

        var $width = $('#left').find('#width').val();
        var $height = $('#left').find('#height').val();
        var $measurementunit = $('#left').find('#measurementunit').val();
        var $area = 1;

        if(!checkValue()){return false}

        //根据单位变更计算方式
        if($measurementunit == "平"){
            $area = utils.accMul(parseFloat($width),parseFloat($height));
            $('#left').find('#area').val($area)
        }else if($measurementunit == "延米"){
            $area = parseFloat($height);
            //$('#left').find('#area').val($area)
        }

        if(checkNaN()==true) {
            $('#total').val(utils.accMul(utils.accMul(parseFloat($('#unitprice').val()), parseFloat($('#num').val())),$area).toFixed(2));
        }

        return true;
    }

    function checkValue(){
        var flag = true;
        var numRex = /^(\d+|\d+\.[0-9]{1,4})$/;
        var $height = $('#left').find('#height');
        if(!numRex.test($height.val()) || parseFloat($height.val()) < 0){
            $height.focus().select();
            $height.addClass('popover-notitle').attr({
                "data-rel" : "popover",
                "data-placement" : "top",
                "data-original-title" : "",
                "title" : "",
                "data-content" : "长度输入错误"
            }).popover('show');
            flag =  false;
        }else{
            $height.popover('destroy');
        }

        var $width = $('#left').find('#width');
        if(!numRex.test($width.val()) || parseFloat($width.val()) < 0){
            $width.focus().select();
            $width.addClass('popover-notitle').attr({
                "data-rel" : "popover",
                "data-placement" : "top",
                "data-original-title" : "",
                "title" : "",
                "data-content" : "宽度输入错误"
            }).popover('show');
            flag =  false;
        }else{
            $width.popover('destroy');
        }

        var $thick = $('#left').find('#thick');
        if(!numRex.test($thick.val()) || parseFloat($thick.val()) < 0){
            $thick.focus().select();
            $thick.addClass('popover-notitle').attr({
                "data-rel" : "popover",
                "data-placement" : "top",
                "data-original-title" : "",
                "title" : "",
                "data-content" : "厚度输入错误"
            }).popover('show');
            flag =  false;
        }else{
            $thick.popover('destroy');
        }
        return flag
    }
    //表单校验
    function checkNum($line) {
        var flag = true;
        var $goodsName = $line.find('#name');
        if($goodsName.val()==""){
            $goodsName.focus().select();
            $goodsName.addClass('popover-notitle').attr({
                    "data-rel" : "popover",
                    "data-placement" : "auto",
                    "data-original-title" : "",
                    "title" : "",
                    "data-content" : "商品名称不能为空"
                }).popover('show');
            flag = false;
            }else{
                $goodsName.popover('destroy');
            }

        var numRex = /^(\d+|\d+\.[0-9]{1,4})$/;

        var $unitprice = $line.find('#unitprice');
        if(!numRex.test($unitprice.val()) || parseFloat($unitprice.val())<0){
            $unitprice.focus().select();
            $unitprice.addClass('popover-notitle').attr({
                "data-rel" : "popover",
                "data-placement" : "auto",
                "data-original-title" : "",
                "title" : "",
                "data-content" : "售价输入错误"
            }).popover('show');
            flag =  false;
        }else{
            $unitprice.popover('destroy');
        }
        //数量校验
        var $num = $line.find('#num');
        if(!numRex.test($num.val()) || parseFloat($num.val())<0){
            $num.focus().select();
            $num.addClass('popover-notitle').attr({
                "data-rel" : "popover",
                "data-placement" : "auto",
                "data-original-title" : "",
                "title" : "",
                "data-content" : "数量输入错误"
            }).popover('show');
            flag =  false;
        }else{
            $num.popover('destroy');
        }
        //备注校验
        var $remark = $line.find('#remark');
        if($remark.val().length>128){
            $remark.focus().select();
            $remark.addClass('popover-notitle').attr({
                "data-rel" : "popover",
                "data-placement" : "auto",
                "data-original-title" : "",
                "title" : "",
                "data-content" : "备注长度应在128个字符以内"
            }).popover('show');
            flag = false;
        }else{
            $remark.popover('destroy');
        }

        return flag;
    }

    function checkNaN() {

        var $num = $('#num');
        var $unitprice = $('#unitprice');
        var $total = $('#total');
        if($num.val()=="" || $unitprice.val()==""||$total.val()==""){
            return false;
        }
        if(isNaN($num.val())){
            com.showAlert(com.warning, "数量需要数字类型信息!");
            return false;
        }
        if(isNaN($unitprice.val())){
            com.showAlert(com.warning, "售价需要数字类型信息!");
            return false;
        }
        if(isNaN($total.val())){
            com.showAlert(com.warning, "总价需要数字类型信息!");
            return false;
        }
        return true;
    }

    //计算所有子项的总价
    function cycTotals() {
        var _total =0;
        var _num = 0;
        var $li = $('.list-group-item');
        $li.length && $li.each(function () {
            var $this = $(this);
            var $span = $this.find('.s_total');
            _total = parseFloat($span.find('.b_total').text());
            if(_total){
                _num = utils.accAdd(parseFloat($this.find('.s_total').find('.b_total').text()),_num);
            }
        });
        return _num;
    }

    //报价区

    //楼盘id
    $("#orderAddr").val(params["address"]);
    $("#discount").val("1");
    $("#totals").val("0");
    //提交
    $('#submit').click(function () {
        var qid=null;
        if(submitCheck()==true){
            puotation.puotation["puotation.name"] = $('#brands').val();
            puotation.puotation["puotation.comment"] = $('#comment').val();
            puotation.puotation["puotation.pid"] = params["pid"];

            com.post(api.production.addPuotation,puotation.puotation,function (data) {
                com.showAlert(null,"报价添加成功");
                qid = data.puotation.qid;
                //清空类为order_inputinfo的input
                $('.order_inputinfo').val(null);
            },function (e) {
                com.showAlert(com.error,"报价添加失败");
            },false);

            $lis = $('.list-group-item');
            $.each($lis,function (i,v) {
                var $v = $(v);
                puotation.puotationItem["puotationItem.qid"] = qid;
                puotation.puotationItem["puotationItem.name"] = $v.find('h4').attr('data-qutoName');
                puotation.puotationItem["puotationItem.quoteType"] = $v.find('.s_brand').find('.b_brand').attr('adddata');
                puotation.puotationItem["puotationItem.measurementUnit"] = $v.find('.s_unit').find('.b_unit').text();
                puotation.puotationItem["puotationItem.unitPrice"] = parseFloat($v.find('.s_unitprice').find('.b_unitprice').text());
                puotation.puotationItem["puotationItem.format"] = $v.find('.s_format').find('.b_format').text();
                puotation.puotationItem["puotationItem.height"] = parseFloat($v.find('.s_height').find('.b_height').text());
                puotation.puotationItem["puotationItem.width"] = parseFloat($v.find('.s_width').find('.b_width').text());
                puotation.puotationItem["puotationItem.thick"] = parseFloat($v.find('.s_thick').find('.b_thick').text());
                puotation.puotationItem["puotationItem.specil"] = $v.find('.s_specil').find('.b_specil').text();
                puotation.puotationItem["puotationItem.num"] = parseFloat($v.find('.s_number').find('.b_number').text());
                puotation.puotationItem["puotationItem.total"] = parseFloat($v.find('.s_total').find('.b_total').text());
                puotation.puotationItem["puotationItem.comment"] = $v.find('.s_remark').find('.b_remark').text();
                com.post(api.production.addPuotationItem,puotation.puotationItem,function (data) {
                    if($lis.length-1 == i){
                        com.showAlert(null,"报价项添加成功");
                    }
                    //清空销售项
                    $('.list-group-item').remove();

                },function (e) {
                    com.showAlert(com.showAlert(com.error,"第"+(i+1)+"报价项添加失败"));
                });
            });

        }
    });
//检查主材品牌
    function submitCheck() {
        var flag = true;
        var $_brand = $('#brands');

        var _brand =$.trim($_brand.val());
        if(_brand == ""){
            flag = false;
            $_brand.focus().select();
            $_brand.addClass('popover-notitle').attr({
                "data-rel" : "popover",
                "data-placement" : "bottom",
                "data-original-title" : "",
                "title" : "",
                "data-content" : "名称不能为空"
            }).popover('show');
        }else{
            $_brand.popover('destroy');
            //判断品牌差异
            var $_lis = $('.list-group-item');
            $.each($_lis,function (i,v) {
                var $v = $(v);
                if(_brand != $v.find('.s_brand').find('.b_brand').text()){
                    $v.css("border", "solid red 2px");
                    var r = i+1;
                    com.showAlert(null,"报价项第"+r+"项中类型与品牌不符，请检查");
                    flag = false;
                }
            });
        }

//判断楼盘地址 是否为空
        var $_orderAddr = $('#orderAddr');
        if($_orderAddr.val()==""){
            flag = false;
            $_orderAddr.focus().select();
            $_orderAddr.addClass('popover-notitle').attr({
                "data-rel" : "popover",
                "data-placement" : "bottom",
                "data-original-title" : "",
                "title" : "",
                "data-content" : "楼盘地址不能为空"
            }).popover('show');

        }else{
            $_orderAddr.popover('destroy');
        }

        var $_orderID = $('#orderId');
        if($_orderID.val()==""){
            flag = false;
            $_orderID.focus().select();
            $_orderID.addClass('popover-notitle').attr({
                "data-rel" : "popover",
                "data-placement" : "bottom",
                "data-original-title" : "",
                "title" : "",
                "data-content" : "订单编号不能为空"
            }).popover('show');
        }else{
            $_orderID.popover('destroy');
        }
        return flag;
    }
    //取消提示信息
    cancelProp();
    function cancelProp() {
        var $inputs = $('input','#left');
        //获得右侧input焦点事件重置input为初始，进而取消提示
        var $inputss = $('input','#searchInfo').focus(function cls(){$('input','#searchInfo').text("")});
        $.each($inputs,function (i,v) {
            $(this).focus(function(){
                var $div = $(this).parent().find('.popover');
                if($div){
                    $div.remove();
                }
            });
        });
        $.each($inputss,function (i,v) {
            $(this).focus(function(){
                var $div = $(this).parent().find('.popover');
                if($div){
                    $div.remove();
                }
            });
        });
    }


    $('#returnBtn').click(function () {
        com.switchPage(api.index.puotationIndex.url);
    });

});