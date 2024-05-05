$(function() {

     var decorationRank = {
         paytype: params['urlLoadParams'].paytype,
         type: params['urlLoadParams'].type, // 0:设计业绩, 1:业务业绩, 2:主材业绩, 3:总业绩
         designer: params.userInfo.user.userId,
         depte: params.userInfo.user.dept.did,
         region: params.userInfo.user.dept.fatherDept.did,
         ranku: null,
         rankd: null,
         rankr: null,
         achi: null,
         title: null,
         sort: null,
     };

     if (decorationRank.type == 0 || decorationRank.type == 1) {
         decorationRank.achi = "rank";
         decorationRank.ranku = "rank1";
         decorationRank.rankd = "rank2";
         decorationRank.rankr = "rank3";
         decorationRank.title = "装修-";
         decorationRank.sort = 0;
     } else if (decorationRank.type == 2) {
         decorationRank.achi = "sachi";
         decorationRank.ranku = "sranku";
         decorationRank.rankd = "srankd";
         decorationRank.rankr = "srankr";
         decorationRank.title = "主材-";
         decorationRank.sort = 1;
     } else if (decorationRank.type == 3) {
         decorationRank.achi = "tachi";
         decorationRank.ranku = "tranku";
         decorationRank.rankd = "trankd";
         decorationRank.rankr = "trankr";
         decorationRank.title = "总业绩-";
         decorationRank.sort = 2;
     }

    // 查询条件
    var $cond = com.focusPage("#condList").html('');

    var $searchBtn = $('<button></button>').addClass('btn btn-xs btn-info btn-search').html('查询');
    var $cleanBtn = $('<button></button>').addClass('btn btn-xs btn-danger btn-clean').css('margin', '0px 3px').html('重置');
    var $tendBtn = $('<button></button>').addClass('btn btn-xs btn-warning btn-clean').html('收|展');

    if (!decorationRank.paytype) {

        condList($cond, $searchBtn, $cleanBtn, $tendBtn, "年份", "year");
        condList($cond, $searchBtn, $cleanBtn, $tendBtn, "月份", "month");
        condList($cond, $searchBtn, $cleanBtn, $tendBtn, "人员", "designer");
        condList($cond, $searchBtn, $cleanBtn, $tendBtn, "部门", "depte");
        condList($cond, $searchBtn, $cleanBtn, $tendBtn, "分区", "region");
        com.focusPage("#year").addClass("v_required");
        com.focusPage("#month").addClass("v_required");

        com.datetime(com.focusPage("#year"), "year");
        com.datetime(com.focusPage("#month"), "month");
    }


    com.initTypeahead('designer', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 3,
        "departmentType.name": ""
    }, "autoFillKeyValue", "key", "value");

    com.initTypeahead('depte', api.communion.queryDepartmentByName, "dept.name", {
        "dept.type.dtid": 2
    }, 'deptList', 'did', 'name', null);

    com.initTypeahead('region', api.communion.queryDepartmentByName, "dept.name", {
        "dept.type.dtid": 1
    }, 'deptList', 'did', 'name', null);

    // 查询结果
    resultList(null);

    // 查询
    $searchBtn.click(function() {

        if (com.validate("condList")) {
            return false;
        }

        var year = com.focusPage("#year").val();
        var month = com.focusPage("#month").val();
        var designer = com.typeahead("designer");
        var depte = com.typeahead("depte");
        var region = com.typeahead("region");

        resultList(year + month, designer, depte, region);
    });

    // 重置
    $cleanBtn.click(function() {

        com.focusPage('.fl-filter-inline').each(function(i, v) {

            $($(v).children()[1]) && $($(v).children()[1]).removeAttr('data-typeahead-key').val('');
        });
    });

    // 收|展
    $tendBtn.click(function() {

        com.focusPage('.fl-filter-inline').each(function(i, v) {

            if (i > 3) {
                $(v).toggle();
            }
        });
    });

    // 排名
    function rank(url, div, name, list, month, designer, depte, region, api, title, sort) {

        var str = api == 1 ? "decorationRegionRank" : api == 2 ? "decorationDepartmentRank" : "decorationRank";

        var options = {[str+".month"] : month, [str+".type"] : decorationRank.type == 1 ? 1 : 0, [str+".designer.userId"] : designer, [str+".depte.did"] : depte, [str+".region.did"] : region};

        var $ul = $('<ul></ul>').addClass('col-sm-4 item-list fl-table-list ui-sortable widget-box transparent').appendTo(div);

        var $title = $('<div></div>').addClass('widget-header widget-header-flat').append($('<h4></h4>').addClass("lighter").append($('<i></i>').addClass("icon-star orange")).append($('<span></span>').html(title))).appendTo($ul);

        com.post(url, options, function(res) {

            var ranks = res.ranks;

            ranks.sort(function(a,b){

                return sort == 0 ? b.rank - a.rank : sort == 1 ? b.sachi - a.sachi : b.tachi - a.tachi;
            });

            if (ranks && ranks.length) {
                $.each(ranks, function(i, v) {

                    var $liLine = $('<li></li>').addClass('item-orange clearfix');
                    var $h4 = $(i > 2 ? '<h4></h4>': '<h2></h2>').css("margin-top", "0px").addClass('oid').append($('<small></small>').addClass('blue').html(getElement(v, name.split('.'))));
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

                    $.each(list, function(index, value) {

                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(getElement(v, value[1].split('.'))).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo(["rank1", "rank2", "rank3", "sranku", "srankd", "srankr", "tranku", "trankd", "trankr"].indexOf(value[1]) != -1? $ulStyle: $ulProperty);
                    });

                    $liLine.append($h4).append($ulProperty).append($ulStyle);

                    $liLine.appendTo($ul);
                });
            } else {
                var $metaData = $ul.html('').append($title);
                var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($metaData);
                var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
                $mesg.append($('<span></span>').text('无可用数据提供'));
            };
        });
    }

    function getElement(o, props) {

        var prop = props.shift();

        if (props.length == 0) {
            return o[prop];
        } else if (o[prop]) {
            return getElement(o[prop], props);
        }

        return "";
    }

    function resultList(month, designer, depte, region) {
        var type = decorationRank.type;
        var $rank1 = com.focusPage("#rank1").html('');
        var $rank2 = com.focusPage("#rank2").html('');

        var ranku = decorationRank.ranku, rankd = decorationRank.rankd, rankr = decorationRank.rankr, achi = decorationRank.achi, title = decorationRank.title, sort = decorationRank.sort;

        var regionRank = [["编号:", "region.no", "blue"], ["分区:", "region.name", "grey"], ["总业绩:", achi, "blue"], ["总排名:", type==0 || type==1 ? "rank1" : rankr, "blue"]];
        var departmentRank = [["编号:", "depte.no", "blue"], ["部门:", "depte.name", "grey"], ["分区:", "region.name", "grey"], ["总业绩:", achi, "blue"], ["总排名:", type==0 || type==1 ? "rank1" : rankd, "blue"], ["分区排名:", type==0 || type==1 ? "rank2" : rankr, "blue"]];
        var rank1 = [["编号:", "designer.userId", "blue"], ["人员:", "designer.currentName", "grey"], ["分区:", "region.name", "grey"], ["部门:", "depte.name", "grey"], ["总业绩:", achi, "blue"], ["总排名:", ranku, "blue"], ["分区排名:", rankr, "blue"], ["部门排名:", rankd, "blue"]];
        var rank2 = [["编号:", "designer.userId", "blue"], ["人员:", "designer.currentName", "grey"], ["部门:", "depte.name", "grey"], ["总业绩:", achi, "blue"], ["总排名:", ranku, "blue"], ["部门排名:", rankd, "blue"]];
        var rank3 = [["编号:", "designer.userId", "blue"], ["人员:", "designer.currentName", "grey"], ["分区:", "region.name", "grey"], ["总业绩:", achi, "blue"], ["总排名:", ranku, "blue"], ["分区排名:", rankr, "blue"]];

        if (decorationRank.paytype == "region") {// -分区
            rank(api.report.queryDecorationRegionRank, $rank1, "region.name", regionRank, month, null, null, null, 1, type == 1 ? "业务分区排名": title + "设计分区排名", sort);
            rank(api.report.queryDecorationDepartmentRank, $rank1, "depte.name", departmentRank, month, designer, depte == null || depte == "" ? decorationRank.depte : depte, region, 2, type == 1 ? "业务部分区排名" : title + "设计部分区排名", sort);
            rank(api.report.queryDecorationRank, $rank1, "designer.currentName", rank3, month, designer, depte, region == null || region == "" ? decorationRank.region : region, 3, type == 1 ? "业务员分区排名": title + "设计师分区排名" , sort);
        } else if (decorationRank.paytype == "depte") {// -部门
            rank(api.report.queryDecorationRegionRank, $rank1, "region.name", regionRank, month, null, null, null, 1, type == 1 ? "业务分区排名" : title + "设计分区排名"  , 0);
            rank(api.report.queryDecorationDepartmentRank, $rank1, "depte.name", departmentRank, month, null, null, null, 2, type == 0 ?  "业务部排名" : title + "设计部排名" , 0);
            rank(api.report.queryDecorationDepartmentRank, $rank1, "depte.name", departmentRank, month, designer, depte == null || depte == "" ? decorationRank.depte : depte, region, 2, type == 1 ? "业务部门分区排名" : title + "设计部分区排名", sort);
            rank(api.report.queryDecorationRank, $rank2, "designer.currentName", rank3, month, designer, depte, region == null || region == "" ? decorationRank.region : region, 3, type == 1 ? "业务员分区排名" : title + "设计师分区排名", sort);
            rank(api.report.queryDecorationRank, $rank2, "designer.currentName", rank2, month, designer, depte == null || depte == "" ? decorationRank.depte : depte, region, 3, type == 1 ? "业务员部门排名" : title + "设计师部门排名", sort);
        } else if (decorationRank.paytype == "designer") {// -人员
            rank(api.report.queryDecorationRank, $rank1, "designer.currentName", rank3, month, designer, depte, region == null || region == "" ? decorationRank.region : region, 3, type == 1 ? "业务员分区排名": title + "设计师分区排名" , sort);
            rank(api.report.queryDecorationRank, $rank1, "designer.currentName", rank2, month, designer, depte == null || depte == "" ? decorationRank.depte : depte, region, 3, type == 1 ? "业务员部门排名" : title + "设计师部门排名", sort);
        } else {// -高级
            rank(api.report.queryDecorationDepartmentRank, $rank1, "depte.name", departmentRank, month, designer, depte == null || depte == "" ? decorationRank.depte : depte, region, 2, type == 1 ? "业务部分区排名" : title + "设计部分区排名", sort);
            rank(api.report.queryDecorationRank, $rank1, "designer.currentName", rank3, month, designer, depte, region == null || region == "" ? decorationRank.region : region, 3, type == 1 ? "业务员分区排名" : title + "设计师分区排名", sort);
            rank(api.report.queryDecorationRank, $rank1, "designer.currentName", rank2, month, designer, depte == null || depte == "" ? decorationRank.depte : depte, region, 3, type == 1 ? "业务员部门排名" : title + "设计师部门排名", sort);
            rank(api.report.queryDecorationRegionRank, $rank2, "region.name", regionRank, month, null, null, null, 1, type == 1 ? "业务分区排名" : title + "设计分区排名", sort);
            rank(api.report.queryDecorationDepartmentRank, $rank2, "depte.name", departmentRank, month, null, null, null, 2, type == 1 ? "业务部排名" : title + "设计部排名", sort);
            rank(api.report.queryDecorationRank, $rank2, "designer.currentName", rank1, month, null, null, null, 3, type == 1 ? "业务员全员排名" : title + "设计师全员排名", sort);
        };

    }

    function condList($cond, $searchBtn, $cleanBtn, $tendBtn, name, condCode) {

        var $item = $('<span></span>').addClass('fl-filter-inline');
        var $label = $('<label></label>').html("  " + name + ":");

        $label.appendTo($item);

        var $showItem, $valueItem;

        $showItem = $('<input>').attr({
            "type": "text",
            "id": condCode,
            "data-rqs": "month",
            "data-op": "eq",
            "data-type": "text"
        }).appendTo($item);

        $cond.append($item).append($searchBtn).append($cleanBtn).append($tendBtn);

    }

});
