jQuery(function ($) {

    var droup = {

        btns: {
            saveBtn: com.focusPage("#saveBtn").on("click", saveData),
            saveUser: com.focusPage("#saveUser").on("click", addUser),
        },

        modals: {
            droupModal: com.focusPage("#droupModal"),
            bindModal: com.focusPage("#bindModal"),
            addModal: com.focusPage("#addModal"),
        },

        items: {
            itemlist: com.focusPage("#itemlist", "#droupModal"),
            orderId: com.focusPage("#orderId", "#bindModal"),
            name: com.focusPage("#name", "#bindModal"),
            user: com.focusPage("#user", "#addModal"),
            enter: com.focusPage("#enter"),
            path: com.focusPage("#path"),
        },
        did: null,
        orderId: null,
        status: {},
        isHandle: {},
        count: 1,
        or: 0, // 0:数据可继续加载 1:数据已加载完 跳出
    };

    // 关闭对话时,重置page页数和数据是否可加载
    droup.modals.droupModal.on('hide.bs.modal', function (e) {

        droup.count = 1;
        droup.or = 0;
        com.cleanItems(droup.items);
        com.focusPage("#itemlist").html("");
        com.clearValidator();
        com.closeTip();
    });

    droup.modals.addModal.on('hide.bs.modal', function (e) {
        droup.did = null;
        com.clearValidator();
        com.cleanTypeahead("user");
        com.cleanItems(droup.items);
        com.closeTip();
    });

    com.initTypeahead('user', api.personel.queryUserByPinyin, "pinyinName", {
        "departmentType.name": "",
        "user.status": 0
    }, "autoFillKeyValue", "key", "value", null);


    com.post(api.ds.customer, {}, function (res) {
        droup.status = res.droupStatus.split("key", "value");
        droup.isHandle = res.droupIsHandle.split("key", "value");
    }, null, false);

    function line(v) {

        var sevenDiv = $('<div class="itemdiv dialogdiv"></div>');
        var eightDiv = $('<div class="user"></div>').appendTo(sevenDiv);

        var img = $('<img src="assets/altogether/images/avatar2.png"/>').appendTo(eightDiv);
        com.showImg(img, v.creater.userPhoto, 50, 50, '');
        var nineDiv = $('<div class="body"></div>').appendTo(sevenDiv);
        var tenDiv = $('<div class="time"></div>').appendTo(nineDiv);
        var time = $('<i class="icon-time"></i>').appendTo(tenDiv);
        var span = $('<span class="green"></span>').html(v.createTime).appendTo(tenDiv);

        // 判断当前对话类型 0.文本 1.图片 2.应用
        if (v.type == 0) {
            var twelveDiv = $('<div class="text"></div>').html(v.content).appendTo(nineDiv);
            var thirteenDiv = $('<div class="tools"></div>').appendTo(nineDiv);
            var a = $('<a class="btn btn-minier" name="remove">删除</a>').appendTo(thirteenDiv);
        } else if (v.type == 1) {
            var photo = $('<img class="text" style="width: 250px; height: 150px" />').appendTo(nineDiv);
            com.showImg(photo, v.path, 250, 150, '', null, 0);
            var eighteenDiv = $('<div class="tools"></div>').appendTo(nineDiv);
            var a = $('<a class="btn btn-minier" name="remove">删除</a>').appendTo(eighteenDiv);
        }
        return sevenDiv;
    }

    function show(v) {

        droup.modals.droupModal.modal("show");
        com.post(api.customer.pageConversation, {
            "paging.page": droup.count,
            "paging.rows": 10,
            "filters[0].field": "orderId",
            "filters[0].data": v.decoration.orderId,
            "filters[0].op": "eq"
        }, function (res) {

            if (res.paging.data.length < 10) {
                droup.or = 1;
            }

            var oneDiv = $('<div class="widget-main no-padding" style="text-align:center;"></div>').appendTo(droup.items.itemlist);
            var sixDiv = $('<div class="dialogs" id="scrollDiv" style="overflow-y: scroll; overflow-x: hidden; height: 600px"></div>').appendTo(oneDiv);
            $.each(res.paging.data, function (i, v) {

                sixDiv.prepend(line(v));
                $("a[name='remove']").click(function () {

                    var _sevenDiv = $(this).parents(".dialogdiv");

                    var url = api.customer.deleteConversation;
                    var options = {
                        "conversation.cid": v.cid,
                    };
                    com.post(url, options, function (res) {

                        com.showAlert(com.info, "操作成功");
                    });
                    _sevenDiv.remove();
                });
            });
            var form = $('<form></form>').appendTo(oneDiv);
            var fourteen = $('<div class="form-actions"></div>').appendTo(form);
            var fifteen = $('<div class="input-group"></div>').appendTo(fourteen);
            var input = $('<input placeholder="请输入" type="text" class="form-control" id="enter" name="message">').appendTo(fifteen);
            var sp = $('<span class="input-group-btn"></span>').appendTo(fifteen);
            var btn = $('<button class="btn btn-sm btn-info no-radius" type="button" id="sendBtn">发送</button>').appendTo(sp);
            var a = $('<a style="margin-left: 2px" id = "droupUpload"></a>').appendTo(sp);
            com.focusPage("#sendBtn").click(function () {

                if (com.focusPage("#enter").val() == '')
                    return false;
                var url = api.customer.responseConversation;
                var options = {
                    "conversation.orderId": v.decoration.orderId,
                    "conversation.type": 0,
                    "conversation.content": com.focusPage("#enter").val(),
                    "conversation.path": "",
                    "conversation.width": 0,
                    "conversation.height": 0,
                };
                com.post(url, options, function (res) {

                    var item = line(res.conversation);

                    sixDiv.append(item);
                    $('#scrollDiv').scrollTop($('#scrollDiv')[0].scrollHeight)
                });
                com.focusPage("#enter").val('');
            });

            com.uploadify("#droupUpload", "图片", api.common.uploadImg, 'btn btn-success', '*.jpg;*.jpeg;*.gif;*.png', {
                'uploadType': 0
            }, 1, function (data) {

                var url = api.customer.responseConversation;
                var options = {
                    "conversation.orderId": v.decoration.orderId,
                    "conversation.type": 1,
                    "conversation.content": "",
                    "conversation.path": data.resUrl,
                    "conversation.width": 250,
                    "conversation.height": 150,
                };
                com.post(url, options, function (res) {

                    var item = line(res.conversation);
                    sixDiv.append(item);
                });
            });
            $($('#scrollDiv')[0]).scroll(function () {

                if (this.scrollTop <= 0) {
                    if (droup.or == 1)
                        return false;
                    droup.count += 1;
                    com.post(api.customer.pageConversation, {
                        "paging.page": droup.count,
                        "paging.rows": 10,
                        "filters[0].field": "orderId",
                        "filters[0].data": v.decoration.orderId,
                        "filters[0].op": "eq"
                    }, function (res) {
                        if (droup.count < res.paging.totalPage){
                            $.each(res.paging.data, function (i, v) {

                                sixDiv.prepend(line(v));
                            });
                        }
                        if (res.paging.data.length < 10) {
                            droup.or = 1;
                        }

                    });
                }
            });
        });
    }

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.customer.pageDroup);

    searcher.condition(['customer-droup-orderId', 'customer-v-name', 'customer-droup-status', 'customer-droup-updateTime', 'customer-droup-handleTime', 'customer-droup-isHandle']);

    searcher.button([{
        id: "bindDroup",
        name: "绑定",
        clazz: "btn-yellow",
        icon: "icon-plus"
    }]);

    var lineprops = [{
        fieId: "name",
        name: "客户名称",
        prop: "decoration.customer.name",
        clazz: "grey"
    }, {
        field: "orderId",
        name: "装修单号",
        prop: "decoration.orderId",
        clazz: "grey"
    }, {
        fieId: "orderAddr",
        name: "楼盘地址",
        prop: "decoration.house.village.name " + "decoration.house.houseNumber",
        clazz: "grey"
    }, {
        fieId: "designer",
        name: "设计师",
        prop: "decoration.designer.currentName",
        clazz: "grey"
    }, {
        fieId: "salesman",
        name: "业务员",
        prop: "decoration.salesman.currentName",
        clazz: "grey"
    }, {
        fieId: "escorter",
        name: "跟单员",
        prop: "decoration.escorter.currentName",
        clazz: "grey"
    }, {
        fieId: "supervisor",
        name: "监理",
        prop: "decoration.supervisor.currentName",
        clazz: "grey"
    }, {
        field: "updateTime",
        name: "更新时间",
        prop: "updateTime",
        clazz: "green"
    }, {
        field: "handleTime",
        name: "处理时间",
        prop: "handleTime",
        clazz: "green"
    }, {
        fieId: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: droup.status
    }, {
        fieId: "isHandle",
        name: "处理状态",
        prop: "isHandle",
        clazz: "red",
        dataset: droup.isHandle
    },];

    var linebtns = [{
        name: "对话",
        clazz: "btn-yellow",
        handle: function (v) {

            droup.did = v.did;
            droup.orderId = v.decoration.orderId;
            show(v);
            return false;
        }
    }, {
        name: "删除",
        clazz: "btn-danger",
        handle: function (v) {

            var url = api.customer.deleteDroup;
            var options = {
                "droup.did": v.did,
            };
            com.post(url, options, function (data) {

                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
            });
            return false;
        },
    }, {
        name: "添加人员",
        clazz: "btn-success",
        handle: function (v) {
            droup.did = v.did;
            droup.modals.addModal.modal("show");
        },
    }];

    searcher.line(function (v) {

        return v.decoration.orderId + '-' + v.name
    }, lineprops, linebtns).render();

    com.focusPage('#bindDroup', '#pagenation').on("click", function () {

        droup.modals.bindModal.modal("show");
    });

    function saveData() {

        if (com.validate('bindModal'))
            return false;

        var url = api.customer.bindDroup;
        var orderId = droup.items.orderId.val();
        var options = {
            "droup.decoration.orderId": orderId,
            "droup.name": droup.items.name.val(),
        };
        com.post(url, options, function (res) {

            searcher.doSearch();
        });
        droup.modals.bindModal.modal("hide");
    }
    
    function addUser() {

        if (com.validate('addModal'))
            return false;
        var url = api.customer.updateDroup;
        var options = {
            "droup.did": droup.did,
            "droup.userId": com.typeahead("user")
        };
        com.post(url, options, function (res) {

            searcher.doSearch();
        });
        droup.did = null;
        droup.modals.addModal.modal("hide");
    }
});
