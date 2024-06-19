$(function() {

    var userModule = {

        module: params.system.module

    };

    var seacher = new Searcher();

    seacher.base("userCondList", "userPagenation", "userResultList", api.personel.pageUserByMid);

    seacher.condition(['personel-userId', 'personel-userName', 'personel-roleId', 'personel-phone']);

    seacher.param({
        "module.mid": userModule.module.mid
    });

    seacher.history("userModulePostData");

    var lineprops = [{
        fieId : "userId",
        name : "员工编号",
        prop : "userId",
        clazz : "grey"
    }, {
        fieId : "loginId",
        name : "用户名",
        prop : "loginId",
        clazz : "grey"
    }, {
        fieId : "dept.name",
        name : "部门",
        prop : "dept.name",
        clazz : "grey"
    }, {
        fieId : "duty.name",
        name : "职位",
        prop : "duty.name",
        clazz : "grey"
    }, {
        fieId : "role.name",
        name : "角色",
        prop : "role.name",
        clazz : "grey"
    }, {
        fieId : "phone",
        name : "联系方式",
        prop : "phone",
        clazz : "grey"
    }];

    var linebtus = [];

    seacher.line("userName", lineprops, linebtus).render();

});
