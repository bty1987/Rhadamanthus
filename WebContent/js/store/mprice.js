$(function () {
    var goodsPricePopUp = com.focusPage('#goodsPricePopUp');
    var imgUrl;

    var validator = {
        num: {
            type: "v_num",
            regex: /^(\d+|\d+\.[0-9]{1,4})$/,
            errorMsg: "数量输入内容格式错误"
        },
        priceType: {
            type: "v_priceType",
            regex: /^(0([\.]?\d*[0-9]+)|0|1)$/,
            errorMsg: "结算值在0-1之间"
        },
        imgs: {
            type: "v_requireds",
            regex: /^(0([\.]?\d*[0-9]+)|0|1)$/,
            errorMsg: "请上传图片"
        },
        color: [],
        mformat: [],
        editFlg: false
    };

    var goodsName = goodsPricePopUp.attr('data-goodName');
    var gid = goodsPricePopUp.attr('data-gid');

    $.extend(com.validator, validator);

    var displayFunc = (function () {
        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);

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

        var createTableTitle = function () {
            var $ulTitle = $('<ul></ul>').addClass('flex-table');
            var $liTitle = $('<li></li>').addClass('line table-title');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index'));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col8');

            var titleName = '图片,商品,颜色,规格,价格说明,价格,状态';

            $.each(titleName.split(','), function (i, v) {
                var $cell = $('<div></div>').addClass('cell').html(v);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action').html($('<div>操作</div>').addClass('cell option'));

            $liTitle.append($indexWrap).append($contentWrap).append($optionWrap).appendTo($ulTitle);

            return $ulTitle;
        };

        var creatLine = function (i, v, lastFlag) {
            var $liLine = $('<li></li>').addClass('line');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(i + 1));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col8');
            var status = {
                0: "启用",
                1: "禁用",
                2: "热点",
                3: "推荐"
            };

            var propertyArr = [
                [v.mgoods.name, 'blue'],
                [v.mcolor.color, 'blue'],
                [v.mformat.format, 'blue'],
                [v.name, 'grey'],
                [v.price, 'blue'],
                [status[v.status], 'red']
            ];

            var propertyArr2 = [
                [v.img, 'blue']
            ];

            $.each(propertyArr2, function (i, v) {
                var $imgDiv = $('<div></div>').addClass('cell').appendTo($contentWrap);
                var img = $('<img />');
                com.showImg(img, v[0], 50, 50, '50x50', null, 0);
                img.appendTo($imgDiv);
            });

            $.each(propertyArr, function (i, v) {
                var $cell = $('<div></div>').addClass('cell ' + v[1]).html(v[0]);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action');
            var $cellOption = $('<div></div>').addClass('cell option');

            var $btnGroup = $('<div></div>').addClass('btn-group');
            var $btn = $('<button></button>').addClass('btn btn-primary dropdown-toggle').attr('data-toggle', 'dropdown').append('操作').append('<i class="icon-angle-down"></i>');
            var $btnUl = $('<ul></ul>').addClass('dropdown-menu').addClass(lastFlag ? 'bottom-up' : '');

            var $btnStart = $('<li></li>').append($('<a></a>').html('启用'));
            var $btnStop = $('<li></li>').append($('<a></a>').html('禁用'));
            var $gtbe = $('<li></li>').append($('<a></a>').html('热点'));
            var $go = $('<li></li>').append($('<a></a>').html('推荐'));

            $btnUl.append($btnStart).append($btnStop).append($gtbe).append($go);

            $btnGroup.append($btn).append($btnUl).appendTo($cellOption);

            $cellOption.appendTo($optionWrap);

            $liLine.append($indexWrap).append($contentWrap).append($optionWrap);

            /*有效状态*/
            $btnStart.click(function () {
                com.focusPage('#layerAdd').attr('data-fid', v.pid);
                com.focusPage('#layerAdd').attr('data-status', v.status);

                var id = com.focusPage('#layerAdd').attr('data-fid');
                var status = com.focusPage('#layerAdd').attr('data-status');
                
                zero(id, status);
            });
            /*无效状态*/
            $btnStop.click(function () {
                com.focusPage('#layerAdd').attr('data-fid', v.pid);
                com.focusPage('#layerAdd').attr('data-status', v.status);

                var id = com.focusPage('#layerAdd').attr('data-fid');
                var status = com.focusPage('#layerAdd').attr('data-status');

                one(id, status);
            });

            /*人气状态*/
            $gtbe.click(function () {
                com.focusPage('#layerAdd').attr('data-fid', v.pid);
                com.focusPage('#layerAdd').attr('data-status', v.status);

                var id = com.focusPage('#layerAdd').attr('data-fid');
                var status = com.focusPage('#layerAdd').attr('data-status');
                
                two(id, status);
            });

            /*推荐状态*/
            $go.click(function () {
                com.focusPage('#layerAdd').attr('data-fid', v.pid);
                com.focusPage('#layerAdd').attr('data-status', v.status);

                var id = com.focusPage('#layerAdd').attr('data-fid');
                var status = com.focusPage('#layerAdd').attr('data-status');
                
                three(id, status);
            });
            return $liLine;
        };

        return {
            init: function (tableId, listData) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function (v) {
                return creatLine(v);
            }
        }
    })();

    function doSearcher() {
        com.post(api.store.queryMpriceByGid, {
            "mprice.mgoods.gid": goodsPricePopUp.attr('data-gid')
        }, function (res) {
            displayFunc.init('resultListPrice', res.mprices);
        })
    }

    doSearcher();

    com.post(api.store.queryMcolorByGid, {"mcolor.gid": goodsPricePopUp.attr('data-gid'),"mcolor.status": 0}, function (res) {
        var colorsp = [];
        $.each(res.mcolors, function (i, v) {
            colorsp.push(v)
        });
        validator.color = colorsp;
    }, null, false);

    com.post(api.store.queryMformatByGid, {"mformat.gid": goodsPricePopUp.attr('data-gid'),"mformat.status": 0}, function (res) {
        var mformatsp = [];
        $.each(res.mformats, function (i, v) {
            mformatsp.push(v)
        });
        validator.mformat = mformatsp;
    }, null, false);

    function addline(lineindex) {
        var $line = $('<li></li>').addClass('line');
        var $indexWrap = $('<div></div>').addClass('line-wrap order').append($('<div></div>').addClass('cell index').text(lineindex));
        var $lineInfoWrap = $('<div></div>').addClass('line-wrap content col7');
        var $optWrap = $('<div></div>').addClass('line-wrap action');
        var _lineInfoSet = [
            {cellClass: "name", hasInput: !0, flag: false},
            {cellClass: "price", hasInput: !0, flag: true},
            {cellClass: "goods", hasInput: !0, flag: false, disable: true},
            {cellClass: "color", hasSelectCtype: !0},
            {cellClass: "format", hasSelectCtypes: !0},
            {cellClass: "img", hasbutton: !0, flag: false}
        ];
        var $btncheck = $('<a class="color-green green"  style="font-size: 18px"><i class="icon-ok"></i></a>');
        var $btndel = $('<a class="color-red red" style="font-size: 18px"><i class=" icon-remove"></i></a>');

        $.each(_lineInfoSet, function (i, v) {
            var $input;
            var $select;
            var $cell = $('<div></div>').addClass('cell ' + v.cellClass);

            if (v.hasInput) {
                $input = $('<input>').prop({
                    'type': 'text', 'autocomplete': 'off'
                }).attr('data-toggle', 'popover').attr('data-placement', 'bottom').addClass('editable v_required');

                if (v.flag) {
                    $input.addClass('v_amount');
                }

                if (v.disable) {
                    $input.attr("readonly", true).val(goodsName);
                }
                $cell.append($input);
            }

            if (v.hasbutton) {
                $cell.html("").Huploadify({
                    'debug': false, // 开启调试
                    'auto': true, // 是否自动上传
                    'successTimeout': 150, // 超时时间
                    'formData': { // 附带值
                        'uploadType': 0,
                        'username': '用户名',
                        'rnd': '加密密文'
                    },
                    'multi': false, // 批量上传
                    'buttonClass': 'btn btn-success',
                    'buttonText': '上传图片',
                    'overrideEvents': ['onDialogClose'],  // 不执行默认的onSelect事件
                    'fileObjName': 'strutsUploads', // 服务器端脚本使用的文件对象的名称 $_FILES个['upload']
                    'uploader': config.media + api.common.uploadImg.url, // 上传处理程序
                    'height': '45', // 浏览按钮的高度
                    'fileTypeDesc': '支持的格式:', // 在浏览窗口底部的文件类型下拉菜单中显示的文本
                    'fileTypeExts': '*.jpg;*.jpeg;*.gif;*.png', // 允许上传的文件后缀
                    'fileSizeLimit': 5120, // 上传文件的大小限制
                    'queueSizeLimit': 10, // 上传数量
                    'onUploadSuccess': function (file, data, response) { //上传到服务器,服务器返回相应信息到data里
                        var dateObj = eval("(" + data + ")");
                        if (dateObj.errorCode == 0) {
                            imgUrl = dateObj.resUrl;
                            $cell.html("");
                            var img = $('<img />');
                            com.showImg(img, dateObj.resUrl, 75, 75, '75x75', null, 0);
                            img.appendTo($cell);
                        } else {
                            alert(data);
                        }
                    }
                });
            }

            if (v.hasSelectCtype) {
                $select = $('<select style="width: 100%;"></select>');
                $select.bindData(validator.color, "cid", "color").addClass('editable v_required');
                $cell.append($select);
            }
            if (v.hasSelectCtypes) {
                $select = $('<select style="width: 100%;"></select>');
                $select.bindData(validator.mformat, "fid", "format").addClass('editable v_required');
                $cell.append($select);
            }
            $cell.appendTo($lineInfoWrap);
        });

        $optWrap.append($('<div></div>').addClass('cell option').append($btncheck).append($btndel));

        $line.append($indexWrap).append($lineInfoWrap).append($optWrap);

        $btncheck.click(function (e) {
            com.focusPage("#file_upload_1-button").attr("class","uploadify-button btn btn-success v_requireds");
            e.stopPropagation();
            if (com.validate(null,"bottom")) {
                return;
            }

            var options = {
                "mprice.mgoods.gid": gid,
                "mprice.name": $lineInfoWrap.find('.name input').val(),
                "mprice.price": $lineInfoWrap.find('.price input').val(),
                "mprice.mcolor.cid": $lineInfoWrap.find('.color select').val(),
                "mprice.mformat.fid": $lineInfoWrap.find('.format select').val(),
                "mprice.img": imgUrl
            };

            com.post(api.store.addMprice, options, function () {
                com.focusPage('#list').empty();
                addline(1).addClass('current').appendTo('#list');
                doSearcher();
            })
        });

        $btndel.click(function (e) {
            com.focusPage('#list').empty();
            addline(1).addClass('current').appendTo('#list');
        });
        return $line;
    }

    addline(1).addClass('current').appendTo('#list');

    /*状态信息验证*/
    function zero(id, status) {
        com.post(api.store.updateMpriceForStatus, {
            "mprice.pid": id,
            "mprice.status": "0"
        }, function (res) {
            doSearcher()
        });
    }

    function one(id, status) {
        com.post(api.store.updateMpriceForStatus, {
            "mprice.pid": id,
            "mprice.status": "1"
        }, function (res) {
            doSearcher()
        });
    }

    function two(id, status) {
        com.post(api.store.updateMpriceForStatus, {
            "mprice.pid": id,
            "mprice.status": "2"
        }, function (res) {
            doSearcher()
        });
    }

    function three(id, status) {
        com.post(api.store.updateMpriceForStatus, {
            "mprice.pid": id,
            "mprice.status": "3"
        }, function (res) {
            callback();
            doSearcher()
        });
    }

    com.focusPage('.layui-layer-content').css('overflow', 'hidden');
    com.focusPage('#showPrice').css('height', '660px');
    com.focusPage('#showPrice').css('overflow-y' , 'scroll');
    com.focusPage('#resultListPrice').css({
        'width': '96%',
        'margin': '0 auto',
        'height': '560px',
        'marigin-top': '20px'
    });
    com.focusPage('#addPrice').css({'width': '96%', 'margin': '0 auto', 'margin-top': '15px'});
});
