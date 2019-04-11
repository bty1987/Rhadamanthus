
jQuery(function($) {

    if (jQuery().datepicker) {
        com.focusPage('.date-picker').datepicker({
            autoclose: true,
            format: 'yyyy-mm-dd'//yyyy-mm-dd hh:ii,
        });
    }

    var manifest = {
        saveBtn:  com.focusPage("#saveBtn"),
        cancellBtn: com.focusPage("#cancelBtn"),
        items: {
        	manifestTime: com.focusPage("#manifestTime"),
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

    var $layerSubmit = com.focusPage('#approvalSubmit');

    com.post(api.inventory.queryStorehouseForSelf, {}, function(res){

        $.each(res.storehouses,function(i,v){
            if(v.status == 0){
                manifest.storehouses.push(v);
            }
        });
    }, null, false);

    //添加一条空行
    addline(1).addClass('current').appendTo(com.focusPage('#list'));

    com.focusPage('#addManifestItem').click(function(){
    	
    	if(com.validate('list','bottom')){
            return;
        }
        
        var num = com.focusPage('.line', '#list').length;

        addline(num + 1).appendTo(com.focusPage('#list'));
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

        var options = {};

        approvalUtils.initqueryApprovalUser("approver", 11);

        openSubmitlayer(function(index, layero){

            var approverId = com.focusPage('#approver').find('input:checked').attr('userid');

            if (approverId == null || approverId == "") {
                com.showAlert(com.warning, "请选择审批人");
                return false;
            }
            
            var manifestTime = manifest.items.manifestTime.val();
            var comment = manifest.items.comment.val();

            options = {
                "approval.receiver.userId":approverId,
                "approval.comment": comment,
                
                "approvalManifestDB.manifestTime": manifestTime,
                "approvalManifestDB.comment":comment,
                "approvalManifestDB.attachment": ""//– 附件路径
            };

            var $list = com.focusPage('li.line', '#list');

            $list.length && $list.each(function(i, e){
            	
                var $this = $(e);

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
                
                com.showAlert(com.info, "操作成功");

                com.focusPage('#list').empty();
                
                manifest.items.manifestTime.val(null);
                manifest.items.comment.val("");
                
                com.focusPage('#approver').empty();

                addline(1).addClass('current').appendTo(com.focusPage('#list'));
            }, null, false);
        });
    });

    function openSubmitlayer(callback) {
        layer.closeAll();
        layer.open({
            type: 1,
            skin: 'layui-layer-lan',
            title: "调拨",
            content: $layerSubmit,
            area: ( $(window).width() * 0.6 < 600 ? $(window).height() * 0.6: 600 ) + "px",
            maxmin: false,
            zIndex: 9000,
            btn: ['提交', '取消'],
            yes: function (index, layero) {
                callback(index, layero);
            },
            btn2: function (index, layero) {
                com.focusPage('#approver').empty();
            },
            cancel: function () {
                com.focusPage('#approver').empty();
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
            {cellClass: "no"},//编号
            {cellClass: "name", hasInput: true, require: "v_required"},//名称
            {cellClass: "color",hasSelect: true},//颜色
            {cellClass: "format",hasSelect: true},//规格
            {cellClass: "measurementUnit"},//单位
            {cellClass: "instorehouse", hasSelect: true},//仓库
            {cellClass: "outstorehouse", hasSelect: true},//仓库
            {cellClass: "number", hasInput: true, require: "v_float_3"},//数量
            {cellClass: "pieceNum"},//件数
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
                	"goods.pinyin": query,
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
                    	
                    	if(com.focusPage('li[data-pgid="' + val.gid +'"]').length != 0){
                    		com.showAlert(com.error, "商品已存在");
                    		v = ""
                    		return false;
                    	}
                    	
                        $lineInfoWrap.find('.no').text(val.no);
                        $lineInfoWrap.find('.measurementUnit').text(val.measurementUnit);
                        $lineInfoWrap.find('.pieceNum').text(val.pieceNum);
                        $line.attr('data-pgid',val.gid);
                        $line.attr('data-gid',val.gid + '_' + lineindex);
                        
                        $lineInfoWrap.find('.instorehouse select').bindData(manifest.storehouses,"shId","name");
                        $lineInfoWrap.find('.outstorehouse select').bindData(manifest.storehouses,"shId","name");

                        com.post(api.inventory.queryColorForEnableByGid,{
                            "color.gid": val.gid
                        },function(res){
                            com.focusPage('li[data-gid="'+val.gid+'_'+lineindex+'"] .color select').bindData(res.colors,"cid","name");
                        });
                        
                        com .post(api.inventory.queryFormatForEnableByGid,{
                            "format.gid": val.gid
                        },function(res){
                            com.focusPage('li[data-gid="'+val.gid+'_'+lineindex+'"] .format select').bindData(res.formats,"fid","info");
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
                 return;
             }
         });

         $btndel.click(function(e){
             $line.remove();
             reorder();
         });

        return $line;
    }
    
    //重排序
    function reorder(){
    	com.focusPage('.line', '#list').each(function(i, e){
            $(e).find('.index').text(i + 1);
        });
    }
    
});
