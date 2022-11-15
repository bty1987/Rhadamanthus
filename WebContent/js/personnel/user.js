$(function() {

    var user = {
        statusType: [],
        deptType: [],
        dutyTypeMap: {},
        saveBtn: null,
        cancelBtn: null,
        items: {},
        editLoginId: null,
        deptList: {},
        loginFlag: false,
        simpleAddUserModal: null,
        userPhoto: "",
        identityPathF: "",
        identityPathB: "",

        btn: {
            saveBtns: com.focusPage("#saveBtns").on("click", saveBtns),
            save: com.focusPage("#save").on("click", save),
        },

        modals: {
            pictureModal: com.focusPage("#pictureModal"),
            transferModal: com.focusPage("#transferModal"),
        },
        items: {
            userPhoto: com.focusPage("#userPhoto", "#pictureModal"),
            identityPathF: com.focusPage("#identityPathF", "#pictureModal"),
            identityPathB: com.focusPage("#identityPathB", "#pictureModal"),
        },
        postData: null,
        isExpert: true
    };

    var type = params['urlLoadParams'].type

    if (type == 'expert') {
        user.postData = 'userExpertPostData';
        user.isExpert = true;
    } else {
        user.postData = 'userPostData';
        user.isExpert = false;
    }

    user.simpleAddUserModal = com.focusPage("#simpleAddUserModal");
    user.simpleAddUserModal.on('hide.bs.modal', function(e) {

        com.cleanItems(user.items);
        com.closeTip();
    });

    user.modals.pictureModal.on('show.bs.modal', function(e) {

        com.cleanItems(user.items);
        com.clearValidator();
    });

    com.uploadify("#pictureUpload", "上传图片", api.common.uploadImg, 'btn btn-success blue col-md-12', '*.jpg;*.jpge;*.gif;*.png', {
        'uploadType': 0
    }, 1, function(data) {

        com.focusPage("#picture").val(data.resUrl);
        com.focusPage("#userPhoto").attr("href", com.showImg(com.focusPage("#showImg"), data.resUrl, 150, 150, ''));
    });

    com.uploadify("#pictureUpload1", "上传图片", api.common.uploadImg, 'btn btn-success blue col-md-12', '*.jpg;*.jpge;*.gif;*.png', {
        'uploadType': 0
    }, 1, function(data) {

        com.focusPage("#picture1").val(data.resUrl);
        com.focusPage("#identityPathF").attr("href", com.showImg(com.focusPage("#showImg1"), data.resUrl, 360, 260, ''));
    });

    com.uploadify("#pictureUpload2", "上传图片", api.common.uploadImg, 'btn btn-success blue col-md-12', '*.jpg;*.jpge;*.gif;*.png', {
        'uploadType': 0
    }, 1, function(data) {

        com.focusPage("#picture2").val(data.resUrl);
        com.focusPage("#identityPathB").attr("href", com.showImg(com.focusPage("#showImg2"), data.resUrl, 360, 260, ''));
    });

    user.modals.qrcodeModal = com.initForm("qrcodeModal", "二维码", [{
        "id": "Qrcode",
        "type": "div",
        "clazz": "qrcode"
    }], []);
    user.items.Qrcode = com.focusPage("#Qrcode");

    user.modals.importModal = com.initForm("importModal", "导入", [{
        "id": "import",
        "type": "div"
    }], []);
    user.items.import = com.focusPage("#import");

    user.modals.ddModal = com.initForm("ddModal", "钉钉部门", [{
        "id": "tree3",
        "type": "div",
        "clazz": "tree"
    }], [{
        "id": "savebtn",
        "clazz": "btn btn-primary",
        "name": "保存"
    }]);
    user.items.tree3 = com.focusPage("#tree3");

    user.modals.simpleAddUserModal = com.initForm("simpleAddUserModal", "添加员工", [{
        "id": "userName",
        "name": "姓名",
        "type": "text",
        "validator": "v_required v_name_cn"
    }, {
        "id": "currentName",
        "name": "现用名",
        "type": "text",
        "validator": "v_required"
    }, {
        "id": "gender",
        "name": "性别",
        "type": "switch",
        "validator": "v_required",
        "clazz": "gender"
    }, {
        "id": "identity",
        "name": "身份证号",
        "type": "text",
        "validator": "v_required v_identity"
    }, {
        "id": "phone",
        "name": "手机号",
        "type": "text",
        "validator": "v_required v_phones"
    },

    {
        "id": "loginId",
        "name": "用户名",
        "type": "text",
        "validator": "v_required v_name_en"
    }, {
        "id": "deptTypeSel",
        "name": "部门类型",
        "type": "select",
        "validator": "v_required"
    }, {
        "id": "deptSel",
        "name": "部门",
        "type": "select",
        "validator": "v_required"
    }, {
        "id": "dutySel",
        "name": "职位",
        "type": "select",
        "validator": "v_required"
    }, {
        "id": "statusSel",
        "name": "状态",
        "type": "select",
        "validator": "v_required"
    }, ], [{
        "id": "saveUserBtn",
        "clazz": "btn btn-primary",
        "name": "保存"
    }]);

    com.post(api.communion.queryDepartmentType, {}, function(res) {

        user.deptType = res.departmentTypes;
    }, null, false);

    var displayFunc = (function() {

        var renderList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function(i, v) {

                    var $liLine = $('<li></li>').addClass('item-orange clearfix');

                    var $urldiv = $('<div style="border: 1px solid #ccc ;float :left;"></div>').css("width", "75px").css("height", "75px").css("margin-right", "10px");
                    var img = $('<img />').css("margin-right", "20px").appendTo($urldiv);
                    com.showImg(img, v.userPhoto, 75, 75, '', null, 0);

                    var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + v.userName));
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

                    var $qrcode = $('<a></a>').addClass('btn btn-minier btn-yellow').html('二维码');
                    var $btnCheck = $('<a></a>').addClass('btn btn-minier btn-blue').html('查看');
                    var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-success').html('编辑');
                    var $addDD = $('<a></a>').addClass('btn btn-minier btn-warning').html('添加到钉钉');
                    var $updateDD = $('<a></a>').addClass('btn btn-minier btn-inverse').html('同步钉钉信息');
                    var $deleteDD = $('<a></a>').addClass('btn btn-minier btn-danger').html('从钉钉删除');
                    var $userexception = $('<a></a>').addClass('btn btn-minier btn-pink').html('工作经历');
                    var $btnlookContract = $('<a></a>').addClass('btn btn-minier btn-purple').html('查看合同');
                    var $btnlookEducation = $('<a></a>').addClass('btn btn-minier btn-yellow').html('教育信息');
                    var $btnlookOperation = $('<a></a>').addClass('btn btn-minier btn-blue').html('工作信息');
                    var $btnDetail = $('<a></a>').addClass('btn btn-minier btn-success').html('简单查看');
                    var $btnPrint = $('<a></a>').addClass('btn btn-minier btn-warning').html('打印');
                    var $btnPicture = $('<a></a>').addClass('btn btn-minier btn-purple').html('图片');
                    var $btnOffjob = $('<a></a>').addClass('btn btn-minier btn-inverse').html('离职');
                    var $btnTransfer = $('<a></a>').addClass('btn btn-minier btn-danger').html('调职');
                    var $btnContract = $('<a></a>').addClass('btn btn-minier btn-pink').html('合同');

                    var propertyArr = [["员工编号:", v.userId, "grey"], ["用户名:", v.loginId, "grey"], ["部门:", v.dept.name, "grey"], ["职位:", v.duty.name, "grey"], ["角色:", v.role.name, "grey"], ["联系方式:", v.phone, "grey"], ["身份证:", v.identity.replace(/(\d{6})\d{8}(\w{4})/, '$1********$2'), "grey"]];

                    $.each(propertyArr, function(index, value) {

                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    $qrcode.click(function() {

                        user.items.Qrcode.html("").qrcode({
                            render: "canvas", // 也可以替换为table
                            width: 150,
                            height: 150,
                            text: "fanglinserver:" + v.userId
                        });

                        user.modals.qrcodeModal.modal('show');
                    });

                    // 查看
                    $btnCheck.click(function() {

                        params.personel.userId = v.userId;
                        params.personel.isExpert = user.isExpert;
                        com.popup4page("#layerPopUp", api.index.userViewIndex.url, "查看");

                    });

                    $btnEdit.click(function() {

                        params.personel.userId = v.userId;
                        params.type = 1;
                        params.personel.isExpert = user.isExpert;
                        com.popup4page("#layerPopUp", api.index.userEditIndex.url, "编辑");
                    });

                    // 添加点击事件
                    $addDD.unbind().bind('click', function() {

                        com.focusPage('#ddModal').modal('show');

                        com.focusPage('#tree3').html("");
                        com.focusPage("#tree3").removeData("tree");
                        com.focusPage("#tree3").unbind('click');
                        var deptList = null;

                        com.post(api.dd.queryDDDepartment, {}, function(res) {

                            deptList = res.departments;
                        }, null, false);

                        if (deptList == null) {
                            return false;
                        }

                        var deptObj = {
                            '1': {
                                name: params.company.name,
                                type: 'folder',
                                id: params.company.no
                            }
                        }, didList = [];
                        // 获取所有叶子节点
                        $.each(deptList, function(i, v) {

                            didList.push(v.id);
                        });

                        $.each(deptList, function(i, v) {

                            if (v.parentid && didList.indexOf(v.parentid) != -1) {
                                didList.splice(didList.indexOf(v.parentid), 1);
                            }
                        });

                        // splice为删除了父类的id,余下的在didlist中的id为子节点的id
                        com.focusPage('#tree3').ace_tree({
                            dataSource: {
                                data: function(options, callback) {

                                    var $data = null;
                                    if (!("type" in options)) {
                                        $data = deptObj;// the root tree
                                        callback({
                                            data: $data
                                        });
                                        return;
                                    } else if ("type" in options && options.type == "folder") {
                                        if ("children" in options) {
                                            $data = options.children;
                                        } else {
                                            $data = getDeptByDid(options.id);
                                        }
                                    }

                                    if ($data != null) {
                                        setTimeout(function() {

                                            callback({
                                                data: $data
                                            });
                                        }, parseInt(Math.random() * 500) + 200);
                                    }
                                }
                            },
                            loadingHTML: '<div class="tree-loading"><i class="icon-refresh icon-spin blue"></i></div>',
                            'open-icon': 'icon-minus',
                            'close-icon': 'icon-plus',
                            'selectable': true,// 可选
                            'multiSelect': true, // 多选
                            'selected-icon': null,
                            'unselected-icon': null,
                            folderSelect: true,
                            cacheItems: false
                        }).on('selected', function(evt, opt) {

                        });

                        var getDeptByDid = function(did) {

                            var depts = {};
                            $.each(deptList, function(i, v) {

                                if (v.parentid == did) {
                                    depts[v.id] = {
                                        name: v.name,
                                        type: didList.indexOf(v.id) == -1 ? 'folder' : 'item',
                                        id: v.id
                                    }
                                }
                            });
                            return depts;
                        };

                        com.focusPage('#savebtn').unbind().bind('click', function() {

                            var items = com.focusPage('#tree3').tree('selectedItems');
                            var length = items.length;
                            com.focusPage('#ddModal').modal("hide");
                            var params = {
                                "user.userid": v.userId,
                                "user.name": v.currentName,
                                "user.Mobile": v.phone,
                                "user.Position": v.duty.name
                            };

                            if (length) {
                                for ( var i = 0; i < length; i++) {
                                    params["dids" + "[" + i + "]"] = items[i].id;
                                }
                            }

                            com.post(api.dd.queryDDUser, {
                                "user.userid": v.userId
                            }, function(res) {

                                if (res.user && res.user.userid != null) {
                                    com.post(api.dd.updateDDUser, params, function(data) {

                                        if ($.trim(data.errcode) == $.trim(0)) {
                                            com.showAlert(com.info, "更新成功");
                                        } else {
                                            com.showAlert(com.error, "更新失败");
                                        }
                                    });
                                } else {
                                    com.post(api.dd.addDDUser, params, function(data) {

                                        if ($.trim(data.errcode) == $.trim(0)) {
                                            com.showAlert(com.info, "创建成功");
                                        } else {
                                            com.showAlert(com.error, "创建失败");
                                        }
                                    });
                                }
                            }, null, false);
                        });

                        com.focusPage('#cancel').click(function() {

                            com.focusPage("#tree3").removeData("tree");
                        });
                    });

                    com.focusPage('#closeM').click(function() {

                        com.focusPage("#tree3").removeData("tree");
                    });
                    // 同步钉钉信息
                    $updateDD.click(function() {

                        var btn = $(this);
                        var span = btn.find('span');
                        btn.find('i').remove();
                        var loading = $('<i></i>').addClass('icon-spinner icon-spin white bigger-125');
                        span.prepend(loading);
                        var message = "<p>确定要将该员工信息同步到钉钉吗?</p>";
                        com.showConfirm(message, function(result) {

                            var selectedDepts = [];
                            var phone;
                            com.post(api.dd.queryDDUser, {
                                "user.userid": v.userId
                            }, function(res) {

                                selectedDepts = res.user.department;
                                phone = res.user.mobile;
                                if (selectedDepts == null) {
                                    com.showAlert(com.error, "该员工还没有添加到钉钉部门");
                                    return;
                                }

                                var params = {
                                    "user.userid": v.userId,
                                    "user.name": v.currentName,
                                    "user.Mobile": phone,
                                    "user.Position": v.duty.name,
                                    "dids": selectedDepts
                                };

                                com.post(api.dd.updateDDUser, params, function(data) {

                                    if ($.trim(data.errcode) == $.trim(0)) {
                                        com.showAlert(com.info, "更新成功");
                                    } else {
                                        com.showAlert(com.error, "更新失败");
                                    }
                                });
                            }, null, false);
                        });
                    });

                    $btnlookContract.click(function() {

                        params.personel.uid = v.uid;
                        com.popup4page("#layerPopUp", api.index.userContract.url, "合同信息");
                    });

                    $btnlookEducation.click(function() {

                        params.personel.uid = v.uid;
                        com.popup4page("#layerPopUp", api.index.userEducation.url, "教育信息");
                    });

                    $btnlookOperation.click(function() {

                        params.personel.uid = v.uid;
                        com.popup4page("#layerPopUp", api.index.userOperation.url, "工作信息");
                    });

                    $btnDetail.click(function() {

                        params.personel.userId = v.userId;
                        params.personel.uid = v.uid;
                        params.personel.isExpert = user.isExpert;
                        com.popup4page("#layerPopUp", api.index.userDetail.url, "人员信息");
                    });

                    $btnPrint.click(function() {

                        params.personel.userId = v.userId;
                        params.personel.uid = v.uid;
                        com.popup("方林装饰应聘登记表", api.index.userPrint.url, null, null, true);
                    });

                    $btnPicture.click(function() {

                        user.modals.pictureModal.modal("show");
                        params.personel.userId = v.userId;
                        params.personel.uid = v.uid;
                        initUser(v);

                    });

                    $btnOffjob.click(function() {

                        com.post(api.personel.quitUser, {
                            "user.userId": v.userId
                        }, function(v) {

                            com.showAlert(com.info, "离职成功");
                            userSeacher.doSearch();
                        });
                    });

                    $btnTransfer.click(function() {

                        user.modals.transferModal.modal("show");
                        params.personel.userId = v.userId;
                        transfer(v);
                        return false;
                    });

                    $btnContract.click(function() {

                        modalAgreementModal(v.userId, v.uid);
                    });

                    var modalAgreementModal = function(userId, uid) {

                        params.personel.userId = v.userId;

                        params.personel.uid = v.uid;

                        params.historyPage = api.index.userIndex.url;

                        com.switchPage(api.index.userContracts.url);
                    };

                    // 删除点击事件
                    $deleteDD.click(function() {

                        var btn = $(this);
                        var span = btn.find('span');
                        btn.find('i').remove();
                        var loading = $('<i></i>').addClass('icon-spinner icon-spin white bigger-125');
                        span.prepend(loading);
                        var message = "<p>确定要删除该员工吗?</p>";
                        com.showConfirm(message, function(result) {

                            com.post(api.dd.queryDDUser, {
                                "user.userid": v.userId
                            }, function(res) {

                                if (res.user.name != null) {
                                    com.post(api.dd.deleteDDUser, {
                                        "user.userid": v.userId
                                    }, function(data) {

                                        if ($.trim(data.errcode) == $.trim(0)) {
                                            com.showAlert(com.info, "删除成功");
                                        } else {
                                            com.showAlert(com.error, "删除失败");
                                        }
                                    });
                                } else {
                                    com.showAlert(com.error, "钉钉中没有该用户, 无法删除");
                                }
                            });
                        });
                    });

                    $userexception.unbind().bind('click', function() {

                        params.personel.uid = v.uid;
                        com.popup4page("#layerPopUp", api.index.userExperience.url, "工作经历");
                    });

                    if (type == 'expert' && v.status == constant.personel.user.STATUS_ONJOB_INT) {
                        $divBtnWrap.append($qrcode).append($btnCheck).append($btnEdit).append($addDD).append($updateDD).append($deleteDD).append($userexception).append($btnlookContract).append($btnlookEducation).append($btnlookOperation).append($btnDetail).append($btnPrint).append($btnPicture).append($btnOffjob).append($btnTransfer).append($btnContract).appendTo($h3);
                    } else if (type == 'expert' && v.status == constant.personel.user.STATUS_OFFJOB_INT || v.status == constant.personel.user.STATUS_KEEPJOB_INT) {
                        $divBtnWrap.append($btnCheck).append($btnEdit).append($userexception).append($btnlookContract).append($btnlookEducation).append($btnlookOperation).append($btnDetail).append($btnPrint).append($btnPicture).append($btnOffjob).append($btnTransfer).append($btnContract).appendTo($h3);
                    } else if (v.status == constant.personel.user.STATUS_OFFJOB_INT || v.status == constant.personel.user.STATUS_KEEPJOB_INT) {
                        $divBtnWrap.append($btnCheck).append($btnEdit).append($userexception).append($btnlookContract).append($btnlookEducation).append($btnlookOperation).append($btnDetail).append($btnPrint).append($btnPicture).append($btnOffjob).append($btnTransfer).appendTo($h3);
                    } else {
                        $divBtnWrap.append($qrcode).append($btnCheck).append($btnEdit).append($addDD).append($updateDD).append($deleteDD).append($userexception).append($btnlookContract).append($btnlookEducation).append($btnlookOperation).append($btnDetail).append($btnPrint).append($btnPicture).append($btnOffjob).append($btnTransfer).appendTo($h3);
                    }

                    $liLine.append($urldiv).append($h3).append($ulProperty).appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };
        return {
            init: function(tableId, listData) {

                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            }
        }
    })();

    var _condArr = ['personel-userId', 'personel-userName', 'personel-roleId', 'personel-deptId', 'personel-userstatus', 'personel-identity', 'personel-phone'];
    var userSeacher = new Searcher();

    userSeacher.init(_condArr, "condList", api.personel.pageUser, function(data) {

        displayFunc.init('resultList', data);
    }, "pagenation", user.postData, null, false, null, function() {

        var $addaS = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'addUserSimple').css("margin", "0px 3px");
        var $addiS = $('<i></i>').addClass('icon-plus bigger-110').appendTo($addaS);
        var $addspanS = $('<span></span>').text('添加-简化').appendTo($addaS);

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addUser').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        var $importa = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'import').css("margin", "0px 3px");
        var $importi = $('<i></i>').addClass('icon-upload bigger-110').appendTo($importa);
        var $importspan = $('<span></span>').text('上传').appendTo($importa);

        var $exporta = $('<a></a>').addClass('btn btn-minier btn-warning pull-left').attr('name', 'export').css("margin", "0px 3px");
        var $exporti = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($exporta);
        var $exportspan = $('<span></span>').text('导出').appendTo($exporta);

        var btns = [$addaS, $adda, $importa];
        user.isExpert ? btns.push($exporta) : btns; // 是否为员工-高级页面

        return btns;
    });

    com.focusPage('a[name="addUser"]', '#pagenation').click(function() {

        delete params.type;

        params.personel.userId = null;
        params.personel.isExpert = user.isExpert;

        com.popup4page("#layerPopUp", api.index.userEditIndex.url, "添加");
    });

    com.focusPage('a[name="addUserSimple"]', '#pagenation').click(function() {

        user.simpleAddUserModal.modal("show");
    });

    com.focusPage('a[name="import"]', '#pagenation').click(function() {

        user.modals.importModal.modal("show");
    });

    com.uploadify(user.items.import, "上传文件", api.salary.importUserSalary, 'btn btn-success col-sm-12', '*.xls;*.xlsx', {
        'uploadType': 4
    }, 1);

    com.focusPage('a[name="export"]', '#pagenation').click(function() {

        com.popup4page("#layerPopUp", api.index.userOutputIndex.url, "导出人员信息");
    });

    // 添加人员(简化版)
    user.saveBtn = com.focusPage("#saveUserBtn").on("click", saveData);
    user.cancelBtn = com.focusPage("#cancelUserBtn").on("click", function() {

        user.simpleAddUserModal.modal("hide");
    });

    user.items.loginId = com.focusPage("#loginId");
    user.items.userName = com.focusPage("#userName");
    user.items.currentName = com.focusPage("#currentName");
    user.items.gender = com.focusPage("#gender").switchBtn("gender");
    user.items.identity = com.focusPage("#identity");
    user.items.phone = com.focusPage("#phone");
    user.items.deptSel = com.focusPage("#deptSel");
    user.items.dutySel = com.focusPage("#dutySel");
    user.items.deptTypeSel = com.focusPage("#deptTypeSel");
    user.items.statusSel = com.focusPage("#statusSel");

    user.items.deptTypeSel.on("change", function(b, d) {

        com.post(api.system.queryDutyByDtid, {
            "duty.departmentType.dtid": $(this).val()
        }, function(res) {

            user.dutyTypeMap = res.dutys;
            user.items.dutySel.bindData(user.dutyTypeMap, "did", "name");
        });

        com.post(api.communion.queryDepartmentByDtid, {
            "dept.type.dtid": $(this).val()
        }, function(res) {

            user.items.deptSel.bindData(res.deptList, "did", "name");
            d && d();
        });

    }).trigger("change");

    user.items.deptTypeSel.bindData(user.deptType, "dtid", "name");
    user.items.statusSel.bindData(constant.personel.user.status.datas, "key", "value");

    function initUser(v) {

        com.focusPage("#picture").val(v.userPhoto);
        com.focusPage("#userPhoto").attr("href", com.showImg(com.focusPage("#showImg"), v.userPhoto, 150, 150, '', null));
        com.focusPage("#picture1").val(v.identityPathF);
        com.focusPage("#identityPathF").attr("href", com.showImg(com.focusPage("#showImg1"), v.identityPathF, 360, 260, '', null));
        com.focusPage("#picture2").val(v.identityPathB);
        com.focusPage("#identityPathB").attr("href", com.showImg(com.focusPage("#showImg2"), v.identityPathB, 360, 260, '', null));
    }

    function saveData() {

        if (com.validate("simpleAddUserModal")) {
            return false;
        }

        var loginId = user.items.loginId.val();

        com.post(api.personel.queryUserByLoginId, {
            "user.loginId": loginId
        }, function(res) {

            user.loginFlag = false;
            com.showTip(user.items.loginId, "用户名已存在", "right");
        }, function(res) {

            user.loginFlag = true;
        }, false);

        if (!user.loginFlag)
            return false;

        var options = {
            "userInfo.user.userName": user.items.userName.val().trim(),
            "userInfo.user.currentName": user.items.currentName.val(),
            "userInfo.user.gender": com.genderType[user.items.gender.prop("checked")],
            "userInfo.gender": user.items.gender.prop("checked") == true ? 0 : 1,
            "userInfo.user.identity": user.items.identity.val(),
            "userInfo.user.phone": user.items.phone.val(),
            "userInfo.user.loginId": user.items.loginId.val(),
            "userInfo.user.dtid": user.items.deptTypeSel.val(),
            "userInfo.user.dept.did": user.items.deptSel.val(),
            "userInfo.user.duty.did": user.items.dutySel.val(),
            "userInfo.user.status": user.items.statusSel.val(),
            "userInfo.salary": 0,
            "userInfo.fangliner.userId": "",
            "userInfo.entryTime": new Date().getFullYear() + "-" + utils.accAdd(new Date().getMonth(), 1) + "-" + new Date().getDate(),
            "userInfo.hometownAddress": "",
            "userInfo.address": "",
            "userInfo.bank": "",
            "userInfo.bankCardNum": "",
            "userInfo.isMarried": 1,
            "userInfo.isBirth": 1,
            "userInfo.isHouseLoan": 1,
            "userInfo.isCarLoan": 1,
            "userInfo.isCarID": 1,
            "userInfo.isPassID": 1,
            "userInfo.isHMID": 1,
            "userInfo.isTWID": 1,
            "userInfo.isPresentGraduate": 1,
            "userInfo.isInsurance": 1
        };

        com.post(api.personel.addUser, options, function(res) {

            com.showAlert(com.info, "操作成功");

            user.simpleAddUserModal.modal("hide");

            userSeacher.doSearch();
        });
    }

    function saveBtns() {

        var param = {
            "user.userId": params.personel.userId,
            "user.userPhoto": com.focusPage("#picture").val(),
            "user.identityPathF": com.focusPage("#picture1").val(),
            "user.identityPathB": com.focusPage("#picture2").val()
        };

        com.post(api.personel.updateUserForPhoto, param, function(res) {

            user.userPhoto = com.focusPage("#picture").val();
            user.identityPathF = com.focusPage("#picture1").val();
            user.identityPathB = com.focusPage("#picture2").val();

            com.showAlert(com.info, "操作成功");

            user.modals.pictureModal.modal("hide");

            userSeacher.doSearch();
        });
    }

    function removePicture() {

        com.focusPage("#showImg").attr("src", "#");
        com.focusPage("#picture").val("");
        com.focusPage("#userPhoto").attr("href", "javascript:void(0)");
    }

    function removePicture1() {

        com.focusPage("#showImg1").attr("src", "#");
        com.focusPage("#picture1").val("");
        com.focusPage("#identityPathF").attr("href", "javascript:void(0)");
    }

    function removePicture2() {

        com.focusPage("#showImg2").attr("src", "#");
        com.focusPage("#picture2").val("");
        com.focusPage("#identityPathB").attr("href", "javascript:void(0)");
    }

    user.items.dept = com.focusPage("#dept", "#transferModal");
    user.items.duty = com.focusPage("#duty", "#transferModal");
    user.items.deptType = com.focusPage("#deptType", "#transferModal");

    user.items.deptType.on("change", function(b, d) {

        com.post(api.system.queryDutyByDtid, {
            "duty.departmentType.dtid": $(this).val()
        }, function(res) {

            user.dutyTypeMap = res.dutys;
            user.items.duty.bindData(user.dutyTypeMap, "did", "name");
        });

        com.post(api.communion.queryDepartmentByDtid, {
            "dept.type.dtid": $(this).val()
        }, function(res) {

            user.items.dept.bindData(res.deptList, "did", "name");
            d && d();
        });

    }).trigger("change");

    user.items.deptType.bindData(user.deptType, "dtid", "name");

    function transfer(v) {

        user.items.deptType.val(v.dept.type.dtid).trigger("change", function() {

            user.items.dept.val(v.dept.did);
            user.items.duty.val(v.duty.did);
        }),

        user.modals.transferModal.modal("show");
    }

    function save() {

        if (com.validate('transferModal'))
            return false;

        var param = {
            "user.userId": params.personel.userId,
            "user.dtid": user.items.deptType.val(),
            "user.dept.did": user.items.dept.val(),
            "user.duty.did": user.items.duty.val(),
        };

        com.post(api.personel.tranUser, param, function(res) {

            com.showAlert(com.info, "调职成功");

            user.modals.transferModal.modal("hide");

            userSeacher.doSearch();
        });
    }
    ;

});