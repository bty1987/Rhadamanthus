/**
 * Created by Administrator on 2016/9/23 0023.
 */


jQuery(function($) {

    if (jQuery().datepicker) {
        com.focusPage('.date-picker').datepicker({
            format: 'yyyy-mm-dd',//yyyy-mm-dd hh:ii,
            autoclose:true
        });
    }

    var manifest = {
        saveBtn:  com.focusPage("#saveBtn"),
        cancellBtn: com.focusPage("#cancelBtn"),
        manifestItems: {
            orderId : com.focusPage("#orderId"),
            customerName : com.focusPage("#customer"),
            des : com.focusPage("#comment")
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
                regex: /^\d{1,8}(\.\d{1,2})?$/,
                errorMsg: "售价输入内容格式错误"
            }

        }
    };

    $.extend(com.validator, manifest.validator);

    com.post(api.inventory.queryStorehouseForSelf, {}, function(res){
        var storehousesStatus = [];

        $.each(res.storehouses,function(i,v){
            if(v.status==0){
                storehousesStatus.push(v);
            }
        });
        manifest.storehouses = storehousesStatus;
    }, null, false);


    com.post(api.ds.manifest, {}, function(res){
        com.focusPage('#form [name="mtype"]').bindData(res.manifestTypes,"key","value");
    }, null, false);


    com.post(api.inventory.queryManifestTemplate,{},function(res){
        var manifestTemplatesStatus = [];
        $.each(res.manifestTemplates,function(i,v){
            if(v.status==0){
                manifestTemplatesStatus.push(v);
            }
        });
        com.focusPage('#form [name="manifest"]').bindData(manifestTemplatesStatus,'mtId','name');
    });

    //添加一条空行
    addline(1).addClass('current').appendTo(com.focusPage('#list'));
    
    com.focusPage('#addSaleOrder').click(function(){
        if(com.validate('list','bottom')){
            return;
        }
        var num = com.focusPage('.line', '#list').length;
        var returnFlag = false;
        var $lines = com.focusPage('.line', '#list');
        $lines.each(function(){
            var $this = $(this);

        });

        if(returnFlag) return;

        cyclTotal();
        var $line = addline(num + 1);
        $line.appendTo(com.focusPage('#list'));
    });

    com.focusPage('#submitSaleOrder').click(function(){
        if(com.validate('list','bottom')){
            return;
        }
        var options = {};

        var $lines = com.focusPage('li.line', '#list');
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

        if(manifest.totalSum < 0){
            layer.msg("当前录入订单总数小于0",{time:3000});
            return false;
        }

        var manifestTime = com.focusPage('[name="date"]', '#form').val();//– 货单时间
        var total = manifest.totalSum;// – 总价
        var type = com.focusPage('[name="mtype"]','#form').val();//– 类型
        var comment = com.focusPage('#comment').val();//– 备注

        options = {
            "manifest.manifestTime": manifestTime,
            "manifest.total": total,
            "manifest.type": type,
            "manifest.comment": comment,
            "manifest.attachment": ""//– 附件路径
        };


        var $list = com.focusPage('li.line', '#list');
        $list.length && $list.each(function(i){
            var $this = $(this);

            options["manifestItems["+i+"].goods.gid"] = $this.attr('data-gid');//– 商品id
            options["manifestItems["+i+"].color.cid"] = $this.find('.color select').val();//– 商品编号
            options["manifestItems["+i+"].format.fid"] = $this.find('.format select').val();//– 商品名

            if(type == 1 || type == 4){
                options["manifestItems["+i+"].instorehouse.shId"] = $this.find('.storehouse select').val();// – 仓库ID
            }else{
                options["manifestItems["+i+"].outstorehouse.shId"] = $this.find('.storehouse select').val();//– 仓库ID
            }

            options["manifestItems["+i+"].num"] = $this.find('.number input').val();//– 数量
            options["manifestItems["+i+"].unitPrice"] = $this.find('.price input').val();//– 进货价
            options["manifestItems["+i+"].comment"] = $this.find('.des input').val();// – 说明

        });

        var btn = $(this);
        btn.button('loading');

        if(type == 1){
            com.post(api.inventory.addManifestForCG, options, function(data){
                btn.button('reset');
                layer.msg('保存成功!', {icon : 1});
                
                com.focusPage('#list').empty();
                com.focusPage('[name="date"]','#form').val(null);
                com.focusPage('[name="orderid"]','#form').val(null);
                com.focusPage('[name="customer"]','#form').val(null);
                com.focusPage('#comment').val(null);
                com.focusPage("#totalSpan").text(0);

                //添加一条空行
                addline(1).addClass('current').appendTo(com.focusPage('#list'));

            }, function(e){
                btn.button('reset');
                com.showAlert(com.error, e.errorMsg);
            });
        }else if(type == 3){
            com.post(api.inventory.addManifestForXG, options, function(data){
                btn.button('reset');
                layer.msg('保存成功!', {icon : 1});
                //清空页面
                com.focusPage('#list').empty();
                com.focusPage('[name="date"]','#form').val(null);
                com.focusPage('[name="orderid"]','#form').val(null);
                com.focusPage('[name="customer"]','#form').val(null);
                com.focusPage('#comment').val(null);
                com.focusPage("#totalSpan").text(0);

                //添加一条空行
                addline(1).addClass('current').appendTo(com.focusPage('#list'));
                
            }, function(e){
                btn.button('reset');
                com.showAlert(com.error, e.errorMsg);
            });
        }


    });


    //添加一个空行
    function addline(lineindex){

        var $line = $('<li></li>').addClass('line');
        var $indexWrap = $('<div></div>').addClass('line-wrap order').append($('<div></div>').addClass('cell index').text(lineindex));
        var $lineInfoWrap = $('<div></div>').addClass('line-wrap content col10');
        var $optWrap= $('<div></div>').addClass('line-wrap action');
        var _lineInfoSet = [
            {cellClass : "no"},//编号
            {cellClass : "name", hasInput : !0},//名称
            {cellClass : "barcode"},//条形码
            {cellClass : "color",hasSelectColor:!0},//颜色
            {cellClass : "format",hasSelectFormat:!0},//规格
            {cellClass : "measurementUnit"},//单位
            {cellClass : "storehouse", hasSelect : !0},//仓库
            {cellClass : "number", hasInput : !0},//数量
            {cellClass : "price", hasInput : !0},//采购金额
            {cellClass : "des", hasInput : !0}//备注
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
                if(v.cellClass == "price"){
                    $input.addClass('v_selling');
                }
                if(v.cellClass == "des"){
                    $input.attr('maxlength', '128');
                }
                $cell.append($input);
            }

            if(v.hasSelect){
                var $select = $('<select class="v_required"></select>');
                $select.bindData(manifest.storehouses,"shId","name");
                $cell.append($select);
            }
            if(v.hasSelectColor){
                var $select = $('<select class="v_required"></select>');
                $cell.append($select);
            }
            if(v.hasSelectFormat){
                var $select = $('<select class="v_required"></select>');
                $cell.append($select);
            }
            $cell.appendTo($lineInfoWrap);

        });

        $lineInfoWrap.find('.name input').typeahead({
            url: api.inventory.queryGoodsByName,
            list: [],
            postData: {},
            source: function (query, process) {
                var params = $.extend({"goods.name" : query,"goods.pinyin":query,"goods.no":query}, this.options.postData);
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
                        $lineInfoWrap.find('.barcode').text(val.barcode);
                        $lineInfoWrap.find('.measurementUnit').text(val.measurementUnit);
                        $line.attr('data-gid',val.gid);
                        $line.attr('data-pgid',val.gid+'_'+lineindex);
                        com.post(api.inventory.queryColorForEnableByGid,{
                            "color.gid": val.gid
                        },function(res){
                            com.focusPage('li[data-pgid="'+val.gid+'_'+lineindex+'"] .color select').bindData(res.colors,"cid","name");
                        });
                        com.post(api.inventory.queryFormatForEnableByGid,{
                            "format.gid": val.gid
                        },function(res){
                            com.focusPage('li[data-pgid="'+val.gid+'_'+lineindex+'"] .format select').bindData(res.formats,"fid","info");
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

                cyclTotal();

         });

         $btndel.click(function(e){
             e.stopPropagation();
             $line.remove();
             reorder();
             cyclTotal();
         });

        return $line;

    }

    //选择模板添加
    var $btnadd = com.focusPage('#form a[name="addQuotationVersion"]');
    $btnadd.click(function(){

        var optmtId = com.focusPage('#form select[name="manifest"]').val();
        if(optmtId == null || optmtId == ""){
            layer.msg('模板不存在',{icon:2});
            return
        }
        var index = com.focusPage('.line', '#list').length;
        com.post(api.inventory.queryManifestTemplateItemByMtId,{
            "manifestTemplate.mtId": optmtId
        },function(res){
            if(index!=0){
                for(var i = 0;i<res.manifestTemplateItems.length;i++){
                    index = com.focusPage('.line', '#list').length;
                    if(com.focusPage('#list li:last-of-type div.no').text()!=""){
                        autoAddline(index);
                        //addline(2+index).addClass('current').appendTo('#list');
                    }else{

                        if(res.manifestTemplateItems[i].goods.status==0){
                            var $lineInfoWrap1 = com.focusPage('#list li:nth-of-type('+index+') div.content');
                            com.focusPage('#list li:nth-of-type('+index+')').attr('data-gid',res.manifestTemplateItems[i].goods.gid);
                            $lineInfoWrap1.find('div.no').text(res.manifestTemplateItems[i].goods.no);
                            $lineInfoWrap1.find('div.name input').val(res.manifestTemplateItems[i].goods.name);
                            $lineInfoWrap1.find('div.barcode').text(res.manifestTemplateItems[i].goods.barcode);
                            $lineInfoWrap1.find('div.measurementUnit').text(res.manifestTemplateItems[i].goods.measurementUnit);
                            $lineInfoWrap1.find('div.number input').val(0);
                            $lineInfoWrap1.find('div.price input').val(0);
                            com.post(api.inventory.queryColorForEnableByGid,{
                                "color.gid": res.manifestTemplateItems[i].goods.gid
                            },function(data){
                                $lineInfoWrap1.find('.color select').bindData(data.colors,"cid","name");
                            });
                            com.post(api.inventory.queryFormatForEnableByGid,{
                                "format.gid": res.manifestTemplateItems[i].goods.gid
                            },function(data){
                                $lineInfoWrap1.find('.format select').bindData(data.formats,"fid","info");
                            });
                        }

                    }

                }
            }else{
                for(var i = 0;i<res.manifestTemplateItems.length;i++){
                    index=com.focusPage('.line', '#list').length;
                    autoAddline(index);
                }
            }
            function autoAddline(index){
                if(res.manifestTemplateItems[i].goods.status==0){

                    index = com.focusPage('.line', '#list').length;
                    addline(1+index).appendTo(com.focusPage('#list'));

                    var $lineInfoWrap1 = com.focusPage('#list li:nth-of-type('+(index+1)+') div.content');
                    com.focusPage('#list li:nth-of-type('+(index+1)+')').attr('data-gid',res.manifestTemplateItems[i].goods.gid);
                    $lineInfoWrap1.find('div.no').text(res.manifestTemplateItems[i].goods.no);
                    $lineInfoWrap1.find('div.name input').val(res.manifestTemplateItems[i].goods.name);
                    $lineInfoWrap1.find('div.barcode').text(res.manifestTemplateItems[i].goods.barcode);
                    $lineInfoWrap1.find('div.measurementUnit').text(res.manifestTemplateItems[i].goods.measurementUnit);
                    $lineInfoWrap1.find('div.number input').val(0);
                    $lineInfoWrap1.find('div.price input').val(0);

                    com.post(api.inventory.queryColorForEnableByGid,{
                        "color.gid": res.manifestTemplateItems[i].goods.gid
                    },function(data){
                        $lineInfoWrap1.find('.color select').bindData(data.colors,"cid","name");
                    });
                    com.post(api.inventory.queryFormatForEnableByGid,{
                        "format.gid": res.manifestTemplateItems[i].goods.gid
                    },function(data){
                        $lineInfoWrap1.find('.format select').bindData(data.formats,"fid","info");
                    });
                }


            }

        });

    });


    //计算总价的和
    function cyclTotal(){

        var _total = 0;

        var $list = com.focusPage('.line', '#list');
        $list.length && $list.each(function(){
            var $this = $(this);
            if($this.find('.price input').val()){
                _total = utils.accAdd(utils.accMul(parseFloat($this.find('.price input').val() + ''),$this.find('.number input').val()), _total);
            }
        });

        manifest.totalSum = _total;

        com.focusPage("#totalSpan").text(_total);
    }

    //重排序
    function reorder(){
        var $list = com.focusPage('.line', '#list');
        $list.length && $list.each(function(i){
            var $this = $(this);
            $this.find('.index').text(i + 1);
        });
    }
    //校验日期
    function checkInfo(){

        var flag = true;

        var date = com.focusPage('[name="date"]','#form');
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
        }else{
            date.popover('destroy');
        }

        return flag;

    }

    com.focusPage('#form div.pull-right').css('width','55%');
    com.focusPage('#form div.pull-right:nth-of-type(3) .inline-group:nth-of-type(3)').css('margin-left','160px');

});
