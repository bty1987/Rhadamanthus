jQuery(function () {
    var createPuotation={
        btns:{
            addBtn:com.focusPage("#addBtn"),//添加
            submitBtn:com.focusPage("#submitBtn"),//提交
            refreshBtn:com.focusPage("#refreshBtn"),//重置
            resetBtn:com.focusPage("#resetBtn"),//返回

        },
        items:{
            name:com.focusPage("#name"),//报价名
            brand:com.focusPage("#brand"),//类型
            measurementunit:com.focusPage("#measurementunit"),//单位
            format1:com.focusPage("#format1"),//规格
            height:com.focusPage("#height"),//长度
            width:com.focusPage("#width"),//宽度
            thick:com.focusPage("#thick"),//厚度
            area:com.focusPage("#area"),//面积
            unitprice:com.focusPage("#unitprice"),//售价
            num:com.focusPage("#num"),//数量
            total:com.focusPage("#total"),//总价
            remark:com.focusPage("#remark"),//备注
            specil:com.focusPage("#specil"),//特征

            comment:com.focusPage("#comment"),//备注
            discount:com.focusPage("#discount"),//折让
            totals:com.focusPage("#totals"),//总额
            orderAddr:com.focusPage("#orderAddr")//楼盘地址

        },
        qiids:null,
        quoteTypes:null,
        flag:true,
    };
    //报价项区 自动赋值
    com.initTypeahead('name', api.production.queryQuoteItemByPinyin,"quoteItem.pinyin", "quoteItem.name", "quoteItems", "qiid", "name",function(list,k, v) {

        $.each(list, function(index,val){

            if(val.qiid == k){
                createPuotation.items.name.val(val.name);
                createPuotation.items.unitprice.val(val.unitprice);
                createPuotation.items.brand.val(val.quoteType.name);
                createPuotation.quoteTypes = {
                    "quoteType.name" : val.quoteType.name,
                    "quoteType.qtid" : val.quoteType.qtid
                };
                createPuotation.items.width.val(0);
                createPuotation.items.height.val(0);
                createPuotation.items.thick.val(0);
                createPuotation.items.format1.val(val.format);
                createPuotation.items.measurementunit.val(val.measurementunit);
                createPuotation.items.num.val(1);
                createPuotation.items.total.val(utils.accMul(parseFloat(createPuotation.items.unitprice.val()),parseFloat(createPuotation.items.num.val())));
                createPuotation.items.name.val(val.name).attr('data-name',val.name);
            }
        });
        return v;
    });


    //点击添加按钮
    createPuotation.btns.addBtn.click(function () {
        com.clearValidator();
        if(!totalPrice() || !totalArea()){return false};
        var _name= createPuotation.items.name.attr('data-name');

        if(createPuotation.flag==true){
            var $liList = $('<li></li>').addClass('list-group-item');
            var $delete = $('<div></div>').addClass('pull-right action-button').append($('<a></a>').addClass('btn btn-minier btn-danger _delete').html('删除'));
            var $h4 = $('<h4></h4>').html(_name).attr('data-qutoName',_name);
            $h4.append($delete).appendTo($liList);
            $liList.append(addSpan(' 类型:  ','s_brand',$('#brand').val()," ",'b_brand',createPuotation.quoteTypes["quoteType.qtid"])).
            append(addSpan(' 单位:  ','s_unit',$('#measurementunit').val()," ",'b_unit',null)).
            append(addSpan(' 规格: ','s_format',$('#format1').val()," ",'b_format',null)).
            append(addSpan(' 长度: ','s_height',$('#height').val()," ",'b_height',null)).
            append(addSpan(' 宽度: ','s_width',$('#width').val()," ",'b_width',null)).
            append(addSpan(' 厚度: ','s_thick',$('#thick').val()," ",'b_thick',null)).
            append(addSpan(' 面积: ','s_area',$('#area').val()," ",'b_area',null)).
            append(addSpan(' 售价: ','s_unitprice',$('#unitprice').val(),'blue','b_unitprice',null)).
            append(addSpan(' 数量: ','s_number',$('#num').val(),'red','b_number')).
            append(addSpan(' 总价: ','s_total',$('#total').val(),'blue','b_total',null)).
            append(addSpan(' 备注: ','s_remark',$('#remark').val()," ",'b_remark',null)).
            append(addSpan(' 特型: ','s_specil',$('#specil').val()," ",'b_specil',null)).
            append($('<span></span>').text($('#bid').val()).attr("id","invisiblePurchase"));
            $('#puotationItemList').append($liList);
            //给最后一个li标签加上底框,除了最后一个li 其他的li均无底框
            //$('.list-group-item').css("border-bottom","none");
            //$('.list-group-item:last').css("border-bottom","grey solid 1px");
            //清空左侧
            com.focusPage('#left').find('input').val("");
            com.focusPage('#left').find('select').empty();

            $delete.click(function () {
                var $this = $(this);
                var $totals = createPuotation.items.totals;

                var $liParent = $this.parent().parent();

                var deleteNum = -Number($liParent.find('.s_total').find('.b_total').text());
                var totalNum = parseFloat(utils.accAdd($totals.val(),deleteNum));
                $totals.val(totalNum);
                $liParent.remove();
                //$('.list-group-item:last').css("border-bottom","solid 1px");
            });
        }else if(createPuotation.flag == false){
            com.showAlert(com.warning,"商品信息不完善,请先完善商品信息");
        }
        createPuotation.items.totals.val(cycTotals());

    });

    createPuotation.btns.refreshBtn.click(function () {
        com.focusPage('#left').find('input').val("");
        com.focusPage('#left').find('select').empty();
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


    //计算总价
    function  totalPrice(){
        com.clearValidator();
        if(com.validate("left","right")){return false};
        createPuotation.items.total.val(utils.accMul( createPuotation.items.unitprice.val(),createPuotation.items.num.val()).toFixed(2));
        return true;
    };

    com.focusPage('#unitprice,#num,#total').on("change",function () {
        totalPrice();
    });

    //计算面积
    function  totalArea(){
        com.clearValidator();
        var $width = createPuotation.items.width.val();
        var $height = createPuotation.items.height.val();
        var $measurementunit = createPuotation.items.measurementunit.val();
        var $area = 1;

        if(com.validate("left","right")){return false}

        //根据单位变更计算方式
        if($measurementunit == "平"){
            $area = utils.accMul(parseFloat($width),parseFloat($height));
            createPuotation.items.area.val($area);
        }

        return true;
    }

    com.focusPage('#height,#width,#thick,#area').on("change",function () {
        totalArea();
    });

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
    createPuotation.items.orderAddr.val(params["address"]);
    createPuotation.items.discount.val("1");
    createPuotation.items.totals.val("0");
    //提交
    createPuotation.btns.submitBtn.click(function () {
        var _options = {};

        _options["puotation.name"] = createPuotation.quoteTypes["quoteType.name"];
        _options["puotation.comment"] = createPuotation.items.comment.val();
        _options["puotation.pid"] = params["pid"];
        _options["puotation.total"] = createPuotation.items.totals.val();

        $lis = com.focusPage('.list-group-item');
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
            com.focusPage('.order_inputinfo').val(null);
            //清空销售项
            com.focusPage('.list-group-item').remove();
        },function (e) {
            com.showAlert(com.error,"报价添加失败");
        },false);
    });

    createPuotation.btns.resetBtn.click(function () {
        com.switchPage(api.index.puotationIndex.url);
    });

});