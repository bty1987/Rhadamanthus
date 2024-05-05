$(function() {

    var assistanceItem = {

        aid: params.aid,
        aiid: null,
        assistanceItem: null,

        items: {
            title: com.focusPage("#title"),
            content: com.focusPage('#content')
        },
        btns: {
            addAssistanceItem: com.focusPage('#addAssistanceItem'),
            confirmBtn: com.focusPage('#confirmBtn'),
        },
        drawingModal: com.focusPage('#drawingModal').on("show.bs.modal", function(a) {

            com.clearValidator();
        }),
    };
    com.focusPage('#fl-statement').statement("帮助", "项目");
    var assistanceItems = [];

    com.post(api.data.queryAssistanceItem, {
        "assistance.aid": assistanceItem.aid
    }, function(res) {

        assistanceItems = res.assistanceItems

        if (res.assistanceItems.length == 0) {
            emptyData("list");
        } else {
            initList(res.assistanceItems);
        }
    });

    function initList(listData) {

        var $tableWrap = com.focusPage('#list');
        var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

        if (!listData || listData.length == 0)
            return false;

        $.each(listData, function(i, v) {

            var $title = v.title;
            var $content = v.content;

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $h3 = $('<h3></h3>').addClass('oid');
            var $small = $('<small></small>').addClass('blue').html(v.title).appendTo($h3);
            var $btnDiv = $('<div></div>').addClass('action-buttons pull-right').appendTo($h3);

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');
            var $btnPhoto = $('<a></a>').addClass('btn btn-minier btn-success').html('图片');

            var propertyArr = [["标题:", v.title, "grey", "title"], ["内容:", v.content, "grey", "content"]];

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>').css({
                    "border-bottom": "0px"
                });
                $('<strong></strong>').attr('name', value[3]).html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $liLine.append($h3).append($ulProperty).appendTo($ul);
            $btnDiv.append($btnEdit).append($btnPhoto);

            $btnEdit.click(function() {

                com.clearValidator();
                com.cleanItems(assistanceItem.items);

                assistanceItem.assistanceItem = v;
                assistanceItem.aiid = v.aiid;

                assistanceItem.items.title.val(v.title);
                assistanceItem.items.content.val(v.content);

                com.popup4mini("#miniPopUp", "#layerEdit", "编辑");
            });

            $btnPhoto.click(function() {

                managedrawing(v);
                initUploadBtn(v);
            });
        });

        $ul.appendTo($tableWrap);
    }

    function emptyData(id) {

        var $resultList = com.focusPage('#' + id).html('');
        var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resultList);
        var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
        var $span = $('<span></span>').text('无可用数据提供').appendTo($mesg);
    }

    assistanceItem.btns.confirmBtn.click(function() {

        if (com.validate('miniPopUp', 'right')) {
            return false;
        }

        var url = api.data.addAssistanceItem;
        var options = {
            "assistanceItem.content": com.focusPage("#content").val(),
            "assistanceItem.title": com.focusPage("#title").val(),
            "assistance.aid": assistanceItem.aid
        };

        if (assistanceItem.aiid) {
            url = api.data.updateAssistanceItem;
            options["assistanceItem.aiid"] = assistanceItem.aiid;
        }

        com.post(url, options, function() {

            com.focusPage('#list ul.item-list').remove();

            com.clearValidator();
            com.closePopup(com.focusPage("#confirmBtn"));

            com.post(api.data.queryAssistanceItem, {
                "assistance.aid": assistanceItem.aid
            }, function(data) {

                initList(data.assistanceItems);
            });
        });
    });

    assistanceItem.btns.addAssistanceItem.click(function() {

        com.clearValidator();
        com.cleanItems(assistanceItem.items);

        assistanceItem.aiid = null;

        com.popup4mini("#miniPopUp", "#layerEdit", "创建");
    });

    function managedrawing(v) {

        com.focusPage('#assistanceDrawing').html("");

        com.post(api.communion.queryDataDrawing, {
            "dataDrawing.sid": v.aiid,
            "dataDrawing.type": 5

        }, function(data) {

            var dataPictures = data.dataDrawings;

            if (!dataPictures || dataPictures.length == 0)
                return false;

            $.each(dataPictures, function(i, value) {

                if (value.status != 0)
                    return true;

                appendGalleryElement("assistanceDrawing", value);
            });

            com.popup4photos(com.focusPage("#assistanceDrawing"));
        });

        assistanceItem.drawingModal.modal("show");
    }

    function appendGalleryElement(galleryId, value) {

        var gallery = com.focusPage("#" + galleryId);
        var imgLi = $("<li></li>").attr("id", "gallery_li" + value.ddid).addClass("text-center col-sm-4").css("border", "0px").css("border-color", "white").css("padding", "0px").css("height", "150px").css("width", "150px").appendTo(gallery);
        var img = $('<img/>');
        var $imgA = $('<a></a>').attr('data-rel', 'colorbox').addClass('cboxElement').attr('href', com.showImg(img, value.drawingUrl, 200, 200, '200x200')).attr('target', '_blank').append(img).appendTo(imgLi);
        var imgA = $("<a></a>").addClass('cboxElement').attr("target", "_blank").css("height", "150px").append(img).appendTo(imgLi);

        com.showImg(img, value.drawingUrl, 150, 150, value.name, null, value.type);

        var toolsDiv = $("<div></div>").addClass("tools tools-bottom").appendTo(imgLi);
        var toolsA = $("<a></a>").attr("href", "#").on("click", function() {

            com.post(api.communion.deleteDataDrawing, {
                "dataDrawing.ddid": value.ddid
            }, function(res) {

                com.focusPage("#gallery_li" + value.ddid).remove();
            });
        }).appendTo(toolsDiv);

        $("<i></i>").addClass("icon-remove red").appendTo(toolsA);
    }

    function initUploadBtn(v) {

        com.uploadify("#assistanceUpload", "上传图片", api.common.uploadImg, 'btn btn-success', '*.jpg;*.jpeg;*.gif;*.png', {
            'uploadType': 0
        }, 5, function(data) {

            var options = {};

            options["dataDrawing.sid"] = v.aiid;
            options["dataDrawing.name"] = data.strutsUploadsFileName;
            options["dataDrawing.drawingUrl"] = data.resUrl;
            options["dataDrawing.drawingType"] = 0;
            options["dataDrawing.type"] = 5;

            com.post(api.communion.addDataDrawing, options, function(res) {

                var salesPicture = res.dataDrawing;

                appendGalleryElement("assistanceDrawing", salesPicture);

                com.popup4photos("#assistanceDrawing");
            });

        });
    }
});