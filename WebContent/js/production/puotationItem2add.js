
jQuery(function () {
    // var returnBtn = $('#returnBtn');
    var addPuotationItem={

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

            brands:com.focusPage("#brands"),//品牌
            comment:com.focusPage("#comment"),//备注
            discount:com.focusPage("#discount"),//折让
            totals:com.focusPage("#totals"),//总额
            orderAddr:com.focusPage("#orderAddr")//楼盘地址

        },
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
    com.initTypeahead('name', api.production.queryQuoteItemByPinyin,"quoteItem.pinyin","quoteItem.name", "quoteItems", "qiid", "name",function(list,k, v) {

        $.each(list, function(index,val){

            if(val.qiid == k){
                addPuotationItem.items.name.val(val.name);
                addPuotationItem.items.unitprice.val(val.unitprice);
                addPuotationItem.items.brand.val(val.quoteType.name);
                addPuotationItem.items.width.val(0);
                addPuotationItem.items.height.val(0);
                addPuotationItem.items.thick.val(0);
                addPuotationItem.items.format1.val(val.format);
                addPuotationItem.quoteTypes = val.quoteType.qtid;
                addPuotationItem.items.measurementunit.val(val.measurementunit);
                addPuotationItem.items.num.val(1);
                addPuotationItem.items.total.val(utils.accMul(parseFloat(addPuotationItem.items.unitprice.val()),parseFloat(addPuotationItem.items.num.val())));
                addPuotationItem.items.name.val(val.name).attr('data-name',val.name);
            }
        });
        return v;
    });

    //点击添加按钮
    addPuotationItem.btns.addBtn.click(function () {
        com.clearValidator();
        if(!totalPrice() || !totalArea()){return false};
        var _name= addPuotationItem.items.name.attr('data-name');
        if(addPuotationItem.flag==true){
            var $liList = $('<li></li>').addClass('list-group-item');
            var $delete = $('<div></div>').addClass('pull-right action-button').append($('<a></a>').addClass('btn btn-minier btn-danger _delete').html('删除'));
            var $h4 = $('<h4></h4>').html(_name).attr('data-qutoName',_name);
            $h4.append($delete).appendTo($liList);
            $liList.append(addSpan(' 类型: ','s_brand',com.focusPage('#brand').val()," ",'b_brand',addPuotationItem.quoteTypes)).
            append(addSpan(' 单位: ','s_unit',com.focusPage('#measurementunit').val()," ",'b_unit',null)).
            append(addSpan(' 规格: ','s_format',com.focusPage('#format1').val()," ",'b_format',null)).
            append(addSpan(' 长度: ','s_height',com.focusPage('#height').val()," ",'b_height',null)).
            append(addSpan(' 宽度: ','s_width',com.focusPage('#width').val()," ",'b_width',null)).
            append(addSpan(' 厚度: ','s_thick',com.focusPage('#thick').val()," ",'b_thick',null)).
            append(addSpan(' 面积: ','s_area',com.focusPage('#area').val()," ",'b_area',null)).
            append(addSpan(' 售价: ','s_unitprice',com.focusPage('#unitprice').val(),'blue','b_unitprice',null)).
            append(addSpan(' 数量: ','s_number',com.focusPage('#num').val(),'red','b_number')).
            append(addSpan(' 总价: ','s_total',com.focusPage('#total').val(),'blue','b_total',null)).
            append(addSpan(' 备注: ','s_remark',com.focusPage('#remark').val()," ",'b_remark',null)).
            append(addSpan(' 特型: ','s_specil',com.focusPage('#specil').val()," ",'b_specil',null)).
            append($('<span></span>').text(com.focusPage('#bid').val()).attr("id","invisiblePurchase"));

            $('#puotationItemList').append($liList);
            //给最后一个li标签加上底框,除了最后一个li 其他的li均无底框
            //     $('.list-group-item').css("border-bottom","none");
            //     $('.list-group-item:last').css("border-bottom","grey solid 1px");
            //清空左侧
            com.focusPage('#left').find('input').val("");
            com.focusPage('#left').find('select').empty();

            $delete.click(function () {
                var $this = com.focusPage(this);
                var $totals = addPuotationItem.items.totals;

                var $liParent = $this.parent().parent();

                var deleteNum = -Number($liParent.find('.s_total').find('.b_total').text());
                var totalNum = parseFloat(utils.accAdd($totals.val(),utils.accMul(deleteNum,params["discount"])));

                $totals.val(totalNum);
                $liParent.remove();
                //$('.list-group-item:last').css("border-bottom","solid 1px");
            });
        }else if(addPuotationItem.flag == false){
            com.showAlert(com.warning,"商品信息不完善,请先完善商品信息");
        }
        addPuotationItem.items.totals.val(cycTotals());
    });

    addPuotationItem.btns.refreshBtn.click(function () {
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
        addPuotationItem.items.total.val(utils.accMul( addPuotationItem.items.unitprice.val(),addPuotationItem.items.num.val()).toFixed(2));
        return true;
    };

    com.focusPage('#unitprice,#num,#total').on("change",function () {
        totalPrice();
    });

    //计算面积
    function  totalArea(){
        com.clearValidator();
        var $width = addPuotationItem.items.width.val();
        var $height = addPuotationItem.items.height.val();
        var $measurementunit = addPuotationItem.items.measurementunit.val();
        var $area = 1;

        if(com.validate("left","right")){return false}

        //根据单位变更计算方式
        if($measurementunit == "平"){
            $area = utils.accMul(parseFloat($width),parseFloat($height));
            addPuotationItem.items.area.val($area);
        }

        return true;
    }

    com.focusPage('#height,#width,#thick,#area').on("change",function () {
        totalArea();
    });

    function cycTotals() {
        var _total =0;
        var _num = params["total"];
        var $li = com.focusPage('.list-group-item');
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
    addPuotationItem.items.orderAddr.val(params["address"]);
    addPuotationItem.items.discount.val(params["discount"]);
    addPuotationItem.items.brands.val(params["name"]);
    addPuotationItem.items.totals.val(params["total"]);
    addPuotationItem.items.comment.val(params["comment"]);
    //提交
    addPuotationItem.btns.submitBtn.click(function () {

        if(submitCheck()==true){

            $lis = com.focusPage('.list-group-item');

            $.each($lis,function (i,v) {

                var $v = $(v);
                addPuotationItem.puotationItem["puotationItem.qid"] = params["qid"];
                addPuotationItem.puotationItem["puotationItem.name"] = $v.find('h4').attr('data-qutoName');
                addPuotationItem.puotationItem["puotationItem.quoteType"] = $v.find('.s_brand').find('.b_brand').attr('adddata');
                addPuotationItem.puotationItem["puotationItem.measurementUnit"] = $v.find('.s_unit').find('.b_unit').text();
                addPuotationItem.puotationItem["puotationItem.unitPrice"] = parseFloat($v.find('.s_unitprice').find('.b_unitprice').text());
                addPuotationItem.puotationItem["puotationItem.format"] = $v.find('.s_format').find('.b_format').text();
                addPuotationItem.puotationItem["puotationItem.height"] = parseFloat($v.find('.s_height').find('.b_height').text());
                addPuotationItem.puotationItem["puotationItem.width"] = parseFloat($v.find('.s_width').find('.b_width').text());
                addPuotationItem.puotationItem["puotationItem.thick"] = parseFloat($v.find('.s_thick').find('.b_thick').text());
                addPuotationItem.puotationItem["puotationItem.specil"] = $v.find('.s_specil').find('.b_specil').text();
                addPuotationItem.puotationItem["puotationItem.num"] = parseFloat($v.find('.s_number').find('.b_number').text());
                addPuotationItem.puotationItem["puotationItem.total"] = parseFloat($v.find('.s_total').find('.b_total').text());
                addPuotationItem.puotationItem["puotationItem.comment"] = $v.find('.s_remark').find('.b_remark').text();
                com.post(api.production.addPuotationItem,addPuotationItem.puotationItem,function (data) {
                    if($lis.length-1 == i){
                        com.showAlert(null,"报价项添加成功");
                    }
                    //清空销售项
                    com.focusPage('.list-group-item').remove();
                },function (e) {
                    com.showAlert(com.error,"第"+(i+1)+"报价项添加失败");
                });
            });

        }
    });
//检查主材品牌
    function submitCheck() {
        var flag = true;
        var $_brand = addPuotationItem.items.brands;
        var _brand = $.trim($_brand.val());
        com.clearValidator();

        if(!com.validate("right",null)){
            var $_lis = com.focusPage('.list-group-item');
            $.each($_lis,function (i,v) {
                var $v = $(v);
                if(_brand != $v.find('.s_brand').find('.b_brand').text()){
                    $v.css("border", "solid red 2px");
                    var r = i+1;
                    com.showAlert(null,"报价项第"+r+"项中类型与品牌不符,请检查");
                    flag = false;
                }
            });
        }else{
            flag = false;
        }
        return flag;
    }

    addPuotationItem.btns.resetBtn.click(function () {
        com.switchPage(api.index.puotationIndex.url);
    });

});