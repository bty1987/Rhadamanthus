$(function () {

    var village = {
        saveBtn: com.focusPage("#saveBtn").on("click", saveData),
        cancellBtn: com.focusPage("#cancelBtn"),
        saveMapBtn: com.focusPage("#saveMapBtn").on("click", saveMap),
        modal: com.focusPage("#villageModal").on("show.bs.modal", function (a) {
            com.clearValidator();
            com.clearValidator("#no", !0)
        }),
        mapModal: com.focusPage('#mapModal').on("hide.bs.modal", function (a) {
            com.focusPage('#mapContainer').removeClass('changing-point');
        }).on("shown.bs.modal", drawMap),
        drawingModal: com.focusPage('#drawingModal').on("show.bs.modal", function (a) {
            com.clearValidator();
        }),
        mapItems: {
            no: com.focusPage("#mapForm [name='no']"),
            name: com.focusPage('#mapForm [name="name"]'),
            city: com.focusPage('#city')
        },
        items: {
            no: com.focusPage("#no").blur(function () {
                $this = $(this);
                void 0 != $this.val() && "" != $this.val().trim() && com.post(api.data.queryVillageById, {
                        "village.no": $this.val()
                    },
                    function (a) {
                        0 < a.village.no ? (com.showTips($this, "该楼盘编号已经存在", !0), village.repeatFlg = !0) : (com.clearValidator("#no", !0), village.repeatFlg = !1)
                    })
            }),
            nameRuleSel: com.focusPage("#nameRuleSel"),
            name: com.focusPage("#villagename"),
            cityProperSel: com.focusPage("#cityProperSel"),
            citySel: com.focusPage("#citySel").on("change", function (b, c) {
                bindCityProper($(this).val(), village.items.cityProperSel, !1, c)
            }),
            developer: com.focusPage("#developer"),
            salesPhone: com.focusPage("#salesPhone"),
            deliveryTime: com.focusPage("#deliveryTime"),
            content: com.focusPage("#content")
        },
        validator: {
            no: {
                type: "v_no",
                regex: /^P_\d{4}$/g,
                errorMsg: "请以P_作为前缀 , 之后以四位数字组成(如P_0001)."
            }
        },
        editFlag: !1,
        repeatFlg: !1,
        cityList: {},
        cityKey: "cid",
        cityValue: "name",
        cityProperList: {},
        cityProperKey: "cpid",
        cityProperValue: "name",
        nameRuleList: {},
        nameRuleValue: "ruleContent",
        url: null,
        vid: null,
        no: null,
        postData : '',
        pageType : params['urlLoadParams'].type,
    };

    if(village.pageType == "village"){

        village.url = api.data.pageVillage;
        village.postData = "villageForVillagePostData"

    }else if(village.pageType == "houseLayout"){

        village.postData = "villageForHouseLayoutPostData"
    }

    var mp;
    
    com.post(api.system.queryCity, {}, function (a) {
        village.cityList = a.citys;
        village.items.citySel.bindData(village.cityList, village.cityKey, village.cityValue, !1).trigger("change")
    });

    com.post(api.common.queryBuildingNameRule, {}, function (a) {
        village.nameRuleList = a.buildingNameRules;
    }, null, false);

    village.items.nameRuleSel.bindData(village.nameRuleList, village.nameRuleValue, village.nameRuleValue, !1).trigger("change");

    com.datetime(village.items.deliveryTime);

    initUploadBtn();

    var displayFunc = (function () {
        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    var $liLine = creatLine(v);
                    $liLine.appendTo($ul);
                });
                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function (v) {
            var $liLine = $('<li></li>').addClass('item-orange clearfix');

            var $urldiv = $('<div style="border: 1px solid #ccc ;float :left;"></div>').css("width", "75px").css("height", "75px").css("margin-right", "10px");
            var img = $('<img />').css("margin-right", "20px").appendTo($urldiv);
            var url = com.showImg(img, v.url, 75, 75, '', null, 0);

            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + v.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnPosition = $('<a></a>').addClass('btn btn-minier btn-yellow').html('位置');
            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-success').html('编辑');
            var $drawingedit = $('<a></a>').addClass('btn btn-minier btn-warning').html('管理图片');
            var $houseLayout = $("<a></a>").addClass("btn btn-minier btn-danger").html("户型");

            var $btnStatus = $('<div></div>').addClass('pull-right');
            var $statusSwitch = $('<input/>').addClass('ace ace-switch ace-switch-5').prop({"type": "checkbox"});
            var $span = $('<span></span>').addClass('lbl');

            var propertyArr = [
                ["楼盘编号:", v.no, "grey"],
                ["所在城市:", v.cityProper.city.name, "grey"],
                ["所在城区:", v.cityProper.name, "grey"],
                ["开发商:", v.developer ? v.developer : "-", "grey"],
                ["售楼电话:", v.salesPhone ? v.salesPhone : "-", "grey"],
                ["交房时间:", v.deliveryTime, "green"],
                ["说明:", v.content, "grey"]
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $btnStatus.append($statusSwitch).append($span);

            if (village.pageType == "village"){
                $divBtnWrap.append($btnPosition).append($btnEdit).append($drawingedit).append($btnStatus).appendTo($h3);
            } else{
                $divBtnWrap.append($houseLayout).appendTo($h3);
            }

            $liLine.append($urldiv).append($h3).append($ulProperty);

            $btnEdit.click(function () {
                editVillage(v);
            });

            $btnPosition.click(function () {
                editPosition(v);
            });

            $drawingedit.click(function () {
                params.vid = v.vid;
                village.vid = v.vid;
                village.url = v.url;
                village.no = v.no;
                managedrawing(v.vid);
            });

            $houseLayout.click(function(){
                params.vid = v.vid;
                com.popup4page("#villagePopUp","/views/data/houseLayout.html","户型");
            })

            !v.status && $statusSwitch.prop("checked", true);
            $statusSwitch.switchBtn("status-lbl").on("click", function () {
                $statusSwitch.prop("checked") ? (updateStatus(v.no, 0, function () {
                    $statusSwitch.removeAttr("checked");
                })) : (updateStatus(v.no, 1, function () {
                    $statusSwitch.prop("checked");
                }));
            });

            return $liLine;
        };

        return {
            init: function (tableId, listData) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function (v) {
                return creatLine(v);
            }
        }
    })();

    var _condArr = ['villageName', 'datacity'];

    var searcher = new Searcher();
    searcher.init(_condArr, "condList", api.data.pageVillage, function (data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "villagePostData", null, false, null, function () {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addVillage').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    // 启用禁用功能
    function updateStatus(id, status, failcallBack) {
        com.post(api.data.updateVillageForStatus, {"village.no": id, "village.status": status}, function () {
        }, function () {
            failcallBack && failcallBack();
        });
    }

    // 添加按钮
    com.focusPage('a[name="addVillage"]', '#pagenation').click(function () {
        village.editFlg = false;
        com.cleanItems(village.items);
        $("#nodiv").css({"display": "none"});
        village.items.citySel.trigger("change");
        village.modal.modal("show");
    });

    // 保存
    function saveData() {
        if (com.validate() || village.repeatFlg) {
            return false;
        }
        var option = {
            "village.no": village.items.no.val(),
            "village.name": village.items.name.val(),
            "village.cityProper.cpid": village.items.cityProperSel.val(),
            "village.developer": village.items.developer.val(),
            "village.salesPhone": village.items.salesPhone.val(),
            "village.deliveryTime": "" == village.items.deliveryTime.val() ? void 0 : village.items.deliveryTime.val(),
            "village.content": village.items.content.val(),
            "village.rule": village.items.nameRuleSel.val()
        };
        var url;
        if (village.editFlg) {
            url = api.data.updateVillage;
        } else {
            url = api.data.addVillage
        }
        com.post(url, option, function (res) {
            village.modal.modal("hide");
            searcher.doSearch();
        });

    }

    // 编辑按钮
    function editVillage(b) {
        village.modal.modal("show");
        village.editFlg = true;
        com.focusPage("#nodiv").css({"display": "block"});
        village.items.cpid = b.cityProper.cpid;
        village.items.no.val(b.no).prop("disabled", !0).css("display", "block");
        village.items.name.val(b.name);
        village.items.citySel.val(b.cityProper.city.cid).trigger("change", function () {
            village.items.cityProperSel.val(b.cityProper.cpid)
        });
        village.items.developer.val(b.developer);
        village.items.salesPhone.val(b.salesPhone);
        village.items.deliveryTime.val(b.deliveryTime);
        village.items.content.val(b.content);
        village.items.nameRuleSel.val(b.rule)
    }

    // 显示图片
    function managedrawing(vid) {
        village.drawingModal.modal("show");
        com.focusPage('#villageDrawing').html("");
        com.post(api.communion.queryDataDrawing, {"dataDrawing.sid": vid, "dataDrawing.type": 0}, function (data) {
            var villageSourcePics = data.dataDrawings;
            if (villageSourcePics && villageSourcePics.length) {
                $.each(villageSourcePics, function (i, value) {
                    appendGalleryElement("villageDrawing", value);
                });
                com.popup4photos("#villageDrawing");
            }
        }, null, false);

        
    }

    // 上传图片
    function initUploadBtn() {
        com.focusPage("#villageUpload").html("").Huploadify({
            'debug': false, // 开启调试
            'auto': true, // 是否自动上传
            'successTimeout': 150, // 超时时间
            'formData': { // 附带值
                'uploadType': 0,
                'username': '用户名',
                'rnd': '加密密文'
            },
            'multi': true, // 批量上传
            'buttonClass': 'btn btn-success',
            'buttonText': '上传图片',
            'overrideEvents': ['onDialogClose'],  // 不执行默认的onSelect事件
            'fileObjName': 'strutsUploads', // 服务器端脚本使用的文件对象的名称
                                            // $_FILES个['upload']
            'uploader': config.media + api.common.uploadImg.url, // 上传处理程序
            'height': '45', // 浏览按钮的高度
            'fileTypeDesc': '支持的格式:', // 在浏览窗口底部的文件类型下拉菜单中显示的文本
            'fileTypeExts': '*.jpg;*.jpeg;*.gif;*.png', // 允许上传的文件后缀
            'fileSizeLimit': '5MB', // 上传文件的大小限制
            'queueSizeLimit': 10, // 上传数量
            'onUploadSuccess': function (file, data, response) { // 上传到服务器,服务器返回相应信息到data里
                var dateObj = eval("(" + data + ")");
                if (dateObj.errorCode == 0) {
                    var options = {};
                    options["dataDrawing.sid"] = params.vid;
                    options["dataDrawing.name"] = dateObj.strutsUploadsFileName;
                    options["dataDrawing.drawingUrl"] = dateObj.resUrl;
                    options["dataDrawing.drawingType"] = 0;
                    options["dataDrawing.type"] = 0;

                    com.post(api.communion.addDataDrawing, options, function (res) {
                        
                        var drawing = res.dataDrawing;
                        
                        appendGalleryElement("villageDrawing", drawing);
                        com.popup4photos("#villageDrawing");
                        
                        if (village.url == null) {
                            updateVillageUrl(village.no, drawing.drawingUrl)
                        }
                    });
                    searcher.doSearch();
                } else {
                    console.log(data);
                }
            }
        });
    }

    function appendGalleryElement(galleryId, value) {
        var gallery = com.focusPage("#" + galleryId);
        var imgLi = $("<li></li>").attr("id", "gallery_li" + value.ddid).addClass("text-center col-sm-4").css("border", "0px").css("border-color", "white").css("padding", "0px").css("height", "150px").css("width", "150px").appendTo(gallery);
        var img = $('<img/>');
        var imgA = $("<a></a>").addClass('cboxElement').attr("target", "_blank").css("height", "150px").append(img).appendTo(imgLi);
        com.showImg(img, value.drawingUrl, 150, 150, value.name, null, value.drawingType);
        var toolsDiv = $("<div></div>").addClass("tools tools-bottom").appendTo(imgLi);
        var toolsA = $("<a></a>").attr("href", "#").on("click", function () {
            com.post(api.communion.deleteDataDrawing, {"dataDrawing.ddid": value.ddid}, function (res) {
                com.focusPage("#gallery_li" + value.ddid).remove();
            });
        }).appendTo(toolsDiv);
        $("<i></i>").addClass("icon-remove red").appendTo(toolsA);

        var toolok = $("<a></a>").attr("href", "#").on("click", function () {
            updateVillageUrl(village.no, value.drawingUrl);
        }).appendTo(toolsDiv);
        $("<i></i>").addClass("icon-ok green").appendTo(toolok);
    }

    function updateVillageUrl(no, url) {
        var options = {};
        options["village.no"] = no;
        options["village.url"] = url;
        com.post(api.data.updateVillageForUrl, options, function (res) {
            village.url = url;
        }, null, false);
        searcher.doSearch();
    }

    // 初始化地图 创建地图函数
    //var mp = createMap();

    function createMap(lng, lat) {
        var mp = new BMap.Map("mapContainer", {enableMapClick: false, minZoom: 11, maxZoom: 20}); // 在百度地图容器中创建一个地图
        mp.centerAndZoom(new BMap.Point(123.38497, 41.810947), 15); // 设定地图中心和坐标并将地图显示在地图容器中
        mp.setMapStyle({style: 'light'});
        mp.enableKeyboard();
        mp.enableScrollWheelZoom(true);

        mp.addEventListener("click", showInfo);

        return mp;
    }

    function showInfo(e) {
        if (!com.focusPage('#mapContainer').hasClass('changing-point')) {
            return;
        }

        mp.clearOverlays();

        var vill = village.currentVill;
        var name = vill.name;
        var x = vill.x;
        var y = vill.y;
        var count = vill.count;
        var comment = name + "已完成订单" + count + "套";

        var mytext = new ComplexCustomOverlay(new BMap.Point(e.point.lng, e.point.lat), name, comment); // 控制标注地址和备注信息

        mp.addOverlay(mytext);

        village.currentVill.tempPoint = {
            x: e.point.lng,
            y: e.point.lat
        }
    }

    // 自定义覆盖物
    function ComplexCustomOverlay(point, text, mouseoverText) {
        this._point = point;
        this._text = text;
        this._mouseoverText = mouseoverText;
    }

    // 标记点提示框样式
    ComplexCustomOverlay.prototype = new BMap.Overlay();
    ComplexCustomOverlay.prototype.initialize = function (map) {
        this._map = map;

        // 定位点
        var circle = document.createElement('section');
        circle.setAttribute('class', 'position-mark');

        this._circle = circle;

        mp.getPanes().labelPane.appendChild(circle);

        // 文字描述
        var div = this._div = document.createElement("div");
        div.setAttribute('class', 'txt');
        // div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat); //堆叠顺序

        var span = this._span = document.createElement("span");
        div.appendChild(span);
        span.innerHTML = this._text;
        var that = this;
        /*
		 * div.onclick = function(){ window.open('html/1.html'); //跳转定向 };
		 */

        // 箭头边框
        var arrowBorder = this._arrow = document.createElement("div");
        arrowBorder.setAttribute('class', 'arrow-border');
        div.appendChild(arrowBorder);

        // 提示框下面的小三角和提示框横向位置
        var arrow = this._arrow = document.createElement("div");
        arrow.setAttribute('class', 'arrow');
        div.appendChild(arrow);

        circle.appendChild(div);
        return circle;// 当调用map.removeOverlay或者map.clearOverlays方法时,API会自动将initialize方法返回的DOM元素进行移除.
    };

    ComplexCustomOverlay.prototype.draw = function () {
        var map = this._map;
        var pixel = map.pointToOverlayPixel(this._point);

        this._circle.style.top = pixel.y - 5 + 'px';
        this._circle.style.left = pixel.x - 5 + 'px';
    };

    // 重选位置点击
    com.focusPage('[name="resetPositionBtn"]').click(function () {
        com.focusPage('#mapContainer').addClass('changing-point');
        mp.clearOverlays();
    });

    // 重新加载地图
    com.focusPage('[name="resetMapBtn"]').click(function () {
        // mp.reset();
        drawMap();
    });

    //确认位置
    com.focusPage("#placeBtn").click(function(){
        getPlace(com.focusPage("#city").val(), com.focusPage("#name").val());
    });

    // 保存位置
    function saveMap() {
        var params = {
            'village.no': village.currentVill.no,
            'village.x': village.currentVill.tempPoint.x,
            'village.y': village.currentVill.tempPoint.y
        };

        com.post(api.data.updateVillageForPosition, params, function (res) {
            village.mapModal.modal('hide');
            searcher.doSearch();
        }, null);
    }

    // 编辑位置
    function editPosition(vill) {
        // 初始化地图 创建地图函数
        mp = createMap();

        village.mapItems.no.val(vill.no);
        village.mapItems.name.val(vill.name);
        village.mapItems.city.val(vill.cityProper.city.name);

        mp && mp.clearOverlays();

        village.mapModal.modal("show");

        village.currentVill = vill;

        var x = vill.x;
        var y = vill.y;

        village.currentVill.tempPoint = {
            x: x,
            y: y
        };
    }

    function drawMap() {
        mp = createMap();
        var vill = village.currentVill;
        var name = vill.name;
        var x = vill.x;
        var y = vill.y;
        var count = vill.count;
        var comment = name + "已完成订单" + count + "套";

        if (x && y) {
            var mytext = new ComplexCustomOverlay(new BMap.Point(x, y), name, comment); // 控制标注地址和备注信息
            mp.addOverlay(mytext);
            // mp.panTo(mytext);
            mp.setCenter(new BMap.Point(x, y));
        }
    }

    function bindCityProper(a, b, d, c) {
        "" != a ? com.post(api.system.queryCityProperByCid, {
                "cityProper.city.cid": a
            },
            function (res) {

                b.bindData(res.cityPropers, village.cityProperKey, village.cityProperValue, d);
                c && c()
            }) : b.bindData([], "", "", d)
    }

    //webapi
    function getPlace(city, villageName){
        $.ajax({
            url: "http://api.map.baidu.com/place/v2/search?query=" + villageName + "&region=" + city + "&output=json&ak=LRGsFoxg2Z21c9on5s5YhBQ9zeewZGw8",
            type: "GET",
            dataType: "JSONP",
            success: function(data){
                var lng;
                var lat;
                var placeFlag;

                if(data.results.length > 0 && data.results[0].location != undefined){
                    lng = data.results[0].location.lng;
                    lat = data.results[0].location.lat;
                    placeFlag = true;
                }else{
                    lng = 123.38497;
                    lat = 41.810947;
                    placeFlag = false;
                }

                village.currentVill.tempPoint.x = lng;
                village.currentVill.tempPoint.y = lat;

                mp = createMap();
                mp = new BMap.Map("mapContainer", {enableMapClick: false, minZoom: 11, maxZoom: 20}); // 在百度地图容器中创建一个地图
                mp.centerAndZoom(new BMap.Point(lng, lat), 15); // 设定地图中心和坐标并将地图显示在地图容器中
                mp.setMapStyle({style: 'light'});
                mp.enableKeyboard();
                mp.enableScrollWheelZoom(true);

                if(placeFlag){
                    var newPoint = new BMap.Point(lng, lat);
                    var marker2 = new ComplexCustomOverlay(newPoint, villageName); // 控制标注地址和备注信息
                    mp.addOverlay(marker2);
                    mp.setCenter(newPoint);
                }

            }
        })
    }

});

