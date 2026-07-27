jQuery(function($) {

    var signet = {

        sid: null,

        btns: {
            saveBtn: com.focusPage("#saveBtn"),
            copyBtn: com.focusPage("#copyBtn"),
            moveBtn: com.focusPage("#moveBtn"),
        },

        items: {
            no: com.focusPage("#no", "#signetModal"),
            name: com.focusPage("#name", "#signetModal"),
            keyword: com.focusPage("#keyword", "#signetModal"),
            type: com.focusPage("#type", "#signetModal"),
            path: com.focusPage("#path", "#signetModal"),

            signetImg: com.focusPage("#signetImg"),

            company: com.focusPage("#company", "#moveSignetModal"),

            qrcode: null,
        },

        modals: {
            qrcodeModal: null,
            copySignetModal: null,
            moveSignetModal: null,
        },

        status: {},
        type: {}
    }

    signet.status = constant.data().signet.status.keys;
    signet.type = constant.data().signet.type.keys;
    signet.items.type.bindData(constant.data().signet.type.datas, "key", "value");

    com.post(api.system.queryCompany, {
        "company.atttype": 1
    }, function(res) {

        signet.items.company.bindData(res.companys, "cid", "name");
    })

    signet.modals.qrcodeModal = com.initForm("qrcodeModal", "二维码", [{
        "id": "qrcode",
        "type": "div",
        "clazz": "qrcode"
    }], []);
    signet.items.qrcode = com.focusPage("#qrcode");

    com.uploadify("#pictureUpload", "上传图片", api.common.uploadImg, 'btn btn-success', '*.png', {
        'uploadType': 2
    }, 1, function(data) {

        signet.items.path.val(data.resUrl);
        signet.items.filesize.val(data.filesize);

        com.showImg(signet.items.signetImg, data.resUrl, 150, 150, '', null, 0);
    });

    signet.btns.saveBtn.click(saveData);
    signet.btns.copyBtn.click(copyData);
    signet.btns.moveBtn.click(moveData);

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.data.pageSignet);

    searcher.condition(["data-signet-name", "data-signet-status", "data-signet-type"]);

    searcher.history("signetPostData");

    searcher.button([{
        id: "addSignet",
        name: "添加",
        clazz: "btn-yellow",
        icon: "icon-plus"
    }]);

    var lineprops = [{
        filed: "img",
        name: "印张图片",
        prop: "path",
        type: "img"
    }, {
        field: "no",
        name: "编号",
        prop: "no",
        clazz: "grey"
    }, {
        field: "name",
        name: "名称",
        prop: "name",
        clazz: "grey"
    }, {
        field: "keyword",
        name: "关键字",
        prop: "keyword",
        clazz: "grey"
    }, {
        field: "signno",
        name: "标识",
        prop: "signno",
        clazz: "grey"
    }, {
        field: "status",
        name: "状态",
        prop: "status",
        dataset: signet.status,
        clazz: "red"
    }, {
        field: "type",
        name: "类型",
        prop: "type",
        dataset: signet.type,
        clazz: "red"
    }, ];

    var linebtns = [{
        name: "编辑",
        clazz: "btn-yellow",
        handle: function(v) {

            signet.sid = v.sid;

            com.popup4model('#layerAdd', '编辑', null, function() {

                com.clearValidator();
            }, function() {

                editSignet(v);
            });
            return false;
        }
    }, {
        name: "更新",
        clazz: "btn-yellow",
        handle: function(v) {

            signet.sid = v.sid;

            com.popup4model('#layerAdd', '编辑', null, function() {

                com.clearValidator();
            }, function() {

                initUpdate(v);
            });
            return false;
        },
        show: function(v) {

            return (v.status == constant.data().signet.STATUS_INIT_INT);
        }
    }, {
        name: "注册",
        clazz: "btn-success",
        handle: function(v) {

            com.post(api.data.registSignet, {
                "signet.sid": v.sid
            }, function(res) {

                searcher.doSearch();
            });
            return false;
        },
        show: function(v) {

            return (v.status == constant.data().signet.STATUS_INIT_INT);
        }
    }, {
        name: "认证",
        clazz: "btn-warning",
        handle: function(v) {

            com.post(api.data.authSignet, {
                "signet.sid": v.sid
            }, function(res) {

                showQRCode(res.signet.path);
            });
            return false;
        },
        show: function(v) {

            return (v.status == constant.data().signet.STATUS_REGIST_INT);
        }
    }, {
        name: "确认",
        clazz: "btn-inverse",
        handle: function(v) {

            com.post(api.data.confirmSignet, {
                "signet.sid": v.sid
            }, function(res) {

                searcher.doSearch();
            });
            return false;
        },
        show: function(v) {

            return (v.status == 2);
        }
    }, {
        name: "签章",
        clazz: "btn-danger",
        handle: function(v) {

            com.post(api.data.signateSignet, {
                "signet.sid": v.sid,
                "signet.data": config.media + v.path
            }, function(res) {

                searcher.doSearch();
            });
            return false;
        },
        show: function(v) {

            return (v.status == 3);
        }
    }, {
        name: "自动授权",
        clazz: "btn-yellow",
        handle: function(v) {

            com.post(api.data.autoSignet, {
                "signet.sid": v.sid
            }, function(res) {

                com.popup("自动签认证", res.signet.path);
            });
            return false;
        },
        show: function(v) {

            return (v.status == 3);
        }
    }, {
        name: "二维授权",
        clazz: "btn-success",
        handle: function(v) {

            com.post(api.data.autoSignet, {
                "signet.sid": v.sid
            }, function(res) {

                showQRCode(res.signet.path);
            });
            return false;
        },
        show: function(v) {

            return (v.status == 3);
        }
    }, {
        name: "印章",
        clazz: "btn-info",
        handle: function(v) {

            params.data.signature = v;

            com.popup4page("#layerPopUp", "/views/data/signature.html", "印章")
            return false;
        },
        show: function(v) {

            return (v.status == 3);
        }
    }, {
        name: "复制",
        clazz: "btn-yellow",
        handle: function(v) {

            signet.sid = v.sid;

            com.popup4model('#copySignet', '复制', null, function() {

                com.clearValidator();
            }, function() {

                initUpdate(v);
            });
            return false;
        },
        show: function(v) {

            return (v.status == 3);
        }
    }, {
        name: "公司",
        clazz: "btn-success",
        handle: function(v) {

            signet.sid = v.sid;

            com.popup4model('#moveSignet', '切换公司', null, function() {

                com.clearValidator();
            });
            return false;
        },
        show: function(v) {

            return (v.status == 3);
        }
    }, {
        name: "作废",
        clazz: "btn-danger",
        handle: function(v) {

            com.showConfirm("是否确认作废 " + v.name + " 签章", function() {

                com.post(api.data.cancelSignet, {
                    "signet.sid": v.sid
                }, function(res) {

                    searcher.doSearch();
                });
            });
            return false;
        },
        show: function(v) {

            return v.status != 5;
        }
    }, ]

    searcher.line("name", lineprops, linebtns).render();

    com.focusPage("#addSignet").click(function(v) {

        addSignet(v);

        signet.sid = null;

        com.clearImg(signet.items.signetImg);
        com.cleanItems(signet.items);

        com.popup4model('#layerAdd', '添加', null, function() {

            com.clearValidator();
        });
    });

    function saveData() {

        if (com.validate('signetModal'))
            return false;

        var url = api.data.addSignet;
        var options = {
            "signet.no": signet.items.no.val(),
            "signet.name": signet.items.name.val(),
            "signet.keyword": signet.items.keyword.val(),
            "signet.type": signet.items.type.val(),
            "signet.path": signet.items.path.val(),
            "signet.data": config.server + signet.items.path.val(),
        }

        if (signet.sid) {
            options["signet.sid"] = signet.sid;

            url = api.data.updateSignet;
        }

        com.post(url, options, function(res) {

            com.closePopup();
            searcher.doSearch();
        });
    }

    function copyData() {

        if (com.validate('copySignetModal'))
            return false;

        var url = api.data.copySignet;
        var options = {
            "signet.sid": signet.sid,
            "signet.no": com.focusPage("#no", "#copySignetModal").val(),
            "signet.name": com.focusPage("#name", "#copySignetModal").val(),
        };

        com.post(url, options, function(res) {

            com.closePopup();
            searcher.doSearch();
        });
    }

    function moveData() {

        if (com.validate('moveSignetModal'))
            return false;

        var url = api.data.moveSignet;
        var options = {
            "signet.sid": signet.sid,
            "signet.company": signet.items.company.val(),
        };

        com.post(url, options, function(res) {

            com.closePopup();
            searcher.doSearch();
        });
    }

    function addSignet(v) {

        signet.items.no.prop('disabled', false);
        signet.items.path.prop('disabled', false);
    }

    function initUpdate(v) {

        signet.items.no.val(v.no).prop("disabled", false);
        signet.items.name.val(v.name);
        signet.items.keyword.val(v.keyword);
        signet.items.path.val(v.path).prop("disabled", false);
        signet.imgsrc = com.showImg(signet.items.signetImg, v.path, 150, 150, '', null, 0);
    }

    function editSignet(v) {

        signet.items.no.val(v.no).prop("disabled", true);
        signet.items.name.val(v.name);
        signet.items.keyword.val(v.keyword);
        signet.items.path.val(v.path).prop("disabled", true);
        signet.imgsrc = com.showImg(signet.items.signetImg, v.path, 150, 150, '', null, 0);
    }

    function showQRCode(url) {

        signet.items.qrcode.html("").qrcode({
            render: "canvas",
            width: 150,
            height: 150,
            text: url
        });

        signet.modals.qrcodeModal.modal('show');
    }

    function base64(img) {

        img.setAttribute("crossOrigin", 'Anonymous');

        var canvas = document.createElement("canvas");

        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext("2d");

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, img.width, img.height);

        return canvas.toDataURL("image/png", 1);
    }

});