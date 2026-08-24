jQuery(function($) {

    var normriceItem = {

        // 常量定义 (附加项业务类型)
        TYPE_QUOTA_INT: 3,
        STATUS_INIT_INT: 0,
        STATUS_CONFIRMED_INT: 2,
        STATUS_REJECTED_INT: 3,

        // 附加项图片 (quotationPicture: atttype=3附加项图片, type=1钉钉媒体图片, status=0有效)
        ATTTYPE_PICTURE_INT: 3,
        PICTURE_TYPE_DING_INT: 1,
        PICTURE_STATUS_YES_SHORT: 0,

        // 业务参数
        orderId: params.quotation.orderId,
        cnid: params.construction.constructionSchedule ? params.construction.constructionSchedule.cnid : null,
        currentQid: null,
        currentPictureItem: null,

        // 缓存元素
        modals: {
            addNormriceItemModal: com.focusPage('#addNormriceItemModal'),
            pictureModal: com.focusPage('#normriceItemPictureModal')
        },

        btns: {
            addNormriceItem: com.focusPage('#btnAddNormriceItem'),
            saveNormriceItem: com.focusPage('#btnSaveNormriceItem')
        },

        items: {
            normriceItemOrderId: com.focusPage('#normriceItemOrderId'),
            normriceItemResultList: com.focusPage('#normriceItemResultList'),
            niNormadd: com.focusPage('#niNormadd', '#addNormriceItemModal'),
            niNum: com.focusPage('#niNum', '#addNormriceItemModal')
        },

        normaddData: [],

        status: {
            0: {
                name: "待确认",
                clazz: "label-warning"
            },
            2: {
                name: "已确认",
                clazz: "label-success"
            },
            3: {
                name: "已驳回",
                clazz: "label-danger"
            }
        }
    };

    // 移除 page-content 样式 (与 normtionIndex 一致)
    com.focusPage('#normriceItemPageContent').removeClass('page-content');

    // 装修单号显示
    if (normriceItem.orderId) {
        normriceItem.items.normriceItemOrderId.text('装修单号: ' + normriceItem.orderId);
        queryData(normriceItem.orderId);
    } else {
        normriceItem.items.normriceItemOrderId.html('<span class="red">缺少装修单号参数</span>');
    }

    // 初始化附加项下拉列表 (从 数据-附加项 加载)
    com.post(api.data.queryNormadd, normriceItem.cnid ? {
        "normadd.constructionNode.cnid": normriceItem.cnid
    } : {}, function(res) {

        normriceItem.normaddData = res.normadds || [];
        var $select = normriceItem.items.niNormadd;
        $select.append('<option value="">请选择附加项</option>');
        $.each(normriceItem.normaddData, function(i, v) {
            $select.append('<option value="' + v.naid + '">' + v.name + '</option>');
        });
    }, null, false);

    // Modal 关闭时清理表单验证与表单项 (与其他模块一致)
    normriceItem.modals.addNormriceItemModal.on('hide.bs.modal', function() {

        com.clearValidator();
        com.cleanItems({
            niNormadd: normriceItem.items.niNormadd,
            niNum: normriceItem.items.niNum
        });
    });

    // 新增附加项按钮
    normriceItem.btns.addNormriceItem.on('click', function() {

        if (!normriceItem.currentQid) {
            com.showAlert(com.warning, "报价信息未加载，无法新增");
            return false;
        }

        normriceItem.items.niNormadd.val('');
        normriceItem.items.niNum.val('1');
        normriceItem.modals.addNormriceItemModal.modal('show');
    });

    // 保存按钮
    normriceItem.btns.saveNormriceItem.bindClick(saveNormriceItem);

    // 图片按钮 (事件委托)
    normriceItem.items.normriceItemResultList.on('click', '.btn-picture-normriceitem', function() {

        normriceItem.currentPictureItem = {
            npiid: $(this).data('npiid'),
            qiid: $(this).data('qiid')
        };

        loadPictures(normriceItem.currentPictureItem.npiid);
        normriceItem.modals.pictureModal.modal('show');
    });

    // 上传图片按钮 (页面初始化一次)
    initUploadBtn();

    // 确认附加项 (事件委托)
    normriceItem.items.normriceItemResultList.on('click', '.btn-confirm-normriceitem', function() {

        var npiid = $(this).data('npiid');

        com.showConfirm("确认要确认该附加项吗?", function() {
            com.post(api.quotation.confirmNormriceItem, {
                "normriceItem.npiid": npiid
            }, function(res) {
                com.showAlert(com.info, "操作成功");
                queryData(normriceItem.orderId);
            });
        });
    });

    // 驳回附加项 (事件委托)
    normriceItem.items.normriceItemResultList.on('click', '.btn-reject-normriceitem', function() {

        var npiid = $(this).data('npiid');

        com.showConfirm("确认要驳回该附加项吗?", function() {
            com.post(api.quotation.rejectNormriceItem, {
                "normriceItem.npiid": npiid
            }, function(res) {
                com.showAlert(com.info, "操作成功");
                queryData(normriceItem.orderId);
            });
        });
    });

    // 删除附加项 (事件委托, 仅"待确认"状态显示按钮)
    normriceItem.items.normriceItemResultList.on('click', '.btn-delete-normriceitem', function() {

        var npiid = $(this).data('npiid');

        com.showConfirm("确认要删除该附加项吗?删除后不可恢复。", function() {
            com.post(api.quotation.deleteNormriceItem, {
                "normriceItem.npiid": npiid
            }, function(res) {
                com.showAlert(com.info, "删除成功");
                queryData(normriceItem.orderId);
            });
        });
    });

    // 保存附加项
    function saveNormriceItem() {

        if (com.validate('addNormriceItemModal'))
            return false;

        var sid = normriceItem.items.niNormadd.val();
        var num = normriceItem.items.niNum.val() || 1;

        if (!sid) {
            com.showAlert(com.warning, "请选择附加项");
            return false;
        }

        var options = {
            "normtion.qid": normriceItem.currentQid,
            "normriceItem.sid": sid,
            "normriceItem.num": num
        };

        if (normriceItem.cnid) {
            options["normriceItem.constructionNode.cnid"] = normriceItem.cnid;
        }

        com.post(api.quotation.addNormriceItem, options, function(res) {

            com.showAlert(com.info, "操作成功");
            normriceItem.modals.addNormriceItemModal.modal('hide');
            queryData(normriceItem.orderId);
        });
    }

    // 查询报价并加载附加项列表
    function queryData(orderId) {

        com.post(api.quotation.queryQuotationByOrderId, {
            "quotation.orderId": orderId
        }, function(res) {

            if (!res.quotations || res.quotations.length == 0) {
                normriceItem.items.normriceItemResultList.html('<div class="alert alert-warning">未找到该装修单的报价信息</div>');
                return;
            }

            var quotation = res.quotations[0];
            normriceItem.currentQid = quotation.qid;

            com.post(api.quotation.queryNormriceItemByType, {
                "normriceItem.qid": normriceItem.currentQid,
                "normriceItem.type": normriceItem.TYPE_QUOTA_INT
            }, function(res) {

                renderList(res.normriceItems || []);
            }, function() {
                normriceItem.items.normriceItemResultList.html('<div class="alert alert-danger">查询附加项失败</div>');
            });
        }, function() {
            normriceItem.items.normriceItemResultList.html('<div class="alert alert-danger">查询报价单失败</div>');
        });
    }

    // 渲染附加项列表
    function renderList(items) {

        var $resultList = normriceItem.items.normriceItemResultList.empty();

        if (items.length == 0) {
            $resultList.append('<div class="alert alert-warning">无附加项数据</div>');
            return;
        }

        var $table = $('<table></table>').addClass('table table-striped table-bordered table-hover');
        var $thead = $('<thead></thead>');
        var $tbody = $('<tbody></tbody>');

        $thead.append(
            '<tr>' +
            '<th class="center">序号</th>' +
            '<th>名称</th>' +
            '<th class="center">数量</th>' +
            '<th class="center">金额</th>' +
            '<th class="center">状态</th>' +
            '<th class="center">操作</th>' +
            '</tr>'
        );

        var totalAmount = 0;

        $.each(items, function(i, v) {

            var salary = parseFloat(v.salary) || 0;
            var num = parseFloat(v.num) || 0;
            var amount = utils.changeThrDecimal(utils.accMul(num, salary));

            totalAmount = utils.accAdd(totalAmount, parseFloat(amount));

            var statusInfo = normriceItem.status[v.status] || normriceItem.status[normriceItem.STATUS_INIT_INT];

            var actionHtml = getActionHtml(v);

            var nodeRow = '<tr>' +
                '<td class="center">' + (i + 1) + '</td>' +
                '<td>' + (v.name || '-') + '</td>' +
                '<td class="center">' + v.num + '</td>' +
                '<td class="center">' + amount + '</td>' +
                '<td class="center"><span class="label ' + statusInfo.clazz + '">' + statusInfo.name + '</span></td>' +
                '<td class="center">' + actionHtml + '</td>' +
                '</tr>';

            $tbody.append(nodeRow);
        });

        $tbody.append(
            '<tr class="info">' +
            '<td colspan="3" class="text-right"><strong>合计</strong></td>' +
            '<td class="center"><strong>' + utils.changeThrDecimal(totalAmount) + '</strong></td>' +
            '<td colspan="2"></td>' +
            '</tr>'
        );

        $table.append($thead).append($tbody);
        $resultList.append($table);
    }

    // 根据状态返回操作按钮 HTML
    function getActionHtml(v) {

        var pictureBtn = '<button type="button" class="btn btn-minier btn-info btn-picture-normriceitem" data-npiid="' + v.npiid + '" data-qiid="' + (v.qiid || '') + '">图片</button> ';

        if (v.status == normriceItem.STATUS_CONFIRMED_INT) {
            return pictureBtn + '<button type="button" class="btn btn-minier btn-danger btn-reject-normriceitem" data-npiid="' + v.npiid + '">驳回</button>';
        }

        if (v.status == normriceItem.STATUS_REJECTED_INT) {
            return pictureBtn + '<span class="label label-default arrowed-in">-</span>';
        }

        return pictureBtn + '<button type="button" class="btn btn-minier btn-primary btn-confirm-normriceitem" data-npiid="' + v.npiid + '">确认</button> ' +
            '<button type="button" class="btn btn-minier btn-danger btn-reject-normriceitem" data-npiid="' + v.npiid + '">驳回</button> ' +
            '<button type="button" class="btn btn-minier btn-yellow btn-delete-normriceitem" data-npiid="' + v.npiid + '">删除</button>';
    }

    // 加载附加项图片 (quotationPicture.qid=附加项npiid, atttype=3附加项图片类型)
    function loadPictures(npiid) {

        com.focusPage('#normriceItemDrawing').html("");

        com.post(api.quotation.queryQuotationPicture, {
            "quotationPicture.qid": npiid,
            "quotationPicture.atttype": normriceItem.ATTTYPE_PICTURE_INT
        }, function(data) {

            var quotationPictures = data.quotationPictures;
            if (quotationPictures && quotationPictures.length) {
                $.each(quotationPictures, function(i, value) {

                    if (value.status == normriceItem.PICTURE_STATUS_YES_SHORT) {
                        appendGalleryElement(value);
                    }
                });

                com.popup4photos(com.focusPage("#normriceItemDrawing"));
            }
        }, null, false);
    }

    // 渲染单张图片 (含删除按钮)
    function appendGalleryElement(value) {

        var gallery = com.focusPage("#normriceItemDrawing");
        var imgLi = $("<li></li>").attr("id", "gallery_li" + value.qpid).addClass("text-center col-sm-4").css("border", "0px").css("border-color", "white").css("padding", "0px").css("height", "150px").css("width", "150px").appendTo(gallery);
        var img = $('<img/>');
        var $imgA = $('<a></a>').attr('data-rel', 'colorbox').addClass('cboxElement').attr('href', com.showImg(img, value.path, 200, 200, '200x200')).attr('target', '_blank').append(img).appendTo(imgLi);
        var imgA = $("<a></a>").addClass('cboxElement').attr("target", "_blank").css("height", "150px").append(img).appendTo(imgLi);
        com.showImg(img, value.path, 150, 150, value.name, null, value.type);
        var toolsDiv = $("<div></div>").addClass("tools tools-bottom").appendTo(imgLi);
        var toolsA = $("<a></a>").attr("href", "#").on("click", function() {

            com.post(api.quotation.deleteQuotationPicture, {
                "quotationPicture.qpid": value.qpid
            }, function(res) {

                com.focusPage("#gallery_li" + value.qpid).remove();
            });
        }).appendTo(toolsDiv);
        $("<i></i>").addClass("icon-remove red").appendTo(toolsA);
    }

    // 上传图片 (批量接口 quotationPictures[i], name取路径最后一段, type=1钉钉媒体图片, atttype=3附加项)
    function initUploadBtn() {

        com.uploadify("#normriceItemUpload", "上传图片", api.common.uploadImg, 'btn btn-success', '*.jpg;*.jpeg;*.gif;*.png', {
            'uploadType': 0
        }, 5, function(data) {

            if (!normriceItem.currentPictureItem) return;

            var path = data.resUrl;

            var options = {
                "quotationPictures[0].orderId": normriceItem.orderId,
                "quotationPictures[0].qid": normriceItem.currentPictureItem.npiid,
                "quotationPictures[0].areaName": "",
                "quotationPictures[0].qiid": normriceItem.currentPictureItem.qiid,
                "quotationPictures[0].name": path.split('/').pop(),
                "quotationPictures[0].path": path,
                "quotationPictures[0].filesize": 0,
                "quotationPictures[0].type": normriceItem.PICTURE_TYPE_DING_INT,
                "quotationPictures[0].atttype": normriceItem.ATTTYPE_PICTURE_INT
            };

            com.post(api.quotation.addQuotationPicture, options, function(res) {

                loadPictures(normriceItem.currentPictureItem.npiid);
            });
        });
    }

});
