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

    var displayFunc = (function() {

        var renderList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function(i, v) {

                    var $photo = $('<div></div>').css({
                        "width": "75px",
                        "height": "75px",
                        "padding": "10px",
                        "float": "left"
                    });
                    var img = $('<img />').appendTo($photo);
                    com.showImg(img, v.userPhoto, 75, 75, '', null, 0);

                    var $liLine = creatLine(v);

                    $ul.append($photo).append($liLine);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix').css({
                "padding-left": "90px"
            });
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.userName));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').html("编辑");
            var $btnDrawing = $('<a></a>').addClass('btn btn-minier btn-success').html("照片墙");

            var propertyArr = [["微信用户:", v.cuser.unionId, "grey"], ["手机号:", v.phone, "grey"], ["微信号:", v.wechat, "grey"], ["行业:", v.industry, "grey"], ["职业:", v.profession, "grey"], ["地址:", v.address, "grey"], ["个人简介:", v.info, "grey"]];

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnEdit).append($btnDrawing).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            // 编辑
            $btnEdit.click(function() {

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
            });

            // 图片
            $btnDrawing.click(function() {

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
    var conditionList = ["market-customer-name", "market-phone", "market-industry"];

    searcher.init(conditionList, "condList", api.market.pageCard, function(data) {

        displayFunc.init('resultList', data);
    }, "pagenation", "casePostData", null, false, null);

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
