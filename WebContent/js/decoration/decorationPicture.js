jQuery(function($) {

    var vrecord = {
        iid: {}
    }

    var $input = $('<input type="file" multiple accept="image/*" style="display:none">').appendTo($('body'));

    var uploadedImages = [];
    var currentOrderId = null; // 当前订单ID
    var pictureList = []; // 图片列表

    function buildPictureLineprops() {

        return [{
            field: "name",
            name: "名称",
            prop: "name",
            clazz: "grey"
        }];
    }

    function buildPictureLinebtns() {

        return {
            upload: {
                name: "上传合同方案",
                clazz: "uploadify-button btn-primary",
                handle: function(v) {
                    vrecord.iid = v.iid;
                    $input.click();
                }
            }
        };
    }

    var searcher = new Searcher();

    searcher.set("condListas", "pagenationas", "resultListas", api.data.queryInspect, {
        "inspect.status": 0
    }, [], "vrecordPostData", "inspects", true);
    searcher.line(function(v) {
        return v.name;
    }, buildPictureLineprops(), buildPictureLinebtns()).render();

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

        // 添加复选框用于批量选择
        var $checkbox = $('<input type="checkbox">')
            .addClass('picture-checkbox')
            .attr('data-uniqueid', uniqueId)
            .css({
                'position': 'absolute',
                'top': '5px',
                'left': '5px',
                'z-index': '10',
                'width': '18px',
                'height': '18px'
            })
            .appendTo(imgLi);

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

    // ==================== 批量操作功能 ====================

    /**
     * 批量更新图片状态
     * @param {Number} status - 目标状态 (1=显示, 4=确认展示, 0=隐藏)
     */
    function batchUpdatePictureStatus(status) {
        var selectedDpids = [];
        var orderId = null;

        // 获取所有选中的图片
        com.focusPage('.picture-checkbox:checked').each(function() {
            var $this = $(this);
            var dpId = $this.data('dpid');
            if (dpId) {
                selectedDpids.push(dpId);
            }
            if (!orderId) {
                orderId = $this.data('orderid');
            }
        });

        if (selectedDpids.length === 0) {
            com.showAlert(com.warning, '请先选择图片');
            return;
        }

        if (!orderId) {
            com.showAlert(com.warning, '无法获取订单信息');
            return;
        }

        com.showLoading('正在处理...');

        // 构建请求数据 - 按照后端 Action 接收的格式
        var requestData = {};
        for (var i = 0; i < selectedDpids.length; i++) {
            requestData['decorationPictures[' + i + '].dpId'] = selectedDpids[i];
            requestData['decorationPictures[' + i + '].orderId'] = orderId;
            requestData['decorationPictures[' + i + '].status'] = status;
        }

        com.post(api.decoration.batchDecorationPicture, requestData, function(res) {
            com.hideLoading();
            if (res.errorCode == 0) {
                com.showAlert(com.info, '操作成功，已更新 ' + selectedDpids.length + ' 张图片状态');
                // 刷新列表
                searcher.refresh();
            } else {
                com.showAlert(com.error, res.errorMsg || '操作失败');
            }
        }, function(err) {
            com.hideLoading();
            com.showAlert(com.error, '操作失败');
        });
    }

    /**
     * 批量显示
     */
    com.focusPage('#batchShow').on('click', function() {
        batchUpdatePictureStatus(1);
    });

    /**
     * 批量确认展示
     */
    com.focusPage('#batchConfirm').on('click', function() {
        batchUpdatePictureStatus(4);
    });

    /**
     * 批量隐藏
     */
    com.focusPage('#batchHide').on('click', function() {
        batchUpdatePictureStatus(0);
    });

});
