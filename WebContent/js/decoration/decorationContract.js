jQuery(function ($) {
    
    var decorationContract = {
        items: {
            download: com.focusPage("#download"),
            viewpdf: com.focusPage("#viewpdf"),
            signet: com.focusPage("#signet"),
            
            qrcode: null,
        },
        btns: {
            saveBtn: com.focusPage('#saveBtn'),
            register: com.focusPage("#register"),
            authentication: com.focusPage("#authentication"),
            sendAuth: com.focusPage("#sendAuth"),
            confirm: com.focusPage("#confirm"),
            signBtn: com.focusPage("#signBtn", "#decorationContractModal"),
            backBtn: com.focusPage("#backBtn"),
        },
        modals:{
            qrcodeModal: null,
            decorationContractModal: com.focusPage("#decorationContractModal")
        },
        status: {
            0: '初始',
            1: '已签',
            2: '失效',
            3: '归档'
        },
        customer: {
            customerName: com.focusPage("#customerName", "#customer"),
            customerGender: com.focusPage("#customerGender", "#customer"),
            customerPhone: com.focusPage("#customerPhone", "#customer"),
            customerAddress: com.focusPage("#customerAddress", "#customer"),
            customerRelationshipType: com.focusPage("#customerRelationshipType", "#customer"),
            customerIdentity: com.focusPage("#customerIdentity", "#customer")
        },
        
        dcid: null,
        
        authFlag: false,
        
        pageType: params.urlLoadParams.depage,
    };
    
    decorationContract.modals.qrcodeModal = com.initForm("qrcodeModal", "二维码", [{"id": "qrcode", "type": "div", "clazz": "qrcode"}], []);
    decorationContract.items.qrcode = com.focusPage("#qrcode");

    com.post(api.data.queryCustomerById, {"customer.cid": params.cid}, function (res) {
        customerItems(res.customer);
        
        decorationContract.authFlag = res.customer.status == 1;
    });
    
    com.post(api.data.querySignet, {}, function (res) {
        decorationContract.items.signet.bindData(res.signets, "sid", "name", false);
    });
    
    if(decorationContract.pageType == "finance"){
        //com.focusPage("#customerInfo").hide();
        com.focusPage("#customerFunction").hide();
        com.focusPage("#contractFunction").hide();
    }

    paintingContract();

    function paintingContract(){

        com.post(api.decoration.queryDecorationContractByOrderId, {"decorationContract.orderId": params.decorationOrderId}, function (res) {
            
            com.focusPage("#contracts").empty();
            var decorationContracts = res.decorationContracts;
            
            if (decorationContracts.length > 0) {
                $.each(decorationContracts, function (i, v) {
                    var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
                    var $liLine = $('<li></li>').addClass('item-orange clearfix');
                    var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.contract.name));
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

                    var btnView = $('<a></a>').addClass('btn btn-minier btn-purple').html('查看');
                    var btnCom = $('<a></a>').addClass('btn btn-minier btn-info').html('公司签');
                    var btnCus = $('<a></a>').addClass('btn btn-minier btn-warning').html('客户签');
                    var btnSign = $('<a></a>').addClass('btn btn-minier btn-primary').html('已签');
                    var btnExpire = $('<a></a>').addClass('btn btn-minier btn-danger').html('失效');
                    var btnContract = $('<a></a>').addClass('btn btn-minier btn-primary').html('归档');
                    
                    var btnGraphNotice = $('<a></a>').addClass('btn btn-minier btn-yellow').html('签名通知');
                    var btnSignNotice = $('<a></a>').addClass('btn btn-minier btn-success').html('客签通知');
                    var btnViewNotice = $('<a></a>').addClass('btn btn-minier btn-purple').html('查看通知');
                    var btnDownloadNotice = $('<a></a>').addClass('btn btn-minier btn-inverse').html('下载通知');
                    
                    var btnViewQR = $('<a></a>').addClass('btn btn-minier btn-purple').html('二维查看');
                    var btnGraphQR = $('<a></a>').addClass('btn btn-minier btn-yellow').html('二维签名');
                    var btnSignQR = $('<a></a>').addClass('btn btn-minier btn-success').html('二维客签');

                    var propertyArr = [
                        ["订单编号: ", v.orderId, "grey"],
                        ["状态: ", decorationContract.status[v.status], "red"],
                        ["创建人: ", v.creater.currentName, "grey"],
                        ["签署人: ", v.signner.currentName, "grey"],
                        ["归档人: ", v.filinner.currentName, "grey"],
                        ["创建时间: ", v.createTime, "green"],
                        ["公司签时间: ", v.comsignTime, "green"],
                        ["签署时间: ", v.cussignTime, "green"],
                        ["归档时间: ", v.filingTime, "green"],
                    ];

                    $.each(propertyArr, function (index, value) {
                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });
                    
                    if(v.status == 0){
                        $divBtnWrap.append(btnView).append(btnCom).append(btnCus).append(btnSign).append(btnExpire).append(btnGraphNotice).append(btnSignNotice).append(btnGraphQR).append(btnSignQR);
                    }
                    if(v.status == 1){
                        $divBtnWrap.append(btnView).append(btnContract);
                    }

                    $divBtnWrap.appendTo($h3);

                    $liLine.append($h3).append($ulProperty).appendTo($ul);
                    
                    btnView.click(function () {
                        viewContract(v.dcid);
                    });

                    btnCom.click(function () {
                        companySign(v.dcid);
                    });

                    btnCus.click(function () {
                        customerSign(v.dcid);
                    });

                    btnSign.click(function () {
                        signContract(v.dcid);
                    });
                    
                    btnExpire.click(function () {
                        expireContract(v.dcid);
                    });

                    btnContract.click(function () {
                        filingContract(v.dcid);
                    });

                    btnGraphNotice.click(function () {
                        sendNotice("是否发送签章通知", v.dcid, 1);
                    });

                    btnSignNotice.click(function () {
                        sendNotice("是否发送签订通知", v.dcid, 2);
                    });

                    btnViewNotice.click(function () {
                        sendNotice("是否发送查看通知", v.dcid, 3);
                    });

                    btnDownloadNotice.click(function () {
                        sendNotice("是否发送下载通知", v.dcid, 4);
                    });
                    
                    btnViewQR.click(function(){
                        showQRCode(config.server + "/views/contract/redirect.html?dcid=" + v.dcid + "&type=1");
                    });
                    
                    btnGraphQR.click(function(){
                        showQRCode(config.server + "/views/contract/redirect.html?dcid=" + v.dcid + "&type=1");
                    });
                    
                    btnSignQR.click(function(){
                        showQRCode(config.server + "/views/contract/redirect.html?dcid=" + v.dcid + "&type=2");
                    });

                    $ul.appendTo(com.focusPage("#contracts"));
                });
            } else {
                var $resultList = com.focusPage("#contracts");
                var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resultList);
                var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
                var $span = $('<span></span>').text('无可用数据提供').appendTo($mesg);
            }
        });
    }
    
    decorationContract.btns.backBtn.on("click", function () {
        com.switchPage(params.historyPage);
    });
    
    //跳转创建合同弹窗
    decorationContract.btns.saveBtn.on("click", function () {
        
        if(!decorationContract.authFlag){
            com.showAlert(com.warning, "客户未认证");
            return false;
        }
        
        com.popup4page("#layerPopUp", "/views/decoration/decorationContract2create.html", "创建合同");
    });
    
    //注册按钮
    decorationContract.btns.register.on("click", function () {
        com.showConfirm("确定要注册吗?", function () {
            com.post(api.data.registCustomer, {"customer.cid": params.cid}, function (res) {
                com.showAlert(com.info, "注册成功");
            });
        });
    });
    
    //认证按钮
    decorationContract.btns.authentication.on("click", function () {
        com.post(api.data.authCustomer, {"customer.cid" : params.cid}, function (res) {
            //com.popup4frame("认证", res.redirect);
            showQRCode(res.redirect);
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
        com.post(api.data.confirmCustomer, {"customer.cid": params.cid}, function (res) {
            customerItems(res.customer);
        });
    });
    
    decorationContract.btns.signBtn.on('click', function () {
        
        com.post(api.decoration.signDecorationContractForCompany, {"decorationContract.dcid" : decorationContract.dcid, "signet.sid" : decorationContract.items.signet.val()});
        
        decorationContract.modals.decorationContractModal.modal("hide");
    });
    
    function sendNotice(title, dcid, type){
        com.showConfirm(title, function () {
            com.post(api.decoration.sendDecorationContract, {"decorationContract.dcid" : dcid,"decorationContract.type" : type});
        });
    }
    
    function showQRCode(url){
        
        console.log(url);
        decorationContract.items.qrcode.html("").qrcode({
            render: "canvas",
            width: 150,
            height: 150,
            text: url
        });
        
        decorationContract.modals.qrcodeModal.modal('show');
    }

    //公司签按钮
    function companySign(dcid) {
        decorationContract.dcid = dcid;
        decorationContract.modals.decorationContractModal.modal("show");
    }

    //客户签按钮
    function customerSign(dcid){
        com.post(api.decoration.signDecorationContractForCustomer, {"decorationContract.dcid" : dcid, "customer.cid" : params.cid}, function (res) {
        	 com.popup4frame("客户签", res.redirect);
        });
    }
    
    //合同查看按钮
    function viewContract(dcid) {
        com.post(api.decoration.viewDecorationContract , {"decorationContract.dcid" : dcid}, function (res) {
        	com.popup4frame("合同查看", res.redirect);
        });
    }
    //合同已签按钮
    function signContract(dcid) {
        com.showConfirm("是否已签合同?", function () {
            com.post(api.decoration.affixDecorationContract , {"decorationContract.dcid" : dcid}, function(){
                paintingContract();
            });
        });
    }
    
    // 合同失效按钮
    function expireContract(dcid) {
        com.showConfirm("是否失效合同?", function () {
            com.post(api.decoration.expireDecorationContract , {"decorationContract.dcid" : dcid}, function(){
                paintingContract();
            });
        });
    }
    
    //合同归档按钮
    function filingContract(dcid) {
    	com.showConfirm("是否归档?", function () {
            com.post(api.decoration.filingDecorationContract , {"decorationContract.dcid" : dcid}, function(){
                paintingContract();
            });
    	});
    }

    function customerItems(customer) {
        
        decorationContract.customer.customerName.text(customer.name);
        decorationContract.customer.customerGender.html(customer.gender);
        decorationContract.customer.customerPhone.html(customer.phone  == "" ? "暂无" : customer.phone);
        decorationContract.customer.customerAddress.html(customer.address == "" ? "暂无" : customer.address);
        decorationContract.customer.customerRelationshipType.html(customer.relationshipType);
        decorationContract.customer.customerIdentity.html(customer.identity == "" ? "暂无" : customer.identity);
    }

});