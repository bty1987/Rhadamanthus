$(function () {
    
    var village = {
        
        saveBtn: com.focusPage("#saveBtn").on("click", saveData),
        cancellBtn: com.focusPage("#cancelBtn"),
        modal: com.focusPage("#villageModal").on("show.bs.modal", function (a) {
            com.clearValidator();
            com.clearValidator("#no", !0)
        }),
        drawingModal: com.focusPage('#drawingModal').on("show.bs.modal", function (a) {
            com.clearValidator();
        }),
        mapItems: {
            no: com.focusPage("#mapForm [name='no']"),
            name: com.focusPage('#mapForm [name="name"]'),
            city: com.focusPage('#city')
        },
        items: {
            no: com.focusPage("#no").blur(function () {
                $this = $(this);
                void 0 != $this.val() && "" != $this.val().trim() && com.post(api.data.queryVillageById, {
                        "village.no": $this.val()
                    },
                    function (a) {
                        0 < a.village.no ? (com.showTips($this, "该楼盘编号已经存在", !0), village.repeatFlg = !0) : (com.clearValidator("#no", !0), village.repeatFlg = !1)
                    })
            }),
            nameRuleSel: com.focusPage("#nameRuleSel"),
            name: com.focusPage("#villagename"),
            cityProperSel: com.focusPage("#cityProperSel"),
            citySel: com.focusPage("#citySel").on("change", function (b, c) {
                bindCityProper($(this).val(), village.items.cityProperSel, !1, c)
            }),
            developer: com.focusPage("#developer"),
            salesPhone: com.focusPage("#salesPhone"),
            deliveryTime: com.focusPage("#deliveryTime"),
            content: com.focusPage("#content")
        },
        
        editFlag: !1,
        repeatFlg: !1,
        cityList: {},
        cityKey: "cid",
        cityValue: "name",
        cityProperList: {},
        cityProperKey: "cpid",
        cityProperValue: "name",
        nameRuleList: {},
        nameRuleValue: "ruleContent",
        url: null,
        vid: null,
        no: null
    };
    
    com.post(api.system.queryCity, {}, function (a) {
        village.cityList = a.citys;
        village.items.citySel.bindData(village.cityList, village.cityKey, village.cityValue, !1).trigger("change")
    });

    com.post(api.common.queryBuildingNameRule, {}, function (a) {
        village.nameRuleList = a.buildingNameRules;
    }, null, false);

    village.items.nameRuleSel.bindData(village.nameRuleList, village.nameRuleValue, village.nameRuleValue, !1).trigger("change");

    initUploadBtn();

    var displayFunc = (function () {
        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    var $liLine = creatLine(v);
                    $liLine.appendTo($ul);
                });
                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function (v) {
            var $liLine = $('<li></li>').addClass('item-orange clearfix');

            var $urldiv = $('<div style="border: 1px solid #ccc ;float :left;"></div>').css("width", "75px").css("height", "75px").css("margin-right", "10px");
            var img = $('<img />').css("margin-right", "20px").appendTo($urldiv);
            var url = com.showImg(img, v.url, 75, 75, '', null, 0);

            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + v.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-success').html('编辑');
            var $drawingedit = $('<a></a>').addClass('btn btn-minier btn-warning').html('管理图片');

            var $btnStatus = $('<div></div>').addClass('pull-right');
            var $statusSwitch = $('<input/>').addClass('ace ace-switch ace-switch-5').prop({"type": "checkbox"});
            var $span = $('<span></span>').addClass('lbl');

            var propertyArr = [
                ["楼盘编号:", v.no, "grey"],
                ["所在城市:", v.cityProper.city.name, "grey"],
                ["所在城区:", v.cityProper.name, "grey"],
                ["开发商:", v.developer ? v.developer : "-", "grey"],
                ["售楼电话:", v.salesPhone ? v.salesPhone : "-", "grey"],
                ["交房时间:", v.deliveryTime, "green"],
                ["说明:", v.content, "grey"]
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $btnStatus.append($statusSwitch).append($span);

            $divBtnWrap.append($btnPosition).append($btnEdit).append($drawingedit).append($btnStatus).appendTo($h3);

            $liLine.append($urldiv).append($h3).append($ulProperty);

            $btnEdit.click(function () {
                editVillage(v);
            });

            $btnPosition.click(function () {
                editPosition(v);
            });

            $drawingedit.click(function () {
                
                village.vid = v.vid;
                village.url = v.url;
                village.no = v.no;
                
                managedrawing(v.vid);
            });

            !v.status && $statusSwitch.prop("checked", true);
            $statusSwitch.switchBtn("status-lbl").on("click", function () {
                $statusSwitch.prop("checked") ? (updateStatus(v.no, 0, function () {
                    $statusSwitch.removeAttr("checked");
                })) : (updateStatus(v.no, 1, function () {
                    $statusSwitch.prop("checked");
                }));
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

    var _condArr = ['data-village-name', 'system-city'];

    var searcher = new Searcher();
    searcher.init(_condArr, "condList", api.data.pageVillage, function (data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "villagePostData", null, false, null, function () {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addVillage').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    // 启用禁用功能
    function updateStatus(id, status, failcallBack) {
        com.post(api.data.updateVillageForStatus, {"village.no": id, "village.status": status}, function () {
        }, function () {
            failcallBack && failcallBack();
        });
    }

    // 添加按钮
    com.focusPage('a[name="addVillage"]', '#pagenation').click(function () {
        village.editFlg = false;
        com.cleanItems(village.items);
        $("#nodiv").css({"display": "none"});
        village.items.citySel.trigger("change");
        village.modal.modal("show");
    });

    // 保存
    function saveData() {
        
        if (com.validate("villageModal") || village.repeatFlg) {
            return false;
        }
        
        var option = {
            "village.no": village.items.no.val(),
            "village.name": village.items.name.val(),
            "village.cityProper.cpid": village.items.cityProperSel.val(),
            "village.developer": village.items.developer.val(),
            "village.salesPhone": village.items.salesPhone.val(),
            "village.deliveryTime": "" == village.items.deliveryTime.val() ? void 0 : village.items.deliveryTime.val(),
            "village.content": village.items.content.val(),
            "village.rule": village.items.nameRuleSel.val()
        };
        var url;
        if (village.editFlg) {
            url = api.data.updateVillage;
        } else {
            url = api.data.addVillage
        }
        com.post(url, option, function (res) {
            village.modal.modal("hide");
            searcher.doSearch();
        });
    }

    // 编辑按钮
    function editVillage(b) {
        village.modal.modal("show");
        village.editFlg = true;
        com.focusPage("#nodiv").css({"display": "block"});
        village.items.cpid = b.cityProper.cpid;
        village.items.no.val(b.no).prop("disabled", !0).css("display", "block");
        village.items.name.val(b.name);
        village.items.citySel.val(b.cityProper.city.cid).trigger("change", function () {
            village.items.cityProperSel.val(b.cityProper.cpid)
        });
        village.items.developer.val(b.developer);
        village.items.salesPhone.val(b.salesPhone);
        village.items.deliveryTime.val(b.deliveryTime);
        village.items.content.val(b.content);
        village.items.nameRuleSel.val(b.rule)
    }

    // 显示图片
    function managedrawing(vid) {
        village.drawingModal.modal("show");
        com.focusPage('#villageDrawing').html("");
        com.post(api.communion.queryDataDrawing, {"dataDrawing.sid": vid, "dataDrawing.type": 0}, function (data) {
            var villageSourcePics = data.dataDrawings;
            if (villageSourcePics && villageSourcePics.length) {
                $.each(villageSourcePics, function (i, value) {
                    appendGalleryElement("villageDrawing", value);
                });
                com.popup4photos("#villageDrawing");
            }
        }, null, false);
    }

    // 上传图片
    function initUploadBtn() {
        
        com.uploadify("#villageUpload", "上传图片", api.common.uploadImg, 'btn btn-success', '*.jpg;*.jpeg;*.gif;*.png', {'uploadType': 0}, 10, function(data){
            var options = {};
            
            options["dataDrawing.sid"] = village.vid;
            options["dataDrawing.name"] = data.strutsUploadsFileName;
            options["dataDrawing.drawingUrl"] = data.resUrl;
            options["dataDrawing.drawingType"] = 0;
            options["dataDrawing.type"] = 0;
            options["dataDrawing.filesize"] = data.filesize;

            com.post(api.communion.addDataDrawing, options, function (res) {
                
                var drawing = res.dataDrawing;
                
                appendGalleryElement("villageDrawing", drawing);
                com.popup4photos("#villageDrawing");
                
                if (village.url == null) {
                    updateVillageUrl(village.no, drawing.drawingUrl)
                }
            });
            
            searcher.doSearch();
        });
    }

    function appendGalleryElement(galleryId, value) {
        
        var gallery = com.focusPage("#" + galleryId);
        
        var imgLi = $("<li></li>").attr("id", "gallery_li" + value.ddid).addClass("text-center col-sm-4").css("border", "0px").css("border-color", "white").css("padding", "0px").css("height", "150px").css("width", "150px").appendTo(gallery);
        var img = $('<img/>');
        var imgA = $("<a></a>").addClass('cboxElement').attr("target", "_blank").css("height", "150px").append(img).appendTo(imgLi);
        
        com.showImg(img, value.drawingUrl, 150, 150, '', null, value.type);

        var toolsDiv = $("<div></div>").addClass("tools tools-bottom").appendTo(imgLi);
        var toolsA = $("<a></a>").attr("href", "#").on("click", function () {
            com.post(api.communion.deleteDataDrawing, {"dataDrawing.ddid": value.ddid}, function (res) {
                com.focusPage("#gallery_li" + value.ddid).remove();
            });
        }).appendTo(toolsDiv);
        
        $("<i></i>").addClass("icon-remove red").appendTo(toolsA);

        var toolok = $("<a></a>").attr("href", "#").on("click", function () {
            updateVillageUrl(village.no, value.drawingUrl);
        }).appendTo(toolsDiv);
        
        $("<i></i>").addClass("icon-ok green").appendTo(toolok);
    }

    function updateVillageUrl(no, url) {
        var options = {};
        options["village.no"] = no;
        options["village.url"] = url;
        com.post(api.data.updateVillageForUrl, options, function (res) {
            village.url = url;
        }, null, false);
        searcher.doSearch();
    }

});

