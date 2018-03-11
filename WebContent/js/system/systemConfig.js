$(function(){

    var system = {
        saveBtn: null,
        cancellBtn: null,
        modal: null,
        config:{},
        
        scid: null,
    };

    system.saveBtn = $('#saveBtn').on("click",saveData);
    system.cancellBtn = $("#cancelBtn");
    system.modal = $("#system");
    system.config.key = $("#key");
    system.config.value = $("#value");
    system.config.comment = $("#comment");

    var displayFunc  = (function(){

        var renderList = function(tableId,listData){
            var $tableWrap = $('#' + tableId);
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
                $('#' + tableId).html(null);
                renderList(tableId,listData);
            },
            drawLine : function(v){
                return creatLine(v);
            }
        }
    })();
    var searcher = new Searcher();

    searcher.init(['systemConfig'], "condList",api.system.pageSystemConfig, function(data){
        //resultList是显示数据的DIV,data是返回值
        displayFunc.init('resultList', data);
    }, "pagenation");


    //编辑
    function edit(row){
    	//给页面标签赋值
    	
    	system.scid = row.scid;
    	
        system.config.key.val(row.key);
		system.config.value.val(row.value);
		system.config.comment.val(row.comment);

		system.modal.modal("show"); //弹出弹层
    }

    $('[name="systemConfig"]' , '#pagenation').on("click",function(){
        com.cleanItems(system.config);
        system.modal.modal('show');
    });

    function saveData(){

        var key = system.config.key.val();
        var value = system.config.value.val();
        
        if(key == null || key == ''){
            bootbox.alert("Key不能为空");
            return;
        }

        if(value == null || value == ''){
            bootbox.alert("Value不能为空");
            return;
        }
        var options = {
        	"systemConfig.scid": system.scid,
            "systemConfig.key" : system.config.key.val(),
            "systemConfig.value": system.config.value.val(),
            "systemConfig.comment": system.config.comment.val(),
        };

        com.post(api.system.updateSystemConfig, options, function (res) {
            //刷新页面所有条件,点击保存之后 刷新页面条件 重新载入
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });
        system.modal.modal('hide');
    }

})