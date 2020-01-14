$(function(){
	
	var accessoriesType = {
			
		items: {
			atid: com.focusPage('#atid'),
			name: com.focusPage('#name'),
			workType: com.focusPage('#workType'),
			comment: com.focusPage('#comment'),
            submitBtn: com.focusPage("#submitBtn"),
		}
	};

    var displayFunc  = (function(){
    	
        var renderList = function(tableId,listData){
        	
            var $tableWrap = com.focusPage('#' + tableId);
            
            if(listData && listData.length){
            	
                var $ulTitle = createTableTitle();
                var $ulData = $('<ul></ul>').addClass('flex-table');
                
                $tableWrap.append($ulTitle).append($ulData);
                $.each(listData,function(i, v){
                    var $liLine = creatLine(i, v, i == listData.length - 1);
                    $liLine.appendTo($ulTitle);
                });
            }
        };
        
        var createTableTitle = function(){
        	
            var $ulTitle = $('<ul></ul>').addClass('flex-table');
            var $liTitle = $('<li></li>').addClass('line table-title');
            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>'));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col4');
            var titleName = '名称,工种,说明,状态';
            
            $.each(titleName.split(','), function (i, v) {
                var $cell = $('<div></div>').addClass('cell').html(v);
                $cell.appendTo($contentWrap);
            });
            
            var $optionWrap = $('<div></div>').addClass('line-wrap action').html($('<div>操作</div>').addClass('cell option'));
            
            $liTitle.append($indexWrap).append($contentWrap).append($optionWrap).appendTo($ulTitle);
            
            return $ulTitle;
        };
        
        var creatLine = function(i, v, lastFlag){
        	
            var $liLine = $('<li></li>').addClass('line');
            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(i + 1));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col4');
            
            var propertyArr = [
                [v.name,'grey'],
                [v.workType.name,'grey'],
                [v.comment,'grey'],
                [v.status=="0"?"启用":"禁用",'red']
            ];
            
            $.each(propertyArr, function (i, v) {
                var $cell = $('<div></div>').addClass('cell ' + v[1]).html(v[0]);
                $cell.appendTo($contentWrap);
            });
            
            var $optionWrap = $('<div></div>').addClass('line-wrap action');
            var $cellOption = $('<div></div>').addClass('cell option');
            var $btnGroup = $('<div></div>').addClass('btn-group');
            var $btn = $('<button></button>').addClass('btn btn-primary dropdown-toggle').attr('data-toggle','dropdown').append('操作').append('<i class="icon-angle-down"></i>');
            
            var $btnUl = $('<ul></ul>').addClass('dropdown-menu').addClass(lastFlag ? 'bottom-up' : '');
            var $btnEdit = $('<li></li>').append($('<a></a>').html('编辑')) ;
            var $btnStart = $('<li></li>').append($('<a></a>').html('启用')) ;
            var $btnStop = $('<li></li>').append($('<a></a>').html('禁用')) ;
            
            $btnUl.append($btnEdit).append($btnStart).append($btnStop);
            $btnGroup.append($btn).append($btnUl).appendTo($cellOption);
            $cellOption.appendTo($optionWrap);
            $liLine.append($indexWrap).append($contentWrap).append($optionWrap);
            
            $btnEdit.click(function(){
                
                accessoriesType.items.atid.val(v.atid);
                accessoriesType.items.name.val(v.name);
                accessoriesType.items.workType.val(v.workType.id);
                accessoriesType.items.comment.val(v.comment);

                com.popup4model('#layerAdd','编辑')
            });

            $btnStart.click(function(){
            	updateStatus(v.atid, 0);
            });
            
            $btnStop.click(function () {
            	updateStatus(v.atid, 1);
            });
            
            return $liLine;
        };

        return {
            init : function(tableId,listData){
                com.focusPage('#' + tableId).html(null);
                renderList(tableId,listData);

            },
            drawLine : function(v){
                return creatLine(v);
            }
        };
    })();
    
    var accessoriesTypeSearcher = new Searcher();
    
    com.post(api.common.queryWorkType, {}, function(res){
        com.focusPage('select[name="workType"]').bindData(res.workTypes,"id","name");
    });

    accessoriesTypeSearcher.init( ["workTypeName"], "condList", api.data.pageAccessoriesType, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "accessoriesTypePostData", null, false, null, function(){


        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addAccessoriesType').css({'margin-top':'-2px','margin-left':'4px'});
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);
        
        var $importAccessoriesType = $('<a></a>').addClass('btn btn-minier btn-warning pull-left').attr('id', 'import').css('margin-top', '-2px');
        var $addaAccessoriesType = $('<i></i>').addClass('icon-cloud-upload bigger-110').appendTo($importAccessoriesType);
        var $addaAccessoriesTypespan = $('<span></span>').text('导入').appendTo($importAccessoriesType);

        return [$importAccessoriesType, $adda];

    },'resultList');

    com.focusPage("#addAccessoriesType").click(function(){
        com.popup4model('#layerAdd','添加')
    });

    accessoriesType.items.submitBtn.click(function () {
        saveData();
    });

    com.focusPage("#import").click(function(){
        com.popup4model('#importLayer','导入辅类')
    });
    
    com.focusPage('#importSelectAccessoriesType').Huploadify({

        'debug' : false, // 开启调试
        'auto':true, // 是否自动上传
        'successTimeout':config.uploadTimeout, // 超时时间
        'formData':{
            'uploadType':4
        },
        'buttonClass': 'btn btn-success col-sm-6',
        'overrideEvents' : ['onDialogClose'], // 不执行默认的onSelect事件
        'fileObjName':'strutsUploads', // 服务器端脚本使用的文件对象的名称 $_FILES个['upload']
        'uploader': config.server + 'importAccessoriesType.do', // 上传处理程序
        'height':'30', // 浏览按钮的高度
        'fileTypeDesc':'支持的格式：',  // 在浏览窗口底部的文件类型下拉菜单中显示的文本
        'fileTypeExts':'*.xls;*.xlsx', // 允许上传的文件后缀
        'fileSizeLimit':'2MB', // 上传文件的大小限制
        'queueSizeLimit' : 1, // 上传数量
        'onUploadSuccess':function(file, data, response){ //上传到服务器，服务器返回相应信息到data里
            //var dateObj = eval("("+data+")");
            accessoriesTypeSearcher.doSearch();
        }
    });
    
    function clearForm(){
        
        com.clearValidator();
        
        accessoriesType.items.atid.val("");
        accessoriesType.items.name.val("");
        accessoriesType.items.workType.val(0);
        accessoriesType.items.comment.val("");

        com.closePopup();
    }

    function updateStatus(atid, status){

    	var options = {
			"accessoriesType.atid": atid,
			"accessoriesType.status": status
    	};
    	
    	com.post(api.data.updateAccessoriesTypeForStatus, options, function(res){
            accessoriesTypeSearcher.doSearch();
            
            com.showAlert(com.info, "操作成功");
        });
    }

    function saveData(){
    	
    	if(com.validate('form1',"right")){
            return false;
    	}
        
        var atid = accessoriesType.items.atid.val();
        var name = accessoriesType.items.name.val();
        var workType = accessoriesType.items.workType.val();
        var comment = accessoriesType.items.comment.val();
        
        var url = api.data.addAccessoriesType;
        var options = {
        	"accessoriesType.name": name,
        	"accessoriesType.workType.id": workType,
        	"accessoriesType.comment": comment
        };
        
        if(atid > 0){
        	url = api.data.updateAccessoriesType;
        	options["accessoriesType.atid"] = atid;
        }
        
        com.post(url, options, function(res){
        	
            accessoriesTypeSearcher.doSearch();
            
            clearForm();
        });
    }

});
