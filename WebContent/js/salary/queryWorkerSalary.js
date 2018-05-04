jQuery(function ($) {


    var Project = (function () {

        var project = {
            usernames: $("#usernames"),
            riqi: $('#riqi'),
            phone: $("#phone"),
            list: $("#list"),
        };

        var binding = {
            Cmtbtn: function () {
                $("#cmtbtn").click(function () {

                    $("#jianpan").hide();
                    var riqi = $('#riqi').val();
                    riqiarr = riqi.split("-");

                    if (riqi == "" || riqi == "undefined") {
                        com.showAlert(com.warning, "日期不能为空!");
                        return;
                    }

                    var uid = $('#usernames').attr('data-typeahead-key');
                    var username = $('#usernames').val();

                    if (uid != "undefined" && uid != null && username != "" && username != null) {
                        binding.openPackageGoods(uid, username, riqiarr[0], riqiarr[1]);
                        project.usernames.val("");
                        project.riqi.val("");
                    } else {
                        com.showAlert(com.warning, "请选择您的名字后再点击查询!");
                    }

                });
            },

            BindingEvent: function () {
                //隐藏全屏按钮
                $('#close').hide();

                $('#close').click(function () {
                    $('#bigScreen').parents('.page-content').removeClass('salary-Screen');
                    $('#jianpan').attr('style', 'left: 37%;text-align: center;top :80%');
                    $('#bigScreen').show();
                    $('#close').hide();
                });

                binding.autoFill(api.personel.queryUserForNameByPinyinName, "usernames", "userBases", "uid", "userName");

                project.usernames.click(function () {
                    binding.BindingXfjianpan("usernames");
                });
                //电话
                project.phone.click(function () {
                    binding.BindingXfjianpan("phone");
                });
                //关闭键盘
                $("#xjianpan").click(function () {
                    binding.BindingXfjianpan(false);
                });
                //全屏
                $('#bigScreen').click(function () {
                    $('#close').show();
                    $('#bigScreen').parents('.page-content').addClass('salary-Screen');
                    $('#jianpan').attr('style', 'left: 30%;text-align: center;top :65%');//36 45
                    $('#bigScreen').hide();
                });
                //绑定键盘
                $(document).keyup(function (event) {
                    if (event.keyCode == 27) {
                        $('#bigScreen').parents('.page-content').removeClass('salary-Screen');
                        $('#jianpan').attr('style', 'left: 50%;text-align: center');//40
                        $('#bigScreen').show();
                        $('#close').hide();
                    }
                });
            },

            openPackageGoods: function (uid, username, startTime, endTime) {
                var $popup = $('#viewPopUp');
                $popup.attr({'data-uid': uid});
                $popup.attr({'data-startTime': startTime});
                $popup.attr({'data-endTime': endTime});
                $popup.css({'overflow': 'hidden'});
                var index = layer.open({
                    type: 1,
                    skin: 'layui-layer-molv',
                    title: username + "工费列表",
                    content: $popup,
                    //area: ["100%", ( $(window).height() * 0.84 < 720 ? $(window).height() * 0.84 : 720 ) + "px"],
                    area: ["100%", "100%"],
                    //maxmin: true,
                    zIndex: 9999,
                    btn: ['确定'],
                    success: function (layer, index) {
                        $popup.load("views/salary/viewSalaryWindow.html");
                    },
                    end: function () {
                        $popup.attr('data-gid', null);
                    }
                });
            },

            autoFill: function (url, id, dataValue, key, value) {

                $("#" + id).typeahead({
                    url: url,
                    list: [],
                    postData: {},
                    source: function (query, process) {
                        var options = $.extend({"pinyinName": query, "user.status": 0}, this.options.postData);
                        com.post(this.options.url, options, $.proxy(this.options.callback, this));
                    }, matcher: function (item) {
                        return true;
                    }, callback: function (data) {
                        this.options.list = data[dataValue];
                        this.flprocess(this.options.list, [key], [value]);
                    },
                    isResultTypeMap: true
                    , flupdater: function (k, v) {
                        return v;
                    }
                });
            },

            Bindingdate: function () {
                $('#riqi').daterangepicker(com.dateramgepickerdefault).prev().on(ace.click_event, function () {
                    $(this).next().focus();
                });
                $('div.daterangepicker.dropdown-menu.opensright').css('z-index', 9991);
            },

            BindingXfjianpan: function (id) {
                $("#jianpan .title").css("line-height", $("#jianpan").height() / 5 + "px");

                project.list.empty();
                var jpnub = $("#xfjp td").length;

                binding.move("jianpan");

                $("#xfjp td").unbind("click");

                if (id != false) {
                    $("#jianpan").show();
                    var xfjp_text = $("#" + id).val();

                    $(".input_on").removeClass("input_on");
                    $("#" + id).addClass("input_on");
                    $("#jptitle").html($("#" + id).attr("placeholder"));

                    $("#xfjp td").click(function () {
                        var click = $(this).html();
                        var _text = $("#" + id).val();

                        if (click == "清空") {
                            $("#" + id).val("");
                        } else if (click == "shift") {
                            for (i = 0; i < jpnub; i++) {
                                $("#xfjp td:eq(" + i + ")").html($("#xfjp td:eq(" + i + ")").html().toUpperCase());
                            }
                        } else if (click == "SHIFT") {
                            for (i = 0; i < jpnub; i++) {
                                $("#xfjp td:eq(" + i + ")").html($("#xfjp td:eq(" + i + ")").html().toLowerCase());
                            }
                        } else if (click == "空格") {
                            _text = _text + " ";
                            $("#" + id).val(_text);
                        } else if (click == "back") {
                            _text = _text.slice(0, _text.length - 1);
                            $("#" + id).val(_text);
                        } else {
                            _text = _text + click;
                            $("#" + id).val(_text);
                        }
                        $("#" + id).typeahead('lookup')
                        $("#" + id).focus();
                    })
                } else {
                    $(".input_on").removeClass("input_on");                    //移除选中input的选中样式
                    $("#jianpan").hide();
                }
            },

            move: function (obj) {

                var OffsetX = 0;
                var OffsetY = 0;
                var moveKg = false;
                var csZ = 0;

                function d(id) {
                    return document.getElementById(id);
                }

                $("#" + obj + " .title").bind("touchstart", function () {//mousedown

                    OffsetX = event.changedTouches[0].pageX - d(obj).offsetLeft;
                    OffsetY = event.changedTouches[0].pageY - d(obj).offsetTop;
                    csZ = $("#" + obj).css("z-index");
                    $("#" + obj).css("z-index", "9999");
                    moveKg = true;
                    jpyd();
                });

                function jpyd() {
                    $(document).bind("touchmove", function () {//mousemove
                        var e = e || window.event.changedTouches[0];
                        var mouswX = e.pageX;
                        var mouswY = e.pageY;
                        var moveX = mouswX - OffsetX;
                        var moveY = mouswY - OffsetY;
                        var maxX = $(window).width() - d(obj).offsetWidth;
                        var maxY = $(window).height() - d(obj).offsetHeight;
                        moveX = Math.min(maxX, Math.max(0, moveX));
                        moveY = Math.min(maxY, Math.max(0, moveY));
                        $("#" + obj).css({"left": moveX, "top": moveY});
                    })

                    $(document).bind("touchend", function () {
                        moveKg = false;
                        $("#" + obj).css("z-index", csZ);
                        //$(document).unbind("mousemove mouseup");
                        $(document).unbind("touchmove touchend");
                    })
                }
            },

            init: function () {
                this.Bindingdate();
                this.BindingXfjianpan(false);
                this.BindingEvent();
                this.Cmtbtn();
            }
        };

        return {
            init: function () {
                binding.init();
            }
        }; //Project End

    })();

    Project.init();

});