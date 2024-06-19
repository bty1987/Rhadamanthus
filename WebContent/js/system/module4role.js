$(function() {

    var roleModule = {

        module: params.system.module

    };

    var seacher = new Searcher();

    seacher.base("condList", "pagenation", "resultList", api.system.pageRoleByMid);

    seacher.condition(["system-module-role-no", "system-module-role-name"]);

    seacher.param({
        "module.mid": roleModule.module.mid
    });

    seacher.history("roleModulePostData");

    var lineprops = [{
        fieId : "no",
        name : "编号",
        prop : "no",
        clazz : "grey"
    }, {
        fieId : "content",
        name : "描述",
        prop : "content",
        clazz : "grey"
    }];

    var linebtus = [];

    seacher.line("name", lineprops, linebtus).render();

});
