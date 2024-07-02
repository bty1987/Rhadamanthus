$.extend(api.index, {
    designRegionIndex: {
        url: "/views/department/designRegion.html"
    },
    businessRegionIndex: {
        url: "/views/department/businessRegion.html"
    },
    designDeptIndex: {
        url: "/views/department/designDept.html"
    },
    businessDeptIndex: {
        url: "/views/department/businessDept.html"
    },
    materialDeptIndex: {
        url: "/views/department/materialDept.html"
    },
    engineeringDeptIndex: {
        url: "/views/department/engineeringDept.html"
    },
    dutyDeptIndex: {
        url: "/views/department/dutyDept.html"
    },
    departmentTree: {
        url: "/views/department/departmentTree.html"
    }
});

$.extend(api, {
    communion: {

        pageDepartment: {
            url: "pageDepartment.do",
            demo: true
        },
        queryDepartment: {
            url: "queryDepartment.do",
            demo: true
        },
        queryDepartmentByDid: {
            url: "queryDepartmentByDid.do"
        },
        queryDepartmentByNo: {
            url: "queryDepartmentByNo.do"
        },
        queryDepartmentByName: {
            url: "queryDepartmentByName.do"
        },
        addDepartment: {
            url: "addDepartment.do",
            server: "communion"
        },
        updateDepartment: {
            url: "updateDepartment.do",
            server: "communion"
        },
        updateDepartmentForStatus: {
            url: "updateDepartmentForStatus.do",
            server: "communion"
        },

        addDepartmentType: {
            url: "addDepartmentType.do",
            server: "communion"
        },
        queryDepartmentType: {
            url: "queryDepartmentType.do"
        },
        queryDepartmentByDtid: {
            url: "queryDepartmentByDtid.do"
        },
        pageDepartmentType: {
            url: "pageDepartmentType.do",
            demo: true
        },

        queryDataDrawing: {
            url: "queryDataDrawing.do"
        },
        addDataDrawing: {
            url: "addDataDrawing.do",
            server: "communion",
            intercept: true
        },
        deleteDataDrawing: {
            url: "deleteDataDrawing.do",
            server: "communion"
        },
        queryBrandSupplier: {
            url: "queryBrandSupplier.do"
        },
        addBrandSupplier: {
            url: "addBrandSupplier.do"
        },
        deleteBrandSupplier: {
            url: "deleteBrandSupplier.do"
        },
        queryBrandInstorer: {
            url: "queryBrandInstorer.do"
        },
        addBrandInstorer: {
            url: "addBrandInstorer.do"
        },
        deleteBrandInstorer: {
            url: "deleteBrandInstorer.do"
        },

        pageServiceNode: {
            url: "pageServiceNode.do"
        },
        addServiceNode: {
            url: "addServiceNode.do"
        },
        updateServiceNode: {
            url: "updateServiceNode.do"
        },
        updateServiceNodeForStatus: {
            url: "updateServiceNodeForStatus.do"
        },

        // 积分模块api 5条
        queryCppoint: {
            url: "queryCppoint.do"
        },
        queryCppointRecord: {
            url: "queryCppointRecord.do"
        },
        createCppoint: {
            url: "createCppoint.do"
        },
        addupCppoint: {
            url: "addupCppoint.do"
        },
        useupCppoint: {
            url: "useupCppoint.do"
        },

        // 任务
        pageTask: {
            url: "pageTask.do"
        },
        queryTask: {
            url: "queryTask.do"
        },
        queryTaskByRid: {
            url: "queryTaskByRid.do"
        },
        queryTaskForSelf: {
            url: "queryTaskForSelf.do"
        },
        addTask: {
            url: "addTask.do",
            server: "communion"
        },
        updateTask: {
            url: "updateTask.do",
            server: "communion"
        },
        updateTaskForStatus: {
            url: "updateTaskForStatus.do",
            server: "communion"
        },
        updateTaskForIsShow: {
            url: "updateTaskForIsShow.do",
            server: "communion"
        },
        updateRoleTask: {
            url: "updateRoleTask.do",
            server: "communion",
            intercept: true,
        },
        deleteRoleTask: {
            url: "deleteRoleTask.do",
            server: "communion",
            intercept: true,
        },

        pageTaskParam: {
            url: "pageTaskParam.do"
        },
        queryTaskParam: {
            url: "queryTaskParam.do"
        },
        addTaskParam: {
            url: "addTaskParam.do",
            server: "communion"
        },
        updateTaskParam: {
            url: "updateTaskParam.do",
            server: "communion"
        },
        updateTaskParamForStatus: {
            url: "updateTaskParamForStatus.do",
            server: "communion"
        },
        deleteTaskParam: {
            url: "deleteTaskParam.do",
            server: "communion"
        },

        pageCustomerRecord: {
            url: "pageCustomerRecord.do"
        },
        queryCustomerRecord: {
            url: "queryCustomerRecord.do"
        },
        addCustomerRecord: {
            url: "addCustomerRecord.do"
        },


    }
});

$.extend(tools, {
    communion: {
        assistance: function(keyword) {

            var assistance = null;

            com.post(api.data.queryAssistanceByKeyword, {
                "assistance.keyword": keyword
            }, function(res) {

                assistance = res.assistance;
            }, null, false);

            com.post(api.data.queryAssistanceItem, {
                "assistance.aid": assistance.aid
            }, function(res) {

                var container = $('<div></div>');
                var oneDiv = $('<div class="panel-group accordion-style1 accordion-style2"></div>').appendTo(container);
                var twoDiv = $('<div class="panel panel-default"></div>').appendTo(oneDiv);

                $.each(res.assistanceItems, function(i, v) {

                    var fourDiv = $('<div class="panel-heading"></div>').appendTo(twoDiv);
                    var aTag = $('<div data-toggle="collapse in" class="accordion-toggle"></a>').appendTo(fourDiv);
                    var iTag = $('<span></span>').html((i + 1) + ". " + v.title).appendTo(aTag);

                    var sixDiv = $('<div class="panel-body no-border"></div>').appendTo(twoDiv);

                    var sevenDiv = $('<div class=""></div>').appendTo(sixDiv);
                    var eightDiv = $('<div class="clearfix timeline-item"></div>').appendTo(sevenDiv);
                    var nineDiv = $('<div class="col-xs-9 pull-left"></div>').appendTo(eightDiv);
                    var content = $('<h3"></h3>').html(v.content).appendTo(nineDiv);
                    var tenDiv = $('<div class="col-xs-3 pull-right draw""></div>').appendTo(eightDiv);

                    $.each(v.drawings, function(i, value) {

                        var img = $('<img class="photo" style="margin-left: 3px;" width="45" />').appendTo(tenDiv);
                        com.showImg(img, value.drawingUrl, 40, 40, '', null, 0);

                    });
                });

                layer.open({
                    type: 1,
                    title: assistance.title,
                    area: ["40%", ($(window).height() * 0.84 < 750 ? $(window).height() * 0.84 : 750) + "px"],
                    maxmin: false,
                    move: false,
                    zIndex: 5000,
                    content: '<div class="help-content">' + container.html() + '</div>'
                });

                com.popup4photos($(".help-content .draw"));

            });
        }
    },
    department: {
        info: function(content, did) {

            com.post(api.communion.queryDepartmentByDid, {
                "dept.did": did
            }, function(res) {

                var department = res.dept;

                com.showTip(content, "编号:" + department.no + "<br\>名称:" + department.name + "<br\>上级:" + department.fatherDept.name, "bottom");
            });
        }
    }
});