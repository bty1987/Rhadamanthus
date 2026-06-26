$(function() {

    var label = {};

    function buildUserLabelLineprops() {

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
            field: "dept",
            name: "部门",
            prop: "dept.deptName",
            clazz: "grey"
        }, {
            field: "duty",
            name: "职位",
            prop: "duty.name",
            clazz: "grey"
        }, {
            field: "role",
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

    function buildUserLabelLinebtns() {

        return {
            edit: {
                name: "编辑",
                clazz: "btn-yellow",
                handle: function(v) {
                    label.userId = v.userId;
                    label.uid = v.uid;
                    com.switchPage(api.index.checkUser.url);
                }
            },
            label: {
                name: "标签",
                clazz: "btn-success",
                handle: function(v) { labelling(v); }
            }
        };
    }

    var _condArr = ['personel-userId', 'personel-userName', 'personel-deptType'];

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.personel.pageUser, null, _condArr, "selectUser", null, false);
    searcher.line(function(v) { return ' ' + v.userName; }, buildUserLabelLineprops(), buildUserLabelLinebtns()).render();

    function labelling(v) {

        var $label = com.focusPage('#label');
        $label.attr({
            'data-uid': v.uiduid
        });

        params.data.label = v;

        com.popup4page($label, "/views/data/checkLabel.html", "标签管理")
    }

});