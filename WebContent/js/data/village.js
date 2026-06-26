$(function() {

    var village = {

        btns: {
            saveBtn: com.focusPage("#saveBtn").on("click", saveData),
            cancellBtn: com.focusPage("#cancelBtn"),
            saveMapBtn: com.focusPage("#saveMapBtn").on("click", saveMap)
        },

        modals: {
            modal: com.focusPage("#villageModal").on("hide.bs.modal", function(a) {

                com.clearValidator();
                com.clearValidator("#no", true);
                com.cleanTypeahead("#parentVillage");
                com.focusPage("#parentVillage").removeClass("v_typeahead v_required");
            }),
            mapModal: com.focusPage('#mapModal').on("hide.bs.modal", function(a) {

                com.focusPage('#mapContainer').removeClass('changing-point');
            }).on("shown.bs.modal", drawMap),
            drawingModal: com.focusPage('#drawingModal').on("show.bs.modal", function(a) {

                com.clearValidator();
            })
        },

        mapItems: {
            no: com.focusPage("#mapForm [name='no']"),
            name: com.focusPage('#mapForm [name="name"]'),
            city: com.focusPage('#city')
        },
        items: {
            parentVillage: com.focusPage("#parentVillage"),
            no: com.focusPage("#no").blur(function() {

                var $this = $(this);

                if ($this.val() != 0 && $this.val().trim()) {
                    com.post(api.data.queryVillageByVid, {
                        "village.no": $this.val()
                    }, function(res) {

                        if (a.village.no) {
                            com.showTips($this, "该楼盘编号已经存在", true);
                            village.repeatFlg = true;
                        } else {
                            com.clearValidator("#no", true);
                            village.repeatFlg = false;
                        }

                    })
                }

            }),
            nameRuleSel: com.focusPage("#nameRuleSel"),
            name: com.focusPage("#villagename"),
            cityProperSel: com.focusPage("#cityProperSel"),
            citySel: com.focusPage("#citySel").on("change", function(b, c) {

                bindCityProper($(this).val(), village.items.cityProperSel, false, c)
            }),
            developer: com.focusPage("#developer"),
            salesPhone: com.focusPage("#salesPhone"),
            deliveryTime: com.focusPage("#deliveryTime"),
            mileage: com.focusPage("#mileage"),
            content: com.focusPage("#content")
        },
        validator: {
            no: {
                type: "v_no",
                regex: /^P_\d{4}$/g,
                errorMsg: "请以P_作为前缀 , 之后以四位数字组成(如P_0001)."
            }
        },
        editFlag: false,
        repeatFlg: false,

        vid: null,
        no: null,

        postData: '',
        pageType: params.urlLoadParams.type

    };

    if (village.pageType == "village") {

        village.postData = "villageForVillagePostData"

    } else if (village.pageType == "houseLayout") {

        initUploadBtn();

        village.postData = "villageForHouseLayoutPostData"
    }

    var mp;

    com.post(api.system.queryCity, {}, function(res) {

        village.items.citySel.bindData(res.citys, "cid", "name", false).trigger("change")
    });

    com.post(api.common.queryBuildingNameRule, {}, function(res) {

        village.items.nameRuleSel.bindData(res.buildingNameRules, "ruleContent", "ruleContent", false).trigger("change");
    });

    com.datetime(village.items.deliveryTime);

    com.initTypeahead('parentVillage', api.data.queryVillageForNameByPinyin, "pinyinName", {}, "autoFillKeyValue", "key", "value");

    village.items.parentVillage.on("change", function(res) {

        if (village.items.parentVillage.val().trim() != "") {
            village.items.parentVillage.addClass("v_typeahead");
        } else {
            village.items.parentVillage.removeClass("v_typeahead");
        }
    });

    function buildVillageLineprops() {

        var lineprops = [{
            field: "img",
            name: "图片",
            type: "img",
            prop: "url"
        }, {
            field: "parentVillage",
            name: "上级楼盘",
            prop: function(v) { return com.checkNull(v.parentVillage && v.parentVillage.name, "暂无"); },
            clazz: "grey"
        }, {
            field: "no",
            name: "楼盘编号",
            prop: "no",
            clazz: "grey"
        }, {
            field: "city",
            name: "所在城市",
            prop: "cityProper.city.name",
            clazz: "grey"
        }, {
            field: "cityProper",
            name: "所在城区",
            prop: "cityProper.name",
            clazz: "grey"
        }, {
            field: "developer",
            name: "开发商",
            prop: function(v) { return v.developer ? v.developer : "-"; },
            clazz: "grey"
        }, {
            field: "salesPhone",
            name: "售楼电话",
            prop: function(v) { return v.salesPhone ? v.salesPhone : "-"; },
            clazz: "grey"
        }, {
            field: "deliveryTime",
            name: "交房时间",
            prop: "deliveryTime",
            clazz: "green"
        }, {
            field: "mileage",
            name: "公里数",
            prop: "mileage",
            clazz: "grey"
        }, {
            field: "content",
            name: "说明",
            prop: "content",
            clazz: "grey"
        }];

        return lineprops;
    }

    function buildVillageLinebtns() {

        var btns = {
            status: {
                type: "switch",
                init: function(v) { return v.status == 0; },
                handle: function(v, checked) { updateStatus(v.no, checked ? 0 : 1); }
            }
        };

        if (village.pageType == "village") {
            btns.rule = {
                name: "规则",
                clazz: "btn-yellow",
                handle: function(v) {
                    params.vid = v.vid;
                    params.data.village = v;
                    com.popup4page("#villagePopUp1", api.index.village4rule.url, "规则");
                }
            };
            btns.position = {
                name: "位置",
                clazz: "btn-yellow",
                handle: function(v) { editPosition(v); }
            };
            btns.edit = {
                name: "编辑",
                clazz: "btn-success",
                handle: function(v) { editVillage(v); }
            };
            btns.drawing = {
                name: "管理图片",
                clazz: "btn-warning",
                handle: function(v) {
                    village.vid = v.vid;
                    village.no = v.no;
                    managedrawing(v.vid);
                }
            };
        } else {
            btns.houseLayout = {
                name: "户型",
                clazz: "btn-danger",
                handle: function(v) {
                    params.vid = v.vid;
                    params.data.village = v;
                    com.popup4page("#villagePopUp", "/views/data/houseLayout.html", "户型");
                }
            };
        }

        return btns;
    }

    function buildVillageButtons() {

        if (village.pageType == "houseLayout") {
            return [];
        }

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addVillage').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    }

    var searcher = new Searcher();

    // 扩展查询条件：楼盘名称、城市、开发商、状态、交付时间范围
    searcher.set("condList", "pagenation", "resultList", api.data.pageVillage, null, [
        'data-village-name',
        'system-city',
        'data-village-developer',
        'data-village-status',
        'data-village-delivery-start',
        'data-village-delivery-end'
    ], "villagePostData", null, false, buildVillageButtons);
    searcher.line(function(v) { return ' ' + v.name; }, buildVillageLineprops(), buildVillageLinebtns()).render();

    // 启用禁用功能
    function updateStatus(id, status) {

        com.post(api.data.updateVillageForStatus, {
            "village.no": id,
            "village.status": status
        }, function() {

            searcher.doSearch();
        });
    }

    // 添加按钮
    com.focusPage('a[name="addVillage"]', '#pagenation').click(function() {

        village.editFlg = false;

        com.cleanItems(village.items);

        $("#nodiv").css({
            "display": "none"
        });

        village.items.citySel.trigger("change");

        village.modals.modal.modal("show");
    });

    // 保存
    function saveData() {

        if (com.validate("villageModal") || village.repeatFlg) {
            return false;
        }

        var url = api.data.addVillage;
        var option = {
            "village.no": village.items.no.val(),
            "village.name": village.items.name.val(),
            "village.cityProper.cpid": village.items.cityProperSel.val(),
            "village.parentVillage.no": com.typeahead(village.items.parentVillage),
            "village.developer": village.items.developer.val(),
            "village.salesPhone": village.items.salesPhone.val(),
            "village.deliveryTime": "" == village.items.deliveryTime.val() ? void 0 : village.items.deliveryTime.val(),
            "village.content": village.items.content.val(),
            "village.rule": village.items.nameRuleSel.val(),
            "village.mileage": village.items.mileage.val()
        };

        if (village.editFlg) {
            url = api.data.updateVillage;
        }

        com.post(url, option, function(res) {

            village.modals.modal.modal("hide");

            searcher.doSearch();
        });
    }

    // 编辑按钮
    function editVillage(b) {

        village.editFlg = true;

        com.focusPage("#nodiv").css({
            "display": "block"
        });

        village.items.cpid = b.cityProper.cpid;
        b.parentVillage != null ? com.updateTypeahead("parentVillage", b.parentVillage.no, b.parentVillage.name) : "";
        village.items.no.val(b.no).prop("disabled", !0).css("display", "block");
        village.items.name.val(b.name);
        village.items.citySel.val(b.cityProper.city.cid).trigger("change", function() {

            village.items.cityProperSel.val(b.cityProper.cpid)
        });
        village.items.developer.val(b.developer);
        village.items.salesPhone.val(b.salesPhone);
        village.items.deliveryTime.val(b.deliveryTime);
        village.items.content.val(b.content);
        village.items.nameRuleSel.val(b.rule);
        village.items.mileage.val(b.mileage);

        village.items.parentVillage.addClass("v_required");

        village.modals.modal.modal("show");
    }

    // 显示图片
    function managedrawing(vid) {

        com.focusPage('#villageDrawing').html("");

        com.post(api.communion.queryDataDrawing, {
            "dataDrawing.sid": vid,
            "dataDrawing.type": 0
        }, function(data) {

            var dataDrawings = data.dataDrawings;

            if (dataDrawings && dataDrawings.length) {
                $.each(dataDrawings, function(i, value) {

                    appendGalleryElement("villageDrawing", value);
                });
                com.popup4photos("#villageDrawing");
            }
        }, null, false);

        village.modals.drawingModal.modal("show");
    }

    // 上传图片
    function initUploadBtn() {

        com.uploadify("#villageUpload", "上传图片", api.common.uploadImg, 'btn btn-success', '*.jpg;*.jpeg;*.gif;*.png', {
            'uploadType': 0
        }, 1, function(data) {

            var options = {};

            options["dataDrawing.sid"] = village.vid;
            options["dataDrawing.name"] = data.strutsUploadsFileName;
            options["dataDrawing.drawingUrl"] = data.resUrl;
            options["dataDrawing.drawingType"] = 0;
            options["dataDrawing.type"] = 0;
            options["dataDrawing.filesize"] = data.filesize;

            com.post(api.communion.addDataDrawing, options, function(res) {

                var drawing = res.dataDrawing;

                appendGalleryElement("villageDrawing", drawing);
                com.popup4photos("#villageDrawing");

                updateVillageUrl(village.no, drawing.drawingUrl)
            });

            searcher.doSearch();
        });
    }

    function appendGalleryElement(galleryId, value) {

        var gallery = com.focusPage("#" + galleryId);
        var imgLi = $("<li></li>").attr("id", "gallery_li" + value.ddid).addClass("text-center col-sm-4").css("border", "0px").css("border-color", "white").css("padding", "0px").css("height", "150px").css("width", "150px").appendTo(gallery);
        var img = $('<img/>');
        var imgA = $("<a></a>").addClass('cboxElement').attr("target", "_blank").css("height", "150px").append(img).appendTo(imgLi);
        com.showImg(img, value.drawingUrl, 150, 150, value.name, null, value.drawingType);
        var toolsDiv = $("<div></div>").addClass("tools tools-bottom").appendTo(imgLi);
        var toolsA = $("<a></a>").attr("href", "#").on("click", function() {

            com.post(api.communion.deleteDataDrawing, {
                "dataDrawing.ddid": value.ddid
            }, function(res) {

                com.focusPage("#gallery_li" + value.ddid).remove();
            });
        }).appendTo(toolsDiv);
        $("<i></i>").addClass("icon-remove red").appendTo(toolsA);

        var toolok = $("<a></a>").attr("href", "#").on("click", function() {

            updateVillageUrl(village.no, value.drawingUrl);
        }).appendTo(toolsDiv);
        $("<i></i>").addClass("icon-ok green").appendTo(toolok);
    }

    function updateVillageUrl(no, url) {

        var options = {
            "village.no": no,
            "village.url": url
        };

        com.post(api.data.updateVillageForUrl, options, function(res) {

            searcher.doSearch();
        }, null, false);
    }

    // 初始化地图 创建地图函数
    function createMap(lng, lat) {

        var center = new TMap.LatLng(41.810947, 123.38497);
        var mp = new TMap.Map("mapContainer", {
            enableMapClick: false,
            minZoom: 11,
            maxZoom: 20,
            center: center,
        });

        // mp.centerAndZoom(new TMap.LatLng(123.38497, 41.810947), 15); // 设定地图中心和坐标并将地图显示在地图容器中
        // mp.setMapStyle({
        // style: 'light'
        // });
        // mp.enableKeyboard();
        // mp.enableScrollWheelZoom(true);

        // mp.addEventListener("click", showInfo);
        
        var mapc = com.focusPage("#mapContainer");
        
        mapc.find("canvas").css("height", mapc.height());

        return mp;
    }

    function showInfo(e) {

        if (!com.focusPage('#mapContainer').hasClass('changing-point')) {
            return false;
        }

        clearMultiMarker();

        var vill = village.currentVill;
        var name = vill.name;
        var x = vill.x;
        var y = vill.y;
        var count = vill.count;
        var comment = name + "已完成订单" + count + "套";

        var mytext = new ComplexCustomOverlay(new TMap.Point(e.point.lng, e.point.lat), name, comment); // 控制标注地址和备注信息

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
    // ComplexCustomOverlay.prototype = new TMap.Overlay();
    // ComplexCustomOverlay.prototype.initialize = function(map) {
    //
    // this._map = map;
    //
    // // 定位点
    // var circle = document.createElement('section');
    // circle.setAttribute('class', 'position-mark');
    //
    // this._circle = circle;
    //
    // mp.getPanes().labelPane.appendChild(circle);
    //
    // // 文字描述
    // var div = this._div = document.createElement("div");
    // div.setAttribute('class', 'txt');
    // // div.style.zIndex = TMap.Overlay.getZIndex(this._point.lat); //堆叠顺序
    //
    // var span = this._span = document.createElement("span");
    // div.appendChild(span);
    // span.innerHTML = this._text;
    // var that = this;
    // /*
    // * div.onclick = function(){ window.open('html/1.html'); //跳转定向 };
    // */
    //
    // // 箭头边框
    // var arrowBorder = this._arrow = document.createElement("div");
    // arrowBorder.setAttribute('class', 'arrow-border');
    // div.appendChild(arrowBorder);
    //
    // // 提示框下面的小三角和提示框横向位置
    // var arrow = this._arrow = document.createElement("div");
    // arrow.setAttribute('class', 'arrow');
    // div.appendChild(arrow);
    //
    // circle.appendChild(div);
    // return circle;// 当调用map.removeOverlay或者map.clearMultiMarker方法时,API会自动将initialize方法返回的DOM元素进行移除.
    // };

    ComplexCustomOverlay.prototype.draw = function() {

        var map = this._map;
        var pixel = map.pointToOverlayPixel(this._point);

        this._circle.style.top = pixel.y - 5 + 'px';
        this._circle.style.left = pixel.x - 5 + 'px';
    };

    // 重选位置点击
    com.focusPage('[name="resetPositionBtn"]').click(function() {

        com.focusPage('#mapContainer').addClass('changing-point');
        clearMultiMarker();
    });

    // 重新加载地图
    com.focusPage('[name="resetMapBtn"]').click(function() {

        // mp.reset();
        drawMap();
    });

    // 确认位置
    com.focusPage("#placeBtn").click(function() {

        getPlace(com.focusPage("#city").val(), com.focusPage("#name").val());
    });

    // 保存位置
    function saveMap() {

        var params = {
            'village.no': village.currentVill.no,
            'village.x': village.currentVill.tempPoint.x * 1000000,
            'village.y': village.currentVill.tempPoint.y * 1000000
        };

        com.post(api.data.updateVillageForPosition, params, function(res) {

            village.modals.mapModal.modal('hide');

            searcher.doSearch();
        });
    }

    // 编辑位置
    function editPosition(vill) {

        // 初始化地图 创建地图函数
        // mp = createMap();

        village.mapItems.no.val(vill.no);
        village.mapItems.name.val(vill.name);
        village.mapItems.city.val(vill.cityProper.city.name);

        // mp && clearMultiMarker();

        village.modals.mapModal.modal("show");

        village.currentVill = vill;

        var x = vill.x / 1000000;
        var y = vill.y / 1000000;

        village.currentVill.tempPoint = {
            x: x,
            y: y
        };
    }

    var mpstyle = null;

    function drawMap() {

        if (com.focusPage("#mapContainer>canvas").length == 0) {
            mp = createMap();
        }

        if (!mpstyle) {
            mpstyle = new TMap.MarkerStyle({
                "width": 25, // 点标记样式宽度（像素）
                "height": 35, // 点标记样式高度（像素）
                "anchor": {
                    x: 16,
                    y: 32
                }
            })
        }

        var vill = village.currentVill;
        var name = vill.name;
        var x = vill.x / 1000000;
        var y = vill.y / 1000000;
        var count = vill.count;
        var comment = name + "已完成订单" + count + "套";

        console.log(x)
        console.log(y)

        if (x && y) {

            var latlng = new TMap.LatLng(y, x);

            mp.setCenter(latlng);

            if (!multiMarker) {
                multiMarker = new TMap.MultiMarker({
                    map: mp,
                    styles: {
                        "myStyle": mpstyle
                    },
                    geometries: []
                });
            }

            multiMarker.setGeometries([{
                "id": "1", // 点标记唯一标识，后续如果有删除、修改位置等操作，都需要此id
                "styleId": 'myStyle', // 指定样式id
                "position": latlng, // 点标记坐标位置
                "properties": {// 自定义属性
                    "title": name
                }
            }]);
        }
    }

    function bindCityProper(a, b, d, c) {

        if (a == "") {
            b.bindData([], "", "", d);
        } else {

            com.post(api.system.queryCityProperByCid, {
                "cityProper.city.cid": a
            }, function(res) {

                b.bindData(res.cityPropers, "cpid", "name", d);
                c && c();
            });
        }
    }

    function getPlace(city, villageName) {

        console.log('开始定位楼盘: ' + villageName + ', 城市: ' + city);

        // 调用后台接口进行定位
        com.post(api.data.locateVillage, {
            "village.no": village.currentVill.no
        }, function(res) {

            com.showAlert(com.info, '定位成功');

            // 使用接口返回的楼盘信息(包含更新后的坐标)
            village.currentVill = res.village;

            var x = res.village.x / 1000000;
            var y = res.village.y / 1000000;

            village.currentVill.tempPoint = {
                x: x,
                y: y
            };

            // 重新绘制地图
            if (com.focusPage("#mapContainer>canvas").length == 0) {
                mp = createMap();
            }

            var latlng = new TMap.LatLng(y, x);
            mp.setCenter(latlng);

            // 添加标记点
            if (!multiMarker) {
                multiMarker = new TMap.MultiMarker({
                    map: mp,
                    styles: {
                        "myStyle": mpstyle
                    },
                    geometries: []
                });
            }

            multiMarker.setGeometries([{
                "id": "1",
                "styleId": 'myStyle',
                "position": latlng,
                "properties": {
                    "title": villageName
                }
            }]);

        }, function(err) {
            com.showAlert(com.error, '定位失败: ' + err.errorMsg);
        });
    }

    var multiMarker = null;

    function clearMultiMarker() {

        if (!mp)
            return false;

        if (!multiMarker)
            return false;

        console.log(multiMarker)

        var geos = multiMarker.getGeometries();

        $.each(geos, function(i, v) {
            multiMarker.remove([v.id])
        });
    }

});