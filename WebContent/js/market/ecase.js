jQuery(function($) {

    var decorationCase = {
        saveBtn: null,
        modal: null,
        items: [],
        type: ["效果图", "施工图"],
        cid: null,
        editFlag: false,
        validator: null,
        ecityItem: []
    };

    decorationCase.saveBtn = com.focusPage("#saveBtn").on("click", saveCaseData);

    decorationCase.modal = com.focusPage("#caseModal");
    decorationCase.modal.on('show.bs.modal', function(e) {

        com.clearValidator();
    });
    decorationCase.modal.on('hidden.bs.modal', function() {

        decorationCase.editFlag = false;
        decorationCase.items.cycle.removeAttr("disabled");
    });

    $.extend(com.validator, decorationCase.validator);

    decorationCase.items.city = com.focusPage("#city");
    decorationCase.items.villageName = com.focusPage("#villageName");
    decorationCase.items.designer = com.focusPage("#designer");
    decorationCase.items.supervisor = com.focusPage("#supervisor");
    decorationCase.items.style = com.focusPage("#style");
    decorationCase.items.type = com.focusPage("#type");
    decorationCase.items.room = com.focusPage("#room");
    decorationCase.items.livingRoom = com.focusPage("#livingRoom");
    decorationCase.items.area = com.focusPage("#area");
    decorationCase.items.cycle = com.focusPage("#cycle");
    decorationCase.items.comment = com.focusPage("#comment");
    decorationCase.validateFlag = com.focusPage("#validateFlag");

    com.post(api.ds.market, {}, function(res) {

        decorationCase.items.room.bindData(res.room, "key", "value");
        decorationCase.items.livingRoom.bindData(res.livingRoom, "key", "value");
    }, null, false);

    com.initTypeahead('city', api.market.queryEcityByPinYin, "ecity.pinyin", {}, "autoFillKeyValue", "key", "value");
    com.initTypeahead('designer', api.market.queryEpersonByPinYin, "eperson.pinyin", {}, "autoFillKeyValue", "key", "value");
    com.initTypeahead('supervisor', api.market.queryEpersonByPinYin, "eperson.pinyin", {}, "autoFillKeyValue", "key", "value");

    decorationCase.items.cycle.attr("disabled", "disabled");

    com.post(api.market.queryEcity, {}, function(res) {

        var ecitys = res.ecitys;
        $.each(ecitys, function(i, v) {

            decorationCase.ecityItem[v.ecid] = v.city;
        })
    }, null, false);

    var lineprops = (function() {

        return [{
            field: "cityId",
            name: "城市",
            prop: function(v) { return decorationCase.ecityItem[v.cityId]; },
            clazz: "grey"
        }, {
            field: "villageName",
            name: "楼盘名称",
            prop: "villageName",
            clazz: "grey"
        }, {
            field: "designer.name",
            name: "设计师",
            prop: function(v) { return v.designer.name == null ? "无" : v.designer.name; },
            clazz: "grey"
        }, {
            field: "supervisor.name",
            name: "监理",
            prop: function(v) { return v.supervisor.name == null ? "无" : v.supervisor.name; },
            clazz: "grey"
        }, {
            field: "style",
            name: "风格",
            prop: "style",
            clazz: "red"
        }, {
            field: "type",
            name: "类型",
            prop: function(v) { return decorationCase.type[v.type]; },
            clazz: "red"
        }, {
            field: "houseType",
            name: "户型",
            prop: "houseType",
            clazz: "red"
        }, {
            field: "area",
            name: "面积",
            prop: function(v) { return v.area + "平"; },
            clazz: "blue"
        }, {
            field: "cycle",
            name: "周期",
            prop: function(v) { return v.cycle + "天"; },
            clazz: "blue"
        }, {
            field: "comment",
            name: "说明",
            prop: "comment",
            clazz: "grey"
        }];
    })();

    var linebtns = (function() {

        return {
            edit: {
                name: "编辑",
                clazz: "btn-yellow",
                handle: function(v) {
                    decorationCase.items.type.unbind("change");

                    cycleChange(decorationCase.items.type, v.cycle);

                    com.focusPage("#validateDiv").attr("style", "display:none");
                    com.cleanTypeahead('designer');
                    com.cleanTypeahead('supervisor');

                    if (v.type == 0) {
                        decorationCase.items.cycle.attr("disabled", "disabled");
                    } else if (v.type == 1) {
                        decorationCase.items.cycle.removeAttr("disabled");
                    }

                    com.updateTypeahead('city', v.cityId, decorationCase.ecityItem[v.cityId]);

                    if (v.designer.name != null) {
                        com.updateTypeahead('designer', v.designer.euid, v.designer.name);
                    }

                    if (v.supervisor.name != null) {
                        com.updateTypeahead('supervisor', v.supervisor.euid, v.supervisor.name);
                    }

                    decorationCase.items.villageName.val(v.villageName);
                    decorationCase.items.style.val(v.style);
                    decorationCase.items.type.val(v.type);
                    decorationCase.items.room.val(v.houseType.substring(0, 2));
                    decorationCase.items.livingRoom.val(v.houseType.substring(2));
                    decorationCase.items.area.val(v.area);
                    decorationCase.items.cycle.val(v.cycle);
                    decorationCase.items.comment.val(v.comment);
                    decorationCase.cid = v.cid;
                    decorationCase.editFlag = true;

                    com.focusPage("#caseModal").modal("show");
                }
            },
            drawing: {
                name: "图片",
                clazz: "btn-success",
                handle: function(v) {
                    com.focusPage("#epicture").html("");
                    com.post(api.market.queryEpictureByCid, {
                        "epicture.cid": v.cid,
                        "epicture.type": 0
                    }, function(data) {

                        var pictures = data.epictures;
                        if (pictures && pictures.length) {
                            $.each(pictures, function(i, d) {

                                appendGalleryElement("epicture", d.epid, d.url, 0, "", api.market.deleteEpicture, v.cid, api.market.updateEcase);
                            });
                            com.popup4photos("#epicture");
                        }
                    }, null, false);

                    initUploadBtn(v.cid);
                    com.focusPage("#epicturePage").modal("show");
                }
            },
            status: {
                name: "状态",
                type: "switch",
                clazz: "display-lbl",
                init: function(v) {
                    return v.status == 1;
                },
                handle: function(v, check) {
                    updateCaseStatus(v.cid, check ? 1 : 0);
                }
            }
        };
    })();

    var buttons = (function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addCase').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.market.pageEcase, null, ["market-ecase-city", "market-designer", "market-supervisor", "market-picture-type", "market-style", "market-houseType", "market-area"], "casePostData", null, false, buildEcaseButtons);
    searcher.line("villageName", lineprops, linebtns).render();

    // 添加
    com.focusPage('a[name="addCase"]', '#pagenation').click(function() {

        decorationCase.items.type.unbind("change");

        cycleChange(decorationCase.items.type, null);

        com.cleanItems(decorationCase.items);
        com.clearValidator("caseModal");

        com.cleanTypeahead('city');
        com.cleanTypeahead('designer');
        com.cleanTypeahead('supervisor');

        decorationCase.items.cycle.attr("disabled", "disabled");

        com.focusPage("#validateDiv").attr("style", "display:none");
        com.focusPage("#caseModal").modal("show");
    });

    function saveCaseData() {

        if (com.validate("caseModal")) {
            return false;
        }

        if (decorationCase.items.designer.val() == "" && decorationCase.items.supervisor.val() == "") {
            com.focusPage("#validateDiv").attr("style", "display:display");
            return false;
        }

        var options = {
            'caser.cityId': com.typeahead('city'),
            'caser.villageName': decorationCase.items.villageName.val(),
            'caser.designer.euid': com.typeahead('designer'),
            'caser.supervisor.euid': com.typeahead('supervisor'),
            'caser.style': decorationCase.items.style.val(),
            'caser.type': decorationCase.items.type.val(),
            'caser.houseType': decorationCase.items.room.val() + decorationCase.items.livingRoom.val(),
            'caser.area': decorationCase.items.area.val(),
            'caser.cycle': decorationCase.items.cycle.val(),
            'caser.comment': decorationCase.items.comment.val()
        };

        if (decorationCase.editFlag) {
            decorationCase.editFlag = false;
            options["caser.cid"] = decorationCase.cid;
            com.post(api.market.updateEcase, options, function(res) {

                com.showAlert(com.info, "修改成功");
                searcher.doSearch();
            });
        } else {
            com.post(api.market.addEcase, options, function(res) {

                com.showAlert(com.info, "创建成功");
                searcher.doSearch();
            });
        }

        com.focusPage("#caseModal").modal("hide");
    }

    // 更新状态
    function updateCaseStatus(cid, cvalue) {

        var options = {};
        options["caser.cid"] = cid;
        options["caser.status"] = cvalue;

        com.post(api.market.updateEcaseForStatus, options, function(res) {

            com.focusPage("#" + cid).prop("checked", true);
            searcher.doSearch();
        });
    }

    function initUploadBtn(cid) {

        com.uploadify("#epictureUpload", "上传图片", api.common.uploadImg, 'btn btn-success', '*.jpg;*.jpeg;*.gif;*.png', {
            'uploadType': 2
        }, 10, function(data) {

            var options = {};

            options["epicture.cid"] = cid;
            options["epicture.type"] = 0;
            options["epicture.url"] = data.resUrl;
            options["epicture.filesize"] = data.filesize;

            com.post(api.market.addEpicture, options, function(res) {

                var pic = res.epicture;
                appendGalleryElement("epicture", pic.epid, data.resUrl, 0, "", api.market.deleteEpicture, cid, api.market.updateEcase);
                com.popup4photos("#epicture");
            });
        });
    }

    function appendGalleryElement(galleryId, imgId, imgUrl, type, editUrl, deleteUrl, cid, defaultUrl) {

        var gallery = com.focusPage("#" + galleryId);

        var imgLi = $("<li></li>").attr("id", "gallery_li" + imgId).addClass("text-center").css("border-color", "#ddd").appendTo(gallery);
        var img = $('<img />');
        var imgA = $("<a></a>").css("height", "150px").append(img).appendTo(imgLi);

        com.showImg(img, imgUrl, 150, 150, '', null, type);

        var toolsDiv = $("<div></div>").addClass("tools tools-bottom").appendTo(imgLi);
        var toolsA = $("<a></a>").attr("href", "#").on("click", function() {

            var options = {};
            options["epicture.epid"] = imgId;

            com.post(deleteUrl, options, function(res) {

                com.focusPage("#gallery_li" + imgId).remove();
            });
        }).appendTo(toolsDiv);
        $("<i></i>").addClass("icon-remove red").appendTo(toolsA);

        var toolsB = $("<a></a>").attr("href", "#").on("click", function() {

            var options = {};
            options["caser.cid"] = cid;
            options["caser.defaultUrl"] = imgUrl;

            com.post(defaultUrl, options, function(res) {

                com.showAlert(com.info, "图片设置成功");
            });
        }).appendTo(toolsDiv);
        $("<i></i>").addClass("icon-ok green").appendTo(toolsB);
    }

    function cycleChange(tag, cycleValue) {

        tag.on("change", function() {

            if (decorationCase.items.type.val() == 0) {
                decorationCase.items.cycle.attr("disabled", "disabled");
                if (cycleValue != null) {
                    decorationCase.items.cycle.val(0);
                }
            } else if (decorationCase.items.type.val() == 1) {
                decorationCase.items.cycle.removeAttr("disabled");
                if (cycleValue != null) {
                    decorationCase.items.cycle.val(cycleValue);
                }
            }
        });
    }
});
