jQuery(function ($) {
    var checkuserlabel = {
        list: [{key: "-1", value: "全部"}],
        userPhoto: "",
        profiles: null,
        userId: null,
        styleType: null,
        areaType: null,
        housesType: null,
        ageType: null,
        radio: null,
        checkbox: null,
        labeltype: []
    };

    com.focusPage('#fl-statement').statement("优选", "人员排名");

    checkuserlabel.check = com.focusPage("#check").on('click', checkuser);

    com.post(api.ds.data, {}, function (res) {
        checkuserlabel.labeltype = res.labeltype
    }, null, false);

    displayline();

    function displayline() {
        $.each(checkuserlabel.labeltype, function (i, v) {
            var $div = $('<div class="col-md-4" id="form' + i + '"></div>').appendTo(com.focusPage("#formLabs"));
            var $col = $('<div class="col-sm-12" ></div>');
            var $lal = $('<label class=" control-label no-padding-right">' + v.value + '</label>');
            $div.append($col.append($lal)).append(drowRoid("belongDesignInfo" + i, "roid" + i));
            com.focusPage("#roid"+i).append(choice(com.focusPage("#roid" + i), v.key, "checkbox"))
        })
    }

    function drowRoid(belongDesignInfo1, roid1) {
        var $col_md = $('<div class="col-md-12"></div>');
        var $widget = $('<div class="widget-container-span ui-sortable"></div>');
        var $widget_box = $('<div class="widget-box transparent"></div>');
        var $widget_body = $('<div class="widget-body"></div>');
        var $body_inner = $('<div class="widget-body-inner" id="' + belongDesignInfo1 + '"></div>');
        var $ul = $('<ul class="item-list fl-table-list ui-sortable"></ul>');
        var $li = $('<li style="overflow-y: scroll;height: 160px;" class="item-orange clearfix" id="' + roid1 + '"></li>');

        $col_md.append($widget.append($widget_box.append($widget_body.append($body_inner.append($ul.append($li))))));

        return $col_md;
    }

    function choice(removeid, typeid, type) {

        removeid.find('ul').remove();

        var $ul = $('<ul class="list-unstyled fl-inline-list clearfix"></ul>');
        com.post(api.data.queryLabel, {"label.status": 0}, function (res) {
            $.each(res.labels, function (i, v) {
                if(v.type == typeid){
                    var $li = $('<li style="width: 50%;padding: 0px!important;"></li>');
                    var $label = $('<label style=""></label>');
                    var $input = $('<input>').attr({
                        "type": type,
                        "name": "module" + typeid,
                        "class": "ace",
                        "id": v.lid
                    }).val(v.lid);
                    var $span = $('<span></span>').addClass('lbl').html(v.name);
                    $li.append($label.append($input).append($span));

                    $li.appendTo($ul);
                }
            })
        }, null, false);
        return $ul;
    }

    function checkuser() {
        com.focusPage("#userlabel").css("display", "block");
        com.focusPage(".rem").remove();
        var checkbox = com.focusPage('input[name^="module"]:checked');
        var option = {};
        var k = 0;

        $.each(checkbox, function (i, v) {
            var $v = $(v);

            if (!isNaN($v.val())) {
                option['userLabel[' + k + ']'] = $v.val();
                k++;
            }
        });

        if (checkbox.length == 0) {
            layer.msg("请选择标签");
        } else {
            var userlabels = null;

            com.post(api.data.pickUserLabel, option, function (res) {
                if (res.userlabels == null || res.userlabels.length == 0) {
                    layer.msg("没有符合的人员");
                }

                userlabels = res.userlabels;

                var $row = $('<div class="row rem"></div>').appendTo(com.focusPage("#userlabel"));

                $.each(userlabels, function (i, v) {
                    checkuserlabel.userPhoto = (v.user.userPhoto == null ? " " : v.user.userPhoto);
                    var $li =drawlnke(v,i);
                    $li.appendTo($row);
                });
            }, null, false);
        }
    }

    function drawlnke(v,i){
        var $box = $('<div class="col-xs-6 col-sm-4 pricing-box"></div>');
        var $widget_box = $('<div class="widget-box"></div>');

        var $header = $('<div class="widget-header header-color-dark"></div>');
        var $h5 = $('<h5 class="bigger lighter"><i class="icon-trophy"></i>NO.'+(i+1)+'</h5>');

        var $body = $('<div class="widget-body"></div>');
        var $main = $('<div class="widget-main"></div>');
        var $ul = $('<ul class="list-unstyled spaced2" style="text-align:center"></ul>');
        var $liimg = $('<li></li>').css({"text-align":"center"});
        var $scope = $('<span class="col-md-3"></span>');
        var $number = $('<span class="line-height-1 bigger-170 blue">'+v.scope+'</span><br>');
        var $points = $('<span class="line-height-1 smaller-90">总分数</span>');
        var $div = $('<div id="infoPicture'+i+'"></div>').css({"width":"170px","height":"160px","border-radius":"100px","border":"1px solid #ccc","margin": "0px auto"});
        var $liname = $('<li>姓名:'+v.user.userName+'</li>');
        var $lilabel = $('<li><i class="icon-lightbulb bigger-120"></i>&nbsp;&nbsp;精通的标签:</li>');
        var $profile = $('<div class="profile-skills"></div>');
        var $phone = $('<li><i class="icon-phone"></i>&nbsp;&nbsp;电话:'+v.user.phone+'</li>');

        var $progress;
        com.post(api.data.queryUserLabelByUid, {"userlabel.user.uid" : v.user.uid}, function(res){
            var userLabel = res.userlabels;

            $.each(res.userlabels, function(i, v){
                if(v.label.isShow == 0) {
                    var num = 0;
                    if (v.scope >= 100) {
                        num = 100;
                        var $bar = $('<div class="progress-bar" style="width:' + num + '%"></div>');
                    } else {
                        num = v.scope;
                        var $bar = $('<div class="progress-bar" style="width:' + num + '%"></div>');
                    }

                    $progress = $('<div class="progress"></div>');

                    var $spanleft = $('<span class="pull-left">' + v.label.name + '</span>');
                    var $spanright = $('<span class="pull-right">' + v.scope + '%</span>');

                    switch (i) {
                        case 0:
                            $bar.addClass("progress-bar-success");
                            break;
                        case 1:
                            $bar.addClass("progress-bar-purple");
                            break;
                        case 2:
                            $bar.addClass("progress-bar-warning");
                            break;
                        case 3:
                            $bar.addClass("progress-bar-danger");
                            break;
                        case 4:
                            $bar.addClass("progress-bar-pink");
                            break;
                    }
                    $progress.append($bar.append($spanleft).append($spanright)).appendTo($profile);
                }
            });
        });

        $box.append($widget_box.append($header.append($h5)).append($body.append($main.append($ul.append($liimg.append($scope.append($number).append($points)).append($div)).append($liname).append($lilabel.append($profile)).append($phone)))));

        var img = $('<img style="border-radius: 100px;"/>').appendTo($div);
        com.showImg(img, checkuserlabel.userPhoto, 170, 160, '', null, 0);

        return $box;
    }
});