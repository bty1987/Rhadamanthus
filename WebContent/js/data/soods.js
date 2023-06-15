$(function() {

    var soods = {
        gid: null,
        keyword: null,
        items: {
            selling: com.focusPage("#selling"),
            goods: com.focusPage("#goodsName"),
            name: com.focusPage("#name"),
            quote: com.focusPage("#quote"),
            num: com.focusPage("#num"),
            soodsnum: com.focusPage("#soodsnum"),

            executeTimes: com.focusPage("#executeTimes"),
            executeDates: com.focusPage("#executeDates"),

            filePath: com.focusPage("#filePath"),
        },
        uitems: {
            uSelling: com.focusPage("#uSelling")
        },

        drawingModal: com.focusPage('#drawingModal').on("show.bs.modal", function(a) {

            com.clearValidator();
        }),
        btns: {
            importBtn: com.focusPage("#importBtn"),
            exportBtn: com.focusPage("#exportBtn")
        },

        addSoodsModal: com.focusPage("#addSoodsModal"),
        updateSoodsModal: com.focusPage("#updateSoodsModal"),

        updateSoodsItemBtn: com.focusPage("#updateSoodsItemBtn"),
        submitBtn: com.focusPage("#submitBtn"),
        withdrawBtn: com.focusPage("#withdrawBtn"),
        pageType: params.urlLoadParams.type,
    };

    com.datetime(soods.items.executeDates, "date", false);
    com.datetime(soods.items.executeTimes, "time", false);

    soods.withdrawBtn.bindClick(saveData);
    soods.updateSoodsItemBtn.bindClick(updateData);

    soods.addSoodsModal.on("hide.bs.modal", function(e) {

        com.clearValidator();
        com.cleanTypeahead("goodsName");
        com.cleanItems(soods.items);
    });

    soods.updateSoodsModal.on("hide.bs.modal", function(e) {

        com.clearValidator();
        com.cleanItems(soods.uitems);
    });

    soods.btns.importBtn.click(function() {

        planMission("import");
    });

    initUploadBtn();

    com.initTypeahead('goodsName', api.data.queryGoodsByName, "goods.name", {}, "goodes", "gid", "name", null);

    var displayFunc = (function() {

        var renderList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function(i, v) {

                    creatLine(v).appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $contentWrap = $('<div style="float: left;"></div>').css("text-align", "center").css("width", "75px").css("margin-right", "10px");
            var $drawingUrl = $('<div style="float: left;"></div>').css("text-align", "center").css("width", "75px").css("height", "75px").css("margin-right", "10px");
            var $imgDiv = $('<div></div>').addClass('cell').appendTo($contentWrap);
            var img = $('<img/>').appendTo($drawingUrl);
            $imgDiv.qrcode({
                render: "canvas",
                width: 75,
                height: 75,
                text: "" + v.sid
            });

            v.path != null ? com.showImg(img, v.path, 75, 75, v.goods.name, null, null) : null;

            $('<span></span>').css("font-size", "1px").html(v.goods.name).appendTo($contentWrap);

            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue'));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnCompile = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');
            var $btnDelete = $('<a></a>').addClass(' btn btn-minier btn-success').html('删除');
            var $btnProject = $('<a></a>').addClass('btn btn-minier btn-warning').html('项目');
            var $drawingedit = $('<a></a>').addClass('btn btn-minier btn-yellow').html('图片');

            var $invalid = $('<div></div>').addClass('pull-right');
            var $statusSwitch = $('<input/>').addClass('ace ace-switch ace-switch-5').prop({
                "type": "checkbox"
            });
            var $span = $('<span></span>').addClass('lbl status-lbl');

            if (soods.pageType != "basic") {
                $invalid.append($statusSwitch).append($span);
                $divBtnWrap.append($invalid).appendTo($h3);
            }
            var propertyArr = [["品牌: ", v.goods.brand, "grey"], ["品类: ", v.goods.category, "grey"], ["单位: ", v.goods.measurementUnit, "red"], ["结算价: ", v.selling, "blue"], ["数量: ", v.num, "blue"], ["状态: ", v.status == 0 ? "有效" : "无效", "red"], ];
            var $label = $('<label></label>');
            var $input = $('<input>').attr({
                "type": "checkbox",
                "name": "sids",
                "class": "ace ace-checkbox-2",
                "data-sid": v.sid,
                "data-status": v.status,
            }).val(v.sid);

            if (soods.pageType == "basic") {
                var $span = $('<span></span>').addClass('blue bigger-150').html(v.goods.name);
            } else {
                var $span = $('<span></span>').addClass('lbl blue bigger-150').html(v.goods.name);
            }

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });
            if (soods.pageType == "basic") {
                $divBtnWrap.append($btnProject).append($drawingedit).appendTo($h3);
            } else {
                $divBtnWrap.append($btnProject).append($btnCompile).appendTo($h3);
            }

            $label.append($input).append($span).appendTo($h3);

            $divBtnWrap.appendTo($h3);

            $liLine.append($contentWrap).append($drawingUrl).append($h3).append($ulProperty);

            !v.status && $statusSwitch.prop("checked", true);

            $btnProject.click(function() {

                params.data.soods = v;

                com.popup4page("#quotationItemPopUp", "/views/data/soodsItem.html", "项目");
            });

            $btnCompile.click(function() {

                soods.sid = v.sid;
                soods.updateSoodsModal.modal("show");
            });

            $btnDelete.click(function() {

                com.showConfirm("是否确认删除", function() {

                    var options = {
                        "soods.sid": v.sid,
                        "soods.status": v.status,
                    };
                    deleteSoods(options);
                });
            });

            $drawingedit.click(function() {

                params.sid = v.sid;
                soods.vid = v.sid;
                managedrawing(v.sid);
            });

            $statusSwitch.click(function() {

                var options = {};
                options["soodes[" + [0] + "].sid"] = v.sid;
                options["soodes[" + [0] + "].status"] = $statusSwitch.prop("checked") ? 0 : 1;

                com.post(api.data.updateSoodsForStatus, options, function() {

                    searcher.doSearch();
                });
            });

            return $liLine;
        };

        return {
            init: function(tableId, listData) {

                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function(v) {

                return creatLine(v);
            }
        }
    })();

    var searcher = new Searcher();
    var condCodeArrs = ["data-soods-name", "data-soods-category", "data-soods-brand", "data-soods-status"];

    searcher.init(condCodeArrs, "condList", api.data.pageSoods, function(data) {

        displayFunc.init('resultList', data);
    }, "pagenation", "soodsPostData", {
        "soods.sid": 0
    }, false, null, function() {

        var $impa = $('<a></a>').addClass('btn btn-minier btn-info pull-left').attr('name', 'import');
        var $impi = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($impa);
        var $impspan = $('<span></span>').text('导出').appendTo($impa);

        var $upda = $('<a></a>').addClass('btn btn-minier btn-pink pull-left').attr('name', 'update').css("margin", "0px 3px");
        var $updi = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($upda);
        var $updspan = $('<span></span>').text('批量更新').appendTo($upda);

        var $starta = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'start').css("margin", "0px 3px");
        var $starti = $('<i></i>').addClass('icon-ok bigger-110').appendTo($starta);
        var $startspan = $('<span></span>').text('启用').appendTo($starta);

        var $stopa = $('<a></a>').addClass('btn btn-minier btn-danger pull-left').attr('name', 'stop').css("margin", "0px 3px");
        var $stopi = $('<i></i>').addClass('icon-ok bigger-110').appendTo($stopa);
        var $stopspan = $('<span></span>').text('禁用').appendTo($stopa);

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addSoodsModal').css({
            'margin-left': '4px'
        });
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        $adda.click(function(e) {

            soods.addSoodsModal.modal("show");
        });

        $impa.click(function() {

            exportPurchase();
        });

        $upda.click(function() {

            soods.keyword = "update_data_soods";

            var form = com.focusPage("#updateForm");

            com.focusPage("#uploaddiv").removeClass("hide").appendTo(form);
            com.focusPage("#fileUpload").removeClass("hide");

            soods.btns.importBtn.removeClass("hide");
            soods.btns.exportBtn.addClass("hide");

            com.popup4model("#updateMa", "批量更新")
        });

        $starta.click(function() {

            batchUpdateStatus(0);
        });

        $stopa.click(function() {

            batchUpdateStatus(1);
        });

        if (soods.pageType == "basic") {
            return [$adda];
        } else {
            return [$impa, $upda, $starta, $stopa];
        }

    }, 'resultList');

    function batchUpdateStatus(status) {

        var checkbox = com.focusPage('input[name="sids"]:checked');

        var options = {};

        $.each(checkbox, function(i, v) {

            var $v = $(v);

            if ($v.val()) {
                options["soodes[" + i + "].sid"] = $v.val();
                options["soodes[" + i + "].status"] = status;
            }
        });

        com.post(api.data.updateSoodsForStatus, options, function(res) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });
    }

    // 导出excel
    function exportPurchase() {

        if (com.focusPage('span[name="totalRecords"]').text() == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }

        if (com.focusPage('span[name="totalRecords"]').text() > 1000) {
            com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
            return false;
        }

        com.post(api.data.pageSoods, $.extend({}, params.soodsPostData, {
            "paging.noPage": 1
        }), function(res) {

            $.exceler({
                column: [["名称: ", 'goods.name'], ["选材ID: ", 'sid'], ["品牌: ", 'goods.brand'], ["品类: ", 'goods.category'], ["单位: ", 'goods.measurementUnit'], ["结算价: ", 'selling'], ["数量: ", 'num'], ["状态: ", 'status']],
                list: res.paging.data
            }, function(v) {

                v.status = v.status == 0 ? "有效" : "无效";
            });
        });
    }

    function deleteSoods(options) {

        com.post(api.data.deleteSoods, options, function(res) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        }, null, false);
    }

    function updateData() {

        if (com.validate('updateSoodsModal')) {
            return false;
        }

        var option = {
            "soods.sid": soods.sid,
            "soods.selling": soods.uitems.uSelling.val()
        };

        com.post(api.data.updateSoods, option, function(e) {

            displayFunc.init();
            com.showAlert(com.info, "操作成功");
            soods.updateSoodsModal.modal("hide");
            searcher.doSearch();
        });
    }

    function saveData() {

        if (com.validate('addSoodsModal')) {
            return false;
        }

        var gid = com.typeahead("goodsName");

        if (!gid) {
            com.showAlert(com.error, "数据绑定失败");
            soods.modals.addSoodsModal.modal("hide");
            return false;
        }

        var option = {
            "soods.goods.gid": gid,
            "soods.num": soods.items.soodsnum.val(),
            "soods.selling": soods.items.selling.val(),
        };

        com.post(api.data.addSoods, option, function(e) {

            displayFunc.init();
            com.showAlert(com.info, "操作成功");
            soods.addSoodsModal.modal("hide");
        });
    }
    // 显示图片
    function managedrawing(sid) {

        soods.drawingModal.modal("show");
        com.focusPage('#soodsDrawing').html("");
        com.post(api.communion.queryDataDrawing, {
            "dataDrawing.sid": sid,
            "dataDrawing.type": 4
        }, function(data) {

            var soodsSourcePics = data.dataDrawings;
            if (soodsSourcePics && soodsSourcePics.length) {
                $.each(soodsSourcePics, function(i, value) {

                    appendGalleryElement("soodsDrawing", value);
                });
                com.popup4photos("#soodsDrawing");
            }
        }, null, false);
    }

    // 上传图片
    function initUploadBtn() {

        com.uploadify("#soodsUpload", "上传图片", api.common.uploadImg, 'btn btn-success', '*.jpg;*.jpeg;*.gif;*.png', {
            'uploadType': 0
        }, 1, function(data) {

            var options = {};

            options["dataDrawing.sid"] = params.sid;
            options["dataDrawing.name"] = data.strutsUploadsFileName;
            options["dataDrawing.drawingUrl"] = data.resUrl;
            options["dataDrawing.drawingType"] = 0;
            options["dataDrawing.type"] = 4;
            options["dataDrawing.filesize"] = data.filesize;

            com.post(api.communion.addDataDrawing, options, function(res) {

                var drawing = res.dataDrawing;

                appendGalleryElement("soodsDrawing", drawing);
                com.popup4photos("#soodsDrawing");
            });

            searcher.doSearch();
        });
    }

    function appendGalleryElement(galleryId, value) {

        var gallery = com.focusPage("#" + galleryId);

        var imgLi = $("<li></li>").attr("id", "gallery_li" + value.ddid).addClass("text-center col-sm-4").css("border", "0px").css("border-color", "white").css("padding", "0px").css("height", "150px").css("width", "150px").appendTo(gallery);
        var img = $('<img/>');
        var imgA = $("<a></a>").addClass('cboxElement').attr("target", "_blank").css("height", "150px").append(img).appendTo(imgLi);

        com.showImg(img, value.drawingUrl, 150, 150, value.name, null, value.drawingType);

        var toolsDiv = $("<div></div>").addClass("tools tools-bottom").appendTo(imgLi);
        var toolsA = $("<a></a>").attr("href", "#").on("click", function() {

            com.post(api.communion.deleteDataDrawing, {
                "dataDrawing.ddid": value.ddid
            }, function(res) {

                com.focusPage("#gallery_li" + value.ddid).remove();
            });
        }).appendTo(toolsDiv);

        var soodsUrl = $("<a></a>").attr("href", "#").on("click", function() {

            var option = {
                "soods.sid": params.sid,
                "soods.path": value.drawingUrl
            };

            com.post(api.data.updateSoods, option, function(e) {

                searcher.doSearch();
                com.showAlert(com.info, "操作成功");
            });

        }).appendTo(toolsDiv);

        $("<i></i>").addClass("icon-remove red").appendTo(toolsA);
        $("<i></i>").addClass("icon-plus green").appendTo(soodsUrl);
    }

    com.uploadify("#attachment", "上传文件", api.common.uploadOther, 'btn btn-sm btn-primary lineheight0', "*.xls;*.xlsx", {
        'uploadType': 3
    }, 1, function(data) {

        0 == data.errorCode ? com.focusPage("#filePath").val(data.resUrl) : alert(data.errorMsg);
    });

    // 导入创建计划
    function planMission(type) {

        if (com.validate("uploaddiv")) {
            return false;
        }

        var args = "";

        if (type == "import") {

            var filePath = soods.items.filePath.val();

            if (filePath == null || filePath == "") {
                com.showAlert(com.warning, "上传文件不能为空");
                return false;
            }

            args = filePath;
        } else {
            return false;
        }

        var date = soods.items.executeDates.val();
        var time = soods.items.executeTimes.val();

        var executeTime = date.replace(/-/g, '').substr(2) + time.replace(/:/g, '').substr(0, 4);

        var times = soods.items.executeDates.val() + ' ' + soods.items.executeTimes.val();
        var checkTime = new Date(times);

        if (!planUtils.TimeComparison(checkTime, config.planTimeLimit)) {
            com.showAlert(com.warning, "执行时间请大于当前时间" + config.planTimeLimit + "分钟");
            return false;
        }

        var options = {
            "plan.task.keyWord": soods.keyword,
            "plan.executeTime": executeTime,
            "plan.args": args
        };

        com.post(api.information.createPlan, options, function(res) {

            com.showAlert(com.info, "计划创建成功");
            com.closePopup();
        });
    }

});