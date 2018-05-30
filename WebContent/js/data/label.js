$(function(){
    var type={};

    com.post(api.ds.data,{},function(res){
        $("#type").bindData(res.label,"key","value");
        $.each(res.label,function(i,v){
            type[v.key]=v.value;
        })
    },null,false);


    var displayFunc = (function(){

        var renderList = function(tableId, listData){
        var $tableWrap = $('#' + tableId);
        var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

        if(listData && listData.length){

            $.each(listData, function(i, v){
                var $liLine = $('<li></li>').addClass('item-orange clearfix');
                var $h3 = $('<h3></h3>').addClass('oid').append($('<amall></amall>').addClass('blue').html(v.name));
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $divBtnWrap = $('<div></div>').addClass('pull-right cation-buttons');

                var $btnDel = $('<input />').attr("type","checkbox").addClass('ace ace-switch ace-switch-5').attr("checked", v.status == 0 ? true : false);
                var $btnSpan = $('<span></span>').addClass("lbl status-lbl");

                var labelArr = [
                    ["类型:", type[v.type] , "grey"],
                    ["比例:", v.proportion, "blue"]
                ];

                $.each(labelArr, function(index, value){
                   var $liLabel = $('<li></li>');
                   $('<strong></strong>').html(value[0]).appendTo($liLabel);
                    $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liLabel);
                    $liLabel.appendTo($ulProperty)
                });

                $divBtnWrap.append($btnDel).append($btnSpan).appendTo($h3);

                $liLine.append($h3).append($ulProperty).appendTo($ul);

                $btnDel.click(function(){
                    var cvalue = $btnDel.prop("checked");
                    if(cvalue){
                        cvalue = 0;
                    }else{
                        cvalue = 1;
                    }
                    updatastatus(v.lid, cvalue);
                })

            });
            $ul.appendTo($tableWrap);
        }

        };
        return {
            init : function(tableId, listData){
                $('#' + tableId).html(null);
                renderList(tableId, listData);
            }
        }
    })();

    var labelSearcher = new Searcher();

    labelSearcher.init(["labelname"], "condList", api.data.pageLabel, function(data){
        displayFunc.init('resultList',data);
    },'pagenation', "label", null, false, null, function(){

        var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'addlabel').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    $('a[name="addlabel"]', '#pagenation').click(function(){
        $("#labelName").val("");
        $("#labelModal").modal("show");
    });

    com.post(api.ds.data, {}, function(res){
        $("#type").bindData(res.type, 'key', 'value');
    });

    function updatastatus(labelId, cvalue){
        var options = {};
        options["label.lid"] = labelId;
        options["label.status"] = cvalue;

        com.post(api.data.updataForStatus, options, function(res){
            labelSearcher.doSearch();
        })
    }

    $("#saveBtn").on('click', function(){
        var $_modalBody = $('.modal-body');
        var type = $_modalBody.find('select[name="type"] option:selected').val();

        var options = {
            "label.name" : $("#labelName").val(),
            "label.type" : type,
            "label.proportion":$("#proportion").val()
        }

        com.post(api.data.addLabel, options, function(res){
            labelSearcher.doSearch();
            com.clearValidator("#type", true);
            com.clearValidator("#labelName", true);
            com.showAlert(com.info, "添加成功");

        })
        $("#labelModal").modal("hide");
    })

});