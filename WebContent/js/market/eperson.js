
jQuery(function($) {

    var eperson = {
        saveBtn: null,
        modal: null,
        items: [],
        euid: null,
        editFlag: false,
        type: ["设计师", "监理"],
        imgUrl: null,
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

    eperson.saveBtn = com.focusPage("#saveBtn").on("click", saveData);

    $.extend(com.validator, eperson.validator);

    eperson.items.city = com.focusPage("#city");
    eperson.items.name = com.focusPage("#name");
    eperson.items.phone = com.focusPage("#phone");
    eperson.items.experience = com.focusPage("#experience");
    eperson.items.type = com.focusPage("#type");
    eperson.items.imgUrl = com.focusPage("#imgUrl");
    eperson.items.info = com.focusPage("#info");
    eperson.items.path = com.focusPage("#path");

    eperson.modal = com.focusPage("#epersonModal");
    eperson.modal.on('show.bs.modal',function(e){
        com.clearValidator();
    });
    eperson.modal.on('hidden.bs.modal', function () {
        eperson.imgUrl = null;
        eperson.editFlag = false;
    });

    com.post(api.market.queryEcity, {}, function(res){
        var ecitys = res.ecitys;
        $.each(ecitys, function(i, v){
            eperson.ecityItem[v.ecid] = v.city;
        })
    }, null, false);

    com.initChosen('city', api.market.queryEcityByPinYin, "ecity.pinyin", {}, "autoFillKeyValue", "key", "value");

    initUploadBtn();

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
            var $urldiv = $('<div style="border: 1px solid #ccc ;float :left;"></div>').css("width", "75px").css("height","75px").css("margin-right", "10px");
            var img = $('<img />').css("margin-right", "20px").appendTo($urldiv);
            var url = com.showImg(img, v.imgUrl, 75, 75, '', null, 0);
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').html("编辑");

            var propertyArr = [
                ["城市:", eperson.ecityItem[v.cityId], "grey"],
                ["姓名:", v.name, "grey"],
                ["电话:", v.phone, "grey"],
                ["经验:", v.experience  + "年", "blue"],
                ["职位:",eperson.type[v.type], "red"],
                ["简介:", v.info, "grey"]
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);

                if(index == propertyArr.length-1){
                    $liProperty.addClass("col-sm-12").css("padding-left", "85px").css("margin-top", "-15px");
                }
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnEdit).appendTo($h3);

            $liLine.append($urldiv).append($h3).append($ulProperty);

            //编辑
            $btnEdit.click(function(){
                eperson.items.imgUrl.html("");
                com.updateChosen('city', v.cityId, eperson.ecityItem[v.cityId]);
                eperson.items.name.val(v.name);
                eperson.items.phone.val(v.phone);
                eperson.items.experience.val(v.experience);
                eperson.items.type.val(v.type);
                eperson.items.info.val(v.info);
                eperson.items.path.val(v.imgUrl);
                eperson.euid = v.euid;
                eperson.editFlag = true;

                if(v.imgUrl != ""){
                    appendGalleryElement("imgUrl", v.imgUrl, 0);
                }
                com.focusPage("#epersonModal").modal("show");
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
    var conditionList = ["e_cityId", "e_name"];

    searcher.init(conditionList, "condList", api.market.pageEperson, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "epersonPostData", null, false, null, function(){

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addeperson').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    //添加
    com.focusPage('a[name="addeperson"]', '#pagenation').click(function(){
        com.cleanItems(eperson.items);
        com.clearValidator("epersonModal");
        eperson.items.imgUrl.html("");
        com.updateChosen('city', "", "");
        com.focusPage("#epersonModal").modal("show");
    });

    function saveData(){
        if(com.validate() ){
            return;
        }

        if(eperson.items.path.val() == ""){
            com.focusPage("#imgUrl").html("");
            var $text = $('<span></span>').html('请上传头像').css("color", "red").appendTo(com.focusPage("#imgUrl"));
            return;
        }

        var options = {
            "eperson.cityId": eperson.items.city.val(),
            "eperson.name": eperson.items.name.val(),
            "eperson.phone": eperson.items.phone.val(),
            "eperson.experience": eperson.items.experience.val(),
            "eperson.type": eperson.items.type.val(),
            "eperson.info": eperson.items.info.val()
        };

        if(eperson.editFlag){
            eperson.editFlag = false;
            options["eperson.euid"] = eperson.euid;
            if(eperson.imgUrl != null){
                options["eperson.imgUrl"] = eperson.imgUrl;
            }
            com.post(api.market.updateEperson, options, function(res){
                com.showAlert(com.info, "信息修改成功");
                searcher.doSearch();
            });
        }else {
            options["eperson.imgUrl"] = eperson.imgUrl;
            com.post(api.market.addEperson, options, function(res){
                com.showAlert(com.info, "创建成功");
                searcher.doSearch();
            });
        }

        com.focusPage("#epersonModal").modal("hide");
    }
    function initUploadBtn(){
        com.focusPage("#epersonUpload").html("").Huploadify({
            'debug' : false, // 开启调试
            'auto':true, // 是否自动上传
            'successTimeout':150, // 超时时间
            'formData':{ // 附带值
                'uploadType':0,
                'username':'用户名',
                'rnd':'加密密文'
            },
            'multi': false, // 批量上传
            'buttonClass': 'btn btn-success',
            'buttonText': '上传头像',
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
                    com.focusPage("#imgUrl").html("");
                    eperson.imgUrl = dateObj.resUrl;
                    eperson.items.path.val(dateObj.resUrl);
                    appendGalleryElement("imgUrl", dateObj.resUrl, 0);
                }else{
                    console.log(data);
                }
            }
        });
    }

    function appendGalleryElement(galleryId, imgUrl, type){
        var gallery = com.focusPage("#" + galleryId);
        var img = $('<img />');
        var imgA = $("<a></a>").attr("href", com.showImg(img, imgUrl, 150, 150, '150x150', null, type)).attr("data-rel", "colorbox").css("height", "150px").append(img).appendTo(gallery);
        var toolsDiv = $("<div></div>").addClass("tools tools-bottom").appendTo(gallery);
        imgA.colorbox(colorboxArgs);
    }
});
