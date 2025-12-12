$(function() {

    var goodsPackage = {
        items: {
            companySelect: com.focusPage('#companySelect', "#addPackageModal"),
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

        // 恢复可编辑状态
        goodsPackage.items.companySelect.prop('disabled', false);
        goodsPackage.items.goodsName.prop('readonly', false);
    });

    // 初始化加载公司列表
    com.post(api.system.queryCompany, {
        "company.atttype": "1"
    }, function(res) {

        goodsPackage.items.companySelect.bindData(res.companys, "cid", "name");
    });

    // 监听公司选择变化，清空商品选择
    goodsPackage.items.companySelect.on('change', function() {

        // 清空商品输入框
        goodsPackage.items.goodsName.val('');
        com.cleanTypeahead("goodsName");

        com.focusPage("#goodsName", "#addPackageModal").typeahead("args", {
            "goods.company": $(this).val()
        });

        console.log($(this).val())

        goodsPackage.selectedGoods = null;

        // 清空商品信息
        goodsPackage.items.goodsNo.val('');
        goodsPackage.items.category.val('');
        goodsPackage.items.brand.val('');
        goodsPackage.items.colorSelect.html('<option value="">请选择颜色</option>');
        goodsPackage.items.formatSelect.html('<option value="">请选择规格</option>');
    });

    // 初始化商品名称自动完成
    com.initTypeahead(goodsPackage.items.goodsName, api.data.queryGoodsByName, "goods.name", function() {

        // 动态返回查询参数，包含所选公司
        var companyId = goodsPackage.items.companySelect.val();

        console.log(companyId);

        if (!companyId) {
            com.showAlert(com.warning, '请先选择公司');
            return false;
        }
        return {
            "goods.company": companyId
        };
    }, "goodes", "gid", "name", function(list, k, v) {

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
                    console.log(com.warning, "品牌不一致!套餐品牌: " + goodsPackage.packageBrand);
                }

                // 验证不能添加套餐类型商品
                if (val.type == 1) {
                    com.showAlert(com.warning, "不能添加套餐类型商品!");
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
        clazz: "blue",
    }, {
        fieId: "ctype",
        name: "结算类型",
        prop: "ctype",
        clazz: "red",
        dataset: constant.data().price.ctype.keys,
    }, {
        fieId: "cvalue",
        name: "结算值",
        prop: "cvalue",
        clazz: "blue",
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

        // 确保添加模式下字段可编辑
        goodsPackage.items.companySelect.prop('disabled', false);
        goodsPackage.items.goodsName.prop('readonly', false);

        goodsPackage.modals.addPackageModal.modal("show");
    });

    /**
     * 编辑套餐商品
     */
    function editPackageItem(item) {

        goodsPackage.editingGpid = item.gpid;
        com.focusPage('#modalTitle').text('编辑套餐商品');

        // 编辑模式下设置公司和商品名称为只读
        goodsPackage.items.companySelect.prop('disabled', true);
        goodsPackage.items.goodsName.prop('readonly', true);

        // 填充公司信息
        if (item.goods && item.goods.company) {
            goodsPackage.items.companySelect.val(item.goods.company);
        }

        // 填充表单数据
        goodsPackage.items.goodsName.val(item.goods.goods || item.goods.name);
        goodsPackage.items.goodsNo.val(item.goods.no || '');
        goodsPackage.items.category.val(item.goods.category || '');
        goodsPackage.items.brand.val(item.goods.brand || '');
        goodsPackage.items.num.val(item.num || '');
        goodsPackage.items.selling.val(item.selling ? item.selling : '');

        // 填充结算类型和结算值
        goodsPackage.items.ctypeSelect.val(item.ctype);
        goodsPackage.items.cvalue.val(item.cvalue);

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

        // 表单验证
        if (com.validate('addPackageModal')) {
            return false;
        }

        // 验证是否选择了商品
        if (!goodsPackage.selectedGoods || !goodsPackage.selectedGoods.gid) {
            com.showAlert(com.warning, "请选择商品");
            return false;
        }

        // 如果是编辑模式，添加 gpid
        if (goodsPackage.editingGpid) {
            updateData();
            return false;
        }

        // 构建保存参数
        var url = api.data.addGoodsPackage;
        var option = {
            "goods.gid": goodsPackage.pid,
            "goodsPackages[0].goods.gid": goodsPackage.selectedGoods.gid,
            "goodsPackages[0].color.cid": goodsPackage.items.colorSelect.val(),
            "goodsPackages[0].format.fid": goodsPackage.items.formatSelect.val(),
            "goodsPackages[0].num": goodsPackage.items.num.val()
        };

        option["goodsPackages[0].selling"] = goodsPackage.items.selling.val();

        // 结算类型
        option["goodsPackages[0].ctype"] = goodsPackage.items.ctypeSelect.val();
        option["goodsPackages[0].cvalue"] = goodsPackage.items.cvalue.val();

        // 调用保存接口
        com.post(url, option, function(e) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
            goodsPackage.modals.addPackageModal.modal("hide");
        });
    }

    /**
     * 保存套餐商品
     */
    function updateData() {

        // 构建保存参数
        var url = api.data.updateGoodsPackage;
        var option = {
            "goods.gid": goodsPackage.pid,
            "goodsPackage.goods.gid": goodsPackage.selectedGoods.gid,
            "goodsPackage.color.cid": goodsPackage.items.colorSelect.val(),
            "goodsPackage.format.fid": goodsPackage.items.formatSelect.val(),
            "goodsPackage.num": goodsPackage.items.num.val()
        };

        option["goodsPackage.gpid"] = goodsPackage.editingGpid;
        option["goodsPackage.selling"] = goodsPackage.items.selling.val();

        // 结算类型
        option["goodsPackage.ctype"] = goodsPackage.items.ctypeSelect.val();
        option["goodsPackage.cvalue"] = goodsPackage.items.cvalue.val();

        // 调用保存接口
        com.post(url, option, function(e) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
            goodsPackage.modals.addPackageModal.modal("hide");
        });
    }
});
