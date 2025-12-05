$(function() {

    var goodsPackage = {
        items: {
            goodsName: com.focusPage('#goodsName', "#addPackageModal"),
            goodsNo: com.focusPage('#goodsNo', "#addPackageModal"),
            category: com.focusPage('#category', "#addPackageModal"),
            brand: com.focusPage('#brand', "#addPackageModal"),
            colorSelect: com.focusPage('#colorSelect', "#addPackageModal"),
            formatSelect: com.focusPage('#formatSelect', "#addPackageModal"),
            num: com.focusPage('#num', "#addPackageModal"),
            selling: com.focusPage('#selling', "#addPackageModal"),
            ctypeSelect: com.focusPage('#ctypeSelect', "#addPackageModal"),
            cvalue: com.focusPage('#cvalue', "#addPackageModal")
        },
        modals: {
            addPackageModal: com.focusPage('#addPackageModal')
        },
        btns: {
            savePackageBtn: com.focusPage('#savePackageBtn').on("click", saveData)
        },

        // 套餐商品ID（从 params 获取）
        pid: params.data.goods != null ? params.data.goods.gid : "",

        // 套餐商品品牌（用于校验）
        packageBrand: params.data.goods != null ? params.data.goods.brand : "",

        // 当前选中的商品
        selectedGoods: null,

        // 当前编辑的套餐明细ID（编辑模式）
        editingGpid: null,

        // 状态枚举
        status: constant.data().goods.status.keys
    };

    // 弹窗关闭时清空数据
    goodsPackage.modals.addPackageModal.on("hide.bs.modal", function(e) {

        com.clearValidator();
        com.cleanTypeahead("goodsName");
        com.cleanItems(goodsPackage.items);
        goodsPackage.selectedGoods = null;
        goodsPackage.editingGpid = null;
        com.focusPage('#modalTitle').text('添加套餐商品');
    });

    // 初始化商品名称自动完成
    com.initTypeahead(goodsPackage.items.goodsName, api.data.queryGoodsByName, "goods.name", {}, "goodes", "gid", "name", function(list, k, v) {

        // 选中商品后自动填充信息
        $.each(list, function(index, val) {

            if (val.gid == k) {
                goodsPackage.selectedGoods = val;

                // 填充商品信息
                goodsPackage.items.goodsNo.val(val.no || '');
                goodsPackage.items.category.val(val.category || '');
                goodsPackage.items.brand.val(val.brand || '');

                // 验证品牌是否一致
                if (goodsPackage.packageBrand && val.brand != goodsPackage.packageBrand) {
                    com.showAlert(com.warning, "品牌不一致！套餐品牌：" + goodsPackage.packageBrand);
                }

                // 验证不能添加套餐类型商品
                if (val.type == 1) {
                    com.showAlert(com.warning, "不能添加套餐类型商品！");
                    goodsPackage.selectedGoods = null;
                    return;
                }

                // 加载颜色列表
                com.post(api.data.queryColorForEnableByGid, {
                    "color.gid": val.gid
                }, function(res) {

                    if (res.colors && res.colors.length > 0) {
                        goodsPackage.items.colorSelect.bindData(res.colors, "cid", "name");
                    } else {
                        com.showAlert(com.warning, '该商品暂无颜色信息');
                        goodsPackage.items.colorSelect.html('<option value="">无颜色</option>');
                    }
                });

                // 加载规格列表
                com.post(api.data.queryFormatForEnableByGid, {
                    "format.gid": val.gid
                }, function(res) {

                    if (res.formats && res.formats.length > 0) {
                        goodsPackage.items.formatSelect.bindData(res.formats, "fid", "info");
                    } else {
                        com.showAlert(com.warning, '该商品暂无规格信息');
                        goodsPackage.items.formatSelect.html('<option value="">无规格</option>');
                    }
                });
            }
        });
        return v;
    });

    // 初始化 Searcher
    var searcher = new Searcher();

    // 定义显示字段
    var packageProps = [{
        fieId: "no",
        name: "商品编号",
        prop: "goods.no",
        clazz: "blue"
    }, {
        fieId: "name",
        name: "商品名称",
        prop: "goods.goods",
        clazz: "grey"
    }, {
        fieId: "category",
        name: "品类",
        prop: "goods.category",
        clazz: "grey"
    }, {
        fieId: "brand",
        name: "品牌",
        prop: "goods.brand",
        clazz: "grey"
    }, {
        fieId: "color",
        name: "颜色",
        prop: "color.color",
        clazz: "grey"
    }, {
        fieId: "format",
        name: "规格",
        prop: "format.format",
        clazz: "grey"
    }, {
        fieId: "num",
        name: "数量",
        prop: "num",
        clazz: "blue"
    }, {
        fieId: "selling",
        name: "售价",
        prop: "selling",
        clazz: "green",
        render: function(v) {

            return v.selling ? (v.selling / 100).toFixed(2) + ' 元' : '-';
        }
    }, {
        fieId: "ctype",
        name: "结算类型",
        prop: "ctype",
        clazz: "blue",
        render: function(v) {
            var ctypeMap = {
                '0': '固定金额',
                '1': '百分比',
                '2': '按数量'
            };
            return v.ctype !== null && v.ctype !== undefined ? ctypeMap[v.ctype] || '-' : '-';
        }
    }, {
        fieId: "cvalue",
        name: "结算值",
        prop: "cvalue",
        clazz: "green",
        render: function(v) {
            if (v.cvalue !== null && v.cvalue !== undefined && v.cvalue !== '') {
                if (v.ctype == 0) {
                    // 固定金额，显示为元
                    return (v.cvalue / 100).toFixed(2) + ' 元';
                } else if (v.ctype == 1) {
                    // 百分比
                    return v.cvalue + '%';
                } else if (v.ctype == 2) {
                    // 按数量
                    return v.cvalue;
                }
            }
            return '-';
        }
    }, {
        fieId: "status",
        name: "状态",
        prop: "goods.status",
        clazz: "red",
        dataset: goodsPackage.status
    }];

    // 定义操作按钮
    var linebtns = [{
        name: "编辑",
        clazz: "btn-info",
        icon: "fa-edit",
        handle: function(v) {

            editPackageItem(v);
        }
    }, {
        name: "删除",
        clazz: "btn-warning",
        icon: "fa-trash-o",
        handle: function(v) {

            com.showConfirm("确认删除该套餐商品吗？", function(result) {

                com.post(api.data.deleteGoodsPackage, {
                    "goodsPackage.gpid": v.gpid
                }, function(e) {

                    com.showAlert(com.info, "删除成功");
                    searcher.doSearch();
                });
            });
        }
    }];

    // 配置 Searcher
    searcher.base("packageCondList", "packagePagenation", "packageResultList", api.data.queryGoodsPackage);
    searcher.result("goodsPackages").isPage(true); // 不分页

    // 设置查询参数
    searcher.param({
        "goodsPackage.pid": goodsPackage.pid
    });

    // 添加"添加"按钮
    searcher.button(function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addBtn').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('fa fa-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text(' 添加').appendTo($adda);
        return [$adda];
    });

    // 渲染列表
    searcher.line("goods.name", packageProps, linebtns).render();

    // 添加按钮点击事件
    com.focusPage("#addBtn").click(function() {

        goodsPackage.editingGpid = null;
        com.focusPage('#modalTitle').text('添加');
        goodsPackage.modals.addPackageModal.modal("show");
    });

    /**
     * 编辑套餐商品
     */
    function editPackageItem(item) {

        goodsPackage.editingGpid = item.gpid;
        com.focusPage('#modalTitle').text('编辑套餐商品');

        // 填充表单数据
        goodsPackage.items.goodsName.val(item.goods.goods || item.goods.name);
        goodsPackage.items.goodsNo.val(item.goods.no || '');
        goodsPackage.items.category.val(item.goods.category || '');
        goodsPackage.items.brand.val(item.goods.brand || '');
        goodsPackage.items.num.val(item.num || '');
        goodsPackage.items.selling.val(item.selling ? (item.selling / 100).toFixed(2) : '');

        // 填充结算类型和结算值
        goodsPackage.items.ctypeSelect.val(item.ctype !== null && item.ctype !== undefined ? item.ctype : '');
        if (item.cvalue !== null && item.cvalue !== undefined && item.cvalue !== '') {
            // 如果是固定金额，需要转换为元
            if (item.ctype == 0) {
                goodsPackage.items.cvalue.val((item.cvalue / 100).toFixed(2));
            } else {
                goodsPackage.items.cvalue.val(item.cvalue);
            }
        } else {
            goodsPackage.items.cvalue.val('');
        }

        goodsPackage.selectedGoods = item.goods;

        // 加载并选中颜色
        com.post(api.data.queryColorForEnableByGid, {
            "color.gid": item.goods.gid
        }, function(res) {

            if (res.colors && res.colors.length > 0) {
                goodsPackage.items.colorSelect.bindData(res.colors, "cid", "name");
                if (item.color && item.color.cid) {
                    goodsPackage.items.colorSelect.val(item.color.cid);
                }
            }
        });

        // 加载并选中规格
        com.post(api.data.queryFormatForEnableByGid, {
            "format.gid": item.goods.gid
        }, function(res) {

            if (res.formats && res.formats.length > 0) {
                goodsPackage.items.formatSelect.bindData(res.formats, "fid", "info");
                if (item.format && item.format.fid) {
                    goodsPackage.items.formatSelect.val(item.format.fid);
                }
            }
        });

        // 打开弹窗
        goodsPackage.modals.addPackageModal.modal("show");
    }

    /**
     * 保存套餐商品
     */
    function saveData() {

        console.log(111)

        // 表单验证
        if (com.validate('addPackageModal')) {
            return false;
        }
        
        console.log(222)

        // 验证是否选择了商品
        if (!goodsPackage.selectedGoods || !goodsPackage.selectedGoods.gid) {
            com.showAlert(com.warning, "请选择商品");
            return false;
        }
        
        console.log(333)

        // 构建保存参数
        var option = {
            "goods.gid": goodsPackage.pid,
            "goodsPackages[0].goods.gid": goodsPackage.selectedGoods.gid,
            "goodsPackages[0].color.cid": goodsPackage.items.colorSelect.val(),
            "goodsPackages[0].format.fid": goodsPackage.items.formatSelect.val(),
            "goodsPackages[0].num": goodsPackage.items.num.val()
        };

        // 售价（可选，转换为分）
        var sellingValue = goodsPackage.items.selling.val();
        if (sellingValue) {
            option["goodsPackages[0].selling"] = Math.round(parseFloat(sellingValue) * 100);
        }

        // 结算类型
        var ctypeValue = goodsPackage.items.ctypeSelect.val();
        if (ctypeValue !== '') {
            option["goodsPackages[0].ctype"] = ctypeValue;
        }

        // 结算值（根据结算类型处理）
        var cvalueInput = goodsPackage.items.cvalue.val();
        if (cvalueInput !== '' && ctypeValue !== '') {
            if (ctypeValue == 0) {
                // 固定金额，转换为分
                option["goodsPackages[0].cvalue"] = Math.round(parseFloat(cvalueInput) * 100);
            } else {
                // 百分比或按数量，直接保存
                option["goodsPackages[0].cvalue"] = parseFloat(cvalueInput);
            }
        }

        // 如果是编辑模式，添加 gpid
        if (goodsPackage.editingGpid) {
            option["goodsPackages[0].gpid"] = goodsPackage.editingGpid;
        }

        // 调用保存接口
        com.post(api.data.addGoodsPackage, option, function(e) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
            goodsPackage.modals.addPackageModal.modal("hide");
        });
    }
});
