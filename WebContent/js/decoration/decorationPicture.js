jQuery(function($) {

    var vrecord = {
        iid: {}
    }

    var $input = $('<input type="file" multiple accept="image/*" style="display:none">').appendTo($('body'));

    var uploadedImages = [];
    var displayFunc = (function() {

        var renderList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (!listData || listData.length == 0)
                return false;

            $.each(listData, function(i, v) {

                creatLine(v).appendTo($ul);
            });

            $ul.appendTo($tableWrap);
        };

        var creatLine = function(v) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.name));
            var $ulPicture = $('<div></div>').attr('style', 'min-height: 150px;');
            var $ul = $('<ul></ul>').addClass('ace-thumbnails').attr('id', 'imageDataUL' + v.iid).appendTo($ulPicture);
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons').appendTo($h3);

            var $uploadBtn = $('<a></a>').addClass('uploadify-button btn btn-minier btn-primary').html('上传合同方案').appendTo($divBtnWrap);

            var propertyArr = [["名称:", v.name, "grey"]];

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>').attr('id', 'imageData' + v.iid);
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $liLine.append($h3).append($ulProperty).append($ulPicture);
            $uploadBtn.click(function() {

                vrecord.iid = v.iid;
                $input.click();
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
        };
    })();

    var searcher = new Searcher();

    searcher.init([], "condListas", api.data.queryInspect, function(data) {

        displayFunc.init('resultListas', data);
    }, "pagenationas", "vrecordPostData", {
        "inspect.status": 0

    }, true, "inspects", null);

    var url = 'uploadImg.do';

    com.focusPage("#add").click(function() {

        if (uploadedImages.length === 0) {
            alert('请先上传图片');
            return false;
        }

        for ( var i = 0; i < uploadedImages.length; i++) {

            var timestamp = jQuery.now();
            var params = 'strutsUploads';

            var uploaded = uploadedImages[i].data;
            var name = uploadedImages[i].name;

            upload(uploaded, api.common.uploadImg, name, params, null, function(data) {

                decorationUtils.addDecorationPicture(data, 1, "designPictures");
            });
        }

    });

    function upload(content, uapi, name, fileargs, args, success, fail, complete) {

        var url = config.media + (uapi ? uapi.url : exts.indexOf('jpg') == -1 ? api.common.uploadOther.url : api.common.uploadImg.url);

        var arr = content.split(','), mime = arr[0].match(/:(.*?);/)[1], bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        var file = new File([u8arr], name, {
            type: mime
        });

        var formData = new FormData();
        formData.append(fileargs, file);

        $.ajax({
            url: url,
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
        }).success(function(result) {

            if (success && typeof success == 'function')
                success(result);
            com.showAlert(com.info, "上传成功");
        }).error(function(error) {

            if (fail && typeof fail == 'function')
                fail(error);
            com.showAlert(com.info, "上传失败");
        }).complete(function(info) {

            if (complete && typeof complete == 'function')
                complete(info);
        });
    }

    function appendGalleryElement(galleryId, imgId, imgUrl, deleteUrl, uniqueId, fileName) {

        var gallery = com.focusPage("#" + galleryId);
        var imgLi = $("<li></li>").attr("id", "gallery_li" + uniqueId).addClass("ace-thumbnails").appendTo(gallery);
        var img = $('<img />').css({
            "max-width": "100%",
            "height": "auto",
        });
        var imgA = $("<a></a>").css("height", "150px").append(img).appendTo(imgLi);

        img.attr("src", imgUrl);

        var toolsDiv = $("<div></div>").addClass("tools tools-bottom").appendTo(imgLi);
        var toolsA = $("<a></a>").attr("href", "#").addClass("cboxElement").on("click", function() {

            (uploadedImages.indexOf(imgUrl) != -1 & uploadedImages.splice(ll.indexOf(imgUrl)))

            com.focusPage("#gallery_li" + uniqueId).remove();

        }).appendTo(toolsDiv);

        $("<i></i>").addClass("icon-remove red").appendTo(toolsA);
    }

    $input.on('change', function(event) {

        var files = event.target.files;

        for ( var i = 0; i < files.length; i++) {

            var file = files[i];
            var uniqueId = 'img-' + Date.now() + '-' + Math.floor(Math.random() * 1000); // 生成唯一ID‌:ml-citation{ref="6,8" data="citationList"}
            var reader = new FileReader();

            reader.onload = function(e) {

                var imageData = e.target.result;
                uploadedImages.push({
                    data: imageData,
                    name: file.name
                });
                displayImageIcon(imageData, uniqueId, file.name);
            };

            reader.onerror = function() {

                alert('文件读取失败, 请重试');
            };

            reader.readAsDataURL(file);
        }

        $input.val('');
    });

    function displayImageIcon(imageData, uniqueId, fileName) {
        appendGalleryElement('imageDataUL' + vrecord.iid, 'imageDataUL' + vrecord.iid, imageData, 1, uniqueId, fileName);
    }

});
