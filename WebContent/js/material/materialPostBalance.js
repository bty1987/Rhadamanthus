
var materialSubOrderPostData = {};

$(function(){

    var materialOrderPostBalance = {
        //厂结值点击保存
        vsaveBtn: com.focusPage("#vsaveBtn").on("click", updateMaterialSubOrderBalanceForVBalance),
        //结算值点击保存
        saveBtn: com.focusPage("#saveBtn").on("click", updateMaterialSubOrderBalanceForBalance),
        smodal: com.focusPage('#smodal').on("show.bs.modal", function(a) {
            com.clearValidator();
            com.focusPage('#vbalance').val(null);
            com.focusPage('#vbalancets_total').val(materialOrderPostBalance.total);
        }).on("hide.bs.modal", function(a) {
            materialOrderPostBalance.msobId = null;
            com.focusPage('#balance').val(null);
        }),
        modal: com.focusPage('#modal').on("show.bs.modal", function(a) {
            com.clearValidator();
            com.focusPage('#balance_prebalance').val(materialOrderPostBalance.preTotal);
            com.focusPage('#balance_vbalance').val(materialOrderPostBalance.vbalance);
        }).on("hide.bs.modal", function(a) {
            materialOrderPostBalance.msobId = null;
        }),
        total:null,
        vbalance :null,
        preTotal:null,
    };

    /**
     * 回调函数必须提供 init(tableId, result.list)方法
     * tableId ，用来显示的div的id
     * result.list 列表的json数组
     **/
    var lineprops = (function() {

        return [{
            field: "material.orderId",
            name: "装修单号",
            prop: "material.orderId",
            clazz: "blue"
        }, {
            field: "material.house",
            name: "楼盘地址",
            prop: function(v) { return v.material.house.village.name + " " + v.material.house.houseNumber; },
            clazz: "grey"
        }, {
            field: "material.brand",
            name: "品牌",
            prop: "material.brand",
            clazz: "grey"
        }, {
            field: "material.salesman.currentName",
            name: "业务员",
            prop: function(v) { return v.material.salesman.currentName ? v.material.salesman.currentName : '---'; },
            clazz: "grey"
        }, {
            field: "material.region.name",
            name: "归属大区",
            prop: function(v) { return v.material.region.name ? v.material.region.name : '---'; },
            clazz: "grey"
        }, {
            field: "material.department.name",
            name: "归属部门",
            prop: function(v) { return v.material.department.name ? v.material.department.name : '---'; },
            clazz: "grey"
        }, {
            field: "total",
            name: "总价",
            prop: "total",
            clazz: "blue"
        }, {
            field: "material.total",
            name: "子订单总价",
            prop: "material.total",
            clazz: "blue"
        }, {
            field: "material.coupon",
            name: "券值",
            prop: "material.coupon",
            clazz: "blue"
        }, {
            field: "material.couponInfo",
            name: "券信息",
            prop: function(v) { return v.material.couponInfo ? v.material.couponInfo : '---'; },
            clazz: "grey"
        }, {
            field: "instorer.currentName",
            name: "主材驻店",
            prop: function(v) { return v.instorer.currentName ? v.instorer.currentName : '---'; },
            clazz: "grey"
        }, {
            field: "balance",
            name: "预结值",
            prop: "balance",
            clazz: "blue"
        }, {
            field: "balanceTime",
            name: "预结时间",
            prop: "balanceTime",
            clazz: "green"
        }, {
            field: "creater.currentName",
            name: "预结人",
            prop: "creater.currentName",
            clazz: "grey"
        }, {
            field: "vbalance",
            name: "厂结值",
            prop: "vbalance",
            clazz: "blue"
        }, {
            field: "vbalanceTime",
            name: "厂结时间",
            prop: "vbalanceTime",
            clazz: "green"
        }, {
            field: "post",
            name: "结算值",
            prop: "post",
            clazz: "blue"
        }, {
            field: "postTime",
            name: "结算时间",
            prop: function(v) { return v.postTime ? v.postTime : '---'; },
            clazz: "green"
        }, {
            field: "poster.currentName",
            name: "结算人",
            prop: function(v) { return v.poster.currentName ? v.poster.currentName : '---'; },
            clazz: "grey"
        }, {
            field: "material.maling",
            name: "抹零",
            prop: "material.maling",
            clazz: "blue"
        }, {
            field: "material.venderMaling",
            name: "厂商抹零",
            prop: "material.venderMaling",
            clazz: "blue"
        }, {
            field: "status",
            name: "状态",
            prop: function(v) { return v.status == 0 ? '预结' : v.status == 1 ? '厂结' : v.status == 2 ? '结算' : '---'; },
            clazz: "red"
        }, {
            field: "type",
            name: "类型",
            prop: function(v) { return v.type == 0 ? '购货' : v.type == 1 ? '预结退货' : '结算退货'; },
            clazz: "red"
        }];
    })();

    var linebtns = (function() {

        return {
            supBalance: {
                name: "厂结值",
                clazz: "btn-yellow",
                handle: function(v) {
                    if (v.status == 0) {
                        materialOrderPostBalance.total = v.total;
                        materialOrderPostBalance.msobId = v.mbid;
                        materialOrderPostBalance.smodal.modal("show");
                    } else {
                        com.showAlert(com.warning, "非预结状态下不允许进行厂结");
                    }
                }
            },
            supPost: {
                name: "厂结",
                clazz: "btn-success",
                handle: function(v) {
                    if (v.status == 0 && v.vbalance != 0) {
                        vpostMaterialSubOrderBalance(v.mbid);
                    } else if (v.status == 0 && v.vbalance == 0) {
                        com.showAlert(com.warning, "厂结值未填写，请检查");
                    } else if (v.status != 0) {
                        com.showAlert(com.warning, "非预结状态下不允许进行厂结");
                    }
                }
            },
            balance: {
                name: "结算值",
                clazz: "btn-warning",
                handle: function(v) {
                    if (v.status == 1) {
                        materialOrderPostBalance.preTotal = utils.accSub(v.total, v.balance);
                        materialOrderPostBalance.vbalance = v.vbalance;
                        materialOrderPostBalance.msobId = v.mbid;
                        materialOrderPostBalance.modal.modal("show");
                    } else {
                        com.showAlert(com.warning, "非厂结状态下不允许进行结算");
                    }
                }
            },
            post: {
                name: "结算",
                clazz: "btn-inverse",
                handle: function(v) {
                    if (v.status == 1 && v.post != 0) {
                        postMaterialSubOrderBalance(v.mbid);
                    } else if (v.status == 1 && v.post == 0) {
                        com.showAlert(com.warning, "结算值未填写，请检查");
                    } else if (v.status != 1) {
                        com.showAlert(com.warning, "非厂结状态下不允许进行结算");
                    }
                }
            },
            charge: {
                name: function(v) { return v.type == 0 ? '收款' : '退款'; },
                clazz: "btn-danger",
                handle: function(v) {
                    params.historyPage = api.index.materialPostBalanceIndex.url;
                    materialSubOrderPostData["materialSubOrder.msoId"] = v.material.mid;
                    materialSubOrderPostData["materialSubOrderPostBalance.mpId"] = v.mpId;
                    materialSubOrderPostData["materialSubOrderPostBalance.type"] = v.type;
                    com.switchPage(api.index.materialCollectionIndex.url);
                }
            },
            sub: {
                name: "子项",
                clazz: "btn-purple",
                show: function(v) { return v.type != 1 && v.type != 2; },
                handle: function(v) {
                    params['materialOrderPostBalance.type'] = 0;
                    params['materialSubOrder.msoId'] = v.material.mid;
                    com.switchPage('views/material/materialPostBalanceDetail.html');
                }
            },
            reject: {
                name: "退货",
                clazz: "btn-pink",
                show: function(v) { return v.type == 1 || v.type == 2; },
                handle: function(v) {
                    v.type == 1 ? params['materialOrderPostBalance.type'] = 1 : params['materialOrderPostBalance.type'] = 2;
                    params['materialSubOrder.msoId'] = v.material.mid;
                    params['idents[0]'] = v.ident;
                    com.switchPage('views/material/materialPostBalanceDetail.html');
                }
            }
        };
    })();

    var buttons = (function() {

        var $exportAnchor = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'export').css("margin", "0px 3px");
        var $exprotIcon = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($exportAnchor);
        var $exportText = $('<span></span>').text('导出').appendTo($exportAnchor);
        $exportAnchor.click(function() {
            exportation();
        });

        return [$exportAnchor];
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.material.pageMaterialBalance, null, ['material-orderId', 'material-no', 'material-brand', 'material-orderAddr', 'material-region-name', 'material-dept-name', 'material-balance-status', 'material-balance-type', 'material-fullpayTime', 'material-prebalanceTime', 'material-vbalanceTime', 'material-postBalanceTime'], "materialOrderPostBalancePostData", null, false, buildMaterialPostBalanceButtons);
    searcher.line("material.no", lineprops, linebtns).render();
    //厂结值 点保存//
    function updateMaterialSubOrderBalanceForVBalance(){
        if (!com.validate('smodal')) {

            var _params = {
                //ID用于后台获得该订单实体
                "materialBalance.mbid": materialOrderPostBalance.msobId,
                //用于后台修改厂结值
                "materialBalance.vbalance": com.focusPage('#vbalance').val()
            };
            //调用后台方法
            com.post(api.material.updateMaterialBalanceForVBalance, _params, function(a) {
                //根据当前条件进行分页查询
                setTimeout(function(){
                    searcher.doSearch();
                },500);
                //隐藏弹出框
                materialOrderPostBalance.smodal.modal("hide");
            });
        }
    }
    //结算值 点保存
    function updateMaterialSubOrderBalanceForBalance(){
        //对弹出框的输入进行表单校验
        if (!com.validate('modal')) {
            var _params = {
                //同理 后台传入json
                "materialBalance.mbid": materialOrderPostBalance.msobId,
                "materialBalance.balance": com.focusPage('#balance').val()
            };
            com.post(api.material.updateMaterialBalanceForBalance, _params, function(a) {
                setTimeout(function(){
                    searcher.doSearch();
                },500);

                materialOrderPostBalance.modal.modal("hide");
            });
        }
    }
    //厂结
    function  vpostMaterialSubOrderBalance(id){

        var _params = {
            "materialBalance.mbid": id
        };

        com.post(api.material.vpostMaterialBalance, _params, function(a) {
            com.showAlert(com.info, '厂商成功结算');
            //状态和结算时间在后台进行修改 前台并没有修改
            setTimeout(function () {
                searcher.doSearch();
            },500);

        });
    }

    //结算
    function  postMaterialSubOrderBalance(id){

        var _params = {
            "materialBalance.mbid": id
        };

        com.post(api.material.postMaterialBalance, _params, function(a) {
        	com.showAlert(com.info, '成功结算');
            setTimeout(function () {
                searcher.doSearch();
            },500);

        });
    }
    //导出功能
    function exportation(){

        if(com.focusPage('span[name="totalRecords"]').text() == 0){
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }
        if(com.focusPage('span[name="totalRecords"]').text() > 2000){
            com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
            return false;
        }
        var materialOrderPostBalancePostData=params.materialOrderPostBalancePostData;
        com.post(api.material.pageMaterialBalance, $.extend({},materialOrderPostBalancePostData,{"paging.noPage": 1}), function (res){
            $.exceler({
                column:[
					["主材单号","material.no"],
					["装修单号","material.orderId"],
					["楼盘地址",['material.house.village.name', 'material.house.houseNumber']],
					["品牌","material.brand"],
					["编号","material.salesman.userId"],
					["业务员","material.salesman.currentName"],
					["大区","material.region.name"],
					["部门","material.department.name"],
					["总价","total"],
					["子订单总价","material.total"],
					["券值","material.coupon"],
					["券信息","material.couponInfo"],
					["主材驻店", "instorer.currentName"],
					["预结值","balance"],
					["预结时间 ","balanceTime"],
					["创建人", "creater.currentName"],
					["厂结","vbalance"],
					["厂结时间","vbalanceTime"],
					["结算值","post"],
					["结算时间","postTime"],
					["结算人","poster.currentName"],
					["抹零 ", "material.maling"],
					["厂商抹零 ", "material.venderMaling"],
					["状态", "status"],
					["类型", "type"],
                ],
                list: res.paging.data,
            }, function(v){
				v.status = v.status== 0 ? '预结': v.status== 1 ? '厂结' : v.status== 2 ? '结算' : '---';
				v.type = v.type == 0 ? '购货' : v.type == 1 ? '预结退货' : '结算退货';
			});
        });
    }


});
