
var materialSubOrderPostData = {};

$(function(){

    var materialOrderPostBalance = {
        //厂商结算值点击保存
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
    var displayFunc  = (function(){

        var renderList = function(tableId,listData){
            var $tableWrap = com.focusPage('#' + tableId);//取到画table的div
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if(listData && listData.length){
                //遍历listData
            	
                $.each(listData,function(i, v){
                
                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v){
            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + v.material.no   ));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
            var $btnSupBalance = $('<a></a>').addClass('btn btn-minier btn-yellow').html('厂商结算值');
            var $btnSupPost = $('<a></a>').addClass('btn btn-minier btn-success').html('厂商结算');
            var $btnBalance = $('<a></a>').addClass('btn btn-minier btn-warning').html('结算值');
            var $btnPost = $('<a></a>').addClass('btn btn-minier btn-inverse').html('结算');
            //var $btnSub = $('<a></a>').addClass('btn btn-minier btn-success').html('子项');
            var lable = v.type == 0 ? '收款' : '退款';
            var $btnCharge = $('<a></a>').addClass('btn btn-minier btn-danger').html(lable);
            //侯骅峰于4.7日增加楼盘地址、业务员、品牌、总价、券值、券信息显示字段
            var propertyArr = [
                //增加订单号
                ["装修单号：",v.material.orderId,"blue"],
                //增加楼盘地址
                ["楼盘地址：",v.material.house.village.name + " " + v.material.house.houseNumber,"grey"],
                //创建品牌字段
                ["品牌: ",v.material.brand,"grey"],
                //增加业务员字段
                ["业务员：",v.material.salesman.currentName ? v.material.salesman.currentName : '---',"grey"],
                //新增业务部门和业务大区
                ["归属大区: ",v.material.region.name ? v.material.region.name : '---',"grey"],
                ["归属部门：",v.material.department.name ? v.material.department.name :'---',"grey"],
                //增加总价字段
                ["总价：",v.total,"blue"],
                //过度数据
                ["子订单总价：",v.material.total,"blue"],
                //增加券值
                ["券值：",v.material.coupon,"blue"],
                //增加券信息
                ["券信息：",v.material.couponInfo ? v.material.couponInfo : '---',"grey"],
                ["主材驻店:", v.instorer.currentName ?  v.instorer.currentName : '---' , "grey"],
                //预结算值
                ["预结算值：",v.balance,"blue"],
                ["预结算时间 :", v.balanceTime , "green"],
                ["预结算人:", v.creater.currentName , "grey"],
                ["厂商结算:", v.vbalance , "blue"],
                ["厂商结算时间:", v.vbalanceTime , "green"],
                ["结算值：",v.post,"blue"],
                ["结算时间：",v.postTime ? v.postTime : '---',"green"],
                ["结算人  :", v.poster.currentName ? v.poster.currentName : '---' , "grey"],
                //新增抹零和厂商抹零
                ["抹零：",v.material.maling,"blue"],
                ["厂商抹零：",v.material.venderMaling,"blue"],
                ["状态:", v.status == 0 ? '预结算': v.status== 1 ? '厂商结算' : v.status== 2 ? '结算' : '---' , "red"],
                ["类型:", v.type == 0 ? '购货' : v.type == 1 ? '预结算退货' : '结算退货' , "red"],

            ];

            $.each(propertyArr, function (index,value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnSupBalance).append($btnSupPost).append($btnBalance).append($btnPost).append($btnSub).append($btnCharge).appendTo($h3);

            $liLine.append($h3).append($ulProperty);
            //点击厂商结算值
            $btnSupBalance.click(function(){
                if(v.status==0){
                    materialOrderPostBalance.total = v.total;
                    materialOrderPostBalance.msobId = v.mbid;
                    materialOrderPostBalance.smodal.modal("show");
                }else{
                    com.showAlert(com.warning,"非预结算状态下不允许进行厂商结算");
                }

            });
            //点击结算值
            $btnBalance.click(function(){
                if(v.status==1){
                    materialOrderPostBalance.preTotal = utils.accSub(v.total,v.balance);
                    materialOrderPostBalance.vbalance = v.vbalance;
                    materialOrderPostBalance.msobId = v.mbid;
                    materialOrderPostBalance.modal.modal("show");
                }else{
                    com.showAlert(com.warning,"非厂商结算状态下不允许进行结算");
                }

            });
            //厂商结算
            $btnSupPost.click(function(){
                if(v.status==0 && v.vbalance!=0){
                    vpostMaterialSubOrderBalance(v.mbid);
                }else if(v.status==0 && v.vbalance==0){
                    com.showAlert(com.warning,"厂商结算值未填写，请检查");
                }else if(v.status!=0){
                    com.showAlert(com.warning,"非预结算状态下不允许进行厂商结算");
                }

            });
            //结算
            $btnPost.click(function(){
                if(v.status==1 && v.post!=0){
                    postMaterialSubOrderBalance(v.mbid);
                }else if(v.status==1 && v.post==0){
                    com.showAlert(com.warning,"结算值未填写，请检查");
                }else if(v.status!=1){
                    com.showAlert(com.warning,"非厂商结算状态下不允许进行结算");
                }

            });

            $btnCharge.click(function(){
                params.historyPage = api.index.materialPostBalanceIndex.url;
                materialSubOrderPostData["materialSubOrder.msoId"] = v.material.mid;
                materialSubOrderPostData["materialSubOrderPostBalance.mpId"] = v.mpId;
                materialSubOrderPostData["materialSubOrderPostBalance.type"] = v.type;
                com.switchPage(api.index.materialCollectionIndex.url);
            });


            //收款

            //订单是退货状态的时候 才显示退货按钮  显示退货信息 隐藏子项按钮
            if(v.type == 1 || v.type == 2){

                var $btnReject = $('<a></a>').addClass('btn btn-minier btn-pink').html('退货');

                $divBtnWrap.append($btnReject);
                $btnReject.click(function(){
                	v.type == 1 ? params['materialOrderPostBalance.type'] = 1 : params['materialOrderPostBalance.type'] = 2;
                    params['materialSubOrder.msoId'] = v.material.mid;
                    params['idents[0]'] = v.ident;
                    com.switchPage('views/material/materialPostBalanceDetail.html');
                });
            }else{
                var $btnSub = $('<a></a>').addClass('btn btn-minier btn-purple').html('子项');
                $divBtnWrap.append($btnSub);
                $btnSub.click(function(){
                    params['materialOrderPostBalance.type'] = 0;
                    params['materialSubOrder.msoId'] = v.material.mid;
                    com.switchPage('views/material/materialPostBalanceDetail.html');
                });
            }

            return $liLine;
        };

        return {
            init : function(tableId,listData){
                com.focusPage('#' + tableId).html(null);
                renderList(tableId,listData);
            },
            drawLine : function(v){
                return creatLine(v);
            }
        };
    })();
   //侯骅峰4.7增加品牌，预结算时间，厂商结算时间，结算时间，楼盘地址查询字段(?添加业务员)
    var _condArr = ['material-orderId','material-no','material-brand', 'material-orderAddr', 'material-region-name', 'material-dept-name', 'material-balance-status', 'material-balance-type' ,'material-fullpayTime', 'material-prebalanceTime','material-vbalanceTime','material-postBalanceTime'];

    var searcher = new Searcher();
    //seacher方法分页显示数据
    searcher.init( _condArr, "condList", api.material.pageMaterialBalance, function(data){
        //提供init方法
        displayFunc.init('resultList', data);
    }, "pagenation", "materialOrderPostBalancePostData", null, false, null, function (){
        //增加导出按钮

        var $exportAnchor = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name','export').css("margin", "0px 3px");
        var $exprotIcon = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($exportAnchor);
        var $exportText = $('<span></span>').text('导出').appendTo($exportAnchor);
        $exportAnchor.click(function(){
            exportation();
        });
 
        return [$exportAnchor];
    });
    //厂商结算值 点保存//
    function updateMaterialSubOrderBalanceForVBalance(){
        if (!com.validate('smodal')) {

            var _params = {
                //ID用于后台获得该订单实体
                "materialBalance.mbid": materialOrderPostBalance.msobId,
                //用于后台修改厂商结算值
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
    //厂商结算
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
					["预结算值","balance"],
					["预结算时间 ","balanceTime"],
					["创建人", "creater.currentName"],
					["厂商结算","vbalance"],
					["厂商结算时间","vbalanceTime"],
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
				v.status = v.status== 0 ? '预结算': v.status== 1 ? '厂商结算' : v.status== 2 ? '结算' : '---';
				v.type = v.type == 0 ? '购货' : v.type == 1 ? '预结算退货' : '结算退货';
			});
        });
    }


});
