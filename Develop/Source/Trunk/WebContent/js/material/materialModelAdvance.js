$(function(){

    /**
     * 回调函数必须提供 init(tableId, result.list)方法
     * tableId ，用来显示的div的id
     * result.list 列表的json数组
     * */
    var displayFunc  = (function(){

        var renderList = function(tableId,listData){
            var $tableWrap = $('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if(listData && listData.length){
                $.each(listData,function(i, v){
                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v){
            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + v.materialModelName));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-primary').html('编辑');
            var $btnAdvance = $('<a></a>').addClass('btn btn-minier btn-warning').html('高级');
            var $btnDelete = $('<a></a>').addClass('btn btn-minier btn-danger').html('删除');

            var $btnStatus = $('<div></div>').addClass('pull-right');
            var $statusSwitch = $('<input/>').addClass('ace ace-switch ace-switch-5').prop({"type" : "checkbox"});
            var $span = $('<span></span>').addClass('lbl');
            var propertyArr = [
                ["编号:", v.materialModelNo, "grey"],
                ["品类:", v.materialTypeName, "grey"],
                ["品牌:", v.materialBrandName, "grey"],
                ["单位:", v.measurementUnitName, "grey"],
                ["进价:", v.materialPurchasePrice, "blue"],
                ["标价:", v.materialUnitPrice, "blue"],
                ["折扣:", v.discount, "blue"],
                ["计算方式:", "1" == v.calcType ? "点位" : "0" == v.calcType ? "底价" : "", "1" == v.calcType ? "label label-success arrowed" : "0" == v.calcType ? "label label-danger arrowed" : ""],
                ["计算值:", "1" == v.calcType ? v.point: "0" == v.calcType ? v.base : "", "blue"]
            ];

            $.each(propertyArr, function (index,value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $btnStatus.append($statusSwitch).append($span);

            $divBtnWrap.append($btnEdit).append($btnAdvance).append($btnDelete).append($btnStatus).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnEdit.click(function(){
                editMaterial(v);
            });
            
            $btnAdvance.click(function(){
            	advanceMaterial(v);
            })

            $btnDelete.click(function() {
                bootbox.confirm("确定删除吗？", function(result) {
                    if(result) {
                        deleteMaterial(v.mmId);
                    }
                });
            });

            !v.status && $statusSwitch.prop("checked", true);
            $statusSwitch.switchBtn("status-lbl").on("click",function() {
                $statusSwitch.prop("checked") ? (updateStatus(v.mmId, 0, function(){$statusSwitch.removeAttr("checked")})) : (updateStatus(v.mmId, 1,function(){$statusSwitch.prop("checked")}));
            });

            return $liLine;
        };

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

    var _condArr = ['materialModelNo', 'materialModelName', 'materialTypeId', 'materialBrandName'];

    var searcher = new Searcher();

    searcher.init( _condArr, "condList", api.material.pageMaterialModel, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "materialModelAdvancePostData", null, false, null, function(){
    	
    	var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'add').css("margin", "0px 3px");
    	var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
    	var $addspan = $('<span></span>').text('添加').appendTo($adda);
    	
    	var $exporta = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'export').css("margin", "0px 3px");
    	var $exporti = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($exporta);
    	var $exportspan = $('<span></span>').text('导出').appendTo($exporta);
    	
    	var $importa = $('<a></a>').addClass('btn btn-minier btn-warning pull-left').attr('name', 'import').css("margin", "0px 3px");
    	var $importi = $('<i></i>').addClass('icon-upload bigger-110').appendTo($importa);
    	var $importspan = $('<span></span>').text('上传').appendTo($importa);
    	
    	return [$adda, $exporta, $importa];
    });

    var materialModel = {
        $nowLine : null,
        saveBtn: $("#saveBtn").on("click", saveData),
        saveAdvanceBtn: $('#saveAdvanceBtn').on('click', advance),
        cancelBtn: $("#cancelBtn"),
        modal: $("#materialModelModal").on("show.bs.modal", function(a) {
            com.clearValidator();
            com.clearValidator("#materialModelName", !0);
            com.clearValidator("#materialModelNo", !0)
        }),
        advanceModal: $('#advanceModelModal').on("show.bs.modal", function(a){
        	com.clearValidator();
        }),
        materialModelItems: {
            mmId : $("#mmId"),
            materialModelNo : $("#materialModelNo").on("blur",function() {
                $this = $(this);
                void 0 != $this.val() && "" != $this.val().trim() && com.post(api.material.queryMaterialModelByNo, {"materialModel.materialModelNo": $this.val()},function(a) {
                    0 != a.materialModel.mmId ? (com.showTips($this, "\u8be5\u578b\u53f7\u7f16\u53f7\u5df2\u5b58\u5728", !0), materialModel.repeatFlg = !0) : (com.clearValidator("#materialModelNo", !0), materialModel.repeatFlg = !1)
                })
            }),
            materialModelName : $("#materialModelName"),
            materialTypeId : $("#materialTypeId").change(function() {
                var b = materialModel.materialModelItems.materialTypeId.val();
                com.post(api.data.queryBrandByCategoryId, {
                        "brand.cid": b
                    },
                    function(c) {
                        materialModel.data.materialBrandData[b] = c.brands;
                        $("#materialBrandId").bindData(materialModel.data.materialBrandData[b + ""], "bid", "brandName")
                    })
            }),
            mmIda : $("#mmIda"),
            materialModelNoa: $('#materialModelNoa'),
            materialModelNamea: $('#materialModelNamea'),
            materialBrandId : $("#materialBrandId"),
            measurementUnitId : $("#measurementUnitId"),
            materialUnitPrice : $("#materialUnitPrice"),
            materialPurchasePrice : $("#materialPurchasePrice"),
            discount : $("#discount"),
            calcTypeSwitch: $("#calcTypeSwitch").switchBtn("calcType").on("change",function() {
                materialModel.materialModelItems.calcTypeSwitch.prop("checked") ? (materialModel.materialModelItems.pointDiv.css("display", "block"), materialModel.materialModelItems.baseDiv.css("display", "none")) : (materialModel.materialModelItems.pointDiv.css("display", "none"), materialModel.materialModelItems.baseDiv.css("display", "block"))
            }),
            calcType : $("#calcType"),
            pointDiv : $("#pointDiv"),
            point : $("#point"),
            baseDiv : $("#baseDiv"),
            base : $("#base")
        },
        data: {
            materialTypeData: {},
            materialBrandData: {},
            measurementUnitData: {}
        },
        editFlg: !1,
        repeatFlg: !1,
        validator:  {
        	materialBrandName: {
                type: "v_materialBrandName",
                regex: /^.{2,64}$/g,
                errorMsg: "主材型号名称格式错误."
            },
            price: {
                type: "v_price",
                regex: /^[0-9]+\.{0,1}[0-9]{0,2}$/g,
                errorMsg: "价格内容输入错误错误."
            },
            discount: {
                type: "v_discount",
                regex: /^(1\.0{1,2}|1|0\.[0-9]{1,2})$/g,
                errorMsg: "折扣内容输入错误错误."
            },
            point: {
                type: "v_point",
                regex: /^(1\.0{1,2}|1|0|0\.[0-9]{1,3})$/g,
                errorMsg: "点位内容输入错误错误."
            }
        }
    };

    $.extend(com.validator, materialModel.validator);

    com.post(api.data.queryCategory, {},function(b) {
        materialModel.data.materialTypeData = b.categorys;
        $("#materialTypeId").bindData(materialModel.data.materialTypeData, "cid", "categoryName");
    });

    com.post(api.common.queryMeasurementUnit, {},function(b) {
        materialModel.data.measurementUnitData = b.measurementUnits;
        $("#measurementUnitId").bindData(materialModel.data.measurementUnitData, "id", "name")
    });

    //添加按钮
    $('a[name="add"]','#pagenation').click(function(){
        materialModel.editFlg = !1;
        
        com.cleanItems(materialModel.materialModelItems);
        
        materialModel.materialModelItems.materialModelNo.removeAttr("disabled");
        materialModel.materialModelItems.materialBrandId.html("");
        
        var b = materialModel.materialModelItems.materialTypeId.val();
        
        com.post(api.data.queryBrandByCategoryId, {"brand.cid": b}, function(c) {
            materialModel.data.materialBrandData[b] = c.brands;
            $("#materialBrandId").bindData(materialModel.data.materialBrandData[b + ""], "bid", "brandName")
        });
        
        materialModel.modal.modal("show");
    });
    
    $('a[name="export"]','#pagenation').click(function(){
    	
    	if($('span[name="totalRecords"]').text() == 0){
			com.showAlert(com.warning, "请通过条件进行查询");
			return false;
		}
    	
    	if($('span[name="totalRecords"]').text() > 500){
			com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
			return false;
		}
		
		com.post(api.material.pageMaterialModel, $.extend({}, params.materialModelAdvancePostData, {"paging.noPage": 1}), function(res){
			
			$.exceler({
				column : [
				    ["编号","mmId"],
					["编号","materialModelNo"],
					["名称",'materialModelName'],
					['品类','materialTypeName'],
					['品牌','materialBrandName'],
					['单位','measurementUnitName'],
					['进价', 'materialPurchasePrice'],
					['标价', 'materialUnitPrice'],
					['折扣', 'discount'],
					['计算方式','calcType'],
					['点位', 'point'],
					['底价', 'base'],
				],
				list: res.paging.data,
			});
		});
    });
    
    $('a[name="import"]','#pagenation').click(function(){
    	$('#importModal').modal("show");
    });

    //保存
    function saveData() {
        if (!com.validate() && !materialModel.repeatFlg) {
            var _params = {
                "materialModel.mmId": materialModel.materialModelItems.mmId.val(),
                "materialModel.materialModelNo": materialModel.materialModelItems.materialModelNo.val(),
                "materialModel.materialModelName": materialModel.materialModelItems.materialModelName.val(),
                "materialModel.materialBrandId": materialModel.materialModelItems.materialBrandId.val(),
                "materialModel.materialBrandName": materialModel.materialModelItems.materialBrandId.find("option:selected").text(),
                "materialModel.materialTypeName": materialModel.materialModelItems.materialTypeId.find("option:selected").text(),
                "materialModel.measurementUnitId": materialModel.materialModelItems.measurementUnitId.val(),
                "materialModel.measurementUnitName": materialModel.materialModelItems.measurementUnitId.find("option:selected").text(),
                "materialModel.materialUnitPrice": materialModel.materialModelItems.materialUnitPrice.val(),
                "materialModel.materialPurchasePrice": materialModel.materialModelItems.materialPurchasePrice.val(),
                "materialModel.discount": materialModel.materialModelItems.discount.val(),
            };
            com.post(materialModel.editFlg ? api.material.updateMaterialModel: api.material.addMaterialModel, _params, function(a) {
                searcher.doSearch();
            });
        }
        
        materialModel.modal.modal("hide");
    }
    
    function advance(){
    	
    	if(com.validate()) return ;
    	
    	var options = {
    		"materialModel.mmId": materialModel.materialModelItems.mmIda.val(),
			"materialModel.calcType": materialModel.materialModelItems.calcTypeSwitch.prop("checked") ? 1 : 0,
            "materialModel.point": "" == materialModel.materialModelItems.point.val() ? 0 : materialModel.materialModelItems.point.val(),
            "materialModel.base": "" == materialModel.materialModelItems.base.val() ? 0 : materialModel.materialModelItems.base.val()
    	}
    	
    	com.post(api.material.updateMaterialModelForAdvance, options, function(res){
    		searcher.doSearch();
    	});
    	
    	materialModel.advanceModal.modal("hide");
    }

    //删除
    function deleteMaterial(mmid) {
        var  c = {};
        
        c["ids[0]"] = mmid;

        com.post(api.material.deleteMaterialModelByIds, c, function(){
        	searcher.doSearch();
        });
    }

    //编辑按钮
    function editMaterial(c) {
        materialModel.editFlg = !0;
        materialModel.materialModelItems.mmId.val(c.mmId);
        materialModel.materialModelItems.materialModelNo.val(c.materialModelNo).attr("disabled", !0);
        materialModel.materialModelItems.materialModelName.val(c.materialModelName);
        materialModel.materialModelItems.materialTypeId.val(c.materialTypeId);
        com.post(api.data.queryBrandByCategoryId, {
                "brand.cid": c.materialTypeId
            },
            function(b) {
                materialModel.data.materialBrandData[c.materialTypeId] = b.brands;
                $("#materialBrandId").bindData(materialModel.data.materialBrandData[c.materialTypeId + ""], "bid", "brandName");
                materialModel.materialModelItems.materialBrandId.val(c.materialBrandId)
            });
        materialModel.materialModelItems.measurementUnitId.val(c.measurementUnitId);
        materialModel.materialModelItems.materialUnitPrice.val(c.materialUnitPrice);
        materialModel.materialModelItems.materialPurchasePrice.val(c.materialPurchasePrice);
        materialModel.materialModelItems.discount.val(c.discount);
        
        materialModel.modal.modal("show");
    }
    
    function advanceMaterial(c){
    	
    	materialModel.materialModelItems.mmIda.val(c.mmId);
    	materialModel.materialModelItems.materialModelNoa.val(c.materialModelNo).attr("disabled", !0);
        materialModel.materialModelItems.materialModelNamea.val(c.materialModelName);
    	materialModel.materialModelItems.base.val(c.base);
        materialModel.materialModelItems.point.val(c.point);
        
        if(c.calcType == 1){
        	materialModel.materialModelItems.calcTypeSwitch.prop("checked", !0);
        	
        	materialModel.materialModelItems.pointDiv.css("display", "block");
        	materialModel.materialModelItems.baseDiv.css("display", "none");
        }else if(c.calcType == 0){
        	materialModel.materialModelItems.calcTypeSwitch.prop("checked", !1);
        	
        	materialModel.materialModelItems.pointDiv.css("display", "none");
        	materialModel.materialModelItems.baseDiv.css("display", "block");
        }
        
        materialModel.advanceModal.modal("show");
    }

    //启用禁用功能
    function updateStatus(mmid, status, failcallBack){
        com.post(api.material.updateMaterialModelForStatus, {"materialModel.mmId" : mmid, "materialModel.status" : status}, function(){

        },function(){
            failcallBack && failcallBack();
        });
    }
    
    $('#import').Huploadify({
        'debug' : false, // 开启调试
        'auto':true, // 是否自动上传
        'successTimeout':config.uploadTimeout, // 超时时间
        'formData':{
        	'uploadType':4,
        },
        'buttonClass': 'btn btn-success col-sm-12',
        'overrideEvents' : ['onDialogClose'], // 不执行默认的onSelect事件
        'fileObjName':'strutsUploads', // 服务器端脚本使用的文件对象的名称 $_FILES个['upload']
        'uploader': config.host + 'importMaterialModule.do', // 上传处理程序
        'height':'30', // 浏览按钮的高度
        'fileTypeDesc':'支持的格式：',  // 在浏览窗口底部的文件类型下拉菜单中显示的文本
        'fileTypeExts':'*.xls;*.xlsx', // 允许上传的文件后缀
        'fileSizeLimit':'2MB', // 上传文件的大小限制
        'queueSizeLimit' : 1, // 上传数量
        'onUploadSuccess':function(file, data, response){ //上传到服务器，服务器返回相应信息到data里
        	console.log(data);
        	var dateObj = eval("("+data+")");
        }
    });

});
