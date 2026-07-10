jQuery(function($) {

    var construction = {

        constructionNodes: {},

        modals: {
        },

        btns: {
        },

        items: {
        },

        drawingModal: com.focusPage('#drawingModal').on("show.bs.modal", function(a) {

            com.clearValidator();
        }),
    };

    com.post(api.data.queryConstructionNode, {}, function(res) {
        $.each(res.constructionNodes, function(i, v) {
            construction.constructionNodes[v.cnid] = v.name;
        });
        construction.constructionNodes[0] = "初始";
        construction.constructionNodes[1] = "开工";
        construction.constructionNodes[2] = "完工";
    }, null, false);

    // 获取页面控制参数(按公司差异化配置)
    var pageConfig = constructionPage.getConfig("constructionDiary");

    // pageBtn 配置为空时, 所有按钮按原逻辑显示; 否则需在 pageBtn 中存在
    function btnVisible(key) {

        return pageConfig.pageBtn.length == 0 || pageConfig.pageBtn.contains(key);
    }

    var searcher = new Searcher();

    searcher.base("diaryCondList", "diaryPagenation", "diaryResultList", pageConfig.apiPage || api.construction.pageConstructionDiary);

    searcher.condition(pageConfig.condArr.length > 0 ? pageConfig.condArr : ["decoration-orderId", "construction-diary-isUpload"]);

    // 字段定义映射: key 对应配置 propertyArr 中的 value
    var propertyMap = {
        "decoration": {
            field: "decoration",
            name: "装修单",
            prop: "decoration.orderId",
            clazz: "blue",
            click: function(btn, v) {

                tools.decoration.info(btn, v.decoration.orderId);
            }
        },
        "atttype": {
            field: "atttype",
            name: "类型",
            prop: "atttype",
            dataset: constant.construction().constructionDiary.atttype.keys,
            clazz: "red"
        },
        "cnid": {
            field: "cnid",
            name: "工程状态",
            prop: "cnid",
            dataset: construction.constructionNodes,
            clazz: "red"
        },
        "isUpload": {
            field: "isUpload",
            name: "是否上传图片",
            prop: "isUpload",
            dataset: constant.construction().constructionDiary.isUpload.keys,
            clazz: "red"
        },
        "creater": {
            field: "creater",
            name: "创建人",
            prop: "creater.userName",
            clazz: "grey"
        },
        "content": {
            field: "content",
            name: "内容",
            prop: "content",
            clazz: "grey"
        },
        "createTime": {
            field: "createTime",
            name: "创建时间",
            prop: "createTime",
            clazz: "green"
        }
    };

    // 根据配置 propertyArr 组装列定义, 配置为空则使用全部默认列
    var lineprops = (function () {

        if (pageConfig.propertyArr.length == 0) {

            var all = [];
            $.each(propertyMap, function (key, prop) { all.push(prop); });
            return all;
        }

        var props = [];
        $.each(pageConfig.propertyArr, function (i, key) {

            if (propertyMap[key]) props.push(propertyMap[key]);
        });
        return props;
    })();

    var linebtns = [{
        name: "图片",
        clazz: "btn-yellow",
        handle: function(v) {
            managedrawing(v.cdid);
            initUploadBtn(v);
        },
        show: function() {
            return btnVisible("picture");
        }
    }];
    com.uploadify("#path", "图片", api.common.uploadOther, 'btn btn-success blue ', '*.jpg;*.jpeg;*.gif;*.png', {
        'uploadType': 0
    }, 1, function(data) {

        construction.resUrl = data.resUrl;
        com.focusPage("#path").val(data.resUrl);
        com.focusPage("#infoPicture").attr("href", com.showImg(com.focusPage("#showImg"), data.resUrl, 150, 150, ''));

        searcher.doSearch();
    });

    searcher.line("decoration.orderId", lineprops, linebtns).render();

    function managedrawing(cdid) {

        com.focusPage('#constructionDrawing').html("");
        com.post(api.construction.queryConstructionDiaryDrawingByCdid, {
            "constructionDiaryDrawing.cdid": cdid
        }, function(data) {

            var constructionDiaryDrawings = data.constructionDiaryDrawings;
            if (constructionDiaryDrawings && constructionDiaryDrawings.length) {
                $.each(constructionDiaryDrawings, function(i, value) {

                    appendGalleryElement("constructionDrawing", value, value.type);
                });
                com.popup4photos(com.focusPage("#constructionDrawing"));
            }
        }, null, false);

        construction.drawingModal.modal("show");
    }

    function initUploadBtn(v) {

        com.uploadify("#constructionUpload", "上传图片", api.common.uploadImg, 'btn btn-success', '*.jpg;*.jpeg;*.gif;*.png', {
            'uploadType': 0
        }, 5, function(data) {

            var options = {};
            options["constructionDiaryDrawing.cid"] = v.cid;
            options["constructionDiaryDrawing.csid"] = v.csid;
            options["constructionDiaryDrawing.cdid"] = v.cdid;
            options["constructionDiaryDrawing.cnid"] = v.cnid;
            options["constructionDiaryDrawing.drawingName"] = data.strutsUploadsFileName;
            options["constructionDiaryDrawing.drawingUrl"] = data.resUrl;
            options["constructionDiaryDrawing.drawingAddUrl"] = data.resUrl;
            options["constructionDiaryDrawing.filesize"] = data.filesize;
            options["constructionDiaryDrawing.cuid"] = v.cuid;
            options["constructionDiaryDrawing.type"] = 0;
            options["constructionDiaryDrawing.schedule"] = v.schedule;

            com.post(api.construction.addConstructionDiaryDrawing, options, function(res) {

                var constructionDiaryDrawing = res.constructionDiaryDrawing;

                appendGalleryElement("constructionDrawing", constructionDiaryDrawing, 0);
                com.popup4photos("#constructionDrawing");
            });

            searcher.doSearch();
        });
    }

    function appendGalleryElement(galleryId, value, type) {

        var gallery = com.focusPage("#" + galleryId);
        var imgLi = $("<li></li>").attr("id", "gallery_li" + value.cddid).addClass("text-center col-sm-4").css("border", "0px").css("border-color", "white").css("padding", "0px").css("height", "150px").css("width", "150px").appendTo(gallery);
        var img = $('<img/>');
        var $imgA = $('<a></a>').attr('data-rel', 'colorbox').addClass('cboxElement').attr('href', com.showImg(img, value.drawingUrl, 200, 200, '200x200')).attr('target', '_blank').append(img).appendTo(imgLi);
        var imgA = $("<a></a>").addClass('cboxElement').attr("target", "_blank").css("height", "150px").append(img).appendTo(imgLi);
        com.showImg(img, value.drawingUrl, 150, 150, '150x150', null, type);
        var toolsDiv = $("<div></div>").addClass("tools tools-bottom").appendTo(imgLi);
        var toolsA = $("<a></a>").attr("href", "#").on("click", function() {

            com.post(api.construction.deleteConstructionDiaryDrawing, {
                "constructionDiaryDrawing.cddid": value.cddid,
            }, function(res) {

                com.focusPage("#gallery_li" + value.cddid).remove();
            });
        }).appendTo(toolsDiv);
        $("<i></i>").addClass("icon-remove red").appendTo(toolsA);

    }
});
