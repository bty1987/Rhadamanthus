/** userExperience.js —— 工作调动经历（只读列表） */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var table = layui.table, $ = layui.jquery;
    var uid = (app.params.personel && app.params.personel.uid) || getUrlUid();
    function getUrlUid() { var m = location.search.match(/[?&]uid=([^&]+)/); return m ? m[1] : null; }
    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'type', title: '类型', width: 120 },
            { field: 'comment', title: '备注', minWidth: 200 }, { field: 'operateTime', title: '调动时间', width: 160 },
            { field: 'createTime', title: '创建时间', width: 160 } ]] });
    if (uid) app.post(api.personel.queryUserExperienceByUid, { 'userExperience.uid': uid }, function (res) {
        table.reload('resultTable', { data: res.userExperiences || [] });
    });

});
}); // end app.ready
