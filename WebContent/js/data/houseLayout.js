$(function() {

    var houseLayout = {

        btns: {
            addHouseTypeBtn: com.focusPage("#addHouseTypeBtn"),
            saveBtn: com.focusPage("#saveDataBtn"),
            cancelBtn: com.focusPage("#cancelBtn"),
        },
        items: {
            houseTypeOne: com.focusPage("#houseTypeOne"),
            houseTypeTwo: com.focusPage("#houseTypeTwo"),
            houseTypeThr: com.focusPage("#houseTypeThr"),
            houseTypeFour: com.focusPage("#houseTypeFour"),
            area: com.focusPage("#area"),
            comment: com.focusPage("#comment")
        },
        modals: {
            houseTypeModal: com.focusPage("#houseTypeModal"),
            houseLayoutModal: com.focusPage("#houseLayoutModal"),
        },
        vid: params.data.village.vid,
    };

    houseLayout.btns.saveBtn.bindClick(saveData);

    houseLayout.modals.houseTypeModal.on("hide.bs.modal", function() {
        com.cleanItems(houseLayout.items);
        com.clearValidator();
        com.closeTip();
    });

    houseLayout.btns.addHouseTypeBtn.click(function() {
        com.clearValidator();
        houseLayout.modals.houseTypeModal.modal("show");
    });

    var initList = function(listData) {

        var $tableWrap = com.focusPage('#list').empty();
        var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

        if (!listData.length) {
            var $resultList = com.focusPage("#list").addClass('dz-default dz-message');
            var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resultList);
            var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
            var $span = $('<span></span>').text('无可用数据提供').appendTo($mesg);
            return $resultList;
        } else if (listData && listData.length) {

            $.each(listData, function(i, v) {
                var $liLine = $('<li></li>').addClass('item-orange clearfix');

                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
                var $drawingedit = $('<a></a>').addClass('btn btn-minier btn-warning').html('管理图片');
                var $deletBtn = $('<a></a>').addClass('btn btn-minier btn-danger').html('删除');

                var propertyArr = [["名称:", v.name, "green"], ["面积:", v.area + '平方米', "red"], ["说明:", v.comment, "grey"]];

                $.each(propertyArr, function(index, value) {
                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });
                $divBtnWrap.append($deletBtn).append($drawingedit);
                $liLine.append($divBtnWrap).append($ulProperty).appendTo($ul);

                $drawingedit.click(function() {
                    houseLayout.hlid = v.hlid;
                    managedrawing(v.hlid);
                });

                $deletBtn.click(function() {
                    com.showConfirm("确定删除吗?", function(reslut) {
                        com.post(api.data.deleteHouseLayout, {
                            "houseLayout.hlid": v.hlid
                        }, function(res) {
                            queryHouseLayout(houseLayout.vid);
                            com.showAlert(com.info, "操作成功");
                        });
                    });
                })

            });
            $ul.appendTo($tableWrap);
        }
    };

    queryHouseLayout(houseLayout.vid);

    function queryHouseLayout(vid) {

        com.post(api.data.queryHouseLayout, {
            "houseLayout.vid": vid
        }, function(data) {

            initList(data.houseLayouts);

        }, function(e) {
            com.showAlert(com.error, e.errorMsg);
        }, false);
    };

    function saveData() {
        if (com.validate('houseTypeModal')) { return false; };

        var options = {};

        options["houseLayout.name"] = houseLayout.items.houseTypeOne.val() + "室" + houseLayout.items.houseTypeTwo.val() + "厅" + houseLayout.items.houseTypeThr.val() + "厨" + houseLayout.items.houseTypeFour.val() + "卫";
        options["houseLayout.Area"] = houseLayout.items.area.val();
        options["houseLayout.comment"] = houseLayout.items.comment.val();
        options["houseLayout.vid"] = params.data.village.vid;

        if (houseLayout.items.area.val() == 0 || isNaN(houseLayout.items.area.val())) {
            com.showAlert(com.warning, "户型面积输入错误");
            return false;
        }

        if (houseLayout.items.houseTypeOne.val() == 0 && houseLayout.items.houseTypeTwo.val() == 0 && houseLayout.items.houseTypeThr.val() == 0 && houseLayout.items.houseTypeFour.val() == 0) {
            com.showAlert(com.warning, "户型输入错误");
            return false;
        };

        com.post(api.data.addHouseLayout, options, function() {
            com.showAlert(com.info, "添加成功");
            queryHouseLayout(houseLayout.vid);
        });

        houseLayout.modals.houseTypeModal.modal("hide");
    };

    // 提交图片
    function managedrawing(hlid) {

        houseLayout.modals.houseLayoutModal.modal("show");
        com.focusPage('#houseLayoutDrawing').html("");

        com.post(api.communion.queryDataDrawing, {
            "dataDrawing.sid": hlid,
            "dataDrawing.type": 2
        }, function(data) {

            com.focusPage("#houseLayoutDrawing").append(drawProductionPicture());
            var houseLayoutPictures = data.dataDrawings;

            for ( var i = 0; i < houseLayoutPictures.length; i++) {

                var houseLayoutPicture = houseLayoutPictures[i];
                // 文件
                if (houseLayoutPicture.type == 2) {
                    addCAD(com.focusPage("#productionUploadTheCAD"), houseLayoutPicture);
                }

            }
        }, null, false);

        com.post(api.communion.queryDataDrawing, {
            "dataDrawing.sid": hlid,
            "dataDrawing.type": 1
        }, function(data) {

            var houseLayoutPictures = data.dataDrawings;

            for ( var i = 0; i < houseLayoutPictures.length; i++) {

                var houseLayoutPicture = houseLayoutPictures[i];
                // 图
                if (houseLayoutPicture.type == 1) {
                    addPicture(com.focusPage("#productionUploadPlan"), houseLayoutPicture);
                }

            }

            com.popup4photos("#productionUploadPlan");

            loadHuploadify("houseLayoutFileUpload", "上传文件", "*.dwg;*.dwt", false, function(data) {
                addHouseLayoutPicture(data, 2);
            }, "btn btn-warning");

            loadHuploadify("houseLayoutUpload", "上传图片", "*.jpg;*.jpge;*.gif;*.png", true, function(data) {
                addHouseLayoutPicture(data, 1);
            }, "btn btn-success");

        }, null, false);

    };

    function loadHuploadify(eId, ename, fileType, multi, callback, btnstyle) {

        com.uploadify("#" + eId, ename, api.common.uploadImg, ('btn ' + btnstyle ? btnstyle : "btn-success"), fileType, {
            'uploadType': 2
        }, 1, function(data) {
            callback(data);
        });
    }

    function addPicture(i, v) {
        var $li = $('<li></li>').attr("id", "imgLi_" + v.ddid).appendTo(i);
        var $img = $('<img></img>').attr('width', 200).attr('height', 200);
        var $imgA = $('<a></a>').addClass('cboxElement').attr('target', '_blank').append($img).appendTo($li);

        com.showImg($img, v.drawingUrl, 200, 200, v.name, null);

        var $tags = $('<div></div>').addClass('tags').appendTo($li);
        var $nameHolder = $('<span></span>').addClass('label-holder').appendTo($tags);
        var $nameInfo = $('<span></span>').addClass('label label-info arrowed').text(v.name).appendTo($nameHolder);
        var $timeHolder = $('<span></span>').addClass('label-holder').appendTo($tags);
        var $timeInfo = $('<span></span>').addClass('label label-danger arrowed').text(v.createTime).appendTo($timeHolder);

        var $tools = $('<div></div>').addClass('tools tools-top').appendTo($li);
        var $toolLabel = $('<label></label>').appendTo($tools);
        var $downA = $('<a></a>').addClass("icon-download-alt").appendTo($tools);

        var $delA = $('<a></a>').addClass("icon-remove").appendTo($tools);

        $delA.click(function() {
            com.post(api.communion.deleteDataDrawing, {
                "dataDrawing.ddid": v.ddid
            }, function(res) {
                com.focusPage("#imgLi_" + v.ddid).remove();
            });
        });

        com.downloadFile($downA, v.drawingUrl, v.name);

    }
    function addCAD(i, v) {

        var $name = v.name;

        var $infobox = $('<div></div>').addClass('infobox infobox-blue infobox-dark').attr("id", "cad_" + v.ddid).appendTo(i);
        var $infoboxIcon = $('<div></div>').addClass('infobox-icon').appendTo($infobox);
        var $downIcon = $('<a></a>').addClass('icon-download-alt').appendTo($infoboxIcon);

        com.downloadFile($downIcon, v.drawingUrl, new Date().getTime() + '.' + $name.split('.')[1]);

        var $infoboxData = $('<div></div>').addClass('infobox-data').appendTo($infobox);
        var $infoboxLeft = $('<div></div>').css('float', 'left').appendTo($infoboxData);
        var $infoboxContent = $('<div></div>').addClass('infobox-content').text($name.split('.')[0].substr(0, 8) + '.' + $name.split('.')[1]).appendTo($infoboxLeft);
        var $infoboxContent = $('<div></div>').addClass('infobox-content').text(v.createTime).appendTo($infoboxLeft);

        var $delA = $('<a></a>').addClass("icon-remove").css({
            'float': 'right',
            'font-size': '22px',
            'color': 'white'
        }).appendTo($infoboxData);

        $delA.click(function() {
            com.post(api.communion.deleteDataDrawing, {
                "dataDrawing.ddid": v.ddid
            }, function(res) {
                com.focusPage("#cad_" + v.ddid).remove();
            });
        });
    };

    function drawProductionPicture(res) {
        function createDiv(classes, id, css) {
            var div = $('<div></div>').attr("class", classes);
            if (id)
                div.attr("id", id);
            if (css)
                div.attr("style", css);
            return div;
        }

        function createLabel(classes, text, forId) {
            var label = $('<label></label>').attr("class", classes).text(text);
            if (forId)
                label.attr("for", forId);
            return label;
        }

        function createUl(id, classes, css) {
            var ul = $("<ul></ul>").attr("class", classes);
            if (css)
                ul.attr("style", css);
            if (id)
                ul.attr("id", id);
            return ul;
        }

        var row1 = createDiv("row").append(createDiv("col-md-6").append(createDiv("col-md-2", "houseLayoutUpload"), createDiv("col-md-2", "houseLayoutFileUpload")));

        var row2 = createDiv("row").append(createDiv("col-xs-12").append(createLabel("control-label", "户型图:").attr("style", "margin-left: 20px;margin-top: 20px;"), createDiv("col-md-12 hr"), createDiv("row-fluid").append(createUl("productionUploadPlan", "ace-thumbnails"))), createDiv("col-xs-12").append(createLabel("control-label", "文件:").attr("style", "margin-left: 20px;margin-top: 20px;"), createDiv("col-md-12 hr"), createDiv("row-fluid").append(createDiv("col-sm-7 infobox-container", "productionUploadTheCAD")))

        );

        return [row1, row2];
    }

    function addHouseLayoutPicture(data, type) {

        var options = {};

        options["dataDrawing.sid"] = houseLayout.hlid;
        options["dataDrawing.name"] = data.strutsUploadsFileName;
        options["dataDrawing.drawingUrl"] = data.resUrl;
        options["dataDrawing.drawingType"] = 0;
        options["dataDrawing.type"] = type;

        com.post(api.communion.addDataDrawing, options, function(res) {
            managedrawing(houseLayout.hlid);
        });
    };

});
