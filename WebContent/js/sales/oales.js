jQuery(function ($) {

    var oales = {

        btns: {
            saveBtn: com.focusPage("#saveBtn").on("click", saveData)
        },

        modals: {
            oalesModal: com.focusPage("#oalesModal")
        },

        items: {
            orderId: com.focusPage("#orderId", "#oalesModal"),
            total: com.focusPage("#total", "#oalesModal"),
            comment: com.focusPage("#comment", "#oalesModal"),
            brandName: com.focusPage('#brandName', "#oalesModal"),
            service: com.focusPage('#service', "#oalesModal"),
            atttype: com.focusPage("#atttype", "#oalesModal"),
            cost: com.focusPage('#cost', "#oalesModal"),
            threshold: com.focusPage("#threshold", "#oalesModal"),
            materialer: com.focusPage("#materialer", "#oalesModal"),
            award: com.focusPage('#award', "#oalesModal"),
            profit: com.focusPage('#profit', "#oalesModal"),
            awardType: com.focusPage('#awardType', "#oalesModal"),
        },

        drawingModal: com.focusPage('#drawingModal').on("show.bs.modal", function(a) {

            com.clearValidator();
        }),

        oid: null,
        bid: null,
        house: null,
        status: {},
        atttypes: {},
        awardTypes: {},

        pageType: params.urlLoadParams.pagetype
    };



    oales.modals.oalesModal.on('hide.bs.modal', function (e) {

        com.cleanTypeahead("brandName");
        com.cleanTypeahead("service");
        com.cleanTypeahead("materialer");
        com.cleanItems(oales.items);
        com.closeTip();
    });

    com.initTypeahead("brandName", api.data.queryBrandByPinyin, "pinyinName", {}, 'brands', 'bid', 'alias', function (list, k, v) {

        $.each(list, function (index, val) {

            if (val.bid == k) {
                oales.bid = val.bid;
                oales.items.brandName.val(val.name);
            }
        });
        return v;
    });

    oales.items.awardType = com.focusPage("#awardType").bindData(constant.sales().oales.awardType.datas,"key","value");
    oales.items.atttype = com.focusPage("#atttype").bindData(constant.sales().oales.atttype.datas,"key","value");


    com.initTypeahead('service', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0,
        "departmentType.name": ""
    }, 'autoFillKeyValue', 'key', 'value', null);
    com.initTypeahead('materialer', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0,
        "departmentType.name": ""
    }, 'autoFillKeyValue', 'key', 'value', null);

    var url = api.sales.pageOales;

    var conditions = ['sales-oales-no', 'sales-oales-orderId', 'sales-oales-createTime', 'sales-oales-status', 'sales-oales-brand', 'sales-oales-category'];
    var options = {};
    var history = "oalsePostData";

    if (oales.pageType == "serve") {
        history = "oalesServicePostDate";
    } else if (oales.pageType == "material") {
        options = $.extend({}, options, {
            "statuses[0]": 1,
            "statuses[1]": 3
        });
        history = "oalesMaterialPostDate";
    }  else if (oales.pageType == "finance") {
        options = $.extend({}, options, {
            "statuses[0]": 2,
            "statuses[1]": 4
        });
        history = "oalesFinancePostDate";
    }

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", url);
    searcher.condition(conditions);
    searcher.history(history);

    searcher.param(options);

    if (oales.pageType == "serve"){
        searcher.button([{
            id: "addOales",
            name: "创建",
            clazz: "btn-yellow",
            icon: "icon-plus"
        }]);
    }
    var lineprops = [{
        fieId: "orderId",
        name: "装修单号",
        prop: "decoration.orderId",
        clazz: "blue"
    }, {
        field: "village",
        name: "楼盘",
        prop: "decoration.house.village.name",
        clazz: "grey"
    }, {
        field: "houseNumber",
        name: "楼号",
        prop: "decoration.house.houseNumber",
        clazz: "grey"
    }, {
        field: "supplier",
        name: "厂商",
        prop: "supplier.currentName",
        clazz: "grey"
    }, {
        field: "creater",
        name: "创建人",
        prop: "creater.currentName",
        clazz: "grey"
    }, {
        field: "servicer",
        name: "服务管家",
        prop: "servicer.currentName",
        clazz: "grey"
    }, {
        field: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green"
    }, {
        field: "brand",
        name: "品牌",
        prop: "brand",
        clazz: "grey"
    }, {
        field: "category",
        name: "品类",
        prop: "category",
        clazz: "grey"
    }, {
        field: "atttype",
        name: "类型",
        prop: "atttype",
        clazz: "red",
        dataset: constant.sales().oales.atttype.keys,
    }, {
        field: "awardType",
        name: "奖励类型",
        prop: "awardType",
        clazz: "red",
        dataset: constant.sales().oales.awardType.keys,
    }, {
        field: "total",
        name: "总额",
        prop: "total",
        clazz: "blue"
    }, {
        field: "award",
        name: "奖励",
        prop: "award",
        clazz: "blue"
    }, {
        field: "profit",
        name: "利润",
        prop: "profit",
        clazz: "blue"
    }, {
        fieId: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: constant.sales().oales.status.keys,
    }];
    var linebtns = [{
        name: "编辑",
        clazz: "btn-success",
        handle: function (v) {
            oales.oid= v.oid;
            com.updateTypeahead('service', v.servicer.userId, v.servicer.userName);
            oales.items.orderId.val(v.decoration.orderId);
            oales.items.brandName.val(v.brand);
            oales.items.atttype = com.focusPage("#atttype").bindData(constant.sales().oales.atttype.datas,"key","value");
            com.focusPage("#orderId").attr("disabled","disabled");
            com.focusPage(".material").hide();
            oales.modals.oalesModal.modal("show");
            return false;
        },
        show: function(v) {

           return v.status == constant.sales().oales.STATUS_INIT_INT;
        }
    },{
        name: "编辑",
        clazz: "btn-success",
        handle: function (v) {
            oales.oid= v.oid;
            oales.items.total.val(v.total);
            com.updateTypeahead('materialer', v.materialer.userId, v.materialer.userName);
            oales.items.orderId.val(v.decoration.orderId);
            oales.items.cost.val(v.cost);
            oales.items.threshold.val(v.threshold);
            oales.items.profit.val(v.profit);
            oales.items.award.val(v.award);
            oales.items.awardType = com.focusPage("#awardType").bindData(constant.sales().oales.awardType.datas,"key","value");
            com.focusPage(".serve").hide();
            oales.modals.oalesModal.modal("show");
            return false;
        },
        show: function(v) {

            return (oales.pageType == "material" && (v.status == constant.sales().oales.STATUS_SUBMIT_INI || v.status == constant.sales().oales.STATUS_REJECT_INT));
        }
    },{
        name: "编辑",
        clazz: "btn-success",
        handle: function (v) {
            oales.oid= v.oid;
            oales.items.award.val(v.award);
            oales.items.orderId.val(v.decoration.orderId);
            com.focusPage(".serve").hide();
            com.focusPage(".material").hide();
            com.focusPage(".finance").show();
            oales.modals.oalesModal.modal("show");
            return false;
        },
        show: function(v) {

            return  (oales.pageType == "finance" && v.status == constant.sales().oales.STATUS_CONFIRM_INI);
        }
    }, {
        name: "提交",
        clazz: "btn-pink",
        handle: function (v) {
            submit(v.oid);
        },
        show: function (v) {
            return v.status == constant.sales().oales.STATUS_INIT_INT;
        }
    }, {
        name: "删除",
        clazz: "btn-warning",
        handle: function (v) {
            remove(v.oid);
        },
        show: function (v) {
            return v.status == constant.sales().oales.STATUS_INIT_INT;
        }
    },{
        name: "撤销",
        clazz: "btn-search",
        handle: function (v) {

            revocation(v.oid);

        },
        show: function (v) {
            return  (oales.pageType == "material" && v.status == constant.sales().oales.STATUS_SUBMIT_INI);

        }
    },{
        name: "完结",
        clazz: "btn-inverse",
        handle: function (v) {

            finishOales(v.oid);

        },
        show: function (v) {
            return false;
        }
    },{
        name: "确认",
        clazz: "btn-danger",
        handle: function (v) {
            confirmOales(v.oid);
        },
        show: function (v) {
            return (oales.pageType == "material" && (v.status == constant.sales().oales.STATUS_SUBMIT_INI || v.status == constant.sales().oales.STATUS_REJECT_INT));
        }
    },{
        name: "复核",
        clazz: "btn-pink",
        handle: function (v) {

            checkOales(v.oid);

        },
        show: function (v) {
            return  (oales.pageType == "finance" && v.status == constant.sales().oales.STATUS_CONFIRM_INI);
        }
    },{
        name: "驳回",
        clazz: "btn-purple",
        handle: function (v) {

            rejectOales(v.oid);

        },
        show: function (v) {
            return  (oales.pageType == "finance" && v.status == constant.sales().oales.STATUS_CONFIRM_INI);
        }
    },{
        name: "废单",
        clazz: "btn-inverse",
        handle: function (v) {
            invalid(v.oid);
        },
        show: function (v) {
            return  (v.status != constant.sales().oales.STATUS_INVALID_INI);
        }
    }, {
        name: "付款",
        clazz: "btn-purple",
        handle: function (v) {
            payment(v);
        },
        show: function (v) {
            return  (v.status != constant.sales().oales.STATUS_INVALID_INI);
        }
    }, {
        name: "图片",
        clazz: "btn-primary",
        handle: function (v) {
            managedrawing(v);
            initUploadBtn(v);
        },
        show: function (v) {
            return  (v.status != constant.sales().oales.STATUS_INVALID_INI);
        }
    },
    ];

    searcher.line("no", lineprops, linebtns).render();

    com.focusPage('#addOales', '#pagenation').on("click", function () {
        oales.oid = null;
        com.focusPage("#orderId").attr("disabled",false);
        com.focusPage(".material").hide();
        oales.modals.oalesModal.modal("show");
    });

    function saveData() {

        if (com.validate('oalesModal'))
            return false;

        var bid = com.typeahead("awardStock");

        var url = api.sales.addOales;

        var options = {
            "oales.decoration.orderId": oales.items.orderId.val(),
            "oales.bid": oales.bid,
            "oales.atttype": oales.items.atttype.val(),
            "oales.servicer.userId": com.typeahead("service"),
            "oales.brand": oales.items.brandName.val(),
            "oales.total": oales.items.total.val(),
            "oales.cost": oales.items.cost.val(),
            "oales.profit": oales.items.profit.val(),
            "oales.threshold": oales.items.threshold.val(),
            "oales.awardType": oales.items.awardType.val(),
            "oales.award": oales.items.award.val(),
            "oales.materialer.userId": com.typeahead("materialer"),
        };
        if (oales.oid){
            url = api.sales.updateOales;
            options["oales.oid"] = oales.oid;
        }

        com.post(url, options, function (res) {

            searcher.doSearch();
        });

        oales.modals.oalesModal.modal("hide");
        com.showAlert(com.info, "操作成功");
    }

    function remove(oid) {

        var options = {
            "oales.oid": oid,
        };
        com.post(api.sales.deleteOales, options, function (res) {
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });

    }

    function revocation(oid) {

        var options = {
            "oales.oid": oid,
        };
        com.post(api.sales.cancelOales, options, function (res) {
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });

    }
    function invalid(oid){
        var options = {
            "oales.oid": oid,
        };
        com.post(api.sales.abateOales, options, function (res) {
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });
    }
    function payment(v) {
        params.sales.oales = v;

        com.popup4page("#oalesPayPopUp", "/views/sales/oalesPay.html", "销售付款");

    }

    function submit(oid) {

        var options = {
            "oales.oid": oid,
        };
        com.post(api.sales.submitOales, options, function (res) {
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });

    }

    function finishOales(oid) {

        var options = {
            "oales.oid": oid,
        };
        com.post(api.sales.finishOales, options, function (res) {
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });

    }

    function checkOales(oid) {

        var options = {
            "oales.oid": oid,
        };
        com.post(api.sales.checkOales, options, function (res) {
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });

    }

    function rejectOales(oid) {

        var options = {
            "oales.oid": oid,
        };
        com.post(api.sales.rejectOales, options, function (res) {
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });

    }

    function confirmOales(oid) {

        var options = {
            "oales.oid": oid,
        };
        com.post(api.sales.confirmOales, options, function (res) {
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });

    }

    function managedrawing(v) {

        com.focusPage('#salesDrawing').html("");

        com.post(api.sales.querySalesPicture, {
            "salesPicture.siid": v.oid
        }, function(data) {
            var salesPictures = data.salesPictures;
            if (salesPictures && salesPictures.length) {
                $.each(salesPictures, function(i, value) {
                    if (value.status == constant.sales().salesPicture.STATUS_YES_SHORT) {
                        appendGalleryElement("salesDrawing", value);
                    }

                });
                com.popup4photos(com.focusPage("#salesDrawing"));
            }
        }, null, false);

        oales.drawingModal.modal("show");
    }

    function appendGalleryElement(galleryId, value) {

        var gallery = com.focusPage("#" + galleryId);
        var imgLi = $("<li></li>").attr("id", "gallery_li" + value.spid).addClass("text-center col-sm-4").css("border", "0px").css("border-color", "white").css("padding", "0px").css("height", "150px").css("width", "150px").appendTo(gallery);
        var img = $('<img/>');
        var $imgA = $('<a></a>').attr('data-rel', 'colorbox').addClass('cboxElement').attr('href', com.showImg(img, value.path, 200, 200, '200x200')).attr('target', '_blank').append(img).appendTo(imgLi);
        var imgA = $("<a></a>").addClass('cboxElement').attr("target", "_blank").css("height", "150px").append(img).appendTo(imgLi);
        com.showImg(img, value.path, 150, 150, value.name, null, 0);
        var toolsDiv = $("<div></div>").addClass("tools tools-bottom").appendTo(imgLi);
        var toolsA = $("<a></a>").attr("href", "#").on("click", function() {

            com.post(api.sales.deleteSalesPicture, {
                "salesPicture.spid": value.spid
            }, function(res) {

                com.focusPage("#gallery_li" + value.spid).remove();
            });
        }).appendTo(toolsDiv);
        $("<i></i>").addClass("icon-remove red").appendTo(toolsA);

    }
    function initUploadBtn(v) {

        com.uploadify("#salesUpload", "上传图片", api.common.uploadImg, 'btn btn-success', '*.jpg;*.jpeg;*.gif;*.png', {
            'uploadType': 0
        }, 5, function(data) {

            var options = {};
            options["salesPicture.sid"] = v.oid;
            options["salesPicture.siid"] = v.oid;
            options["salesPicture.name"] = data.strutsUploadsFileName;
            options["salesPicture.path"] = data.resUrl;
            options["salesPicture.type"] = 2;
            options["salesPicture.filesize"] = data.filesize;
            com.post(api.sales.addSalesPicture, options, function(res) {

                var salesPicture = res.salesPicture;

                appendGalleryElement("salesDrawing", salesPicture);

                com.popup4photos("#salesDrawing");

            });

            searcher.doSearch();
        });
    }


});
