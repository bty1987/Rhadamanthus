$(function(){

    var fatherModuleArr = null;

    var Operation = (function(){

        var createLine = function(v){

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + v.operation));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-yellow').html('删除');

            var propertyArr = [
                ["编号:", v.oid, "grey"],
                ["操作说明:", v.name, "grey"],
                ["模块:", v.module  ? v.module.name : "---", "grey"],
            ];

            $.each(propertyArr, function (index,value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnDel);

            $divBtnWrap.appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnDel.click(function(){
                deleteOperation(v.oid);
            });

            return $liLine;
        };

        return {
            renderList : function(listData, tableId){
                var $tableWrap = com.focusPage('#' + tableId).empty();
                if(listData && listData.length){

                    var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
                    $ul.appendTo($tableWrap);

                    $.each(listData, function(i, v){
                        var $li = createLine(v);
                        $li.appendTo($ul);
                    });
                }
            }
        };
    })();

    com.post(api.system.queryModule, {'module.system' : parent.config.system}, function(data){
        fatherModuleArr =  data.modules;
    }, null, false);

    function search(){
        com.post(api.system.queryOperation, {'operation.system': parent.config.system}, function(data){
            Operation.renderList( data.operations ,'operationTable');
        }, null, false);
    }

    search();

    var operation = {

        modal : com.focusPage('#operationModal').on("show.bs.modal", function(a) {
            com.clearValidator();
            com.clearValidator("#materialModelName", !0);
            com.clearValidator("#materialModelNo", !0)
        }),
        btnAdd : com.focusPage('#addModule').click(function(){
            com.focusPage('#operationModal').modal("show");
        }),
        saveBtn: com.focusPage("#saveBtn").on("click", saveData),
        operationModalItems : {
            operation  : com.focusPage('#operation'),
            operationName : com.focusPage('#operationName'),
            fatherModule : com.focusPage('#fatherModule').typeahead({

                list: [],
                source: function (query, process) {


                    var level = com.focusPage('#level').val() - 1;

                    var result = $.map(fatherModuleArr, function(val){
                        return val.name.indexOf(query) == -1 ? null : val;
                    });

                    result = result.length ? result : fatherModuleArr;

                    this.options.callback.call(this,result);
                }, matcher: function (item) {
                    return true;
                }, callback: function(data){
                    this.flprocess(data ,'mid', 'name');
                },
                isResultTypeMap : true //必填值为true,获取key,value的标识,
                , flupdater: function(k,v){//下拉列表选中时的一些处理,必填对选中项的key和value做处理
                    //k: key, v:value
                    return v;
                }
            })
        }
    };

    //保存
    function saveData() {
        
        if (com.validate("operationModal")) {
            return false;
        }

        var params = {
            "operation.name": operation.operationModalItems.operationName.val(),
            "operation.operation": operation.operationModalItems.operation.val(),
            "operation.module.mid": operation.operationModalItems.fatherModule.attr('data-typeahead-key'),
            "operation.system": config.system
        };

        com.post(api.system.addOperation, params,function(a) {
            search();
        });
        
        operation.modal.modal('hide');
    }

    function deleteOperation(oid){
        com.showConfirm("是否确定删除", function() {
            com.post(api.system.deleteOperation, {"operation.oid": oid}, function(){
                search();
            });
        });
    }

});