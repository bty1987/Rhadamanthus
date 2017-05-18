
var materialSubOrderPostData = {};

$(function(){

    var materialOrderPostBalance = {
        //厂商结算值点击保存
        vsaveBtn: $("#vsaveBtn").on("click", updateMaterialSubOrderBalanceForVBalance),
        //厂商结算点击保存
        saveBtn: $("#saveBtn").on("click", updateMaterialSubOrderBalanceForBalance),
        smodal: $('#smodal').on("show.bs.modal", function(a) {
            com.clearValidator();
            $('#vbalance').val(null);
        }).on("hide.bs.modal", function(a) {
            materialOrderPostBalance.msobId = null;
            $('#balance').val(null);
        }),
        modal: $('#modal').on("show.bs.modal", function(a) {
            com.clearValidator();
        }).on("hide.bs.modal", function(a) {
            materialOrderPostBalance.msobId = null;
        }),
    };

    /**
     * 回调函数必须提供 init(tableId, result.list)方法
     * tableId ，用来显示的div的id
     * result.list 列表的json数组
     **/
    var displayFunc  = (function(){

        var renderList = function(tableId,listData){
            var $tableWrap = $('#' + tableId);//取到画table的div
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
            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + v.materialSubOrder.msoNo   ));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
            var $btnSupBalance = $('<a></a>').addClass('btn btn-minier btn-warning').html('厂商结算值');
            var $btnSupPost = $('<a></a>').addClass('btn btn-minier btn-purple').html('厂商结算');
            var $btnBalance = $('<a></a>').addClass('btn btn-minier btn-primary').html('结算值');
            var $btnPost = $('<a></a>').addClass('btn btn-minier btn-danger').html('结算');
            var $btnSub = $('<a></a>').addClass('btn btn-minier btn-success').html('子项');
            var $btnCharge = $('<a></a>').addClass('btn btn-minier').html('收款');
            //侯骅峰于4.7日增加楼盘地址、业务员、品牌、总价、券值、券信息显示字段
            var propertyArr = [
                //增加订单号
                ["订单编号：",v.materialSubOrder.orderId,"grey"],
                //增加楼盘地址
                ["楼盘地址：",v.materialSubOrder.orderAddr,"grey"],
                //创建品牌字段
                ["品牌: ",v.materialSubOrder.materialBrand,"grey"],
                //增加业务员字段
                ["业务员：",v.materialSubOrder.salesmanName ? v.materialSubOrder.salesmanName : '---',"grey"],
                //新增业务部门和业务大区
                ["归属大区: ",v.materialSubOrder.regionName ? v.materialSubOrder.regionName : '---',"grey"],
                ["归属部门：",v.materialSubOrder.departmentName ? v.materialSubOrder.departmentName :'---',"grey"],
                //增加总价字段
                ["总价：",v.materialSubOrder.total,"blue"],
                //增加券值
                ["券值：",v.materialSubOrder.coupon,"grey"],
                //增加券信息
                ["券信息：",v.materialSubOrder.couponInfo ? v.materialSubOrder.couponInfo : '---',"grey"],
                ["主材驻店:", v.instorer.currentName ?  v.instorer.currentName : '---' , "grey"],
                //预结算值
                ["预结算值：",v.balance,"grey"],
                ["预结算时间 :", v.balanceTime , "grey"],
                ["预结算人:", v.creater.currentName , "grey"],
                ["厂商结算:", v.vbalance , "grey"],
                ["厂商结算时间:", v.vbalanceTime , "grey"],
                ["结算值：",v.post,"grey"],
                ["结算时间：",v.postTime ? v.postTime : '---',"grey"],
                ["结算人  :", v.poster.currentName ? v.poster.currentName : '---' , "grey"],
                //新增抹零和厂商抹零
                ["抹零：",v.materialSubOrder.maling,"grey"],
                ["厂商抹零：",v.materialSubOrder.venderMaling,"grey"],
                ["状态:", v.status == 0 ? '预结算': v.status== 1 ? '厂商结算' : v.status== 2 ? '结算' : '---' , "blue"],
                ["类型:", v.type == 0 ? '购货' : v.type == 1 ? '预结算退货' : '结算退货' , "blue"],
                //订单号
                //["差值 :", v.difference , "grey"],
                //业务员 业务大区 业务部门？
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
                materialOrderPostBalance.msobId = v.msobId;
                materialOrderPostBalance.smodal.modal("show");
            });
//点击结算值
            $btnBalance.click(function(){
                materialOrderPostBalance.msobId = v.msobId;
                materialOrderPostBalance.modal.modal("show");
            });
//厂商结算
            $btnSupPost.click(function(){
                vpostMaterialSubOrderBalance(v.msobId);
            });
//结算
            $btnPost.click(function(){
                postMaterialSubOrderBalance(v.msobId);M1705136478
            });
//子项
            $btnSub.click(function(){
                params['materialOrderPostBalance.type'] = 0;
                params['materialSubOrder.msoId'] = v.materialSubOrder.msoId;
                com.switchPage('views/material/materialOrderPostBalanceDetail.html');
            });
//收款
            $btnCharge.click(function(){
            	params.historyPage = api.index.materialOrderPostBalanceIndex.url;
                materialSubOrderPostData["materialSubOrder.msoId"] = v.materialSubOrder.msoId;
                com.switchPage(api.index.materialSubOrderCollectionIndex.url);
            });
//订单是退货状态的时候 才显示退货按钮  显示退货信息
            if(v.type == 1 || v.type == 2){
                var $btnReject = $('<a></a>').addClass('btn btn-minier btn-pink').html('退货');
                $divBtnWrap.append($btnReject);
                $btnReject.click(function(){
                	v.type == 1 ? params['materialOrderPostBalance.type'] = 1 : params['materialOrderPostBalance.type'] = 2;
                    params['materialSubOrder.msoId'] = v.materialSubOrder.msoId;
                    params['idents[0]'] = v.ident;
                    com.switchPage('views/material/materialOrderPostBalanceDetail.html');
                });
            }

            return $liLine;
        };
//提
        return {
            init : function(tableId,listData){
                $('#' + tableId).html(null);
                renderList(tableId,listData);
            },
            drawLine : function(v){
                return creatLine(v);
            }
        }
    })();
   //侯骅峰4.7增加品牌，预结算时间，厂商结算时间，结算时间，楼盘地址查询字段(?添加业务员)
    var _condArr = ['orderId','msoNo','materialBrand', 'orderAddr','regionName','departmentName','balanceStatus', 'balanceType' ,'fullCollectTimeRange', 'preBalanceTimeRange','vbalanceTimeRange','postBalanceTimeRange'];

    var searcher = new Searcher();
    //seacher方法分页显示数据
    searcher.init( _condArr, "condList", api.material.pageMaterialSubOrderBalance, function(data){
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
    //厂商结算值 点保存
    function updateMaterialSubOrderBalanceForVBalance(){
        if (!com.validate('smodal')) {
            var _params = {
                //ID用于后台获得该订单实体
                "materialSubOrderBalance.msobId": materialOrderPostBalance.msobId,
                //用于后台修改厂商结算值
                "materialSubOrderBalance.vbalance": $('#vbalance').val()
            };
            //调用后台方法
            com.post(api.material.updateMaterialSubOrderBalanceForVBalance, _params, function(a) {
                //根据当前条件进行分页查询
                searcher.doSearch();
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
                "materialSubOrderBalance.msobId": materialOrderPostBalance.msobId,
                "materialSubOrderBalance.balance": $('#balance').val()
            };
            com.post(api.material.updateMaterialSubOrderBalanceForBalance, _params, function(a) {
                searcher.doSearch();
                materialOrderPostBalance.modal.modal("hide");
            });
        }
    }
    //厂商结算
    function  vpostMaterialSubOrderBalance(id){

        var _params = {
            "materialSubOrderBalance.msobId": id
        };

        com.post(api.material.vpostMaterialSubOrderBalance, _params, function(a) {
            com.showAlert(com.info, '厂商成功结算');
            //状态和结算时间在后台进行修改 前台并没有修改
            searcher.doSearch();
        });
    }

    //结算
    function  postMaterialSubOrderBalance(id){

        var _params = {
            "materialSubOrderBalance.msobId": id
        };

        com.post(api.material.postMaterialSubOrderBalance, _params, function(a) {
        	com.showAlert(com.info, '成功结算');
            searcher.doSearch();
        });
    }
    //导出功能
    function exportation(){

        if($('span[name="totalRecords"]').text() == 0){
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }
        if($('span[name="totalRecords"]').text() > 500){
            com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
            return false;
        }
        com.post(api.material.pageMaterialSubOrderBalance, $.extend({},params.materialOrderPostBalancePostData,{"paging.noPage": 1}), function (res){
            $.exceler({
                column:[
					["订单编号","materialSubOrder.orderId"],
					["楼盘地址","materialSubOrder.orderAddr"],
					["主材订单编号","materialSubOrder.msoNo"],
					["品牌","materialSubOrder.materialBrand"],
					["业务员","materialSubOrder.salesmanName"],
					["大区","materialSubOrder.regionName"],
					["部门","materialSubOrder.departmentName"],
					["总价","materialSubOrder.total"],
					["券值","materialSubOrder.coupon"],
					["券信息","materialSubOrder.couponInfo"],
					["主材驻店", "instorer.currentName"],
					["预结算值","balance"],
					["预结算时间 ","balanceTime"],
					["创建人", "creater.currentName"],
					["厂商结算","vbalance"],
					["厂商结算时间","vbalanceTime"],
					["结算值","post"],
					["结算时间","postTime"],
					["结算人","poster.currentName"],
					["抹零 ", "materialSubOrder.maling"],
					["厂商抹零 ", "materialSubOrder.venderMaling"],
					["状态", "status"],
					["类型", "type"]
                ],
                list: res.paging.data,
            }, function(v){
				v.status = v.status== 0 ? '预结算': v.status== 1 ? '厂商结算' : v.status== 2 ? '结算' : '---';
				v.type = v.type == 0 ? '购货' : v.type == 1 ? '预结算退货' : '结算退货'
			});
        });
    }
});
