
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
        items: {
        	manifestType: com.focusPage("#manifestType"),
        	manifestTime: com.focusPage("#manifestTime"),
        	manifestTemplate: com.focusPage("#manifestTemplate"),
        	totalSpan: com.focusPage("#totalSpan"),
        	comment: com.focusPage("#comment")
        },
        record: {},
        validator: {
        	float3: {
                type: "v_float_3",
                regex: /^(\d+|\d+\.[0-9]{1,3})$/,
                errorMsg: "单价输入内容格式错误"
            }
        },
        storehouses: []
    };

    $.extend(com.validator, manifest.validator);

    com.post(api.inventory.queryStorehouseForSelf, {}, function(res){
        $.each(res.storehouses, function(i,v){
            if(v.status == 0){
            	manifest.storehouses.push(v);
            }
        });
    }, null, false);


    com.post(api.ds.manifest, {}, function(res){
        manifest.items.manifestType.bindData(res.manifestTypes, "key", "value");
    }, null, false);

    com.post(api.inventory.queryManifestTemplate,{},function(res){
        var manifestTemplatesStatus = [];
        $.each(res.manifestTemplates,function(i,v){
            if(v.status == 0){
                manifestTemplatesStatus.push(v);
            }
        });
        manifest.items.manifestTemplate.bindData(manifestTemplatesStatus,'mtId','name');
    });

    //添加一条空行
    addline(1).addClass('current').appendTo(com.focusPage('#list'));
    
    com.focusPage('#addManifestItem').click(function(){
    	
        if(com.validate('list','bottom')){
            return;
        }
        
        var num = com.focusPage('.line', '#list').length;

        cyclTotal();
        
        var $line = addline(num + 1);
        $line.appendTo(com.focusPage('#list'));
    });

    com.focusPage('#submitManifest').click(function(){
    	
    	var $lines = com.focusPage('li.line', '#list');
    	
    	if(!$lines.length){
            com.showAlert(com.warnng, "请填写商品");
            return false;
        }
    	
    	if(com.validate("timelement", "top")){
    		return false;
    	}

        if(com.validate('list', 'bottom')){
            return false;
        }
        
        cyclTotal();
    	
        var manifestTime = manifest.items.manifestTime.val();
        var manifestType = manifest.items.manifestType.val();
        var comment = manifest.items.comment.val();
        
        var total = manifest.items.totalSpan.val();

        var url = "";
        var storehouse = ""
        var options = {
            "manifest.manifestTime": manifestTime,
            "manifest.total": total,
            "manifest.type": manifestType,
            "manifest.comment": comment,
            "manifest.attachment": ""//– 附件路径
        };
        
        if(manifestType == 1){
        	url = api.inventory.addManifestForCG;
        	storehouse = "instorehouse";
        }else if(manifestType == 3){
            url = api.inventory.addManifestForXG;
        	storehouse = "outstorehouse";
        }

        var $list = com.focusPage('li.line', '#list');
        
        $lines.length && $lines.each(function(i, e){
        	
            var $this = $(e);

            options["manifestItems["+i+"].goods.gid"] = $this.attr('data-gid');//– 商品id
            options["manifestItems["+i+"].color.cid"] = $this.find('.color select').val();//– 商品编号
            options["manifestItems["+i+"].format.fid"] = $this.find('.format select').val();//– 商品名
            options["manifestItems["+i+"].num"] = $this.find('.number input').val();//– 数量
            options["manifestItems["+i+"].unitPrice"] = $this.find('.price input').val();//– 进货价
            options["manifestItems["+i+"].comment"] = $this.find('.des input').val();// – 说明
            
            options["manifestItems["+i+"]." + storehouse + ".shId"] = $this.find('.storehouse select').val();
        });
        
        com.post(url, options, function(data){
        	com.showAlert(com.info, "操作成功");
            
            com.focusPage('#list').empty();
            
            manifest.items.manifestType.val(1); // 恢复类型
            manifest.items.manifestTime.val(null);
            manifest.items.comment.val("");
            manifest.items.totalSpan.text(0);
            
            addline(1).addClass('current').appendTo(com.focusPage('#list')); // 添加一条空行
        });
    });

    //添加一个空行
    function addline(lineindex){

        var $line = $('<li></li>').addClass('line');
        var $indexWrap = $('<div></div>').addClass('line-wrap order').append($('<div></div>').addClass('cell index').text(lineindex));
        var $lineInfoWrap = $('<div></div>').addClass('line-wrap content col10');
        var $optWrap= $('<div></div>').addClass('line-wrap action');
        
        var _lineInfoSet = [
            {cellClass: "no"},//编号
            {cellClass: "name", hasInput: true, require: "v_required"},//名称
            {cellClass: "barcode"},//条形码
            {cellClass: "color",hasSelect:true},//颜色
            {cellClass: "format",hasSelect:true},//规格
            {cellClass: "measurementUnit"},//单位
            {cellClass: "storehouse", hasSelect: true},//仓库
            {cellClass: "number", hasInput: true, require: "v_float_3"},//数量
            {cellClass: "price", hasInput: true, require: "v_float_3"},//采购金额
            {cellClass: "des", hasInput: true}//备注
        ];

        var $btncheck = $('<a class="green" style="font-size: 18px"><i class="icon-ok"></i></a>');
        var $btndel = $('<a class="red" style="font-size: 18px"><i class=" icon-remove"></i></a>');

        $.each(_lineInfoSet, function(i, v){
        	
            var $input;
            var $cell = $('<div></div>').addClass('cell '+ v.cellClass);
            
            if(v.hasInput){
                $input = $('<input>').prop({'type': 'text', 'autocomplete': 'off'}).addClass('editable');
                
                if(v.require){
                	$input.addClass(v.require);
                }
                
                if(v.cellClass == "des"){
                    $input.attr('maxlength', '128');
                }
                
                $cell.append($input);
            }
            
            if(v.hasSelect){
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
                var params = {
                	"goods.name": query,
                	"goods.pinyin":query,
                	"goods.no":query
                }
                com.post(this.options.url, params, $.proxy(this.options.callback, this));
            }, matcher: function (item) {
                return true;
            }, callback: function(data){
                this.options.list = data['goodes'];
                this.flprocess(this.options.list,'gid', 'name');
            },
            isResultTypeMap: true,
            flupdater: function(k,v){
            	
                var list = this.options.list;
                
                $.each(list, function(index, val){
                	
                    if(val.gid == k){
                    	
                    	if(com.focusPage('li[data-gid="' + val.gid +'"]').length != 0){
                    		com.showAlert(com.error, "商品已存在");
                    		v = ""
                    		return false;
                    	}
                    	
                        $lineInfoWrap.find('.no').text(val.no);
                        $lineInfoWrap.find('.barcode').text(val.barcode);
                        $lineInfoWrap.find('.measurementUnit').text(val.measurementUnit);
                        $line.attr('data-gid',val.gid);
                        $line.attr('data-pgid',val.gid+'_'+lineindex);
                        
                        com.focusPage('li[data-pgid="'+val.gid+'_'+lineindex+'"] .storehouse select').bindData(manifest.storehouses,"shId","name");
                        
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
        	
        	if(com.validate('list', 'bottom')){
        		return false;
        	}
        	
			cyclTotal();
         });

         $btndel.click(function(e){
             $line.remove();
             reorder();
             cyclTotal();
         });

        return $line;
    }

    //选择模板添加
    com.focusPage("#addManifestStyle").click(function(){
    	
    	if(com.validate('list', 'bottom')){
    		return false;
    	}

        var mtid = manifest.items.manifestTemplate.val();
        var index = com.focusPage('.line', '#list').length;
        
        com.post(api.inventory.queryManifestTemplateItemByMtId,{
            "manifestTemplate.mtId": mtid
        }, function(res){
        	
            for(var i=0;i<res.manifestTemplateItems.length;i++){
            	
            	var item =  res.manifestTemplateItems[i];
            	
            	if(item.goods.status != 0) continue;
            	
            	var _index = 1 + index + i;
            	
                addline(_index).appendTo(com.focusPage('#list'));
                
                com.focusPage('#list li:nth-of-type(' + _index + ')').attr('data-gid',item.goods.gid);

                var $lineInfoWrap1 = com.focusPage('#list li:nth-of-type(' + _index  +') div.content');
                
                $lineInfoWrap1.find('div.no').text(item.goods.no);
                $lineInfoWrap1.find('div.name input').val(item.goods.name);
                $lineInfoWrap1.find('div.barcode').text(item.goods.barcode);
                $lineInfoWrap1.find('div.measurementUnit').text(item.goods.measurementUnit);
                $lineInfoWrap1.find('div.number input').val(0);
                $lineInfoWrap1.find('div.price input').val(0);
                
                $lineInfoWrap1.find('div.storehouse select').bindData(manifest.storehouses,"shId","name");

                com.post(api.inventory.queryColorForEnableByGid,{
                    "color.gid": item.goods.gid
                },function(data){
                    $lineInfoWrap1.find('.color select').bindData(data.colors,"cid","name");
                }, null, false);
                
                com.post(api.inventory.queryFormatForEnableByGid,{
                    "format.gid": item.goods.gid
                },function(data){
                    $lineInfoWrap1.find('.format select').bindData(data.formats,"fid","info");
                }, null, false);
            }
        });
    });


    //计算总价的和
    function cyclTotal(){

        var _total = 0;

        var $list = com.focusPage('.line', '#list');
        
        $list.length && $list.each(function(i, e){
        	
            var $this = $(e);
            
            if($this.find('.price input').val()){
            	var price = parseFloat($this.find('.price input').val());
            	var num = parseFloat($this.find('.number input').val());
            	
                _total = utils.accAdd(utils.accMul(price, num), _total);
            }
        });

        manifest.items.totalSpan.text(utils.changeThrDecimal(_total));
    }

    //重排序
    function reorder(){
    	
    	com.focusPage('.line', '#list').each(function(i, e){
            $(e).find('.index').text(i + 1);
        });
    }

});
