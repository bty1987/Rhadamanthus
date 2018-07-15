$(function () {
    var slide = {
        slideItems: {},
        editFlg: false,
        repeatFlg: false,
        slideData: [],
    };

    slide.slideItems.gid = $("#name");
    slide.slideItems.url = $("#url");
    slide.slideItems.path = $("#path");

    var colorboxArgs = {
        reposition:true,
        scalePhotos:true,
        scrolling:false,
        previous:'<i class="icon-arrow-left"></i>',
        next:'<i class="icon-arrow-right"></i>',
        close:'&times;',
        current:'{current} of {total}',
        maxWidth:'100%',
        maxHeight:'100%'
    };


    var displayFunc = (function () {
        /*表格样式*/
        var renderList = function (tableId, listData) {
            var $tableWrap = $('#' + tableId);
            if (listData && listData.length) {
                var $ulTitle = createTableTitle();
                var $ulData = $('<ul></ul>').addClass('flex-table');
                $tableWrap.append($ulTitle).append($ulData);
                $.each(listData, function (i, v) {
                    var $liLine = creatLine(i, v, i == listData.length - 1);
                    $liLine.appendTo($ulTitle);
                });
            }
        };

        /*表格头*/
        var createTableTitle = function () {
            var $ulTitle = $('<ul></ul>').addClass('flex-table');
            var $liTitle = $('<li></li>').addClass('line table-title');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>'));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col2');
            var titleName = '图片,状态';

            $.each(titleName.split(','), function (i, v) {
                var $cell = $('<div></div>').addClass('cell').html(v);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action').html($('<div>操作</div>').addClass('cell option'));

            $liTitle.append($indexWrap)
                .append($contentWrap)
                .append($optionWrap)
                .appendTo($ulTitle);

            return $ulTitle;
        };
        /*表格体*/
        var creatLine = function (i, v, lastFlag) {
            var $liLine = $('<li></li>').addClass('line');
            var id = i + 1;
            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(id));
            var $contentWrap = $('<div></div>').addClass('line-wrap content col2');

            var propertyArrimg = [
                [v.img, 'null']
            ];

            $.each(propertyArrimg, function (i, v) {
                var $imgDiv = $('<div></div>').addClass('cell').appendTo($contentWrap);
                var img = $('<img> </img>');
                com.showImg(img, v[0], 70, 40, '70x40', null, 0);
                img.appendTo($imgDiv);
            });

            var propertyArr = [
                //[v.icon, 'black'],
                [v.status == "0" ? "启用" : "禁用", 'red']
            ];

            $.each(propertyArr, function (i, v) {
                var $cell = $('<div></div>').addClass('cell ' + v[1]).html(v[0]);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action');
            var $cellOption = $('<div></div>').addClass('cell option');

            var $btnGroup = $('<div></div>').addClass('btn-group');
            var $btn = $('<button></button>').addClass('btn btn-primary dropdown-toggle').attr('data-toggle', 'dropdown').append('操作').append('<i class="icon-angle-down"></i>');
            var $btnUl = $('<ul></ul>').addClass('dropdown-menu').addClass(lastFlag ? 'bottom-up' : '');
            // var $btnStart = $('<li></li>').append($('<a></a>').html('显示'));
            var $btnBan = $('<li></li>').append($('<a></a>').html('禁用'));
            var $btnStart = $('<li></li>').append($('<a></a>').html('启用'));
            var $update = $('<li></li>').append($('<a></a>').html('编辑'));

            $btnUl
                .append($update)
                .append($btnBan)
                .append($btnStart);

            $btnGroup
                .append($btn)
                .append($btnUl)
                .appendTo($cellOption);

            $cellOption.appendTo($optionWrap);

            $liLine.append($indexWrap)
                .append($contentWrap)
                .append($optionWrap);

            //编辑
            $update.click(function () {
                $("#name").attr('data-gid',v.gid);
                $("#name").attr('data-typeahead-key',v.name);
                $("#mgoodsname").hide();
                var $layer = $('#layerAdd');
                editBrand(v);
                openlayer(function (index, layero) {
                    if(com.validate('form1'))
                        return;
                    var id = $layer.find('input[id="name"]').attr("data-gid");
                    updateData(v, function () {
                        layer.closeAll();
                    });
                });
            });

            $btnBan.click(function () {
                $('#layerAdd').attr('data-sid', v.sid);
                $('#layerAdd').attr('data-status', v.status);

                var id = $('#layerAdd').attr('data-sid');
                var status = $('#layerAdd').attr('data-status');

                startStatus(id, status, function () {
                    layer.closeAll();
                    layer.msg('禁用成功', {icon: 1});
                });
            });

            $btnStart.click(function () {
                $('#layerAdd').attr('data-sid', v.sid);
                $('#layerAdd').attr('data-status', v.status);

                var id = $('#layerAdd').attr('data-sid');
                var status = $('#layerAdd').attr('data-status');

                stopStatus(id, status, function () {
                    layer.closeAll();
                    layer.msg('启用成功', {icon: 1});
                });
            });

            return $liLine;
        };

        return {
            init: function (tableId, listData) {
                $('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function (v) {
                return creatLine(v);
            }
        };
    })();

    autoFill(api.store.queryMgoodsByPinyin, "mgoods", "gid", "name");

    //查询
    function doSearcher() {
        com.post(api.store.querySlide, {}, function (res) {
            displayFunc.init('resultList', res.slides);
        });
    }
    doSearcher();

    function autoFill(url, id, key, value) {
        $('input[name=' + id + ']').typeahead({
            url: url,
            list: [],
            postData: {},
            source: function (query, process) {
                var options = $.extend({"mgoods.pinyin": query}, this.options.postData);
                com.post(this.options.url, options, $.proxy(this.options.callback, this));
            }, matcher: function (item) {
                return true;
            }, callback: function (data) {
                slide.slideData = [];
                slide.slideData = data.autoFillKeyValue;
                this.flprocess(slide.slideData, 'key', 'value');
            },
            isResultTypeMap: true,
            flupdater: function (k, v) {
                $('input[name=' + id + ']').attr('data-gid',k);
                return v;
            }
        });
    }

    function openlayer(callback) {
        layer.closeAll();
        layer.open({
            type: 1,
            title: " ",
            content: $('#layerAdd'),
            area: ( $(window).width() * 0.6 < 620 ? $(window).height() * 0.6 : 620 ) + "px",
            maxmin: false,
            zIndex: 9000,
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                var img =$('#showImg').attr('src');
                if(img == "#"){
                    layer.msg("请上传图片");
                }else{
                    callback(index,layero);
                }
            },
            btn2: function (index, layero) {
                //按钮【按钮二】的回调
                $("#name").removeAttr("data-gid");
                $("#name").removeAttr("data-typeahead-key");
                com.clearValidator();
            },
            cancel: function () {
                $("#name").removeAttr("data-gid");
                $("#name").removeAttr("data-typeahead-key");
                //右上角关闭回调
            }
        });
    }

    function startStatus(id, status, callback) {
        if (status == "0") {
            com.post(api.store.updateSlideForStatus, {
                "slide.sid": id,
                "slide.status": "1"
            }, function (res) {
                callback();
                doSearcher();
            });
        } else {
            layer.alert('已经禁用', {
                icon: 0,
                skin: 'layer-ext-moon'
            });
        }
    }

    function stopStatus(id, status, callback) {
        if (status == "1") {
            com.post(api.store.updateSlideForStatus, {
                "slide.sid": id,
                "slide.status": "0"
            }, function (res) {
                callback();
                doSearcher();
            });
        } else {
            layer.alert('已经启用', {
                icon: 0,
                skin: 'layer-ext-moon'
            });
        }
    }

    /*添加信息*/
    function saveData(id,callback){
        var $layer = $('#layerAdd');
        var nameid = $("#name").val();
        var url = $("#url").val();
        var img = $("#path").val();
        if( nameid == "" ){
            nameid = 0;
            com.post(api.store.addSlide, {
                "slide.gid": nameid,
                "slide.url": url,
                "slide.img": img
            }, function(res){
                doSearcher();
                com.clearValidator();
                layer.closeAll();
            });
        }else {
            nameid = $layer.find('input[id="name"]').attr("data-gid");
            com.post(api.store.addSlide, {
                "slide.gid": nameid,
                "slide.url": url,
                "slide.img": img
            }, function (res) {
                doSearcher();
                com.clearValidator();
                layer.closeAll();
            });
        }
    }

    function updateData(v,callback){
        var $layer = $('#layerAdd');
        var path = $("#path").val();
        com.post(api.store.updateSlide, {
            'slide.sid': v.sid,
            "slide.gid":v.gid,
            "slide.img": path,
            "slide.url": slide.slideItems.url.val()
        }, function(res){
            doSearcher();
            callback();
        });
        callback
    }

    function editBrand(v) {
        $("#slideImg").html("");
        slide.slideItems.url.val(v.url);
        slide.slideItems.path.val(v.img);
        var img = $('<img />');
        var imgA = $("<a></a>").attr("href", com.showImg(img, v.img, 150, 150, '150x150', null, 0)).attr("data-rel", "colorbox").css("height", "150px").append(img).appendTo($("#slideImg"));
        imgA.colorbox(colorboxArgs);
    }

    $("#pictureUpload").html("").Huploadify({
        'debug': false, // 开启调试
        'auto': true, // 是否自动上传
        'successTimeout': 99999, //超时时间
        'buttonClass': 'btn btn-success',
        'multi': false, // 批量上传
        'formData': { //附带值
            'uploadType': 0,
            'strutsUploadsFileName': '',
            'username': '用户名',
            'rnd': '加密密文'
        },
        'overrideEvents': ['onDialogClose'], // 不执行默认的onSelect事件
        'fileObjName': 'strutsUploads', // 服务器端脚本使用的文件对象的名称 $_FILES个['upload']
        'uploader': config.media + api.common.uploadImg.url, // 上传处理程序
        'width': '100', // 浏览按钮的宽度
        'height': '32', // 浏览按钮的高度
        'fileTypeDesc': '支持的格式:', // 在浏览窗口底部的文件类型下拉菜单中显示的文本
        'fileTypeExts': '*.jpg;*.jpge;*.gif;*.png', // 允许上传的文件后缀
        'fileSizeLimit': '3MB', // 上传文件的大小限制
        'queueSizeLimit': 25, // 上传数量
        'onUploadSuccess': function (file, data, response) {
            var dateObj = eval("(" + data + ")");
            if (dateObj.errorCode == 0) {
                $("#slideImg").html("");
                slide.slideItems.path.val(dateObj.resUrl);
                var img = $('<img />');
                var imgA = $("<a></a>").attr("href", com.showImg(img, dateObj.resUrl, 150, 150, '150x150', null, 0)).attr("data-rel", "colorbox").css("height", "150px").append(img).appendTo($("#slideImg"));
                imgA.colorbox(colorboxArgs);
            } else {
                alert(data);
            }
        }
    });

    $("#adda").click(function () {
        $("#mgoodsname").show();
        $("#slideImg").html("");
        com.cleanItems(slide.slideItems);
        openlayer(function (index, layero) {
            if($("#path").val() == null || $("#path").val() == ""){
                $("#slideImg").html("");
                var $text = $('<span></span>').html('请上传图片！').css("color", "red").appendTo($("#slideImg"));
                return;
            }
            if(com.validate('form1')){
                return;
            }

            if (slide.slideData.length == 0) {

                if($("#name").val() != ""  ) {

                    $("#name").addClass('popover-notitle').attr({
                        "data-rel": "popover",
                        "data-placement": "right",
                        "data-original-title": "",
                        "title": "",
                        "data-content": "请填写正确的品牌"
                    }).popover('show');
                    return;
                }
            }
            saveData();
        });
    });
});
