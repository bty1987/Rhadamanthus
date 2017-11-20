
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
                    $content.find('#format1').val(val.format);
                    puotation.quoteTypes = val.quoteType.qtid;
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
        if(!calctotal()){return false}
        var _name=$('#left').find('#name').attr('data-name');
        if(puotation.flag==true){
            var $liList = $('<li></li>').addClass('list-group-item');
            var $delete = $('<div></div>').addClass('pull-right action-button').append($('<a></a>').addClass('btn btn-minier btn-danger _delete').html('删除'));
            var $h4 = $('<h4></h4>').html(_name).attr('data-qutoName',_name);
            $h4.append($delete).appendTo($liList);
            $liList.append(addSpan(' 类型：','s_brand',$('#brand').val()," ",'b_brand',puotation.quoteTypes)).
                append(addSpan(' 单位：','s_unit',$('#measurementunit').val()," ",'b_unit',null)).
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
                //     $('.list-group-item').css("border-bottom","none");
                //     $('.list-group-item:last').css("border-bottom","grey solid 1px");
                //清空左侧
                $('#left').find('input').val("");
                $('#left').find('select').empty();

            $delete.click(function () {
                var $this = $(this);
                var $totals = $('#totals');

                var $liParent = $this.parent().parent();

                var deleteNum = -Number($liParent.find('.s_total').find('.b_total').text());
                var totalNum = parseFloat(utils.accAdd($totals.val(),utils.accMul(deleteNum,params["discount"])));

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

    $('#unitprice,#num,#height,#width').on("change",function () {
        calctotal();
    });

    //计算报价项总价
    function calctotal(){
        com.clearValidator();
        var $width = $('#left').find('#width').val();
        var $height = $('#left').find('#height').val();

        var $measurementunit = $('#left').find('#measurementunit').val();
        var $area = 1;

        if(com.validate("left","top")){return false}

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


    function cycTotals() {
        var _total =0;
        var _num = params["total"];
        var $li = $('.list-group-item');
        $li.length && $li.each(function () {
            var $this = $(this);
            var $span = $this.find('.s_total');
            _total = parseFloat($span.find('.b_total').text());
            if(_total){
                _num = utils.accAdd(utils.accMul(parseFloat($this.find('.s_total').find('.b_total').text()),params["discount"]),_num);
            }
        });
        return _num;
    }

    //报价区

    //楼盘id
    $("#orderAddr").val(params["address"]);
    $("#discount").val(params["discount"]);
    $("#brands").val(params["name"]);
    $("#totals").val(params["total"]);
    $("#comment").val(params["comment"]);
    //提交
        $('#submit').click(function () {
           
            if(submitCheck()==true){

                $lis = $('.list-group-item');

                $.each($lis,function (i,v) {
                    
                    var $v = $(v);
                    puotation.puotationItem["puotationItem.qid"] = params["qid"];
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
                        com.showAlert(com.error,"第"+(i+1)+"报价项添加失败");
                    });
                });

            }
        });
//检查主材品牌
    function submitCheck() {
        var flag = true;
        var $_brand = $('#brands');
        var _brand =$.trim($_brand.val());
        com.clearValidator();

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