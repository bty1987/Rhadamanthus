$(function () {

    var version = {
            
        vid: null,
        
        saveBtn: com.focusPage("#saveBtn"),
        cancelBtn: com.focusPage("#cancelBtn"),
        
        versionModal: com.focusPage("#versionModal"),
        
        items: {
            vid: com.focusPage("#vid"),
            no: com.focusPage("#no"),
            createTime: com.focusPage("#createTime"),
            comment: com.focusPage("#comment"),
        },
    };
    
    com.datetime(com.focusPage(".date-picker"), "date");
    
    version.saveBtn.on("click", function () {
        saveData();
    });
    
    version.versionModal.on('hide.bs.modal', function (e) {
        com.clearValidator();
    });
    
    var displayFunc = (function () {
        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId).empty();
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    creatLine(v).appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        }

        var creatLine = function (v) {
            
            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.no));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');
            var $btnEnabled = $('<a></a>').addClass('btn btn-minier btn-success').html('已启用');
            var $btnDisabled = $('<a></a>').addClass('btn btn-minier btn-danger').html('已禁用');
            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-warning').html('删除');

            var propertyArr = [
                ["创建时间:", v.createTime, "grey"],
                ["更新内容:", v.comment, "grey"]
            ];

            //循环出li中的属性
            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);

                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnEdit);
            v.status == 0 ? $divBtnWrap.append($btnEnabled) : $divBtnWrap.append($btnDisabled);
            $divBtnWrap.append($btnDel).appendTo($h3);
            $liLine.append($h3).append($ulProperty);

            $btnEdit.click(function () {

                version.vid = v.vid;
                
                com.cleanItems(version.items);
                
                version.items.no.val(v.no),
                version.items.createTime.val(v.createTime),
                version.items.comment.html(v.comment)

                version.versionModal.modal("show");
            });

            $btnEnabled.click(function () {
                updateStatus(v.vid, 1);
            })
            
            $btnDisabled.click(function () {
                updateStatus(v.vid, 0);
            })

            $btnDel.click(function () {
                com.showConfirm("是否确定删除", function () {
                    com.post(api.upgrade.deleteVersion, {"version.vid": v.vid}, function (res) {
                        com.showAlert(com.info, "操作成功");
                        versionSeacher.doSearch();
                    });
                });
            });

            return $liLine;
        };

        return {
            init: function (tableId, listData) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function (v) {
                return creatLine(v);
            }
        }
    })();

    var versionSeacher = new Searcher();
    versionSeacher.init([], "condList", api.upgrade.pageVersion, function (list) {
        displayFunc.init('resultList', list);
    }, "pagenation", "versionSeacherPostData", null, false, null, function () {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addVillage').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        $adda.click(function () {
            version.vid = null;
            
            com.cleanItems(version.items);
            
            version.versionModal.modal("show");
        });

        return [$adda];
    });

    function saveData() {
        
        if(com.validate("versionModal")){
            return false;
        }
        
        var url = api.upgrade.addVersion;
        
        var options = {
            "version.no": version.items.no.val(),
            "version.createTime": version.items.createTime.val(),
            "version.comment": version.items.comment.val(),
        }

        if(version.vid){
            url = api.upgrade.updateVersion;
            options["version.vid"] = version.vid;
        }

        com.post(url, options, function (res) {
            com.showAlert(com.info, "操作成功");
            versionSeacher.doSearch();
            version.versionModal.modal('hide');
        });
    }
    
    function updateStatus(vid, status){

        var options = {
            "version.vid": vid,
            "version.status": status
        }
        
        com.post(api.upgrade.updateVersionForStatus, options, function (res) {
            versionSeacher.doSearch();
        });
    }

});
