jQuery(function ($) {
    var decorationContract = {
        items: {
            download: com.focusPage("#download"),
            viewpdf: com.focusPage("#viewpdf"),
            signet: com.focusPage("#signet")
        },
        btns: {
            saveBtn: com.focusPage('#saveBtn'),
            backBtn: com.focusPage("#backBtn"),
            register: com.focusPage("#register"),
            authentication: com.focusPage("#authentication"),
            sendAuth: com.focusPage("#sendAuth"),
            confirm: com.focusPage("#confirm"),
            saveBtnBalance: com.focusPage("#saveBtnBalance")
        },
        modals:{
            decorationContractModal: com.focusPage("#decorationContractModal")
        },
        status: {
            0: '初始',
            1: '待签订',
            2: '已签订',
            3: '失效',
            4: '归档'
        },
        customer: {
            customerName: com.focusPage("#customerName"),
            customerGender: com.focusPage("#customerGender"),
            customerPhone: com.focusPage("#customerPhone"),
            customerAddress: com.focusPage("#customerAddress"),
            customerRelationshipType: com.focusPage("#customerRelationshipType"),
            customerIdentity: com.focusPage("#customerIdentity")
        },
    };

    com.focusPage("#signature").jSignature();

    com.post(api.data.queryCustomerById, {"customer.cid": params.cid}, function (res) {
        var customer = res.customer;
        customerItems(customer);
    });

    paintingContract();

    function paintingContract(){

        com.post(api.decoration.queryDecorationContractByOrderId, {"decorationContract.orderId": params.decorationOrderId}, function (res) {
            com.focusPage("#customers").empty();
            var decorationContracts = res.decorationContracts;
            if (decorationContracts.length > 0) {
                $.each(decorationContracts, function (i, v) {
                    var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
                    var $liLine = $('<li></li>').addClass('item-orange clearfix');
                    var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.contract.name));
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

                    var btnView = $('<a></a>').addClass('btn btn-minier btn-danger').html('公司签');
                    var btnRevie = $('<a></a>').addClass('btn btn-minier btn-pink').html('客户签');
                    var btnLine = $('<a></a>').addClass('btn btn-minier btn-purple').html('查看');
                    var btnContract = $('<a></a>').addClass('btn btn-minier btn-yellow').html('归档');
                    var btnSignatureNotice = $('<a></a>').addClass('btn btn-minier btn-yellow').html('签章通知');
                    var btnSignNotice = $('<a></a>').addClass('btn btn-minier btn-success').html('签订通知');
                    var btnViewNotice = $('<a></a>').addClass('btn btn-minier btn-warning').html('查看通知');
                    var btnDownloadNotice = $('<a></a>').addClass('btn btn-minier btn-inverse').html('下载通知');

                    var propertyArr = [
                        ["订单编号: ", v.orderId, "grey"],
                        ["下载地址  : ", "", "grey"],
                        ["地址信息: ", "", "grey"],
                        ["状态: ", decorationContract.status[v.status], "grey"],
                        ["操作人: ", v.creater.currentName, "grey"],
                    ];

                    $.each(propertyArr, function (index, value) {
                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    $divBtnWrap.append(btnSignatureNotice).append(btnSignNotice).append(btnViewNotice).append(btnDownloadNotice).append(btnView).append(btnRevie).append(btnLine).append(btnContract);

                    $divBtnWrap.appendTo($h3);

                    $liLine.append($h3).append($ulProperty).appendTo($ul);

                    btnView.click(function () {
                        CompanySign(v.dcid);
                    });

                    btnRevie.click(function () {
                        CustomerSign(v.dcid);
                    });

                    btnLine.click(function () {
                        viewdecorationContract(v.dcid);
                    });

                    btnContract.click(function () {
                        FiledecorationContract(v.dcid);
                    });

                    btnSignatureNotice.click(function () {
                        SignatureNotice(v.dcid);
                    });

                    btnSignNotice.click(function () {
                        SignNotice(v.dcid);
                    });

                    btnViewNotice.click(function () {
                        ViewNotice(v.dcid);
                    });

                    btnDownloadNotice.click(function () {
                        DownloadNotice(v.dcid);
                    });

                    $ul.appendTo(com.focusPage("#customers"));
                });
            } else {
                var $resultList = com.focusPage("#customers");
                var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resultList);
                var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
                var $span = $('<span></span>').text('无可用数据提供').appendTo($mesg);
            }
        });
    }
    //跳转创建合同弹窗
    decorationContract.btns.saveBtn.on("click", function () {
        com.popup4page("#decorationContractPopUp","/views/decoration/addDecorationContract.html","创建合同", null, function (e) {
            paintingContract();
        });
    });
    //返回
    decorationContract.btns.backBtn.on("click", function () {
        com.switchPage(api.index.decorationIndex.url);
    });
    //注册按钮
    decorationContract.btns.register.on("click", function () {
        com.showConfirm("确定要注册吗?", function () {
            com.post(api.data.registerCustomer, {"customer.cid": params.cid}, function (res) {
                com.showAlert(com.info, "注册成功");
            });
        });
    });
    //认证按钮
    decorationContract.btns.authentication.on("click", function () {
        com.post(api.data.authCustomer, {"customer.cid" : params.cid}, function (res) {
            com.popup4frame("认证", res.redirect);
        });
    });
  //认证通知
    decorationContract.btns.sendAuth.on("click", function () {
        com.post(api.decoration.sendDecorationContractForAuth, {"decorationContract.orderId" : params.decorationOrderId}, function (res) {
            com.popup4frame("认证", res.redirect);
        });
    });
    //确认按钮
    decorationContract.btns.confirm.on("click", function () {
        com.showConfirm("是否确认?", function () {
            com.post(api.data.confirmCustomer, {"customer.cid": params.cid}, function (res) {
                var customer = res.customer;
                com.showAlert(com.info, "确认成功");
                customerItems(customer);
            });
        });
    });

    //签章通知
   function SignatureNotice(dcid) {
        com.showConfirm("是否发送签章通知?", function () {
            com.post(api.decoration.sendDecorationContract, {"decorationContract.dcid" : dcid,"decorationContract.type" : 1}, function (res) {
                com.showAlert(com.info, "发送成功");
            });
        });
    };

    //签订通知
    function SignNotice(dcid) {
        com.showConfirm("是否发送签订通知?", function () {
            com.post(api.decoration.sendDecorationContract, {"decorationContract.dcid" : dcid, "decorationContract.type" : 2}, function (res) {
                com.showAlert(com.info, "发送成功");
            });
        });
    };

    //合同查看通知
    function ViewNotice(dcid) {
        com.showConfirm("是否发送查看通知?", function () {
            com.post(api.decoration.sendDecorationContract, {"decorationContract.dcid" : dcid, "decorationContract.type" : 3}, function (res) {
                com.showAlert(com.info, "发送成功");
            });
        });
    };

    //合同下载通知
    function DownloadNotice(dcid) {
        com.showConfirm("是否发送下载通知?", function () {
            com.post(api.decoration.sendDecorationContract, {"decorationContract.dcid" : dcid, "decorationContract.type" : 4}, function (res) {
                com.showAlert(com.info, "发送成功");
            });
        });
    };

    //公司签按钮
    function CompanySign(dcid) {
        decorationContract.modals.decorationContractModal.modal("show");
        com.post(api.communion.querySignet, {}, function (res) {
            decorationContract.items.signet.bindData(res.signets, "sid", "name", false);
        });

        decorationContract.btns.saveBtnBalance.on('click', function () {
            com.showConfirm("是否确认公司签吗?", function () {
                com.post(api.decoration.signDecorationContractForCompany, {"decorationContract.dcid" : dcid, "signet.sid" : decorationContract.items.signet.val()}, function () {
                    com.showAlert(com.info, "确认成功");
                });
            });
            decorationContract.modals.decorationContractModal.modal("hide");
        });
    }

    //客户签按钮
    function CustomerSign(dcid){
        com.post(api.decoration.signDecorationContractForCustomer, {"decorationContract.dcid" : dcid, "customer.cid" : params.cid}, function (res) {
        	 com.popup4frame("客户签", res.redirect);
        });
    }
    //合同查看按钮
    function viewdecorationContract(dcid) {
        com.post(api.decoration.viewDecorationContract , {"decorationContract.dcid" : dcid}, function (res) {
        	com.popup4frame("合同查看", res.redirect);
        });
    }
    //合同归档按钮
    function FiledecorationContract(dcid) {
    	com.showConfirm("是否归档?", function () {
        com.post(api.decoration.filingDecorationContract , {"decorationContract.dcid" : dcid}, function () {
        	com.showAlert(com.info, "归档成功");
        });
    	});
    }

    function customerItems(customer) {
        decorationContract.customer.customerName.html(customer.name);
        decorationContract.customer.customerGender.html(customer.gender);
        decorationContract.customer.customerPhone.html(customer.phone  == "" ? "暂无" : customer.phone);
        decorationContract.customer.customerAddress.html(customer.address == "" ? "暂无" : customer.address);
        decorationContract.customer.customerRelationshipType.html(customer.relationshipType);
        decorationContract.customer.customerIdentity.html(customer.identity == "" ? "暂无" : customer.identity);
    }

});