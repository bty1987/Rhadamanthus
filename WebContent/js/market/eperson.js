jQuery(function($) {

    var eperson = {
        saveBtn: null,
        modal: null,
        items: [],
        euid: null,
        editFlag: false,
        type: ["设计师", "监理"],
        imgUrl: null,
        validator: null,
        ecityItem: []
    };

    eperson.saveBtn = com.focusPage("#saveBtn").on("click", saveData);

    $.extend(com.validator, eperson.validator);

    eperson.items.city = com.focusPage("#city");
    eperson.items.name = com.focusPage("#name");
    eperson.items.phone = com.focusPage("#phone");
    eperson.items.experience = com.focusPage("#experience");
    eperson.items.type = com.focusPage("#type");
    eperson.items.imgUrl = com.focusPage("#imgUrl");
    eperson.items.info = com.focusPage("#info");
    eperson.items.path = com.focusPage("#path");

    eperson.modal = com.focusPage("#epersonModal");
    eperson.modal.on('show.bs.modal', function(e) {

        com.clearValidator();
    });
    eperson.modal.on('hidden.bs.modal', function() {

        eperson.imgUrl = null;
        eperson.editFlag = false;
    });

    com.post(api.market.queryEcity, {}, function(res) {

        var ecitys = res.ecitys;
        $.each(ecitys, function(i, v) {

            eperson.ecityItem[v.ecid] = v.city;
        })
    }, null, false);

    com.initTypeahead('city', api.market.queryEcityByPinYin, "ecity.pinyin", {}, "autoFillKeyValue", "key", "value");

    initUploadBtn();

    var lineprops = (function() {

        return [{
            type: "img",
            prop: "imgUrl"
        }, {
            field: "cityId",
            name: "城市",
            prop: function(v) { return eperson.ecityItem[v.cityId]; },
            clazz: "grey"
        }, {
            field: "name",
            name: "姓名",
            prop: "name",
            clazz: "grey"
        }, {
            field: "phone",
            name: "电话",
            prop: "phone",
            clazz: "grey"
        }, {
            field: "experience",
            name: "经验",
            prop: function(v) { return v.experience + "年"; },
            clazz: "blue"
        }, {
            field: "type",
            name: "职位",
            prop: function(v) { return eperson.type[v.type]; },
            clazz: "red"
        }, {
            field: "info",
            name: "简介",
            prop: "info",
            clazz: "grey"
        }];
    })();

    var linebtns = (function() {

        return {
            edit: {
                name: "编辑",
                clazz: "btn-yellow",
                handle: function(v) {
                    eperson.items.imgUrl.html("");

                    com.updateTypeahead('city', v.cityId, eperson.ecityItem[v.cityId]);

                    eperson.items.name.val(v.name);
                    eperson.items.phone.val(v.phone);
                    eperson.items.experience.val(v.experience);
                    eperson.items.type.val(v.type);
                    eperson.items.info.val(v.info);
                    eperson.items.path.val(v.imgUrl);

                    eperson.euid = v.euid;
                    eperson.editFlag = true;

                    if (v.imgUrl != "") {
                        appendGalleryElement("imgUrl", v.imgUrl, 0);
                        com.popup4photos("#imgUrl");
                    }

                    com.focusPage("#epersonModal").modal("show");
                }
            }
        };
    })();

    var buttons = (function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addeperson').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.market.pageEperson, null, ["market-city", "market-person-name"], "epersonPostData", null, false, buttons);
    searcher.line("name", lineprops, linebtns).render();

    // 添加
    com.focusPage('a[name="addeperson"]', '#pagenation').click(function() {

        com.cleanItems(eperson.items);
        com.clearValidator("epersonModal");

        eperson.items.imgUrl.html("");
        com.cleanTypeahead('city');

        com.focusPage("#epersonModal").modal("show");
    });

    function saveData() {

        if (com.validate("epersonModal")) {
            return false;
        }

        if (eperson.items.path.val() == "") {
            com.focusPage("#imgUrl").html("");
            var $text = $('<span></span>').html('请上传头像').css("color", "red").appendTo(com.focusPage("#imgUrl"));
            return false;
        }

        var options = {
            "eperson.cityId": com.typeahead("city"),
            "eperson.name": eperson.items.name.val(),
            "eperson.phone": eperson.items.phone.val(),
            "eperson.experience": eperson.items.experience.val(),
            "eperson.type": eperson.items.type.val(),
            "eperson.info": eperson.items.info.val()
        };

        if (eperson.editFlag) {
            eperson.editFlag = false;
            options["eperson.euid"] = eperson.euid;
            if (eperson.imgUrl != null) {
                options["eperson.imgUrl"] = eperson.imgUrl;
            }
            com.post(api.market.updateEperson, options, function(res) {

                com.showAlert(com.info, "信息修改成功");
                searcher.doSearch();
            });
        } else {
            options["eperson.imgUrl"] = eperson.imgUrl;
            com.post(api.market.addEperson, options, function(res) {

                com.showAlert(com.info, "创建成功");
                searcher.doSearch();
            });
        }

        com.focusPage("#epersonModal").modal("hide");
    }
    function initUploadBtn() {

        com.uploadify("#epersonUpload", "上传头像", api.common.uploadImg, 'btn btn-success', '*.jpg;*.jpeg;*.gif;*.png', {
            'uploadType': 0
        }, 1, function(data) {

            com.focusPage("#imgUrl").html("");

            eperson.imgUrl = data.resUrl;
            eperson.items.path.val(data.resUrl);
            eperson.items.filesize.val(data.filesize);

            appendGalleryElement("imgUrl", data.resUrl, 0);

            com.popup4photos("#imgUrl");
        });
    }

    function appendGalleryElement(galleryId, imgUrl, type) {

        var gallery = com.focusPage("#" + galleryId);

        var img = $('<img />');
        var imgA = $("<a></a>").css("height", "150px").append(img).appendTo(gallery);

        com.showImg(img, imgUrl, 150, 150, '', null, type);

        var toolsDiv = $("<div></div>").addClass("tools tools-bottom").appendTo(gallery);
    }
});
