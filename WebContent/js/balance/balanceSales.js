jQuery(function($) {

    var balanceSales = {

        bsid: null,
        btns: {
            createBalanceSalesBtn: com.focusPage("#createBalanceSalesBtn").on("click", saveData),
            withdrawBtn: com.focusPage("#withdrawBtn").on("click", saveDate),
        },

        modals: {
            createBalanceSalesModal: com.focusPage("#createBalanceSalesModal"),
            renewal: com.focusPage("#renewal"),

        },

        items: {
            name: com.focusPage("#BalanceSalesName"),
            brand: com.focusPage("#brand"),
            updateName: com.focusPage("#updata"),
            supplier: com.focusPage('#supplier')
        },

        drawingModal: com.focusPage('#drawingModal').on("show.bs.modal", function(a) {

            com.clearValidator();
        }),

        status: {},

        suppliers: [],

        depage: params['urlLoadParams'].depage,
    };

    balanceSales.modals.createBalanceSalesModal.on("hide.bs.modal", function() {

        com.cleanTypeahead("brand");
        balanceSales.items.supplier.empty();
        balanceSales.suppliers = [];
        com.clearValidator();
        com.cleanItems(balanceSales.items);
    });

    com.initTypeahead('brand', api.data.queryBrandByPinyin, "brand.pinyin", {
        "brand.atttype": 0,
    }, 'brands', 'bid', 'name', function(list, k, v) {

        $.each(list, function(index, val) {

            if (val['bid'] == k) {

                supplier(val)
            }
        });
        return v
    });

    var seacher = new Searcher();
    var history = "balanceSalesPostData";
    var url = api.balance.pageBalanceSales;

    if (balanceSales.depage == "supplier") {
        url = api.balance.pageBalanceSalesForSupplier
    }

    seacher.base("bscondList", "bspagenation", "bsresultList", url);

    seacher.condition(["balance-balance-no", "balance-sales-name", "balance-sales-status", "balance-sales-brand", "balance-sales-grade", "balance-sales-createTime", "balance-sales-creater", "balance-sales-lockTime", "balance-sales-balanceTime"]);

    seacher.button([{
        id: "createBalanceSales",
        name: "创建",
        clazz: "btn-yellow",
        icon: "icon-plus"
    }, {
        id: "export",
        name: "导出",
        clazz: "btn-success",
        icon: "icon-plus"
    }]);

    seacher.history(history);

    var lineprops = [{
        fieId: "balance.no",
        name: "结算单号",
        prop: "balance.no",
        clazz: "blue",
        show: function(v) {

            return (v.balance.no != "0000000000");
        }
    }, {
        fieId: "brand.name",
        name: "品牌名",
        prop: "brand.name",
        clazz: "grey"
    }, {
        fieId: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: constant.balance().balanceSales.status.keys
    }, {
        fieId: "grade",
        name: "等级",
        prop: "grade",
        clazz: "red"
    }, {
        fieId: "income",
        name: "收入",
        prop: "income",
        clazz: "blue",
    }, {
        fieId: "cost",
        name: "成本",
        prop: "cost",
        clazz: "blue",
    }, {
        fieId: "payment",
        name: "应付",
        prop: "payment",
        clazz: "blue",
    }, {
        fieId: "profit",
        name: "利润",
        prop: "profit",
        clazz: "blue",
    }, {
        field: "creater",
        name: "创建人",
        prop: "creater.userName",
        clazz: "grey",
        click: function(btn, v) {

            tools.personel.info(btn, v.creater.userId);
        }
    }, {
        field: "supplier",
        name: "厂商",
        prop: "supplier.userName",
        clazz: "grey",
        click: function(btn, v) {

            tools.personel.info(btn, v.supplier.userId);
        }
    }, {
        field: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green"
    }, {
        field: "balancer",
        name: "结算人",
        prop: "balancer.userName",
        clazz: "grey",
        click: function(btn, v) {

            tools.personel.info(btn, v.balancer.userId);
        }
    }, {
        field: "balanceTime",
        name: "结算时间",
        prop: "balanceTime",
        clazz: "green"
    }, {
        field: "lockTime",
        name: "锁定时间",
        prop: "lockTime",
        clazz: "green"
    }];

    var linebtus = [{
        name: "扣款",
        clazz: "btn-danger",
        handle: function(v) {

            params.balance.bsid = v.bsid;

            params.balance = v.balance;
            params.balance.bid = v.balance.bid;
            params.balance.uid = v.supplier.uid;

            com.popup4page("#stockRecordPopUp", api.index.balanceCutpayIndex.url, "结算扣款") && balanceSales.depage != "supplier";

            return false;
        },
        show: function(v) {

            return (v.balance.no != "0000000000");
        }
    }, {
        name: "汇总",
        clazz: "btn-purple",
        handle: function(v) {

            com.post(api.balance.amountBalanceSales, {
                "balanceSales.bsid": v.bsid
            }, function() {

                com.showAlert(com.info, "汇总成功");
                seacher.doSearch();
            });

            return false;
        },
        show: function(v) {

            return (v.status != constant.balance().balanceSales.STATUS_UNLOCK_INT);
        }
    }, {
        name: "同步金蝶",
        clazz: "btn-inverse",
        handle: function(v) {

            kingdee(v);
        },
        show: function(v) {

            return (v.status == constant.balance().balanceSales.STATUS_ENABLE_CHECK_INT) && balanceSales.depage == null;
        }
    }, {
        name: "明细",
        clazz: "btn-yellow",
        handle: function(v) {

            params.balance.bsid = v.bsid;

            com.popup4page("#stockRecordPopUp", api.index.balanceSalesBalanceIndex.url, "销售单");

            return false;
        }
    }, {
        name: "更新",
        clazz: "btn-info",
        handle: function(v) {

            balanceSales.bsid = v.bsid;
            balanceSales.items.updateName.val(v.name);
            balanceSales.modals.renewal.modal("show");

            return false;
        },
        show: function(v) {

            return (v.status == constant.balance().balanceSales.STATUS_INIT_INT);
        }
    }, {
        name: "结算",
        clazz: "btn-danger",
        handle: function(v) {

            var options = {
                "balanceSales.bsid": v.bsid,
                "balanceSales.payment": v.grade == "A" ? v.income : v.payment
            };

            com.post(api.balance.balanceBalanceSales, options, function() {

                com.showAlert(com.info, "结算成功");
                seacher.doSearch();
            });

            return false;
        },
        show: function(v) {

            return (v.status == constant.balance().balanceSales.STATUS_AFFIRM_INT) && balanceSales.depage == null;
        }
    }, {
        name: "锁定",
        clazz: "btn-success",
        handle: function(v) {

            com.post(api.balance.lockBalanceSales, {
                "balanceSales.bsid": v.bsid
            }, function() {

                com.showAlert(com.info, "锁定成功");
                seacher.doSearch();
            });

            return false;
        },
        show: function(v) {

            return (v.status == constant.balance().balanceSales.STATUS_INIT_INT);
        }
    }, {
        name: "解锁",
        clazz: "btn-inverse",
        handle: function(v) {

            com.post(api.balance.unlockBalanceSales, {
                "balanceSales.bsid": v.bsid
            }, function() {

                com.showAlert(com.info, "解锁成功");
                seacher.doSearch();
            });

            return false;
        },
        show: function(v) {

            return (v.status == constant.balance().balanceSales.STATUS_UNLOCK_INT);
        }
    }, {
        name: "确认",
        clazz: "btn-purple",
        handle: function(v) {

            com.post(api.balance.affirmBalanceSales, {
                "balanceSales.bsid": v.bsid
            }, function() {

                com.showAlert(com.info, "确认成功");
                seacher.doSearch();
            });

            return false;
        },
        show: function(v) {

            return (v.status == constant.balance().balanceSales.STATUS_UNLOCK_INT) && (balanceSales.depage == "supplier" || balanceSales.depage == null);
        }
    }, {
        name: "明细打印",
        clazz: "btn-yellow",
        handle: function(v) {

            params.balance.bsid = v.bsid;
            params.balance.type = 1;

            com.popup("明细表", api.index.balanceSales2print.url, null, null, true);

            return false;
        },
        show: function(v) {

            return (v.status != constant.balance().balanceSales.STATUS_INIT_INT);
        }
    }, {
        name: "利润打印",
        clazz: "btn-success",
        handle: function(v) {

            params.balance.bsid = v.bsid;
            params.balance.type = 2;

            com.popup("利润表", api.index.balanceSales2print.url, null, null, true);

            return false;
        },
        show: function(v) {

            return (v.status != constant.balance().balanceSales.STATUS_INIT_INT) && balanceSales.depage == null;
        }

    }, {
        name: "打印",
        clazz: "btn-blue",
        handle: function(v) {

            params.balance.bsid = v.bsid;
            params.balance.type = 3;

            com.popup("选材表", api.index.balanceSales2print.url, null, null, true);

            return false;
        },
        show: function(v) {

            return false;
        }
    }, {
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            com.post(api.balance.deleteBalanceSales, {
                "balanceSales.bsid": v.bsid
            }, function() {

                com.showAlert(com.info, "删除成功");
                seacher.doSearch();
            });

            return false;
        },
        show: function(v) {

            return (v.status == constant.balance().balanceSales.STATUS_INIT_INT);
        }
    }, {
        name: "图片",
        clazz: "btn-inverse",
        handle: function(v) {

            managedrawing(v);

            initUploadBtn(v);

            return false;
        }
    }];

    seacher.line("name", lineprops, linebtus).render();

    com.focusPage('#createBalanceSales').on("click", function() {

        balanceSales.modals.createBalanceSalesModal.modal("show");
    });

    com.focusPage('#export', '#bspagenation').on("click", function() {

        var total = com.focusPage('span[name="totalRecords"]', "#bspagenation").text();

        if (total == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }

        if (total > 2000) {
            com.showAlert(com.warning, "查询结果大于阀值 , 导出失败");
            return false;
        }

        com.post(api.balance.pageBalanceSales, $.extend({}, params[history], {
            "paging.noPage": 1
        }), function(res) {

            $.exceler({
                column: [['名称', 'name'], ['结算单号', 'balance.no'], ['品牌名', 'brand.name'], ['状态', 'status'], ['等级', 'grade'], ['收入', 'income'], ['成本', 'cost'], ['应付', 'payment'], ['利润', 'profit'], ['创建人', 'creater.userName'], ['创建时间', 'createTime'], ['结算人', 'balancer.userName'], ['结算时间', 'balanceTime'], ['锁定时间', 'lockTime']],
                list: res.paging.data
            }, function(v) {

                v.status = constant.balance().balanceSales.status.keys[v.status];
                v.lockTime = v.lockTime == null ? "" : v.lockTime;
                v.balancer.userName = v.balancer.userName == null ? "" : v.balancer.userName;
                v.balanceTime = v.balanceTime == null ? "" : v.balanceTime;
            });
        });
    });

    function saveData() {

        if (com.validate('createBalanceSalesModal'))
            return false;

        var options = {
            "balanceSales.name": balanceSales.items.name.val(),
            "balanceSales.brand.bid": com.typeahead("brand"),
            "balanceSales.supplier.uid": balanceSales.items.supplier.val(),
            "balanceSales.grade": $('input[name="grade"]:checked').val(),
        };

        com.post(api.balance.createBalanceSales, options, function() {

            com.showAlert(com.info, "操作成功");
            seacher.doSearch();
        });

        balanceSales.modals.createBalanceSalesModal.modal("hide");
    }

    function saveDate() {

        if (com.validate('renewal'))
            return false;

        var options = {
            "balanceSales.bsid": balanceSales.bsid,
            "balanceSales.name": balanceSales.items.updateName.val(),
        };

        com.post(api.balance.updateBalanceSales, options, function() {

            com.showAlert(com.info, "操作成功");
            seacher.doSearch();
        });

        balanceSales.modals.renewal.modal("hide");
    }

    function kingdee(v) {

        var balanceSales = {
            bsid: 0,
            creater: {
                userId: null
            },
            balanceTime: null,
            grade: null,
            brand: {
                kino: null,
                supplier: {
                    oldUserId: null
                }
            },
            name: null,
            payment: 0,
            income: 0,
            paymentOrg: null,
            items: []
        };

        com.post(api.balance.queryBalanceSalesByBsid, {
            "balanceSales.bsid": v.bsid
        }, function(res) {

            balanceSales.bsid = res.balanceSales.bsid;
            balanceSales.creater.userId = res.balanceSales.creater.userId;
            balanceSales.balanceTime = res.balanceSales.balanceTime;
            balanceSales.grade = res.balanceSales.grade;
            balanceSales.brand.kino = res.balanceSales.brand.kino;
            balanceSales.brand.supplier.oldUserId = res.balanceSales.brand.supplier != null ? res.balanceSales.brand.supplier.oldUserId : "";
            balanceSales.name = res.balanceSales.name;
            balanceSales.payment = res.balanceSales.payment;
            balanceSales.income = res.balanceSales.income;
            balanceSales.paymentOrg = params.company.srganization.no;
        }, null, false);

        com.post(api.balance.pageBalanceSalesBalance, {
            "paging.noPage": 1,
            "balanceSalesBalance.bsid": v.bsid
        }, function(res) {

            $.each(res.paging.data, function(i, v) {

                var oneType = v.salesBalance.onetype;
                var Type = v.salesBalance.type;
                var salesRevenue = null;
                var salesAmount = null;
                var accountsPayable = null;
                var venderMaling = Math.round(v.salesBalance.sales.venderMaling);
                var allowance = Math.round(v.salesBalance.allowance);

                if (oneType == 0) {

                    if (Type == 3) {

                        venderMaling = 0;
                        allowance = 0;
                        salesRevenue = v.salesBalance.sales.depositpay;
                        salesAmount = utils.accAdd(salesRevenue, utils.accAdd(venderMaling, allowance));
                        accountsPayable = utils.accSub(v.salesBalance.pbalance, venderMaling);
                    } else {

                        salesRevenue = utils.accAdd(v.salesBalance.sales.depositpay, v.salesBalance.sales.fullpay);
                        salesAmount = utils.accAdd(salesRevenue, utils.accAdd(venderMaling, allowance));
                        accountsPayable = utils.accSub(v.salesBalance.pbalance, venderMaling);
                    }
                }

                if (oneType == 1) {

                    venderMaling = 0;
                    salesRevenue = v.salesBalance.total;
                    salesAmount = utils.accAdd(v.salesBalance.total, allowance);
                    accountsPayable = v.salesBalance.pbalance;
                    venderMaling = (-venderMaling);
                }

                if (oneType == 2 || oneType == 3) {

                    salesRevenue = v.salesBalance.total;
                    salesAmount = utils.accAdd(utils.accSub(v.salesBalance.total, venderMaling), allowance);
                    accountsPayable = utils.accAdd(v.salesBalance.pbalance, venderMaling);
                    venderMaling = (-venderMaling);
                }

                var salesRev = utils.changeThrDecimal(salesRevenue);
                var serMoney = utils.accSub(utils.changeThrDecimal(salesRevenue), utils.changeThrDecimal(accountsPayable));

                var types = [constant.sales().salesBalance.TYPE_PREBALANCEREFUNDS_INT, constant.sales().salesBalance.TYPE_BALANCEREFUNDS_INT];
                var coupon = null;

                if (types.indexOf(v.salesBalance.type) != -1) {
                    coupon = -v.salesBalance.coupon;
                } else {
                    coupon = v.salesBalance.coupon;
                }

                var item = {
                    salesRevenue: salesRev,
                    serviceMoney: serMoney,
                    orderId: v.salesBalance.sales.orderId,
                    no: v.salesBalance.sales.no,
                    coupon: coupon,
                    address: v.salesBalance.sales.house.village.name + " " + v.salesBalance.sales.house.houseNumber
                };
                balanceSales.items.push(item);
            });

        }, null, false);

        kingdeeUtils.balance(balanceSales);
    }

    function managedrawing(v) {

        com.focusPage('#balanceDrawing').html("");

        com.post(api.balance.queryBalancePicture, {
            "balancePicture.pid": v.bsid,
            "balancePicture.type": 1
        }, function(data) {

            var balancePictures = data.balancePictures;
            if (balancePictures && balancePictures.length) {
                $.each(balancePictures, function(i, value) {

                    if (value.status == constant.balance().balancePicture.STATUS_YES_SHORT) {
                        appendGalleryElement("balanceDrawing", value);
                    }

                });
                com.popup4photos(com.focusPage("#balanceDrawing"));
            }
        }, null, false);

        balanceSales.drawingModal.modal("show");
    }

    function appendGalleryElement(galleryId, value, type) {

        var gallery = com.focusPage("#" + galleryId);
        var imgLi = $("<li></li>").attr("id", "gallery_li" + value.bpid).addClass("text-center col-sm-4").css("border", "0px").css("border-color", "white").css("padding", "0px").css("height", "150px").css("width", "150px").appendTo(gallery);
        var img = $('<img/>');
        var $imgA = $('<a></a>').attr('data-rel', 'colorbox').addClass('cboxElement').attr('href', com.showImg(img, value.path, 200, 200, '200x200')).attr('target', '_blank').append(img).appendTo(imgLi);
        var imgA = $("<a></a>").addClass('cboxElement').attr("target", "_blank").css("height", "150px").append(img).appendTo(imgLi);
        com.showImg(img, value.path, 150, 150, value.name, null, type);
        var toolsDiv = $("<div></div>").addClass("tools tools-bottom").appendTo(imgLi);
        var toolsA = $("<a></a>").attr("href", "#").on("click", function() {

            com.post(api.balance.deleteBalancePicture, {
                "balancePicture.bpid": value.bpid
            }, function(res) {

                com.focusPage("#gallery_li" + value.bpid).remove();
            });
        }).appendTo(toolsDiv);

        $("<i></i>").addClass("icon-remove red").appendTo(toolsA);
    }

    function initUploadBtn(v) {

        com.uploadify("#balanceUpload", "上传图片", api.common.uploadImg, 'btn btn-success', '*.jpg;*.jpeg;*.gif;*.png', {
            'uploadType': 0
        }, 5, function(data) {

            var options = {};
            options["balancePicture.bid"] = v.balance.bid;
            options["balancePicture.pid"] = v.bsid;
            options["balancePicture.name"] = data.strutsUploadsFileName;
            options["balancePicture.path"] = data.resUrl;
            options["balancePicture.type"] = 1;
            options["balancePicture.filesize"] = data.filesize;
            com.post(api.balance.addBalancePicture, options, function(res) {

                var balancePicture = res.balancePicture;

                appendGalleryElement("balanceDrawing", balancePicture);

                com.popup4photos("#balanceDrawing");

            });

            searcher.doSearch();
        });
    }

    function supplier(v) {

        balanceSales.items.supplier.empty();
        balanceSales.suppliers = [];

        if (!v || !v.bid) return false;

        com.post(api.communion.queryBrandSupplier, {
            "brandSupplier.brand.bid": v.bid
        }, function(res) {

            $.each(res.brandSuppliers || [], function(i, brandSupplier) {

                if (brandSupplier.supplier) {
                    balanceSales.suppliers.push(brandSupplier.supplier);
                }
            });
        }, null, false);

        balanceSales.items.supplier.bindData(balanceSales.suppliers, "uid", "currentName");
    }
});
