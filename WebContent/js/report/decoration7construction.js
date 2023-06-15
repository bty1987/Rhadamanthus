$(function() {

    var searcher = new Searcher();

    searcher.base("condList", "decoration7Construction", "resultList", api.report.queryDecoration7Construction);

    searcher.button([{
        id: "updateData",
        name: "更新",
        clazz: "btn-primary",
        icon: "icon-refresh"
    }, {
        id: "export",
        name: "导出",
        clazz: "btn-success",
        icon: "icon-download-alt"
    }, ]);

    var lineprops = [{
        field: "index",
        name: "",
        prop: "",
        type: "numbers",
        fixed: "left"
    }, {
        field: "company",
        name: "公司",
        prop: "company",
        clazz: "grey",
        width: 150,
        fixed: "left"
    }, {
        field: "cs14",
        name: "2015年",
        prop: "cs14",
        clazz: "grey"
    }, {
        field: "cs15",
        name: "2016年",
        prop: "cs15",
        clazz: "grey"
    }, {
        field: "cs16",
        name: "2017年",
        prop: "cs16",
        clazz: "grey"
    }, {
        field: "cs17",
        name: "2018年",
        prop: "cs17",
        clazz: "grey"
    }, {
        field: "cs18",
        name: "2019年",
        prop: "cs18",
        clazz: "grey"
    }, {
        field: "cs19",
        name: "2020年",
        prop: "cs19",
        clazz: "grey"
    }, {
        field: "cs20",
        name: "30%",
        prop: "cs20",
        clazz: "grey"
    }, {
        field: "cs21",
        name: "65%",
        prop: "cs21",
        clazz: "grey"
    }, {
        field: "cs22",
        name: "97%",
        prop: "cs22",
        clazz: "grey"
    }, {
        field: "cs23",
        name: "100%",
        prop: "cs23",
        clazz: "grey"
    }, {
        field: "cs0",
        name: "未开工",
        prop: "cs0",
        clazz: "grey"
    }, {
        field: "cs1",
        name: "已开工",
        prop: "cs1",
        clazz: "grey"
    }, {
        field: "cs2",
        name: "已完工",
        prop: "cs2",
        clazz: "grey"
    }, {
        field: "cs3",
        name: "铲大白",
        prop: "cs3",
        clazz: "grey"
    }, {
        field: "cs4",
        name: "放线",
        prop: "cs4",
        clazz: "grey"
    }, {
        field: "cs5",
        name: "力工",
        prop: "cs5",
        clazz: "grey"
    }, {
        field: "cs6",
        name: "水暖",
        prop: "cs6",
        clazz: "grey"
    }, {
        field: "cs7",
        name: "电工",
        prop: "cs7",
        clazz: "grey"
    }, {
        field: "cs8",
        name: "瓦工",
        prop: "cs8",
        clazz: "grey"
    }, {
        field: "cs9",
        name: "地面找平",
        prop: "cs9",
        clazz: "grey",
        width: 100
    }, {
        field: "cs10",
        name: "木工",
        prop: "cs10",
        clazz: "grey"
    }, {
        field: "cs11",
        name: "油工",
        prop: "cs11",
        clazz: "grey"
    }, {
        field: "cs12",
        name: "水电验收",
        prop: "cs12",
        clazz: "grey",
        width: 100
    }, {
        field: "cs13",
        name: "保洁",
        prop: "cs13",
        clazz: "grey"
    }, {
        field: "cs24",
        name: "设计中",
        prop: "cs24",
        clazz: "grey"
    }, {
        field: "cs25",
        name: "设计完成",
        prop: "cs25",
        clazz: "grey",
        width: 100
    }, {
        field: "cs26",
        name: "定金总数",
        prop: "cs26",
        clazz: "grey",
        width: 100
    }, {
        field: "signedNumber",
        name: "签单总数",
        prop: function(v) {

            return (v.cs14 + v.cs15 + v.cs16 + v.cs17 + v.cs18 + v.cs19)
        },
        clazz: "grey",
        width: 100
    }, {
        field: "houseTotal",
        name: "合计户数",
        prop: function(v) {

            return (v.cs14 + v.cs15 + v.cs16 + v.cs17 + v.cs18 + v.cs19 + v.cs26)
        },
        clazz: "grey",
        width: 100
    }, ];

    var linebtns = []

    searcher.table(lineprops, linebtns);

    searcher.render();

    com.focusPage("#updateData").click(function() {

        com.post(api.report.updateDecoration7Construction, {}, function(data) {

            searcher.doSearch();
            com.showAlert(com.info, "更新成功");
        });
    });

    com.focusPage("#export").click(function() {

        exportation();
    });

    function exportation() {

        if (com.focusPage('span[name="totalRecords"]').text() == 0) {
            com.showAlert(com.warning, "请更新数据");
            return false;
        }
        if (com.focusPage('span[name="totalRecords"]').text() > 2000) {
            com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
            return false;
        }

        com.showConfirm("是否确认导出", function() {

            var decoration7ConstructionsPost = params.decoration7ConstructionsPost;

            com.post(api.report.queryDecoration7Construction, $.extend({}, decoration7ConstructionsPost, {
                "paging.noPage": 1
            }), function(res) {

                $.exceler({
                    column: [["公司", "company"], ['2015年', 'cs14'], ['2016年', 'cs15'], ['2017年', 'cs16'], ['2018年', 'cs17'], ['2019年', 'cs18'], ['2020年', 'cs19'], ['30%', 'cs20'], ['65%', 'cs21'], ['97%', 'cs22'], ['100%', 'cs23'], ['未开工', 'cs0'], ['已开工', 'cs1'], ['已完工', 'cs2'], ['铲大白', 'cs3'], ['放线', 'cs4'], ['水暖', 'cs5'], ['力工', 'cs6'], ['电工', 'cs7'], ['瓦工', 'cs8'], ['地面找平', 'cs9'], ['木工', 'cs10'], ['油工', 'cs11'], ['水电验收', 'cs12'], ['保洁', 'cs13'], ['设计中', 'cs24'], ['设计完成', 'cs25'], ['定金总数', 'cs26'], ['签单总数', 'signedNumber'], ['合计户数', 'houseTotal']],
                    list: res.paging.data
                }, function(v) {

                    v.signedNumber = v.cs14 + v.cs15 + v.cs16 + v.cs17 + v.cs18 + v.cs19;
                    v.houseTotal = v.cs14 + v.cs15 + v.cs16 + v.cs17 + v.cs18 + v.cs19 + v.cs26;
                });
            });
        });
    }
});
