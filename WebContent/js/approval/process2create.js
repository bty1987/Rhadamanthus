jQuery(function ($) {

    var process = {
            
        data: params.process,
        searcher: params.searcher,
            
        createBtn: com.focusPage("#createBtn").click(function(){
            process.updateArgs != null ?  updateItem() : createItem();
        }),
        submitBtn: com.focusPage("#submitBtn").click(submit),

        modals: {
            referModal: com.focusPage("#referModal")
        },

        items: {
            name: com.focusPage("#name", "#processForm"),
            no: com.focusPage("#no", "#processForm"),
            code: com.focusPage("#code", "#processForm")
        },

        referItems: {
            id: com.focusPage("#ID"),
            name: com.focusPage("#name",  "#referModal"),
            form: com.focusPage("#form"),
            args: com.focusPage("#args"),
            data: com.focusPage("#data"),
            comment: com.focusPage("#comment"),
            
            validate: com.focusPage("#validate")
        },
        
        args: {},
        
        validates: [
            {"key": "require", "name": "必选验证"},
            {"key": "integer", "name": "整数验证"},
            {"key": "float", "name": "小数验证"}
        ],
        updateArgs: null,
        diffTypes: ["query", "filling"]
    };
    
    if(process.data && process.data.pid){
        
        process.items.no.val(process.data.no);
        process.items.name.val(process.data.name);
        process.items.code.val(process.data.code);
        
        com.post(api.approval.queryProcessItem, {"process.pid": process.data.pid}, function(res){
            
            var items = res.processItems;
            
            $.each(items, function(i, v){
                var data = {
                    "'id'" : v.id,
                    "'name'" : v.name,
                    "'form'" : v.form,
                    "'type'" : v.type,
                    "'validate'" : v.validate,
                    "'data'" : v.data,
                    "'comment'" : v.comment
                };
                drawItem(data, v);
            });
        });
    }

    //隐藏触发
    process.modals.referModal.on('hide.bs.modal', function () {
        com.focusPage("#dataItem").html("");
        process.referItems.validate.html("");
        com.focusPage(".validate").prop("checked", false).trigger("change");
        com.cleanItems(process.referItems);
        process.updateArgs = null;
        
        com.closeTip();
    });

    var $referquery = com.focusPage("#referquery");
    var $referfilling = com.focusPage("#referfilling");
    var $refercondition = com.focusPage("#refercondition");
    var $referother = com.focusPage("#referother");
    
    com.post(api.approval.queryProcessRefer, {}, function(res){
        
        var refers = res.processRefers;
        
        $.each(refers, function(i, v){
            
            var $content = v.type == "query" ? $referquery : v.type == "filling" ? $referfilling : v.type == "condition" ? $refercondition : $referother;
            var btncolor = v.type == "query" ? "btn-success" : v.type == "filling" ? "btn-primary" : v.type == "condition" ? "btn-purple" : "btn-warning";
            
            var $p = $('<p></p>').addClass("col-xs-6").appendTo($content);
            var $btn = $('<button></button>').addClass("btn btn-sm referItem col-xs-12").addClass(btncolor).attr({"data-id": v.id, "data-name": v.name, "data-type": v.type}).appendTo($p);
            var $span = $("<span></span>").text(v.name).appendTo($btn);
        });
        
        com.focusPage(".referItem").click(initItem);
    });

    //点击标签
    function initItem($div, data, flag){
        
        var $btn = $(this);

        var args = $btn.data();

        if(data) args = data;

        com.focusPage("#formFiled .form-group").css("display", "none");

        if(flag){
            //更新
            if(process.diffTypes.contains(args.type)){
                com.focusPage("#formFiled .update").css("display", "block");
            }else if(args.type == "condition"){
                com.focusPage("#formFiled .update").css("display", "block");
                com.focusPage("#formFiled .condition").css("display", "block");
                
                process.referItems.args.val(args.data);
            }else{
                
                com.focusPage("#formFiled .form-group").css("display", "block");
                
                process.referItems.data.val(args.data.replace(new RegExp("/","g"), '\n'));
                process.referItems.comment.val(args.comment);
                
                drawValidate(args.type, args.validate);
            }

            process.referItems.id.val(args.id);
            process.referItems.name.val(args.name);
            
            com.focusPage("#formFiled .noUpdate").removeClass("show").css("display", "none");
        }else{

            com.focusPage("#formFiled .noUpdate").addClass("show");

            if(process.diffTypes.contains(args.type)){
                com.focusPage("#formFiled .show").css("display", "block");
            }else if(args.type == "condition"){
                com.focusPage("#formFiled .show").css("display", "block");
                com.focusPage("#formFiled .condition").css("display", "block");
            }else{
                drawValidate(args.type, null);
                com.focusPage("#formFiled .form-group").css("display", "block");
            }

            process.referItems.id.val(args.id);
            process.referItems.name.val(args.name);
        }

        if(["query", "filling", "upload", "condition"].contains(args.type)) com.focusPage("#formFiled .validate").css("display", "none");
        if(args.type != "select") com.focusPage("#formFiled .data").css("display", "none");

        process.args = args;

        process.modals.referModal.modal("show");
    }

    //点击确定完成比标签左到右复制
    function createItem(){

        if(com.validate("referModal")) return false;
        
        var id = process.args.id;
        var name = process.referItems.name.val();
        var type = process.args.type;
        var validate = "require";
        var data = "";
        var comment = process.referItems.comment.val();

        if(!id){
            id = process.referItems.id.val();
        }
        
        var form = process.referItems.form.val();
        
        if(com.focusPage(".refer-item#" + id).length != 0){
            com.showAlert(com.warning, "控件已存在");
            return false;
        }

        if(process.diffTypes.contains(type) && form != "field"){
            com.showAlert(com.warning, "控件类型不符");
            return false;
        }

        if(type == "condition" && form != "condition"){
            com.showAlert(com.warning, "控件类型不符");
            return false;
        }

        var reg = new RegExp("\n","g");
        if(type == 'select') data = process.referItems.data.val().replace(reg,"/");
        if(type == 'condition') data = process.referItems.args.val();

        var validate = getValidateVal();

        var data = {
            "'id'" : id,
            "'name'" : name,
            "'form'" : form,
            "'type'" : type,
            "'validate'" : validate,
            "'data'" : data,
            "'comment'" : comment
        };

        drawItem(data, null);
        
        process.modals.referModal.modal("hide");
    }
    
    function drawItem(data, v){

        var $content = com.focusPage("#item" + data["'form'"]);
        var licolor = data["'form'"] == "field" ? "item-green" : data["'form'"] == "item" ? "item-blue" : "item-orange";
        
        com.focusPage("#not" + data["'form'"]).css("display", "none");
        
        var $liLine = $('<li></li>').addClass('clearfix refer-item').addClass(licolor).attr("id", data["'id'"]).data(data).appendTo($content);
        var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(data["'name'"])).appendTo($liLine);
        var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix').appendTo($liLine);
        var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
        
        var $btnUp = $('<a></a>').addClass('btn btn-minier btn-warning').html('上移');
        var $btnDown = $('<a></a>').addClass('btn btn-minier btn-inverse').html("下移");
        var $btnUpdate = $('<a></a>').addClass('btn btn-minier btn-yellow').html("更新");
        var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger').html('删除');
        
        var propertyArr = [
           ["标识:", data["'id'"], "grey"],
           ["类型:", data["'type'"], "grey"],
           ["验证:", data["'validate'"], "grey"],
           ["数据:", data["'data'"], "grey"],
           ["备注:", data["'comment'"], "grey"]
        ];

        $.each(propertyArr, function (index,value) {
            var $liProperty = $('<li></li>');
            $('<strong></strong>').html(value[0]).appendTo($liProperty);
            $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
            $liProperty.appendTo($ulProperty);
        });

        $btnUp.click(function(){

            var currli = $(this).parents("li");
            var prevli = currli.prev();

            if(prevli && prevli.length != 0) currli.insertBefore(prevli);
        });

        $btnDown.click(function(){

            var currli = $(this).parents("li");
            var nextli = currli.next();

            if(nextli && nextli.length != 0) currli.insertAfter(nextli);
        });

        $btnUpdate.click(function(){
            process.updateArgs = v;
            $btnUpdate.prop("id", "updateBtn" + v.piid);
            initItem(null, v, true)
        });

        $btnDel.click(function(){
            $(this).parents("li").remove();
        });

        $divBtnWrap.append($btnUp).append($btnDown);
        if(process.data && process.data.pid){
            $divBtnWrap.append($btnUpdate);
        }
        $divBtnWrap.append($btnDel).appendTo($h3);
    }

    //创建表单
    function submit(){
        
        if(com.validate("processForm")) return false;
        
        var index = 0;
        var refers = [];
        
        $.each(com.focusPage(".refer-item"), function(i, e){
            refers.push($.extend({}, $(e).data(), {"'sort'": index++}));
        });
        
        var options = {
            "process.name": process.items.name.val(),
            "process.no": process.items.no.val(),
            "process.code": process.items.code.val(),
            "processItems": refers
        };

        if(process.data && process.data.pid){

            options["process.pid"] = process.data.pid;

            com.post(api.approval.updateProcess, options, function(){
                process.searcher.doSearch();
                com.showAlert(com.info, "修改成功");

                com.closePopup();
            });

        }else{

            com.post(api.approval.addProcess, options, function(res){
                com.cleanItems(process.items);

                com.focusPage("#itemfield").empty();
                com.focusPage("#itemitem").empty();
                com.focusPage("#itemcomment").empty();
                com.focusPage("#itemcondition").empty();

                com.focusPage("#notfield").css("display", "block");
                com.focusPage("#notitem").css("display", "block");
                com.focusPage("#notcomment").css("display", "block");
                com.focusPage("#notcondition").css("display", "block");

                process.searcher.doSearch();
                com.showAlert(com.info, "创建成功");

                com.closePopup();
            });

        }
        
        return false;
    }

    //画验证规则值的框
    function drawValidate(type, params){

        var validates = [];
        if(params != null) {
            validates = params.split('/');
        }

        $.each(process.validates, function(i, v){
            if(v.key != "require" && type != "text") return;

            var $li = $('<li></li>').appendTo(com.focusPage("#validate"));
            var $label = $('<label></label>').appendTo($li);
            var $input = $('<input/>').addClass("ace validate").attr({"type":"checkbox", "value":v.key}).appendTo($label);
            if (validates.contains(v.key)) $input.prop("checked", "checked");
            var $span = $('<span></span>').addClass("lbl").html(v.name).appendTo($label);
        });
    }

    //获取选中的验证规则
    function getValidateVal(){
        var validateValue = "";
        com.focusPage("#validate li input:checked").each(function(i, v){
            validateValue = validateValue + com.focusPage(v).attr("value");
            validateValue = (i+1) == com.focusPage("#validate li input:checked").length ? validateValue :  validateValue + "/";
        });
        return validateValue;
    }

    //更新项目
    function updateItem(){

        if(com.validate("referModal")) return false;

        var id = process.referItems.id.val();
        var name = process.referItems.name.val();

        var validate = getValidateVal();

        var reg = new RegExp("\n","g");

        var data = "";
        if(process.updateArgs.type == 'select') data = process.referItems.data.val().replace(reg, '/');
        if(process.updateArgs.type == 'condition') data = process.referItems.args.val();
        
        var comment = process.referItems.comment.val();

        if(id != process.updateArgs.id && com.focusPage(".refer-item#" + id).length != 0){
            com.showAlert(com.warning, "控件已存在");
            return false;
        }

        var options = {
            "processItem.piid" : process.updateArgs.piid,
            "processItem.id" : id,
            "processItem.name" : name,
            "processItem.validate" : validate,
            "processItem.data" : data,
            "processItem.comment" : comment
        };

        var vals = [id, process.updateArgs.type, validate, data, comment];

        var data = {
            "'id'" : id,
            "'name'" : name,
            "'form'" : process.updateArgs.form,
            "'type'" : process.updateArgs.type,
            "'validate'" : validate,
            "'data'" : data,
            "'comment'" : comment
        };

        com.post(api.approval.updateProcessItem, options, function(res){
            com.focusPage("#updateBtn"+process.updateArgs.piid).parents("li").data(data);
            com.focusPage("#updateBtn"+process.updateArgs.piid).parents("li").find("h3 small").html(name);
            $.each(com.focusPage("#updateBtn"+process.updateArgs.piid).parents("li").find("li b"), function(i, v){
                com.focusPage(v).html(vals[i]);
            });
            process.updateArgs = null;
            com.showAlert(com.info, "更新成功");
            process.modals.referModal.modal("hide");
        });
    }

});