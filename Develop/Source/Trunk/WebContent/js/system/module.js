$(function(){

    var fatherModuleArr = null;

    var Module = (function(){

        var createLine = function(v){

            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + v.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-yellow').html('删除');

            var propertyArr = [
                ["等级:", v.level, "grey"],
                ["图标:", v.icon, "grey"],
                ["链接:", v.url ? v.url: "---", "blue"],
                ["上级:", v.fatherModule ? v.fatherModule.name : "---", "grey"],
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
                deleteModule(v.mid)
            });

            return $liLine;
        };

        var sortData = function(listData){

            var menuArr = {
                level1 : [],
                level2 : [],
                level3 : [],
            };

            var arr ;

            if(!listData || !listData.length){
                return;
            }

            $.each(listData , function(i, v){
                menuArr['level' + v.level][menuArr['level' + v.level].length] = v;
                //menuArr['level' + v.level].push(v);
            });

            $.each(menuArr, function(key, val){
                menuArr[key] = val.sort(function(a,b){
                    return key=='level1' ? a.mid-b.mid : b.mid - a.mid;
                });
            });

            return menuArr;
        };

        return {
            renderList : function(listData, tableId){
                var $tableWrap = $('#' + tableId).empty();
                var menuArr = sortData(listData);
                var menuObj = {
                    level1 : {},
                    level2 : {},
                };
                if(listData && listData.length){

                    var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
                    $ul.appendTo($tableWrap);

                    if(menuArr.level1.length){
                        $.each(menuArr.level1, function(i, v){
                            var $li = createLine(v);
                            menuObj.level1[v.mid] = $li;
                            $li.appendTo($ul);
                        });
                    }

                    if(menuArr.level2.length){
                        $.each(menuArr.level2, function(i, v){

                            var $li = createLine(v);
                            menuObj.level2[v.mid] = $li;
                            var $parent = menuObj.level1[v.fatherModule.mid];
                            $li.insertAfter($parent);

                        });
                    }

                    if(menuArr.level3.length){
                        $.each(menuArr.level3, function(i, v){
                            var $li = createLine(v);
                            var $parent = menuObj.level2[v.fatherModule.mid];
                            $li.insertAfter($parent);
                        });
                    }
                }
            },
            getFatherModuleList : function(listData){
                var result = sortData(listData);
                return  {
                    level1 : result.level1,
                    level2 : result.level2,
                }
            }
        };
    })();

    function search(){
        com.post(api.system.queryModule, {'module.system' : config.system}, function(data){
            Module.renderList( data.modules ,'moduleTable');
            fatherModuleArr = Module.getFatherModuleList(data.modules);
        }, null, false);
    }

    search();

    var module = {
        modal : $('#moduleModal').on("show.bs.modal", function(a) {
            com.clearValidator();
            com.clearValidator("#materialModelName", !0);
            com.clearValidator("#materialModelNo", !0)
        }),
        btnAdd : $('#addModule').click(function(){
            $('#moduleModal').modal("show");
        }),
        saveBtn: $("#saveBtn").on("click", saveData),
        moduleModalItems : {
            name : $('#moduleName'),
            icon : $('#icon'),
            url : $('#url'),
            level : $('#level').on('change', function(){
                var val = $(this).val();
                if (val == 1){
                    $('#fatherModule').attr('readonly', true).removeClass('v_required');
                }else{
                    $('#fatherModule').removeAttr('readonly').addClass('v_required');
                }
            }),
            fatherModule : $('#fatherModule').typeahead({

                list: [],
                source: function (query, process) {


                    var level = $('#level').val() - 1;

                    var result = $.map(fatherModuleArr['level' + level], function(val){
                        return val.name.indexOf(query) == -1 ? null : val;
                    });

                    result = result.length ? result : fatherModuleArr['level' + level];

                    this.options.callback.call(this,result);
                }, matcher: function (item) {
                    return true;
                }, callback: function(data){
                    //this.options.list = data;
                    this.flprocess(data ,'mid', 'name');
                },
                isResultTypeMap : true //必填值为true，获取key，value的标识，
                , flupdater: function(k,v){//下拉列表选中时的一些处理，必填对选中项的key和value做处理
                    //k: key, v:value
                    return v;
                }
            }).attr('readonly', true)
        }
    };

    //保存
    function saveData() {
        if (com.validate()) {
            return;
        }

        var params = {
            "module.name": module.moduleModalItems.name.val(),
            "module.icon": module.moduleModalItems.icon.val(),
            "module.url": module.moduleModalItems.url.val(),
            "module.level": module.moduleModalItems.level.val(),
            "module.fatherModule.mid": module.moduleModalItems.fatherModule.attr('data-typeahead-key'),
            "module.system": config.system,
        };

        com.post(api.system.addModule, params,function(a) {
            module.modal.modal('hide');
            search();

        })
    }

    function deleteModule(mid){
        bootbox.confirm("确定删除吗？", function(result) {
            if(result) {
                com.post(api.system.deleteModule, {"module.mid": mid}, function(){
                    search();
                });
            }
        });
    }

});