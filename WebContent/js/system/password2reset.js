
jQuery(function($) {

    var lineprops = (function() {

        return [{
            field: "userId",
            name: "编号",
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
            name: "电话",
            prop: "phone",
            clazz: "grey"
        }];
    })();

    var linebtns = (function() {

        return {
            reset: {
                name: "重置密码",
                clazz: "btn-yellow",
                handle: function(v) {
                    resetPassword(v.userId, v.userName);
                }
            }
        };
    })();

    var buttons = (function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addAction').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.personel.pageUser, null, ["userId", "userName"], "resetPwdPostData", null, false, buildPassword2resetButtons);
    searcher.line("userName", lineprops, linebtns).render();

    function resetPassword(userId, userName){
        com.showConfirm("是否确定重置(" + userName + ")的密码", function(){
            com.post(api.personel.resetPassword, {'user.userId': userId});
        });
    }

});

