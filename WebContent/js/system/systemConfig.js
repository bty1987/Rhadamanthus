$(function(){

    var system = {
            
        items: {
            key: com.focusPage("#key"),
            value: com.focusPage("#value"),
            comment: com.focusPage("#comment"),
        },
        
        btns: {
            saveBtn: com.focusPage('#saveBtn').on("click",saveData),
            cancellBtn: com.focusPage("#cancelBtn"),
        },
        
        modals: {
            modal: com.focusPage("#system")
        },
            
        scid: null,
    };

    var displayFunc  = (function(){

        var renderList = function(tableId,listData){
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if(listData && listData.length){
                $.each(listData,function(i, v){
                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v){

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('red').html('KEY :')).append($('<span>&nbsp;&nbsp;</span>'))
                .append($('<small></small>').addClass('blue').html(v.key)).append($('<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>'))
                .append($('<small></small>').addClass('red').html('Value :')).append($('<span>&nbsp;&nbsp;</span>'))
                .append($('<small></small>').addClass('blue').html(v.value));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnDraw = $('<a></a>').addClass('btn btn-minier btn-yellow').html('更新');
          
            var propertyArr = [
                ["创建人:", v.createName, "grey"],
                ["创建时间:", v.createTime, "grey"],
                ["说明:", v.comment, "grey"],  
            ];
            
            $.each(propertyArr, function (index,value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnDraw).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnDraw.click(function(){
                edit(v);
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
        }
    })();
    
    var searcher = new Searcher();

    searcher.init(['system-config', 'system-company'], "condList", api.system.pageSystemConfig, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation");

    //编辑
    function edit(row){
    	//给页面标签赋值
    	
    	system.scid = row.scid;
    	
        system.items.key.val(row.key);
		system.items.value.val(row.value);
		system.items.comment.val(row.comment);

		system.modals.modal.modal("show"); //弹出弹层
    }

    com.focusPage('[name="systemConfig"]', com.focusPage('#pagenation')).on("click",function(){
        com.cleanItems(system.config);
        system.modals.modal.modal('show');
    });

    function saveData(){
        
        if(com.validate("system")){
            return false;
        }

        var key = system.items.key.val();
        var value = system.items.value.val();
        
        var options = {
        	"systemConfig.scid": system.scid,
            "systemConfig.key" : system.items.key.val(),
            "systemConfig.value": system.items.value.val(),
            "systemConfig.comment": system.items.comment.val(),
        };

        com.post(api.system.updateSystemConfig, options, function (res) {
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });
        
        system.modals.modal.modal('hide');
    }

})