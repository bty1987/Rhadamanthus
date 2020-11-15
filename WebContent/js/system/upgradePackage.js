jQuery(function($) {
    
    var upgrade = {
        saveBtn : com.focusPage("#saveBtn").on("click", saveData),
        modal : com.focusPage("#upgradeModal"),
        items : {
            upgradeNumber : com.focusPage("#upgradeNumber"),
            trialUpgrade : com.focusPage("#trialUpgrade"),
            createTime : com.focusPage("#createTime"),
            content : com.focusPage("#content"),
            path : com.focusPage("#path"),
            fileSize : com.focusPage("#fileSize"),
        },
    };

    com.datetime(com.focusPage(".date-picker"), "date");
    
    upgrade.modal.on("hide.bs.modal", function(a) {
        com.cleanItems(upgrade.items);
        com.clearValidator();
    });

    var displayFunc = (function() {

        var renderList = function(tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId).empty();
            var $ul = $('<ul></ul>').addClass(
                    'item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function(i, v) {
                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v) {
            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.no));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-yellow').html('删除');

            var propertyArr = [ 
                [ "最新版本:", v.no, "grey" ],
                [ "适用版本:", v.trialno, "grey" ],
                [ "创建时间:", v.createTime, "grey" ],
                [ "版本说明:", v.content, "grey" ], 
                [ "路径:", v.path, "grey" ]
            ];

            $.each(propertyArr, function(index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnDel).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnDel.click(function() {
                com.showConfirm("是否确定删除", function() {
                    com.post(api.upgrade.deleteUpgrade, {"upgrade.ugid" : v.ugid}, function() {
                        seacher.doSearch();
                    });
                });
            });

            return $liLine;
        };

        return {
            init : function(tableId, listData) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine : function(v) {
                return creatLine(v);
            }
        }
    })();

    var seacher = new Searcher();
    
    seacher.init([ 'system-upgrade-version', 'system-upgrade-createTime' ], "condList", api.upgrade.pageUpgrade, function(list) {
        displayFunc.init('resultList', list);
    }, "pagenation", "upgradePostData", null, false, null, function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addUpgrade').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        $adda.click(function() {
            upgrade.modal.modal("show")
        });

        return [$adda];
    });

    function saveData() {
        
        if (com.validate("upgradeModal")) {
            return false
        }
        
        var option = {
            "upgrade.no" : upgrade.items.upgradeNumber.val(),
            "upgrade.trialno" : upgrade.items.trialUpgrade.val(),
            "upgrade.createTime" : upgrade.items.createTime.val()+" 00:00:00",
            "upgrade.content" : upgrade.items.content.val(),
            "upgrade.path" : upgrade.items.path.val(),
            "upgrade.fileSize" : upgrade.items.fileSize.val(),
        }

        com.post(api.upgrade.addUpgrade, option, function() {
            
            com.showAlert(com.info, '添加成功');
            com.cleanItems(upgrade.items);
            
            seacher.doSearch();
        });
        
        upgrade.modal.modal("hide");
    }
    
    com.uploadify("#file", "上传升级包", api.common.uploadOther, 'btn btn-success blue ', "*.zip", {'uploadType': 0}, 1, function(data, file){
        com.focusPage("#path").val(data.resUrl);
        com.focusPage("#fileSize").val(file.size);
    });

});