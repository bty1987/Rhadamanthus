$(function (){

    var houseLayout={

        btns:{
            addHouseTypeBtn : com.focusPage("#addHouseTypeBtn"),
            saveBtn : com.focusPage("#saveDataBtn"),
            cancelBtn : com.focusPage("#cancelBtn"),
        },
        items:{
            houseTypeOne : com.focusPage("#houseTypeOne"),
            houseTypeTwo : com.focusPage("#houseTypeTwo"),
            houseTypeThr : com.focusPage("#houseTypeThr"),
            houseTypeFour : com.focusPage("#houseTypeFour"),
            comment : com.focusPage("#comment"),
        },
        modals:{
            houseTypeModal : com.focusPage("#houseTypeModal"),
            houseLayoutModal : com.focusPage("#houseLayoutModal"),
        },
        vid : params.vid,
    };
    
    initUploadBtn();

    houseLayout.btns.saveBtn.bindClick(saveData);

    houseLayout.modals.houseTypeModal.on("hide.bs.modal", function () {
        com.cleanItems(houseLayout.items);
        com.clearValidator();
        com.closeTip();
    });

    houseLayout.btns.addHouseTypeBtn.click(function(){
        com.clearValidator();
        houseLayout.modals.houseTypeModal.modal("show");
    });

    var initList = function (listData) {

        var $tableWrap = com.focusPage('#list').empty();
        var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

        if(!listData.length){
            var $resultList = com.focusPage("#list").addClass('dz-default dz-message');
            var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resultList);
            var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
            var $span = $('<span></span>').text('无可用数据提供').appendTo($mesg);
            return $resultList;
        }else if (listData && listData.length) {

            $.each(listData, function (i, v) {
                var $liLine = $('<li></li>').addClass('item-orange clearfix');

                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
                var $drawingedit = $('<a></a>').addClass('btn btn-minier btn-warning').html('管理图片');
                var $deletBtn = $('<a></a>').addClass('btn btn-minier btn-danger').html('删除');

                var propertyArr = [
                    ["名称:", v.name , "green"],
                    ["说明:",v.comment,"grey" ],
                ];

                $.each(propertyArr, function (index, value) {
                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                $divBtnWrap.append($deletBtn).append($drawingedit);
                $liLine.append($divBtnWrap).append($ulProperty).appendTo($ul);

                $drawingedit.click(function(){
                    params.hlid = v.hlid;
                    managedrawing(v.hlid);
                });

                $deletBtn.click(function(){
                    com.showConfirm("确定删除吗?", function(reslut) {
                        com.post(api.data.deleteHouseLayout, {"houseLayout.hlid": v.hlid}, function(res){
                            queryHouseLayout(houseLayout.vid);
                            com.showAlert(com.info, "操作成功");
                        });
                    });
                })

            });
            $ul.appendTo($tableWrap);
        }
    };

    queryHouseLayout(houseLayout.vid);

    function queryHouseLayout(vid) {

        com.post(api.data.queryHouseLayout, {"houseLayout.vid": vid}, function (data) {

            initList(data.houseLayouts);

        }, function (e) {
            com.showAlert(com.error, e.errorMsg);
        }, false);
    };

    function saveData(){
        if (com.validate('houseTypeModal')) {
            return false;
        };

        var options ={};
        options["houseLayout.name"] = houseLayout.items.houseTypeOne.val() + "室" + houseLayout.items.houseTypeTwo.val() + "厅" + houseLayout.items.houseTypeThr.val() + "厨" + houseLayout.items.houseTypeFour.val() + "卫";
        options["houseLayout.comment"] = houseLayout.items.comment.val();
        options["houseLayout.vid"] = params.vid;

        if(houseLayout.items.houseTypeOne.val() == 0 && houseLayout.items.houseTypeTwo.val() == 0 && houseLayout.items.houseTypeThr.val() == 0 && houseLayout.items.houseTypeFour.val() == 0){
            com.showAlert(com.warning, "户型输入错误");
            return false;
        };

        com.post(api.data.addHouseLayout ,options,function(){
            com.showAlert(com.info, "添加成功");
            queryHouseLayout(houseLayout.vid);
        });

        houseLayout.modals.houseTypeModal.modal("hide");
    };

    // 提交图片
    function managedrawing(hlid) {
        houseLayout.modals.houseLayoutModal.modal("show");
        com.focusPage('#houseLayoutDrawing').html("");
        com.post(api.communion.queryDataDrawing, {"dataDrawing.sid": hlid, "dataDrawing.type": 1}, function (data) {
            var houseLayoutSourcePics = data.dataDrawings;
            if (houseLayoutSourcePics && houseLayoutSourcePics.length) {
                $.each(houseLayoutSourcePics, function (i, value) {
                    appendGalleryElement("houseLayoutDrawing", value);
                });
                com.popup4photos("#houseLayoutDrawing");
            }
        }, null, false);
    };

    // 上传图片
    function initUploadBtn() {
        com.focusPage("#houseLayoutUpload").html("").Huploadify({
            'debug': false, // 开启调试
            'auto': true, // 是否自动上传
            'successTimeout': 150, // 超时时间
            'formData': { // 附带值
                'uploadType': 0,
                'username': '用户名',
                'rnd': '加密密文'
            },
            'multi': true, // 批量上传
            'buttonClass': 'btn btn-success',
            'buttonText': '上传图片',
            'overrideEvents': ['onDialogClose'],  // 不执行默认的onSelect事件
            'fileObjName': 'strutsUploads', // 服务器端脚本使用的文件对象的名称
                                            // $_FILES个['upload']
            'uploader': config.media + api.common.uploadImg.url, // 上传处理程序
            'height': '45', // 浏览按钮的高度
            'fileTypeDesc': '支持的格式:', // 在浏览窗口底部的文件类型下拉菜单中显示的文本
            'fileTypeExts': '*.jpg;*.jpeg;*.gif;*.png;', // 允许上传的文件后缀
            'fileSizeLimit': '5MB', // 上传文件的大小限制
            'queueSizeLimit': 10, // 上传数量
            'onUploadSuccess': function (file, data, response) { // 上传到服务器,服务器返回相应信息到data里
                var dateObj = eval("(" + data + ")");
                if (dateObj.errorCode == 0) {
                    var options = {};
                    options["dataDrawing.sid"] = params.hlid;
                    options["dataDrawing.name"] = dateObj.strutsUploadsFileName;
                    options["dataDrawing.drawingUrl"] = dateObj.resUrl;
                    options["dataDrawing.drawingType"] = 0;
                    options["dataDrawing.type"] = 1;
                    com.post(api.communion.addDataDrawing, options, function (res) {
                        var drawing = res.dataDrawing;
                        appendGalleryElement("houseLayoutDrawing", drawing);
                        com.popup4photos("#houseLayoutDrawing");
                    });
                    queryHouseLayout(houseLayout.vid);
                } else {
                    console.log(data);
                }
            }
        });
    }
    //显示图片
    function appendGalleryElement(galleryId, value) {

        var gallery = com.focusPage("#" + galleryId);
        var imgLi = $("<li></li>").attr("id", "gallery_li" + value.ddid).addClass("text-center col-sm-4").css("border", "0px").css("border-color", "white").css("padding", "0px").css("height", "150px").css("width", "150px").appendTo(gallery);
        var img = $('<img/>');
        var imgA = $("<a></a>").addClass('cboxElement').attr("target", "_blank").css("height", "150px").append(img).appendTo(imgLi);

        com.showImg(img, value.drawingUrl, 150, 150, value.name, null, value.drawingType);

        var toolsDiv = $("<div></div>").addClass("tools tools-bottom").appendTo(imgLi);
        var toolsA = $("<a></a>").attr("href", "#").on("click", function () {
            com.post(api.communion.deleteDataDrawing, {"dataDrawing.ddid": value.ddid}, function (res) {
                com.focusPage("#gallery_li" + value.ddid).remove();
            });
        }).appendTo(toolsDiv);
        $("<i></i>").addClass("icon-remove red").appendTo(toolsA);

    }

});

