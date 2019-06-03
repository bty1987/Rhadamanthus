jQuery(function($) {
    var decorationCase = {
        saveBtn: null,
        modal: null,
        items: [],
        type: ["效果图", "施工图"],
        cid: null,
        editFlag: false,
        validator: null,
        ecityItem: []
    };

    var colorboxArgs = {
        reposition:true,
        scalePhotos:true,
        scrolling:false,
        previous:'<i class="icon-arrow-left"></i>',
        next:'<i class="icon-arrow-right"></i>',
        close:'&times;',
        current:'{current} of {total}',
        maxWidth:'100%',
        maxHeight:'100%'
    };

    decorationCase.saveBtn = com.focusPage("#saveBtn").on("click", saveCaseData);

    decorationCase.modal = com.focusPage("#caseModal");
    decorationCase.modal.on('show.bs.modal',function(e){
        com.clearValidator();
    });
    decorationCase.modal.on('hidden.bs.modal', function () {
        decorationCase.editFlag = false;
        decorationCase.items.cycle.removeAttr("disabled");
    });

    $.extend(com.validator, decorationCase.validator);

    decorationCase.items.city = com.focusPage("#city");
    decorationCase.items.villageName = com.focusPage("#villageName");
    decorationCase.items.designer = com.focusPage("#designer");
    decorationCase.items.supervisor = com.focusPage("#supervisor");
    decorationCase.items.style = com.focusPage("#style");
    decorationCase.items.type = com.focusPage("#type");
    decorationCase.items.room = com.focusPage("#room");
    decorationCase.items.livingRoom = com.focusPage("#livingRoom");
    decorationCase.items.area = com.focusPage("#area");
    decorationCase.items.cycle = com.focusPage("#cycle");
    decorationCase.items.comment = com.focusPage("#comment");
    decorationCase.validateFlag = com.focusPage("#validateFlag");

    com.post(api.ds.market, {}, function(res){
        decorationCase.items.room.bindData(res.room, "key", "value");
        decorationCase.items.livingRoom.bindData(res.livingRoom, "key", "value");
    }, null, false);

    com.initTypeahead('city', api.market.queryEcityByPinYin, "ecity.pinyin", {}, "autoFillKeyValue", "key", "value");
    com.initTypeahead('designer', api.market.queryEpersonByPinYin, "eperson.pinyin", {}, "autoFillKeyValue", "key", "value");
    com.initTypeahead('supervisor', api.market.queryEpersonByPinYin, "eperson.pinyin", {}, "autoFillKeyValue", "key", "value");

    decorationCase.items.cycle.attr("disabled", "disabled");

    com.post(api.market.queryEcity, {}, function(res){
        var ecitys = res.ecitys;
        $.each(ecitys, function(i, v){
            decorationCase.ecityItem[v.ecid] = v.city;
        })
    }, null, false);

    var displayFunc  = (function(){
        var renderList = function(tableId,listData){
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if(listData && listData.length){
                $.each(listData,function(i, v){
                    var $liLine = creatLine(v);
                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v){
            var that = this;
            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.villageName));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').html("编辑");
            var $btnDrawing = $('<a></a>').addClass('btn btn-minier btn-success').html("图片");
            var $btnStatus = $('<input />').attr("type","checkbox").addClass('ace ace-switch ace-switch-5').prop("id", v.hsid);

            if(v.status == 0){
                $btnStatus.attr("checked", false);
            }else if(v.status == 1){
                $btnStatus.attr("checked", true);
            }

            var $btnSpan = $('<span></span>').addClass("lbl display-lbl");

            var designerName;
            var supervisorName;

            if(v.designer.name == null){
                designerName = "无";
            }else{
                designerName = v.designer.name;
            }

            if(v.supervisor.name == null){
                supervisorName = "无";
            }else{
                supervisorName = v.supervisor.name;
            }

            var propertyArr = [
                ["城市:", decorationCase.ecityItem[v.cityId], "grey"],
                ["楼盘名称:", v.villageName, "grey"],
                ["设计师:", designerName, "grey"],
                ["监理:", supervisorName, "grey"],
                ["风格:", v.style, "red"],
                ["类型:", decorationCase.type[v.type], "red"],
                ["户型:", v.houseType, "red"],
                ["面积:", v.area + "平", "blue"],
                ["周期:", v.cycle + "天", "blue"],
                ["说明:", v.comment, "grey"]
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnEdit).append($btnDrawing).append($btnStatus).append($btnSpan).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            //编辑
            $btnEdit.click(function(){
                
                decorationCase.items.type.unbind("change");
                
                cycleChange(decorationCase.items.type, v.cycle);
                
                com.focusPage("#validateDiv").attr("style", "display:none");
                com.cleanTypeahead('designer');
                com.cleanTypeahead('supervisor');

                if(v.type == 0){
                    decorationCase.items.cycle.attr("disabled", "disabled");
                }else if(v.type == 1){
                    decorationCase.items.cycle.removeAttr("disabled");
                }

                com.updateTypeahead('city', v.cityId, decorationCase.ecityItem[v.cityId]);

                if(v.designer.name != null){
                    com.updateTypeahead('designer', v.designer.euid, v.designer.name);
                }

                if(v.supervisor.name != null){
                    com.updateTypeahead('supervisor', v.supervisor.euid, v.supervisor.name);
                }

                decorationCase.items.villageName.val(v.villageName);
                decorationCase.items.style.val(v.style);
                decorationCase.items.type.val(v.type);
                decorationCase.items.room.val(v.houseType.substring(0,2));
                decorationCase.items.livingRoom.val(v.houseType.substring(2));
                decorationCase.items.area.val(v.area);
                decorationCase.items.cycle.val(v.cycle);
                decorationCase.items.comment.val(v.comment);
                decorationCase.cid = v.cid;
                decorationCase.editFlag = true;

                com.focusPage("#caseModal").modal("show");
            });

            //图片
            $btnDrawing.click(function(){
                com.focusPage("#epicture").html("");
                com.post(api.market.queryEpictureByCid, {"epicture.cid" : v.cid}, function(data){
                    var pictures = data.epictures;
                    if(pictures && pictures.length){
                        $.each(pictures, function(i, d){
                            appendGalleryElement("epicture", d.epid, d.url, 0, "", api.market.deleteEpicture, v.cid, api.market.updateEcase);
                        });
                    }
                }, null, false);

                initUploadBtn(v.cid);
                com.focusPage("#epicturePage").modal("show");
            });

            //启用禁用
            $btnStatus.click(function(){
                var checkedFlag = $btnStatus.prop("checked");
                if(checkedFlag){
                    com.focusPage("#" + v.cid).prop("checked", false);
                    updateCaseStatus(v.cid, 1);
                }else{
                    updateCaseStatus(v.cid, 0);
                }
            });

            return $liLine;
        };

        return {
            init : function(tableId,listData){
                com.focusPage('#' + tableId).html(null);
                renderList(tableId,listData);
            },
            drawLine : function(v){
                return creatLine(v);
            }
        }
    })();

    var searcher = new Searcher();
    var conditionList = ["e_cityId", "e_designer","e_supervisor", "e_pictureType", "e_style", "e_houseType", "e_area"];

    searcher.init(conditionList, "condList", api.market.pageEcase, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "casePostData", null, false, null, function(){

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addCase').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    //添加
    com.focusPage('a[name="addCase"]', '#pagenation').click(function(){
        
        decorationCase.items.type.unbind("change");
        
        cycleChange(decorationCase.items.type, null);
        
        com.cleanItems(decorationCase.items);
        com.clearValidator("caseModal");
        
        com.cleanTypeahead('city');
        com.cleanTypeahead('designer');
        com.cleanTypeahead('supervisor');
        
        decorationCase.items.cycle.attr("disabled", "disabled");
        
        com.focusPage("#validateDiv").attr("style", "display:none");
        com.focusPage("#caseModal").modal("show");
    });

    function saveCaseData(){
        
        if(com.validate("caseModal")){
            return false;
        }

        if(decorationCase.items.designer.val() == "" && decorationCase.items.supervisor.val() == ""){
            com.focusPage("#validateDiv").attr("style", "display:display");
            return false;
        }

        var options = {
            'caser.cityId': com.typeahead('city'),
            'caser.villageName': decorationCase.items.villageName.val(),
            'caser.designer.euid': com.typeahead('designer'),
            'caser.supervisor.euid': com.typeahead('supervisor'),
            'caser.style': decorationCase.items.style.val(),
            'caser.type': decorationCase.items.type.val(),
            'caser.houseType': decorationCase.items.room.val() + decorationCase.items.livingRoom.val(),
            'caser.area': decorationCase.items.area.val(),
            'caser.cycle': decorationCase.items.cycle.val(),
            'caser.comment': decorationCase.items.comment.val()
        };

        if(decorationCase.editFlag){
            decorationCase.editFlag = false;
            options["caser.cid"] = decorationCase.cid;
            com.post(api.market.updateEcase, options, function(res){
                com.showAlert(com.info, "修改成功");
                searcher.doSearch();
            });
        }else{
            com.post(api.market.addEcase, options, function(res){
                com.showAlert(com.info, "创建成功");
                searcher.doSearch();
            });
        }

        com.focusPage("#caseModal").modal("hide");
    }

    //更新状态
    function updateCaseStatus(cid, cvalue){
        
        var options = {};
        options["caser.cid"] = cid;
        options["caser.status"] = cvalue;

        com.post(api.market.updateEcaseForStatus, options, function(res){
            com.focusPage("#" + cid).prop("checked", true);
            searcher.doSearch();
        });
    }

    function initUploadBtn(cid){
        com.focusPage("#epictureUpload").html("").Huploadify({
            'debug' : false, // 开启调试
            'auto':true, // 是否自动上传
            'successTimeout':150, // 超时时间
            'formData':{ // 附带值
                'uploadType':0,
                'username':'用户名',
                'rnd':'加密密文'
            },
            'multi': true, // 批量上传
            'buttonClass': 'btn btn-success',
            'buttonText': '上传图片',
            'overrideEvents' : ['onDialogClose'],  // 不执行默认的onSelect事件
            'fileObjName': 'strutsUploads', // 服务器端脚本使用的文件对象的名称 $_FILES个['upload']
            'uploader':config.media + api.common.uploadImg.url, // 上传处理程序
            'height': '45', // 浏览按钮的高度
            'fileTypeDesc': '支持的格式:', // 在浏览窗口底部的文件类型下拉菜单中显示的文本
            'fileTypeExts': '*.jpg;*.jpeg;*.gif;*.png', // 允许上传的文件后缀
            'fileSizeLimit': '5MB', // 上传文件的大小限制
            'queueSizeLimit' : 10, // 上传数量
            'onUploadSuccess':function(file, data, response){ //上传到服务器,服务器返回相应信息到data里
                var dateObj=eval("("+data+")");
                if(dateObj.errorCode == 0){
                    var options = {};

                    options["epicture.cid"] = cid;
                    options["epicture.url"] = dateObj.resUrl;

                    com.post(api.market.addEpicture, options, function(res){
                        var pic = res.epicture;
                        appendGalleryElement("epicture", pic.epid, dateObj.resUrl, 0, "", api.market.deleteEpicture, cid, api.market.updateEcase);
                    });
                }else{
                    console.log(data);
                }
            }
        });
    }

    function appendGalleryElement(galleryId, imgId, imgUrl, type, editUrl, deleteUrl, cid, defaultUrl){
        var gallery = com.focusPage("#" + galleryId);
        var imgLi = $("<li></li>").attr("id", "gallery_li"+imgId).addClass("text-center").css("border-color", "#ddd").appendTo(gallery);
        var img = $('<img />');
        var imgA = $("<a></a>").attr("href", com.showImg(img, imgUrl, 150, 150, '150x150', null, type)).attr("data-rel", "colorbox").css("height", "150px").append(img).appendTo(imgLi);
        var toolsDiv = $("<div></div>").addClass("tools tools-bottom").appendTo(imgLi);
        var toolsA = $("<a></a>").attr("href", "#").on("click", function(){
            var options = {};
            options["epicture.epid"] = imgId;

            com.post(deleteUrl, options, function(res){
                com.focusPage("#gallery_li"+imgId).remove();
            });
        }).appendTo(toolsDiv);
        $("<i></i>").addClass("icon-remove red").appendTo(toolsA);

        var toolsB = $("<a></a>").attr("href", "#").on("click", function(){
            var options = {};
            options["caser.cid"] = cid;
            options["caser.defaultUrl"] = imgUrl;

            com.post(defaultUrl, options, function(res){
                com.showAlert(com.info, "图片设置成功");
            });
        }).appendTo(toolsDiv);
        $("<i></i>").addClass("icon-ok green").appendTo(toolsB);
        imgA.colorbox(colorboxArgs);
    }

    function cycleChange(tag, cycleValue){
        tag.on("change", function(){
            if(decorationCase.items.type.val() == 0){
                decorationCase.items.cycle.attr("disabled", "disabled");
                if(cycleValue != null){
                    decorationCase.items.cycle.val(0);
                }
            }else if(decorationCase.items.type.val() == 1){
                decorationCase.items.cycle.removeAttr("disabled");
                if(cycleValue != null){
                    decorationCase.items.cycle.val(cycleValue);
                }
            }
        });
    }
});
