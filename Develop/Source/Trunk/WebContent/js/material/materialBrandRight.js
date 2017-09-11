
jQuery(function($) {
	
	var materialBrandRight = {
		saveBtn: null,
		cancelBtn: null,
		modal: null,
		
		editFlg: false,
		
		postParam: {
			"user.duty": "驻店导购"
		},
		
		userId: "",
	};
	
	materialBrandRight.saveBtn = $("#saveBtn").on("click", saveData);
	materialBrandRight.cancelBtn = $("#cancelBtn");
	materialBrandRight.modal = $("#materialBrandRightModal");
	
	var tag_input = $("#brandright");

	tag_input.tag({
		placeholder:tag_input.attr('placeholder'),
		//enable typeahead by specifying the source array
		isStaticResource : false,
		flsource: {
			url : api.data.queryBrandForPinYinName,
			postData : {},
			resultList : "brands",
			keyPath : "bid",
			valuePath : "brandName",
			isResultTypeMap : true, //是否是key - value 形式的列表
		},
	});
	
	com.post(api.data.queryBrand, {}, function(res){
		materialBrandRight.materialBrands = res.brands;
	});
	
	var displayFunc  = (function(){

        var renderList = function(tableId,listData){
            var $tableWrap = $('#' + tableId);
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
        	
            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.userName));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnConfig = $('<a></a>').addClass('btn btn-minier btn-inverse').html('型号权限');
            
            var propertyArr = [
               ["编号:", v.userId, "grey"],
               ["用户名:", v.loginId, "grey"],
           ];
            
           $.each(propertyArr, function (index,value) {
               var $liProperty = $('<li></li>');
               $('<strong></strong>').html(value[0]).appendTo($liProperty);
               $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
               $liProperty.appendTo($ulProperty);
           });

            $divBtnWrap.append($btnConfig).appendTo($h3);
            
            $liLine.append($h3).append($ulProperty);
            
            $btnConfig.click(function(){
            	dialogMaterialBrandRight(v.userId);
            });
            
            return $liLine;
        };
        
        return {
            init : function(tableId,listData){
                $('#' + tableId).html(null);
                renderList(tableId,listData);
            },
            drawLine : function(v){
                return creatLine(v);
            }
        }
    })();
	
	var searcher = new Searcher();
	
	searcher.init(["materialerName"], "condList", api.personel.pageUser, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "materialBrandRightPostData", materialBrandRight.postParam);
	
	function dialogMaterialBrandRight(userId){

		materialBrandRight.userId = userId;

		com.post(api.material.queryMaterialBrandRight, {"materialBrandRight.userId": userId}, function(res){

			var _tag = $('#brandright').data('tag');

			while(_tag.values.length > 0){
				_tag.remove(0)
			}

			if(res.materialBrandRight.brands.length){
				$.each(res.materialBrandRight.brands, function(i, v){
					_tag.fladd(v.bid.toString(), v.brandName);
				});

			}
		});

		materialBrandRight.modal.modal("show");
	}
	
	function saveData(){
		if(com.validate())
			return;
		
		var options = {};
		var brandright = "#";
		
		var brandIds = $("#brandright").val();
		if(brandIds == null){
			brandright = "";
		}else{
			/*for(var i=0;i<brandIds.length;i++){
				brandright += brandIds[i] + "#";
			}*/

			brandIds = brandIds.split(', ');
			brandright = brandIds.join('#');
		}
		
		options["materialBrandRight.userId"] = materialBrandRight.userId;
		options["materialBrandRight.brandId"] = brandright;
		
		com.post(api.material.updateMaterialBrandRight, options);
		
		materialBrandRight.modal.modal("hide");   
	}
	
});