jQuery(function($) {

    var businessCard = {
        saveBtn: null,
        modal: null,
        items: []
    };

    businessCard.saveBtn = com.focusPage("#updateBtn").on("click", updateCardData);

    businessCard.modal = com.focusPage("#cardModal");
    businessCard.modal.on('show.bs.modal', function(e) {

        com.clearValidator();
    });
    businessCard.modal.on('hidden.bs.modal', function() {

        businessCard.imgUrl = null;
    });

    businessCard.items.userName = com.focusPage("#userName");
    businessCard.items.phone = com.focusPage("#phone");
    businessCard.items.wechat = com.focusPage("#wechat");
    businessCard.items.industry = com.focusPage("#industry");
    businessCard.items.profession = com.focusPage("#profession");
    businessCard.items.address = com.focusPage("#address");
    businessCard.items.info = com.focusPage("#info");
    businessCard.items.userPhoto = com.focusPage("#userPhoto");
    businessCard.items.path = com.focusPage("#path");

    initUploadBtn();

    var lineprops = (function() {

        return [{
            type: "img",
            prop: "userPhoto"
        }, {
            field: "cuser.unionId",
            name: "微信用户",
            prop: "cuser.unionId",
            clazz: "grey"
        }, {
            field: "phone",
            name: "手机号",
            prop: "phone",
            clazz: "grey"
        }, {
            field: "wechat",
            name: "微信号",
            prop: "wechat",
            clazz: "grey"
        }, {
            field: "industry",
            name: "行业",
            prop: "industry",
            clazz: "grey"
        }, {
            field: "profession",
            name: "职业",
            prop: "profession",
            clazz: "grey"
        }, {
            field: "address",
            name: "地址",
            prop: "address",
            clazz: "grey"
        }, {
            field: "info",
            name: "个人简介",
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
                    businessCard.items.userName.val(v.userName);
                    businessCard.items.phone.val(v.phone);
                    businessCard.items.wechat.val(v.wechat);
                    businessCard.items.industry.val(v.industry);
                    businessCard.items.profession.val(v.profession);
                    businessCard.items.address.val(v.address);
                    businessCard.items.info.val(v.info);
                    businessCard.items.caid = v.caid;
                    businessCard.items.userPhoto.html("");
                    if (v.userPhoto != "") {
                        appendGalleryElement("userPhoto", v.userPhoto, 0);
                        com.popup4photos("#userPhoto");
                    }
                    businessCard.modal.modal("show");
                }
            },
            drawing: {
                name: "照片墙",
                clazz: "btn-success",
                handle: function(v) {
                    com.focusPage("#cardPhoto").html("");
                    com.post(api.market.queryCardPhotoByCaid, {
                        "cardPhoto.caid": v.caid
                    }, function(data) {

                        var cardPhotos = data.cardPhotos;
                        if (cardPhotos && cardPhotos.length) {
                            $.each(cardPhotos, function(i, d) {

                                appendGalleryElement("cardPhoto", d.url, 0);
                            });
                            com.popup4photos("#cardPhoto");
                        }
                    }, null, false);

                    com.focusPage("#cardPhotoModal").modal("show");
                }
            }
        };
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.market.pageCard, null, ["market-customer-name", "market-phone", "market-industry"], "casePostData", null, false, null);
    searcher.line("userName", lineprops, linebtns).render();

    function updateCardData() {

        if (com.validate("cardModal")) {
            return false;
        }

        var options = {
            'card.caid': businessCard.items.caid,
            'card.userName': businessCard.items.userName.val(),
            'card.phone': businessCard.items.phone.val(),
            'card.wechat': businessCard.items.wechat.val(),
            'card.industry': businessCard.items.industry.val(),
            'card.profession': businessCard.items.profession.val(),
            'card.address': businessCard.items.address.val(),
            'card.info': businessCard.items.info.val()
        };

        if (businessCard.userPhoto != null) {
            options["card.userPhoto"] = businessCard.userPhoto;
        }

        com.post(api.market.updateCard, options, function(res) {

            com.showAlert(com.info, "修改成功");
            searcher.doSearch();
        });

        businessCard.modal.modal("hide");
    }

    function initUploadBtn() {

        com.uploadify("#upload", "上传头像", api.common.uploadImg, 'btn btn-success', '*.jpg;*.jpeg;*.gif;*.png', {
            'uploadType': 0
        }, 1, function(data) {

            com.focusPage("#userPhoto").html("");

            businessCard.userPhoto = data.resUrl;
            businessCard.items.path.val(data.resUrl);
            businessCard.items.filesize.val(data.filesize);

            appendGalleryElement("userPhoto", data.resUrl, 0);

            com.popup4photos("#userPhoto");
        });
    }

    function appendGalleryElement(galleryId, imgUrl, type) {

        var gallery = com.focusPage("#" + galleryId);
        var img = $('<img />');
        var imgA = $("<a></a>").css({
            "height": "150px",
            "float": "left",
            "margin-right": "10px",
            "margin-top": "10px"
        }).append(img).appendTo(gallery);

        com.showImg(img, imgUrl, 150, 150, '', null, type);

        var toolsDiv = $("<div></div>").addClass("tools tools-bottom").appendTo(gallery);
    }
});
