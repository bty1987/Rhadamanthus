$(function() {

    var deptList = null;
    com.post(api.communion.queryDepartment, {}, function(res) {

        deptList = res.deptList;
    }, null, false);

    if (!deptList.length)
        return;

    var deptObj = {}, didList = [];

    // 获取所有叶子节点
    $.each(deptList, function(i, v) {

        didList.push(v.did);
    });

    $.each(deptList, function(i, v) {

        if (v.fatherDept && didList.indexOf(v.fatherDept.did) != -1) {
            didList.splice(didList.indexOf(v.fatherDept.did), 1);
        }
    });

    // 获取根节点
    $.each(deptList, function(i, v) {

        if (v.fatherDept != null && v.fatherDept.did != null && v.fatherDept.did != 0) {
            return true;
        }

        if (!deptObj[v.company]) {
            deptObj[v.company] = {
                name: params.company.name,
                type: 'folder',
                children: {}
            }
        }

        deptObj[v.company]['children'][v.did] = {
            name: v.name,
            type: didList.indexOf(v.did) == -1 ? 'folder' : 'item',
            did: v.did,
            no: v.no
        };
    });

    var getDeptByDid = function(did) {

        var depts = {};

        $.each(deptList, function(i, v) {

            if (!v.fatherDept)
                return true;

            if (v.fatherDept.did == did) {
                depts[v.did] = {
                    name: v.name,
                    type: didList.indexOf(v.did) == -1 ? 'folder' : 'item',
                    did: v.did,
                    no: v.no
                }
            }
        });

        return depts;
    };

    function buildOrganizationLineprops() {

        return [{
            field: "userId",
            name: "员工编号",
            prop: "userId",
            clazz: "grey"
        }, {
            field: "loginId",
            name: "用户名",
            prop: "loginId",
            clazz: "grey"
        }, {
            field: "dept.name",
            name: "部门",
            prop: "dept.name",
            clazz: "grey"
        }, {
            field: "duty.name",
            name: "职位",
            prop: "duty.name",
            clazz: "grey"
        }, {
            field: "role.name",
            name: "角色",
            prop: "role.name",
            clazz: "grey"
        }, {
            field: "phone",
            name: "联系方式",
            prop: "phone",
            clazz: "grey"
        }];
    }

    var _condArr = [];
    var userSeacher = new Searcher();

    com.focusPage('#tree3').ace_tree({
        dataSource: {
            data: function(options, callback) {

                var $data = null;

                if (!("name" in options) && !("type" in options)) {
                    $data = deptObj;// the root tree
                    callback({
                        data: $data
                    });
                    return;
                } else if ("type" in options && options.type == "folder") {
                    if ("children" in options)
                        $data = options.children;
                    else {
                        $data = getDeptByDid(options.did);
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
        'selectable': true,
        'selected-icon': null,
        'unselected-icon': null

    }).on('selected', function(evt, opt) {

        userSeacher.set("condList", "pagenation", "resultList", api.personel.pageUser, {
            'filters[0].data': opt.info[0].no,
            'filters[0].field': 'no',
            'filters[0].op': 'eq'
        }, _condArr, "menuPostData", null, false, null);
        userSeacher.line("userName", buildOrganizationLineprops(), {}).render();
    });
});