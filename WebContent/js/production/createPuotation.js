
jQuery(function () {
    var puotation={
        qiids:null,
        quoteTypes:null,
        flag:true,
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
        com.clearValidator();
        if(!calctotal()){return false};
        var _name=$('#left').find('#name').attr('data-name');

        if(puotation.flag==true){
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

    $('#unitprice,#num,#height,#width,#thick').on("change",function () {
        calctotal();
    });

    //计算报价项总价
    function calctotal(){
        com.clearValidator();
        var $width = $('#left').find('#width').val();
        var $height = $('#left').find('#height').val();
        var $measurementunit = $('#left').find('#measurementunit').val();
        var $area = 1;

        if(com.validate("left","bottom")){return false}

        //根据单位变更计算方式
        if($measurementunit == "平"){
            $area = utils.accMul(parseFloat($width),parseFloat($height));
            $('#left').find('#area').val($area)
        }else if($measurementunit == "延米"){
            $area = parseFloat($height);
            //$('#left').find('#area').val($area)
        }

        $('#total').val(utils.accMul(utils.accMul(parseFloat($('#unitprice').val()), parseFloat($('#num').val())),$area).toFixed(2));

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
        var _options = {};
        if(submitCheck()==true){
            _options["puotation.name"] = $('#brands').val();
            _options["puotation.comment"] = $('#comment').val();
            _options["puotation.pid"] = params["pid"];
            _options["puotation.total"] = $('#totals').val();

            $lis = $('.list-group-item');
            $.each($lis,function (i,v) {
                var $v = $(v);
                _options["puotationItems["+i+"].name"] = $v.find('h4').attr('data-qutoName');
                _options["puotationItems["+i+"].quoteType"] = $v.find('.s_brand').find('.b_brand').attr('adddata');
                _options["puotationItems["+i+"].measurementUnit"] = $v.find('.s_unit').find('.b_unit').text();
                _options["puotationItems["+i+"].unitPrice"] = parseFloat($v.find('.s_unitprice').find('.b_unitprice').text());
                _options["puotationItems["+i+"].format"] = $v.find('.s_format').find('.b_format').text();
                _options["puotationItems["+i+"].height"] = parseFloat($v.find('.s_height').find('.b_height').text());
                _options["puotationItems["+i+"].width"] = parseFloat($v.find('.s_width').find('.b_width').text());
                _options["puotationItems["+i+"].thick"] = parseFloat($v.find('.s_thick').find('.b_thick').text());
                _options["puotationItems["+i+"].specil"] = $v.find('.s_specil').find('.b_specil').text();
                _options["puotationItems["+i+"].num"] = parseFloat($v.find('.s_number').find('.b_number').text());
                _options["puotationItems["+i+"].total"] = parseFloat($v.find('.s_total').find('.b_total').text());
                _options["puotationItems["+i+"].comment"] = $v.find('.s_remark').find('.b_remark').text();
            });

            com.post(api.production.addPuotation ,_options ,function (data) {
                com.showAlert(null,"报价添加成功");
                //清空类为order_inputinfo的input
                $('.order_inputinfo').val(null);
                //清空销售项
                $('.list-group-item').remove();
            },function (e) {
                com.showAlert(com.error,"报价添加失败");
            },false);

        }
    });
    //检查主材品牌
    function submitCheck() {
        var flag = true;
        com.clearValidator();
        var $_brand = $('#brands');
        var _brand =$.trim($_brand.val());

        if(!com.validate("right",null)){
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
        }else{
            flag = false;
        }
        return flag;
    }

    $('#returnBtn').click(function () {
        com.switchPage(api.index.puotationIndex.url);
    });

});