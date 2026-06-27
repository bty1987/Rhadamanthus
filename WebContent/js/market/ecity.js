jQuery(function($) {

    var ecity = {
        saveBtn: null,
        modal: null,
        items: [],
        validator: null
    };

    ecity.saveBtn = com.focusPage("#saveBtn").on("click", saveData);

    ecity.items.city = com.focusPage("#city");
    ecity.items.x = com.focusPage("#x");
    ecity.items.y = com.focusPage("#y");

    ecity.modal = com.focusPage("#ecityModal");
    ecity.modal.on('show.bs.modal', function(e) {

        com.clearValidator();
    });

    var lineprops = (function() {

        return [{
            field: "city",
            name: "名称",
            prop: "city",
            clazz: "grey"
        }, {
            field: "y",
            name: "经度",
            prop: "y",
            clazz: "grey"
        }, {
            field: "x",
            name: "纬度",
            prop: "x",
            clazz: "grey"
        }];
    })();

    var buttons = (function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addEcity').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.market.pageEcity, null, ["market-city"], "ecityPostData", null, false, buildEcityButtons);
    searcher.line("city", lineprops, {}).render();

    // 添加
    com.focusPage('a[name="addEcity"]', '#pagenation').click(function() {

        com.cleanItems(ecity.items);
        com.clearValidator("ecityModal");
        com.focusPage("#ecityModal").modal("show");
    });

    function saveData() {

        if (com.validate("ecityModal")) {
            return false;
        }

        var options = {
            "ecity.city": ecity.items.city.val(),
            "ecity.x": ecity.items.x.val(),
            "ecity.y": ecity.items.y.val()
        };

        com.post(api.market.addEcity, options, function(res) {

            com.showAlert(com.info, "创建成功");
            searcher.doSearch();
        });

        com.focusPage("#ecityModal").modal("hide");
    }

});
