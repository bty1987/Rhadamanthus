jQuery(function($) {

    var eopinions = {

        eoid: null,

        btns : {
            saveBtn : com.focusPage("#saveBtn")
        },

        modals : {
            createModal : com.focusPage("#createModal")
        },

        items : {
            title : com.focusPage("#title"),
            type : com.focusPage("#type"),
            content : com.focusPage("#content")
        },

        type: ["朋友圈", "锦旗", "其他"],

    };

    eopinions.btns.saveBtn.bindClick(saveData);

    var seacher = new Searcher();

    seacher.base("condList", "pagenation", "resultList",api.market.pageEopinions);

    seacher.button([{
        id : "createEopinions",
        name : "创建",
        clazz : "btn-yellow",
        icon : "icon-plus"
    }]);

    seacher.history("eopinionsData");

    var lineprops = [{
        fieId : "type",
        name : "类型",
        prop : "type",
        clazz : "red",
        dataset : eopinions.type
    }, {
        fieId : "content",
        name : "说明",
        prop : "content",
        clazz : "grey"
    }];

    var linebtus = [{
        name: "图片",
        clazz: "btn-yellow",
        handle: function(v) {

            managedrawing(v.eoid);
        }
    }];

    seacher.line("title", lineprops, linebtus).render();

    com.focusPage('#createEopinions').on("click", function() {

        eopinions.modals.createModal.modal("show");
    });

    function managedrawing(cid) {

        com.focusPage("#epicture").html("");
        com.post(api.market.queryEpictureByCid, {
            "epicture.cid": cid,
            "epicture.type": 1
        }, function(data) {

            var pictures = data.epictures;
            if (pictures && pictures.length) {
                $.each(pictures, function(i, d) {

                    appendGalleryElement("epicture", d.epid, d.url, 0, "", api.market.deleteEpicture, cid, api.market.updateEcase);
                });
                com.popup4photos("#epicture");
            }
        }, null, false);

        initUploadBtn(cid);
        com.focusPage("#epicturePage").modal("show");
    }

    function initUploadBtn(cid) {

        com.uploadify("#epictureUpload", "上传图片", api.common.uploadImg, 'btn btn-success', '*.jpg;*.jpeg;*.gif;*.png', {
            'uploadType': 2
        }, 10, function(data) {

            var options = {};

            options["epicture.cid"] = cid;
            options["epicture.type"] = 1;
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

    function saveData() {

        if (com.validate("createModal")) {
            return false;
        }

        var options = {
            'eopinion.title': eopinions.items.title.val(),
            'eopinion.type': eopinions.items.type.val(),
            'eopinion.content': eopinions.items.content.val()
        };

        com.post(api.market.addEopinion, options, function(res) {

            com.showAlert(com.info, "创建成功");
            seacher.doSearch();
        });

        com.focusPage("#createModal").modal("hide");
    }

});
