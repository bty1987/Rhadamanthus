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
            var $btnDelete = $('<a></a>').addClass('btn btn-minier btn-danger').html('删除');

            var $btnStatus = $('<div></div>').addClass('pull-right');
            var $statusSwitch = $('<input/>').addClass('ace ace-switch ace-switch-5').prop({"type" : "checkbox"});
            var $span = $('<span></span>').addClass('lbl');
            var propertyArr = [
                ["编号:", v.materialModelNo, "grey"],
                ["品类:", v.materialTypeName, "grey"],
                ["品牌:", v.materialBrandName, "grey"],
                ["单位:", v.measurementUnitName, "grey"],

                ["进价:", v.materialPurchasePrice, "grey"],
                ["标价:", v.materialUnitPrice, "grey"],
                ["折扣:", v.discount, "grey"],
                ["计算方式:", "1" == v.calcType ? "点位" : "0" == v.calcType ? "底价" : "", "1" == v.calcType ? "label label-success arrowed" : "0" == v.calcType ? "label label-danger arrowed" : ""],
                ["计算值:", "1" == v.calcType ? v.point: "0" == v.calcType ? v.base : "", "grey"]
            ];

            $.each(propertyArr, function (index,value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $btnStatus.append($statusSwitch).append($span);

            $divBtnWrap.append($btnEdit).append($btnDelete).append($btnStatus).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnEdit.click(function(){
                materialModel.$nowLine = $liLine;
                editMaterial(v);
            });

            $btnDelete.click(function() {
                bootbox.confirm("确定删除吗？", function(result) {
                    if(result) {
                        deleteMaterial(v.mmId, function(){
                            $liLine.remove();
                        });
                    }
                });
            });


            !v.status && $statusSwitch.prop("checked", true);
            $statusSwitch.switchBtn("status-lbl").on("click",function() {
                $statusSwitch.prop("checked") ? (updateStatus(v.mmId, 0, function(){$statusSwitch.removeAttr("checked")})) : (updateStatus(v.mmId, 1,function(){$statusSwitch.prop("checked")}));
            });

            /*$statusSwitch.switchBtn("status-lbl").on("click",function(e) {
                e.preventDefault();
                $statusSwitch.prop("checked") ? (updateStatus(v.mmId, 0, function(){$statusSwitch.removeAttr('checked')})) : (updateStatus(v.mmId, 1, function(){$statusSwitch.prop("checked", true)}));
            });*/

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

    var _condArr = ['materialModelNo', 'materialModelName', 'materialTypeId'];

    Searcher.init( _condArr, "condList", api.material.pageMaterialModel, displayFunc, "resultList", "materialModelPostData");

    var materialModel = {
        $nowLine : null,
        saveBtn: $("#saveBtn").on("click", saveData),
        cancelBtn: $("#cancelBtn"),
        modal: $("#materialModelModal").on("show.bs.modal", function(a) {
                com.clearValidator();
                com.clearValidator("#materialModelName", !0);
                com.clearValidator("#materialModelNo", !0)
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
            materialBrandId : $("#materialBrandId"),
            measurementUnitId : $("#measurementUnitId"),
            materialUnitPrice : $("#materialUnitPrice"),
            materialPurchasePrice : $("#materialPurchasePrice"),
            discount : $("#discount"),
            calcTypeSwitch : $("#calcTypeSwitch").switchBtn("calcType").on("change",function() {
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
                errorMsg: "\u4e3b\u6750\u578b\u53f7\u540d\u79f0\u683c\u5f0f\u9519\u8bef."//"主材型号名称格式错误."
            },
            price: {
                type: "v_price",
                regex: /^[0-9]+\.{0,1}[0-9]{0,2}$/g,
                errorMsg: "\u4ef7\u683c\u5185\u5bb9\u8f93\u5165\u9519\u8bef\u9519\u8bef."//"价格内容输入错误错误."
            },
            discount: {
                type: "v_discount",
                regex: /^(1\.0{1,2}|1|0\.[0-9]{1,2})$/g,
                errorMsg: "\u6298\u6263\u5185\u5bb9\u8f93\u5165\u9519\u8bef\u9519\u8bef."//"折扣内容输入错误错误."
            },
            point: {
                type: "v_point",
                regex: /^(1\.0{1,2}|1|0|0\.[0-9]{1,3})$/g,
                errorMsg: "\u70b9\u4f4d\u5185\u5bb9\u8f93\u5165\u9519\u8bef\u9519\u8bef."//"点位内容输入错误错误."
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
        com.post(api.data.queryBrandByCategoryId, {
                "brand.cid": b
            },
            function(c) {
                materialModel.data.materialBrandData[b] = c.brands;
                $("#materialBrandId").bindData(materialModel.data.materialBrandData[b + ""], "bid", "brandName")
            },
            function(a) {
                return {}
            });
        materialModel.modal.modal("show")
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
                "materialModel.calcType": materialModel.materialModelItems.calcTypeSwitch.prop("checked") ? 1 : 0,
                "materialModel.point": "" == materialModel.materialModelItems.point.val() ? 0 : materialModel.materialModelItems.point.val(),
                "materialModel.base": "" == materialModel.materialModelItems.base.val() ? 0 : materialModel.materialModelItems.base.val()
            };
            com.post(materialModel.editFlg ? api.material.updateMaterialModel: api.material.addMaterialModel, _params,function(a) {
                    1 == a.errorCode ? com.showTips(materialModel.materialModelItems.materialModelName, "\u5f53\u524d\u521b\u5efa\u578b\u53f7\u5df2\u7ecf\u5b58\u5728!", !0) : (materialModel.modal.modal("hide"))

                    $('.btn-search','#condList').trigger('click');
                },
                function(a) {
                    com.showTips(materialModel.materialModelItems.materialModelName, a, !0)
                })
        }
    }

    //删除
    function deleteMaterial(mmid, callback) {
        var  c = {};
        c["ids[0]"] = mmid;

        com.post(api.material.deleteMaterialModelByIds, c, function(){
            com.showAlert(com.info, "删除成功！");
            callback();
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
            },
            function(a) {
                return {}
            });
        materialModel.materialModelItems.measurementUnitId.val(c.measurementUnitId);
        materialModel.materialModelItems.materialUnitPrice.val(c.materialUnitPrice);
        materialModel.materialModelItems.materialPurchasePrice.val(c.materialPurchasePrice);
        materialModel.materialModelItems.discount.val(c.discount);
        materialModel.materialModelItems.base.val(c.base);
        materialModel.materialModelItems.point.val(c.point);
        1 == c.calcType ? (materialModel.materialModelItems.calcTypeSwitch.prop("checked", !0), materialModel.materialModelItems.pointDiv.css("display", "block"), materialModel.materialModelItems.baseDiv.css("display", "none")) : 0 == c.calcType && (materialModel.materialModelItems.calcTypeSwitch.prop("checked", !1), materialModel.materialModelItems.pointDiv.css("display", "none"), materialModel.materialModelItems.baseDiv.css("display", "block"));
        materialModel.modal.modal("show");
    }

    //启用禁用功能
    function updateStatus(mmid, status, failcallBack){
        com.post({"url" : "updateMaterialModelForStatus.do"}, {"materialModel.mmId" : mmid, "materialModel.status" : status}, function(){

        },function(){
            failcallBack && failcallBack();
        });
    }

});

