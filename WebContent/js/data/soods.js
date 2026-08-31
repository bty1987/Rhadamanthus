$(function() {

    var soods = {
        gid: null,
        keyword: null,
        items: {
            soodsName: com.focusPage("#soodsName"),
            selling: com.focusPage("#selling"),
            cost: com.focusPage("#cost"),
            balance: com.focusPage("#balance"),
            goods: com.focusPage("#goodsName"),
            format: com.focusPage('#format'),
            name: com.focusPage("#name"),
            quote: com.focusPage("#quote"),
            num: com.focusPage("#num"),
            type: com.focusPage("#type"),
            soodsnum: com.focusPage("#soodsnum"),

            executeTimes: com.focusPage("#executeTimes"),
            executeDates: com.focusPage("#executeDates"),

            filePath: com.focusPage("#filePath"),
        },

        uitems: {
            uSoodsName: com.focusPage("#uSoodsName"),
            uFormat: com.focusPage("#uFormat"),
            uSelling: com.focusPage("#uSelling"),
            uCost: com.focusPage("#uCost"),
            uType: com.focusPage("#uType"),
            uBalance: com.focusPage("#uBalance")
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

    soods.items.type.bindData(constant.data.soods.type.datas, 'key', 'value');
    soods.uitems.uType.bindData(constant.data.soods.type.datas, 'key', 'value');

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

    var lineprops = (function() {

        var lineprops = [{
            type: "checkbox",
            name: "sids",
            prop: "sid",
            clazz: "ace ace-checkbox-2"
        }, {
            field: "qrcode",
            name: "二维码",
            type: "qrcode",
            prop: function(v) { return "" + v.sid; }
        }, {
            field: "drawing",
            name: "图片",
            type: "img",
            prop: "path"
        }, {
            field: "name",
            name: "名称",
            prop: "name",
            clazz: "grey"
        }, {
            field: "brand",
            name: "品牌",
            prop: "goods.brand",
            clazz: "grey"
        }, {
            field: "category",
            name: "品类",
            prop: "goods.category",
            clazz: "grey"
        }, {
            field: "measurementUnit",
            name: "单位",
            prop: "goods.measurementUnit",
            clazz: "red"
        }, {
            field: "selling",
            name: "售价",
            prop: "selling",
            clazz: "blue"
        }, {
            field: "cost",
            name: "成本",
            prop: "cost",
            clazz: "blue"
        }, {
            field: "balance",
            name: "结算价",
            prop: "balance",
            clazz: "blue"
        }, {
            field: "num",
            name: "数量",
            prop: "num",
            clazz: "blue"
        }, {
            field: "status",
            name: "状态",
            prop: function(v) { return constant.data().soods.status.keys[v.status]; },
            clazz: "red"
        }, {
            field: "type",
            name: "类型",
            prop: function(v) { return constant.data.soods.type.keys[v.type]; },
            clazz: "red"
        }];

        return lineprops;
    })();

    var linebtns = (function() {

        var btns = {
            project: {
                name: "项目",
                clazz: "btn-warning",
                handle: function(v) {
                    params.data.soods = v;
                    com.popup4page("#quotationItemPopUp", "/views/data/soodsItem.html", "项目");
                }
            }
        };

        if (soods.pageType == "basic") {
            btns.drawing = {
                name: "图片",
                clazz: "btn-yellow",
                handle: function(v) {
                    params.sid = v.sid;
                    soods.vid = v.sid;
                    managedrawing(v.sid);
                }
            };
        } else {
            btns.edit = {
                name: "编辑",
                clazz: "btn-yellow",
                handle: function(v) {
                    soods.uitems.uSoodsName.val(v.name);
                    soods.uitems.uFormat.val(v.format);
                    soods.uitems.uSelling.val(v.selling);
                    soods.uitems.uCost.val(v.cost);
                    soods.uitems.uBalance.val(v.balance);
                    soods.sid = v.sid;
                    soods.updateSoodsModal.modal("show");
                }
            };
            btns.status = {
                type: "switch",
                init: function(v) { return !v.status; },
                handle: function(v, checked) {
                    var options = {};
                    options["soodes[" + [0] + "].sid"] = v.sid;
                    options["soodes[" + [0] + "].status"] = checked ? 0 : 1;
                    com.post(api.data.updateSoodsForStatus, options, function() {
                        searcher.doSearch();
                    });
                }
            };
            btns.delete = {
                name: "删除",
                clazz: "btn-success",
                handle: function(v) {
                    com.showConfirm("是否确认删除", function() {
                        var options = {
                            "soods.sid": v.sid,
                            "soods.status": v.status
                        };
                        deleteSoods(options);
                    });
                }
            };
        }

        return btns;
    })();

    var searcher = new Searcher();
    var condCodeArrs = ["data-soods-name", "data-soods-category", "data-soods-brand", "data-soods-status"];

    searcher.set("condList", "pagenation", "resultList", api.data.pageSoods, {
        "soods.sid": 0
    }, condCodeArrs, "soodsPostData", null, false, function() {

        var $impa = $('<a></a>').addClass('btn btn-minier btn-info pull-left').attr('name', 'import');
        $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($impa);
        $('<span></span>').text('导出').appendTo($impa);

        var $upda = $('<a></a>').addClass('btn btn-minier btn-pink pull-left').attr('name', 'update').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($upda);
        $('<span></span>').text('批量更新').appendTo($upda);

        var $importa = $('<a></a>').addClass('btn btn-minier btn-warning pull-left').attr('name', 'importSoods').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-upload-alt bigger-110').appendTo($importa);
        $('<span></span>').text('导入').appendTo($importa);

        var $starta = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'start').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-ok bigger-110').appendTo($starta);
        $('<span></span>').text('启用').appendTo($starta);

        var $stopa = $('<a></a>').addClass('btn btn-minier btn-danger pull-left').attr('name', 'stop').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-ok bigger-110').appendTo($stopa);
        $('<span></span>').text('禁用').appendTo($stopa);

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addSoodsModal').css({
            'margin-left': '4px'
        });
        $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        $('<span></span>').text('添加').appendTo($adda);

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
            com.popup4model("#updateMa", "批量更新");
        });

        $importa.click(function() {
            soods.keyword = "import_data_soods";
            var form = com.focusPage("#importSoodsForm");
            com.focusPage("#uploaddiv").removeClass("hide").appendTo(form);
            com.focusPage("#fileUpload").removeClass("hide");
            soods.btns.importBtn.removeClass("hide");
            soods.btns.exportBtn.addClass("hide");
            com.popup4model("#importSoods", "导入选材");
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
            return [$impa, $upda, $importa, $starta, $stopa];
        }
    });
    searcher.line(function(v) { return v.goods.name; }, lineprops, linebtns).render();

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
                column: [["选材: ", 'name'], ["商品: ", 'goods.name'], ["选材ID: ", 'sid'], ["品牌: ", 'goods.brand'], ["品类: ", 'goods.category'], ["单位: ", 'goods.measurementUnit'], ["规格: ", 'format'], ["结算价: ", 'selling'], ["数量: ", 'num'], ["状态: ", 'status']],
                list: res.paging.data
            }, function(v) {

                v.status = constant.data().soods.status.keys[v.status];
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
            "soods.name": soods.uitems.uSoodsName.val(),
            "soods.format": soods.uitems.uFormat.val(),
            "soods.selling": soods.uitems.uSelling.val(),
            "soods.cost": soods.uitems.uCost.val(),
            "soods.type": soods.uitems.uType.val(),
            "soods.balance": soods.uitems.uBalance.val()
        };

        com.post(api.data.updateSoods, option, function(e) {

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
            "soods.name": soods.items.soodsName.val(),
            "soods.goods.gid": gid,
            "soods.format": soods.items.format.val(),
            "soods.num": soods.items.soodsnum.val(),
            "soods.selling": soods.items.selling.val(),
            "soods.cost": soods.items.cost.val(),
            "soods.type": soods.items.type.val(),
            "soods.balance": soods.items.balance.val()
        };

        com.post(api.data.addSoods, option, function(e) {

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