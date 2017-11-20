jQuery(function($) {

    if (jQuery().datepicker) {
        $('.date-picker').datepicker({
            autoclose:true,
            format: 'yyyy-mm-dd',//yyyy-mm-dd hh:ii,
        });
    }

    var purchase = {
        saveBtn:  $("#saveBtn"),
        cancellBtn: $("#cancelBtn"),
        purchaseItems: {
            pid : $("#pId"),
        },
        record: {},
        validator: {
            num: {
                type: "v_num",
                regex: /^[0-9]*[1-9][0-9]*$/,
                errorMsg: "数量输入内容格式错误"
            },
            selling: {
                type: "v_selling",
                regex: /^(\d+|\d+\.[0-9]{1,4})$/,
                errorMsg: "单价输入内容格式错误"
            }
        }
    };

    $.extend(com.validator, purchase.validator);

    //添加一条空行
    addline(1).addClass('current').appendTo('#list');
    
    $('#addPurchase').click(function(){

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
        
        cyclTotal();

        var $line = addline(num + 1);
        
        $line.appendTo('#list');

    });

    //返回采购单
    $('#returnPurchase').click(function(){
        com.switchPage('views/manifest/purchase.html');
    });

    //保存添加采购单
    $('#submitPurchase').click(function(){

        if(com.validate('list', 'bottom')){
            return;
        }

        var options = {};

        var $lines = $('li.line', '#list');
        
        if(!checkInfo()) return;
        
		if(!$lines.length){
            layer.msg('请填写商品');
            return;
        }

        var returnFlag = false;
        $lines.each(function(){

            var $this = $(this);

        });

        if(returnFlag) return;
        
        cyclTotal();

        if(purchase.totalSum < 0){
            layer.msg("当前录入采购单总数小于0",{time:3000});
            return false;
        }

        var purchaseTime = $('[name="date"]', '#form').val();  //– 创建时间
        var deliveryTime = $('[name="deliveryTime"]', '#form').val();//- 交付时间
        var comment = $('#comment').val();

        options = {
            "purchase.comment":comment,
            "purchase.deliveryTime": deliveryTime,
        };

        var $list = $('li.line', '#list');
        
        $list.length && $list.each(function(i){
        	
            var $this = $(this);

            options["purchaseItems["+i+"].goods.gid"] = $this.attr('data-pgid');            //– 商品编号
            options["purchaseItems["+i+"].color.cid"] = $this.find('.color select').val();  //– 颜色
            options["purchaseItems["+i+"].format.fid"] = $this.find('.format select').val();//– 规格
            options["purchaseItems["+i+"].num"] = $this.find('.number input').val();           //– 数量
            options["purchaseItems["+i+"].unitPrice"] = $this.find('.unitPrice input').val();  //- 单价
            
        });

        com.post(api.inventory.addPurchase, options, function(data){
        	
            layer.msg('保存成功!', {icon : 1});
            
            $('#list').empty();
            $('[name="date"]','#form').val(null);
            $('[name="deliveryTime"]', '#form').val(null);
            $('#comment').val(null);
            $("#totalSpan").text(0);
            //添加一条空行
            addline(1).addClass('current').appendTo('#list');

        }, function(e){
        	
            com.showAlert(com.info, e.errorMsg);
            
        });

    });


    //添加一个空行
    function addline(lineindex){

        var $line = $('<li></li>').addClass('line');
        var $indexWrap = $('<div></div>').addClass('line-wrap order').append($('<div></div>').addClass('cell index').text(lineindex));
        var $lineInfoWrap = $('<div></div>').addClass('line-wrap content col9');
        var $optWrap= $('<div></div>').addClass('line-wrap action');
        var _lineInfoSet = [
            {cellClass : "no"},         //商品编号
            {cellClass : "name", hasInput : !0},        //商品名称
            {cellClass : "category"},   //品类
            {cellClass : "brand"},       //品牌
            {cellClass : "color",hasSelectColor:!0},   //颜色
            {cellClass : "format",hasSelectFormat:!0}, //规格
            {cellClass : "number", hasInput : !0},         //数量
            {cellClass : "pieceNum"},                   //件数
            {cellClass : "unitPrice", hasInput : !0}   //单价
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
                if(v.cellClass == "unitPrice"){
                    $input.addClass('v_selling');
                }
                $cell.append($input);
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
                        $lineInfoWrap.find('.category').text(val.category);
                        $lineInfoWrap.find('.brand').text(val.brand);
                        $lineInfoWrap.find('.pieceNum').text(val.pieceNum);
                        $line.attr('data-pgid',val.gid);
                        $line.attr('data-gid',val.gid+"_"+lineindex);
                        com.post(api.inventory.queryColorForEnableByGid,{
                            "color.gid": val.gid
                        },function(res){
                            $('li[data-gid="'+val.gid+'_'+lineindex+'"] .color select').bindData(res.colors,"cid","name");
                        });
                        com.post(api.inventory.queryFormatForEnableByGid,{
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
             checkRowValue($line);
             cyclTotal();
         });

         $btndel.click(function(e){
             e.stopPropagation();
             $line.remove();
             cyclTotal();
             reorder();
         });

        return $line;

    }


    function checkRowValue($line){

        var flag = true;


        
        return flag;
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
        var deliveryTime = $('[name="deliveryTime"]','#form');

        if(!date.val()){
            date.focus().select();

            date.addClass('popover-notitle').attr({
                "data-rel" : "popover",
                "data-placement" : "bottom",
                "data-original-title" : "",
                "title" : "",
                "data-content" : "请选择日期"

            }).popover('show');

            flag =  false;
        }else if(!deliveryTime.val()){

            deliveryTime.focus().select();

            deliveryTime.addClass('popover-notitle').attr({
                "data-rel" : "popover",
                "data-placement" : "bottom",
                "data-original-title" : "",
                "title" : "",
                "data-content" : "请选择日期"

            }).popover('show');

            flag =  false;

        }else{
            date.popover('destroy');
        }

        return flag;

    }

    //计算总价
    function cyclTotal(){

        var _total = 0;

        var $list = $('.line', '#list');
        $list.length && $list.each(function(){
            var $this = $(this);
            if($this.find('.unitPrice input').val()){

                var $sum = utils.accMul(parseFloat($this.find('.unitPrice input').val()+''),parseFloat($this.find('.number input').val()+''));//单个商品的总价
                  _total = utils.accAdd( $sum , _total);//采购单总价
            }
        });


        $("#totalSpan").text(_total);
    }
});
