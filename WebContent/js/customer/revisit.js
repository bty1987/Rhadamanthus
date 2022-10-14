
$(function () {
	
	var revisit = {
		gladness : {},
	};
	var revisits = {
		btns: {
		addConfirmBtn: com.focusPage("#addConfirmBtn"),
	},
		modals: {
		addModal: com.focusPage("#addModal"),
	},
		items: {
		 decoration : com.focusPage("#decoration"),
		 type : com.focusPage("#type"),
		 ident : com.focusPage("#ident"),
		 gladness: com.focusPage("#gladness"),
		 content : com.focusPage("#content")
	},
		 revisitType:{}
	};
	    revisits.btns.addConfirmBtn.bindClick(visitRevisit);
	    
	    revisits.modals.addModal.on("hide.bs.modal", function () {
	        com.cleanItems(revisits.items);
	        com.clearValidator();
	        com.closeTip();
	    });

    revisits.items.type.bindData(constant.customer().revisit.type.datas,"key","value");
    revisits.items.gladness.bindData(constant.customer().revisit.status.datas,"key","value");

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
        var creatLine=function (v) {
            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue'));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $label = $('<label></label>').addClass('control-label').css({
                'color': 'grey',
                'font-size': '20px',
                "font-weight": "bold"
            });
            com.post(api.ds.customer, {}, function (res) {
            	revisit.gladness = res.revisitGladness.split('key', 'value');
            	
            }, null, false);
            
            var _label = $('<label></label>');

            var propertyArr = [
                ["回访id:", v.rid, "grey"],
                ["装修单号:", v.decoration.orderId, "grey"],
                ["类型:", constant.customer().revisit.type.keys[v.type], "red"],
                ["引用id:", v.ident, "grey"],
                ["操作人:", v.creater.currentName, "grey"],
                ["创建时间:", v.createTime, "grey"],
                ["满意度: ", constant.customer().revisit.status.keys[v.gladness], "red"],
                ["内容:", v.content, "grey"],
            ];
           
            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
                $label.appendTo($h3);
            });

            var _span = $('<span></span>').addClass('lbl blue bigger-150').html(v.decoration.orderId);

            _label.append(_span).appendTo($label);

            $divBtnWrap.appendTo($h3);

            $liLine.append($h3).append($ulProperty);

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
        };
    })();

    var seacher = new Searcher();

    seacher.init(["customer-service-orderId","customer-service-revisit-type"], "condList", api.customer.pageRevisit, function (data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "revisitPostData", null, false, null, function () {
    	
        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'visitRevisit').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    
    });
    
    com.focusPage("#visitRevisit").click(function() {
    	 
    	 revisits.modals.addModal.modal("show");
    });

    function visitRevisit() {
    	 
    	 if (com.focusPage('#decoration').children()){
    		  com.focusPage('#decoration').empty();
    	 }
    	 if (com.focusPage('#ident').children()){
   		      com.focusPage('#ident').empty();
   	     }
    	 if (com.focusPage('#content').children()){
   		      com.focusPage('#content').empty();
   	     }
    	 
    	 if (com.validate('addModal')) {
             return false;
         };
           var options = {
        		"revisit.decoration.orderId":revisits.items.decoration.val(),          
                "revisit.type" : revisits.items.type.val(),
                "revisit.ident" : revisits.items.ident.val(),
                "revisit.gladness": revisits.items.gladness.val(),
                "revisit.content" : revisits.items.content.val()
            }
            com.post(api.customer.visitRevisit ,options ,function(res){
                com.showAlert(com.info, "操作成功");
                seacher.doSearch();
            });
       revisits.modals.addModal.modal("hide");
    }
});