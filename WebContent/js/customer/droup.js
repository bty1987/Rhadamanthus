jQuery(function($) {

    var droup = {

        btns: {
            saveBtn: com.focusPage("#saveBtn").on("click", saveData),
            saveUser: com.focusPage("#saveUser").on("click", addUser)
        },

        modals: {
            droupModal: com.focusPage("#droupModal"),
            bindModal: com.focusPage("#bindModal"),
            addModal: com.focusPage("#addModal")
        },

        items: {
            itemlist: com.focusPage("#itemlist", "#droupModal"),
            searchers: com.focusPage("#searchers", "#droupModal"),
            orderId: com.focusPage("#orderId", "#bindModal"),
            name: com.focusPage("#name", "#bindModal"),
            chatId: com.focusPage("#chatId", "#bindModal"),
            type: com.focusPage("#type", "#bindModal"),
            user: com.focusPage("#user", "#addModal"),
            enter: com.focusPage("#enter"),
            path: com.focusPage("#path")
        },
        searType: 0,
        content: null,
        searTime: null,
        did: null,
        orderId: null,
        status: {},
        isHandle: {},
        contype: {},
        count: 1,
        or: 0, // 0:数据可继续加载 1:数据已加载完 跳出
    };
    var options = {}
    var url = api.customer.pageConversation
    // 关闭对话时,重置page页数和数据是否可加载
    droup.modals.droupModal.on('hide.bs.modal', function(e) {

        droup.count = 1;
        droup.or = 0;
        droup.content = null;
        droup.searTime = null;
        com.cleanItems(droup.items);
        com.focusPage("#itemlist").html("");
        com.focusPage("#searchers").html("");
        com.clearValidator();
        com.closeTip();
        options = {};
    });

    droup.modals.addModal.on('hide.bs.modal', function(e) {

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

    droup.items.type.bindData(constant.customer().droup.dType.datas, "key", "value");

    function line(v) {

        if (v.contype == constant.customer().droup.TYPE_CUSTOMER_INT) {
            var sevenDiv = $('<div class="itemdiv dialogdiv customer"></div>');
        } else if (v.contype == constant.customer().droup.TYPE_RENOVATION_INT) {
            var sevenDiv = $('<div class="itemdiv dialogdiv decoration"></div>');
        } else if (v.contype == constant.customer().droup.TYPE_MATERIAL_INT) {
            var sevenDiv = $('<div class="itemdiv dialogdiv material"></div>');
        } else if (v.contype == constant.customer().droup.TYPE_ENGINEERING_INT) {
            var sevenDiv = $('<div class="itemdiv dialogdiv project"></div>');
        } else if (v.contype == constant.customer().droup.TYPE_MONEY_INT) {
            var sevenDiv = $('<div class="itemdiv dialogdiv payment"></div>');
        } else if (v.contype == constant.customer().droup.TYPE_OTHER_INT) {
            var sevenDiv = $('<div class="itemdiv dialogdiv rests"></div>');
        }

        var eightDiv = $('<div class="user"></div>').appendTo(sevenDiv);
        var img = $('<img src="assets/altogether/images/avatar2.png"/>').appendTo(eightDiv);
        com.showImg(img, v.creater.userPhoto, 50, 50, '');
        var nineDiv = $('<div class="body" style="border: 2px solid #fee188"></div>').appendTo(sevenDiv);

        var tenDiv = $('<div class="time"></div>').appendTo(nineDiv);
        var time = $('<i class="icon-time"></i>').appendTo(tenDiv);
        var nameDiv = $('<div class="name" style="text-align: left;"></div>').appendTo(nineDiv);
        var namea = $('<a href="#"></a>').html(v.name).appendTo(nameDiv);

        var span = $('<span class="green"></span>').html(v.createTime).appendTo(tenDiv);
        var contype = $('<a style="margin-left: 5px; color: #000000"></a>').html(droup.contype[v.contype]).appendTo(tenDiv);

        // 0: 客户 1: 装修 2: 主材 3: 工程 4: 款项 5: 其他
        if (v.contype == constant.customer().droup.TYPE_RENOVATION_INT) {
            nineDiv.css("border-color", "#9585bf")
        } else if (v.contype == constant.customer().droup.TYPE_MATERIAL_INT) {
            nineDiv.css("border-color", "#a0a0a0");
        } else if (v.contype == constant.customer().droup.TYPE_ENGINEERING_INT) {
            nineDiv.css("border-color", "#d6487e");
        } else if (v.contype == constant.customer().droup.TYPE_MONEY_INT) {
            nineDiv.css("border-color", "#d15b47");
        } else if (v.contype == constant.customer().droup.TYPE_OTHER_INT) {
            nineDiv.css("border-color", "#303030");
        }

        // 判断当前对话类型 0: 文本 1: 图片 2: 应用 3: 语音
        if (v.type == constant.customer().droup.TYPE_TEEXT_INT) {

            var twelveDiv = $('<div class="text" style="width: 100%"></div>').html(v.content).appendTo(nineDiv);
            var thirteenDiv = $('<div class="tools"></div>').appendTo(nineDiv);
            // var a = $('<a class="btn btn-minier" name="remove">删除</a>').appendTo(thirteenDiv);
        } else if (v.type == constant.customer().droup.TYPE_PICTURE_INT) {
            var photo = $('<img class="text" style="width: 250px; height: 150px"/>');
            var photoA = $('<a></a>').attr("name", "drawing").append(photo).appendTo(nineDiv);
            com.popup4photos($('[name = "drawing"]'));
            var or = v.path.indexOf("group");
            if (or == 0) {
                com.showImg(photo, v.path, 250, 150, '', null, 0);

            } else if (or == -1) {
                com.showImg(photo, v.path, 0, 0, '250x150', null, 1);
            }

            var eighteenDiv = $('<div class="tools"></div>').appendTo(nineDiv);

            // var a = $('<a class="btn btn-minier" name="remove">删除</a>').appendTo(eighteenDiv);

        } else if (v.type == constant.customer().droup.TYPE_VOICE_INT) {

            var textDiv = $('<div class="text"></div>').html(v.content).appendTo(nineDiv);
            var radioDiv = $('<audio width="100%" controls></audio>').appendTo(nineDiv);
            var sourceDiv = $('<source src="' + config.media + v.path + '" type="audio/mpeg">').appendTo(radioDiv);
            var eighteenDiv = $('<div class="tools"></div>').appendTo(nineDiv);
            // var a = $('<a class="btn btn-minier" name="remove">删除</a>').appendTo(eighteenDiv);
        } else if (v.type == 4) {
            var textDiv = $('<div class="text"></div>').html(v.content).appendTo(nineDiv);
            var radioDiv = $('<video width="80%" controls></video>').appendTo(nineDiv);
            var sourceDiv = $('<source src="' + config.media + v.path + '" type="video/mp4">').appendTo(radioDiv);
            var eighteenDiv = $('<div class="tools"></div>').appendTo(nineDiv);
            // var a = $('<a class="btn btn-minier" name="remove">删除</a>').appendTo(eighteenDiv);
        }

        return sevenDiv;
    }

    function show(v) {

        droup.modals.droupModal.modal("show");

        options["paging.page"] = droup.count
        options["paging.rows"] = 10
        options["filters[0].field"] = "orderId"
        options["filters[0].data"] = droup.orderId
        options["filters[0].op"] = "eq"
        var count = $('<div style="text-align:center; margin-top: 8px"></div>').appendTo(droup.items.searchers);
        var aCount = $('<label></label>').html("内容:").appendTo(count);
        var iCount = $('<input id="countText" type="text" style="width: 150px; margin-left: 5px">').appendTo(aCount);
        var aTime = $('<label style="margin-left: 8px"></label>').html("发送时间:").appendTo(count);
        var iTime = $('<input type="text" id="timeSear" style="width: 150px; margin-left: 5px">').appendTo(aTime);
        var searButton = $('<button class="btn btn-xs btn-info btn-search" id="countSear" style="margin-left: 16px">查询</button>').appendTo(count);
        var resetButton = $('<button class="btn btn-xs btn-danger btn-clean" id="resetButton" style="margin-left: 4px">重置</button>').appendTo(count);
        com.datetime(com.focusPage("#timeSear"), "data", true);
        com.focusPage("#countText").val(droup.content);
        com.focusPage("#timeSear").val(droup.searTime);

        com.post(url, options, function(res) {

            if (res.paging.data.length < 10) {
                droup.or = 1;
            }

            var oneDiv = $('<div class="widget-main no-padding" style="text-align:center;"></div>').appendTo(droup.items.itemlist);
            var sixDiv = $('<div class="dialogs" id="scrollDiv" style="overflow-y: scroll; overflow-x: hidden; height: 600px"></div>').appendTo(oneDiv);

            $.each(res.paging.data, function(i, v) {

                sixDiv.prepend(line(v));
                com.popup4photos($('[name = "drawing"]'));
                // if (droup.searType == 1){
                // com.focusPage("#upclick").click(function (){
                //
                // com.focusPage("#itemlist").empty();
                // com.focusPage("#searchers").empty();
                // options = {}
                // options["conversation.cid"] = v.cid
                // options["conversation.content"] = v.content
                // options["conversation.orderId"] = droup.orderId
                // url = api.customer.pageConversationForContent
                // show(v)
                // })
                // }

                $("a[name='remove']").click(function() {

                    var _sevenDiv = $(this).parents(".dialogdiv");

                    var url = api.customer.deleteConversation;
                    var options = {
                        "conversation.cid": v.cid
                    };
                    com.post(url, options, function(res) {

                        com.showAlert(com.info, "操作成功");
                    });
                    _sevenDiv.remove();
                });
            });
            // var box = $('<div></div>').appendTo(oneDiv);
            // var buttonOne = $('<button class="btn btn-minier btn-yellow" type="button" id="saveOne" style="width: 50px; height: 30px">客户</button>').appendTo(box);
            // var buttonTwo = $('<button class="btn btn-minier btn-purple" type="button" id="saveTwo" style="margin-left: 10px; width: 50px; height: 30px">装修</button>').appendTo(box);
            // var buttonThree = $('<button class="btn btn-minier btn-grey" type="button" id="saveThree" style="margin-left: 10px; width: 50px; height: 30px">主材</button>').appendTo(box);
            // var buttonFour = $('<button class="btn btn-minier btn-pink" type="button" id="saveFour" style="margin-left: 10px; width: 50px; height: 30px">工程</button>').appendTo(box);
            // var buttonFive = $('<button class="btn btn-minier btn-danger" type="button" id="saveFive" style="margin-left: 10px; width: 50px; height: 30px">款项</button>').appendTo(box);
            // var buttonSix = $('<button class="btn btn-minier btn-inverse" type="button" id="saveSix" style="margin-left: 10px; width: 50px; height: 30px">其他</button>').appendTo(box);

            // com.focusPage("#saveOne").click(function() {
            //
            // com.focusPage(".customer").toggle();
            // });
            // com.focusPage("#saveTwo").click(function() {
            //
            // com.focusPage(".decoration").toggle();
            // });
            // com.focusPage("#saveThree").click(function() {
            //
            // com.focusPage(".material").toggle();
            // });
            // com.focusPage("#saveFour").click(function() {
            //
            // com.focusPage(".project").toggle();
            // });
            // com.focusPage("#saveFive").click(function() {
            //
            // com.focusPage(".payment").toggle();
            // });
            // com.focusPage("#saveSix").click(function() {
            //
            // com.focusPage(".rests").toggle();
            // });
            // var form = $('<form></form>').appendTo(oneDiv);
            // var fourteen = $('<div class="form-actions"></div>').appendTo(form);
            var fifteen = $('<div class="input-group"  style="margin-top: 10px"></div>').appendTo(oneDiv);
            var input = $('<input placeholder="请输入" type="text" class="form-control" id="enter" name="message">').appendTo(fifteen);
            var sp = $('<span class="input-group-btn"></span>').appendTo(fifteen);
            var btn = $('<button class="btn btn-sm btn-info no-radius" type="button" id="sendBtn">发送</button>').appendTo(sp);
            var a = $('<a style="margin-left: 2px" id = "droupUpload"></a>').appendTo(sp);
            input.hide();
            sp.hide();
            com.focusPage("#sendBtn").click(function() {

                if (com.focusPage("#enter").val() == '')
                    return false;
                var url = api.customer.responseConversation;
                var options = {
                    "conversation.orderId": v.decoration.orderId,
                    "conversation.type": 0,
                    "conversation.contype": 5,
                    "conversation.content": com.focusPage("#enter").val(),
                    "conversation.path": "",
                    "conversation.width": 0,
                    "conversation.height": 0
                };
                com.post(url, options, function(res) {

                    var item = line(res.conversation);

                    sixDiv.append(item);

                    $('#scrollDiv').scrollTop($('#scrollDiv')[0].scrollHeight);
                });
                com.focusPage("#enter").val('');
            });

            com.uploadify("#droupUpload", "图片", api.common.uploadImg, 'btn btn-success', '*.jpg;*.jpeg;*.gif;*.png', {
                'uploadType': 0
            }, 1, function(data) {

                var url = api.customer.responseConversation;
                var options = {
                    "conversation.orderId": v.decoration.orderId,
                    "conversation.type": 1,
                    "conversation.contype": 5,
                    "conversation.content": "",
                    "conversation.path": data.resUrl,
                    "conversation.width": 250,
                    "conversation.height": 150,
                    "conversation.filesize": data.filesize
                };
                com.post(url, options, function(res) {

                    var item = line(res.conversation);
                    sixDiv.append(item);
                });
            });
            $($('#scrollDiv')[0]).scroll(function() {

                if (this.scrollTop <= 0) {

                    if (droup.or == 1)
                        return false;

                    droup.count += 1;
                    options["paging.page"] = droup.count
                    com.post(url, options, function(res) {

                        if (droup.count <= res.paging.totalPage) {
                            $.each(res.paging.data, function(i, v) {

                                sixDiv.prepend(line(v));
                                $("a[name='remove']").click(function() {

                                    var _sevenDiv = $(this).parents(".dialogdiv");

                                    var url = api.customer.deleteConversation;
                                    var options = {
                                        "conversation.cid": v.cid
                                    };
                                    com.post(url, options, function(res) {

                                        com.showAlert(com.info, "操作成功");
                                    });
                                    _sevenDiv.remove();
                                });
                            });
                        }
                        if (res.paging.data.length < 10) {
                            droup.or = 1;
                        }
                    });
                }
            });

        });

        com.focusPage("#countSear").click(function() {

            var i = 1
            droup.content = com.focusPage("#countText").val();
            droup.searTime = com.focusPage("#timeSear").val();

            if (com.focusPage("#countText").val() != "") {
                options["filters[" + i + "].field"] = "content"
                options["filters[" + i + "].data"] = droup.content
                options["filters[" + i + "].op"] = "cn"
                i += 1
            }
            if (com.focusPage("#timeSear").val() != "") {
                options["filters[" + i + "].field"] = "searTime"
                options["filters[" + i + "].data"] = droup.searTime
                options["filters[" + i + "].op"] = "cn"
                options["filters[" + i + "].inputValue"] = droup.searTime
            }
            com.focusPage("#itemlist").empty();
            com.focusPage("#searchers").empty();
            droup.count = 1
            show(v)
        });
        com.focusPage("#resetButton").click(function() {

            com.focusPage("#countText").val("");
            com.focusPage("#timeSear").val("");
            droup.or = 0
            options = {}
        })
    }

    // 获取页面控制参数(按公司差异化配置)
    var pageConfig = customerPage.getConfig("droup");

    // pageBtn 配置为空时, 所有按钮按原逻辑显示; 否则需在 pageBtn 中存在
    function btnVisible(key) {

        return pageConfig.pageBtn.length == 0 || pageConfig.pageBtn.contains(key);
    }

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", pageConfig.apiPage || api.customer.pageDroup);
    searcher.history("droupPostData");
    searcher.condition(pageConfig.condArr.length > 0 ? pageConfig.condArr : ['customer-droup-orderId', 'customer-v-name', 'customer-droup-status', 'customer-droup-updateTime', 'customer-droup-handleTime', 'customer-droup-isHandle', 'customer-droup-type']);

    searcher.button([{
        id: "bindDroup",
        name: "绑定",
        clazz: "btn-yellow",
        icon: "icon-plus"
    }]);

    // 字段定义映射: key 对应配置 propertyArr 中的 value
    var propertyMap = {
        "name": {
            fieId: "name",
            name: "客户名称",
            prop: "decoration.customer.name",
            clazz: "grey"
        },
        "orderId": {
            field: "orderId",
            name: "装修单号",
            prop: "decoration.orderId",
            clazz: "grey",
            click: function(btn, v) {

                tools.decoration.info(btn, v.decoration.orderId);
            }
        },
        "villageName": {
            fieId: "villageName",
            name: "楼盘",
            prop: "decoration.house.village.name",
            clazz: "grey"
        },
        "houseNumber": {
            fieId: "houseNumber",
            name: "楼号",
            prop: "decoration.house.houseNumber",
            clazz: "grey"
        },
        "designer": {
            fieId: "designer",
            name: "设计师",
            prop: "decoration.designer.currentName",
            clazz: "grey",
            click: function(btn, v) {

                tools.personel.info(btn, v.decoration.designer.userId);
            }
        },
        "salesman": {
            fieId: "salesman",
            name: "业务员",
            prop: "decoration.salesman.currentName",
            clazz: "grey",
            click: function(btn, v) {

                tools.personel.info(btn, v.decoration.salesman.userId);
            }
        },
        "updateTime": {
            field: "updateTime",
            name: "更新时间",
            prop: "updateTime",
            clazz: "green"
        },
        "handleTime": {
            field: "handleTime",
            name: "处理时间",
            prop: "handleTime",
            clazz: "green"
        },
        "type": {
            fieId: "type",
            name: "类型",
            prop: "type",
            clazz: "red",
            dataset: constant.customer().droup.dType.keys
        },
        "status": {
            fieId: "status",
            name: "状态",
            prop: "status",
            clazz: "red",
            dataset: constant.customer().droup.status.keys
        },
        "isHandle": {
            fieId: "isHandle",
            name: "处理状态",
            prop: "isHandle",
            clazz: "red",
            dataset: constant.customer().droup.type.keys
        }
    };

    // 根据配置 propertyArr 组装列定义, 配置为空则使用全部默认列
    var lineprops = (function () {

        if (pageConfig.propertyArr.length == 0) {

            var all = [];
            $.each(propertyMap, function (key, prop) { all.push(prop); });
            return all;
        }

        var props = [];
        $.each(pageConfig.propertyArr, function (i, key) {

            if (propertyMap[key]) props.push(propertyMap[key]);
        });
        return props;
    })();

    var linebtns = [{
        name: "对话",
        clazz: "btn-yellow",
        handle: function(v) {

            droup.did = v.did;
            droup.orderId = v.decoration.orderId;
            show(v);
            return false;
        },
        show: function() { return btnVisible("chat"); }
    }, {
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            var url = api.customer.deleteDroup;
            var options = {
                "droup.did": v.did
            };
            com.post(url, options, function(data) {

                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
            });
            return false;
        },
        show: function() { return btnVisible("del"); }
    }, {
        name: "添加人员",
        clazz: "btn-success",
        handle: function(v) {

            droup.did = v.did;
            droup.modals.addModal.modal("show");
        },
        show: function() { return btnVisible("addUser"); }
    }];

    searcher.line(function(v) {

        return v.decoration.orderId + '-' + v.name
    }, lineprops, linebtns).render();

    com.focusPage('#bindDroup', '#pagenation').on("click", function() {

        droup.modals.bindModal.modal("show");
    });

    function saveData() {

        if (com.validate('bindModal'))
            return false;

        var url = api.customer.bindDroup;

        var options = {
            "droup.decoration.orderId": droup.items.orderId.val(),
            "droup.name": droup.items.name.val(),
            "droup.chatId": droup.items.chatId.val(),
            "droup.type": droup.items.type.val()
        };

        com.post(url, options, function(res) {

            searcher.doSearch();

            droup.modals.bindModal.modal("hide");
        });
    }

    function addUser() {

        if (com.validate('addModal'))
            return false;

        var url = api.customer.updateDroup;

        var options = {
            "droup.did": droup.did,
            "droup.userId": com.typeahead("user")
        };

        com.post(url, options, function(res) {

            searcher.doSearch();
        });

        droup.did = null;
        droup.modals.addModal.modal("hide");
    }
});
