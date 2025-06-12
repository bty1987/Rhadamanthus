$(function() {

    var editFeedbackGuarantee = {

        btns: {
            saveBtn: com.focusPage("#editSaveBtn"),
        },
        modals: {

        },
        items: {
            orderId: com.focusPage("#e_orderId"),
            phone: com.focusPage("#e_phone"),
            source: com.focusPage("#e_source"),
            content: com.focusPage("#e_content"),
            cutomerType: com.focusPage("#e_cutomerType"),
            workType: com.focusPage("#e_workType"),
            brandName: com.focusPage("#e_brandName"),
            reportedDate: com.focusPage("#e_reportedDate"),
            renovationYear: com.focusPage("#e_renovationYear"),
            svuid: com.focusPage("#e_svuid"),
            svUserStatus: com.focusPage("#e_svUserStatus"),
            repairResult: com.focusPage("#e_repairResult"),
            plumber‌: com.focusPage("#eplumber‌"),
            electrician‌: com.focusPage("#eelectrician‌"),
            tiler‌: com.focusPage("#etiler‌Type"),
            carpenter‌: com.focusPage("#ecarpenter‌Type‌"),
            painter‌: com.focusPage("#epainter‌‌Type"),

            
        },
        decorationStatus: {},// 订单状态
        typeness: {},// 订单类型

        cid: null,
        bid: null,
        sid: null,
        fgid: null,
        vid: params.customer.vid,
        resUrl: null,
        status: {},
        pids: [],
    };
    

    editFeedbackGuarantee.decorationStatus = constant.decoration().decoration.status.keys;
    editFeedbackGuarantee.typeness = constant.decoration().decoration.typeness.keys; 
    com.datetime(editFeedbackGuarantee.items.reportedDate);
    editFeedbackGuarantee.items.source.bindData(constant.customer().feedbackGuarantee.source.datas, "key", "value");
    editFeedbackGuarantee.items.cutomerType.bindData(constant.customer().feedbackGuarantee.cutomerType.datas, "key", "value");
    editFeedbackGuarantee.items.workType.bindData(constant.customer().feedbackGuarantee.workType.datas, "key", "value");
    editFeedbackGuarantee.items.svUserStatus.bindData(constant.customer().feedbackGuarantee.svUserStatus.datas, "key", "value");
    editFeedbackGuarantee.items.repairResult.bindData(constant.customer().feedbackGuarantee.repairResult.datas, "key", "value");
    com.post(api.ds.customer, {}, function(res) {

        $.each(res.deptType, function(i, v) {

            var label = $('<label style="margin-right: 10px;"></label>').appendTo(com.focusPage("#e_‌choiceDeptType"));
            var inputs = $('<input type="checkbox" class="ace" id="' + v.key + '"  name="deptType" value="' + v.value + '"><span class="lbl blue">' + v.value + '</span>').appendTo(label);
        });
        
        $.each(res.plumber‌Type, function(i, v) {
            var label = $('<label style="margin-right: 10px;"></label>').appendTo(com.focusPage("#eplumber‌"));
            var inputs = $('<input type="checkbox" class="ace" id="' + v.key + '"  name="workType" value="' + v.value + '"><span class="lbl blue">' + v.value + '</span>').appendTo(label);
        });
        
        $.each(res.electrician‌Type, function(i, v) {
            var label = $('<label style="margin-right: 10px;"></label>').appendTo(com.focusPage("#eelectrician‌"));
            var inputs = $('<input type="checkbox" class="ace" id="' + v.key + '"  name="workType" value="' + v.value + '"><span class="lbl blue">' + v.value + '</span>').appendTo(label);
        });
        
     
        $.each(res.tiler‌‌Type, function(i, v) {
            var label = $('<label style="margin-right: 10px;"></label>').appendTo(com.focusPage("#etiler‌Type"));
            var inputs = $('<input type="checkbox" class="ace" id="' + v.key + '"  name="workType" value="' + v.value + '"><span class="lbl blue">' + v.value + '</span>').appendTo(label);        
        });
        

        $.each(res.carpenter‌Type‌, function(i, v) {
            var label = $('<label style="margin-right: 10px;"></label>').appendTo(com.focusPage("#ecarpenter‌Type‌"));
            var inputs = $('<input type="checkbox" class="ace" id="' + v.key + '"  name="workType" value="' + v.value + '"><span class="lbl blue">' + v.value + '</span>').appendTo(label);
        });
        

        $.each(res.painter‌‌Type, function(i, v) {
            var label = $('<label style="margin-right: 10px;"></label>').appendTo(com.focusPage("#epainter‌‌Type"));
            var inputs = $('<input type="checkbox" class="ace" id="' + v.key + '"  name="workType" value="' + v.value + '"><span class="lbl blue">' + v.value + '</span>').appendTo(label);
        });
    });
    
    
    com.initTypeahead('e_brandName', api.data.queryBrandByPinyin, "brand.pinyin", {
        "brand.atttype": 0
    }, 'brands', 'bid', 'name', function(list, k, v) {

        $.each(list, function(index, val) {

            if (val.bid == k) {
            	editFeedbackGuarantee.bid = val.bid;
            	editFeedbackGuarantee.items.brandName.val(val.name);
            }
        });

        return v
    });

    com.initTypeahead('e_svuid', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0,
        "departmentType.name": ""
    }, "autoFillKeyValue", "key", "value");
    
    com.uploadify("#e_path", "图片", api.common.uploadOther, 'btn btn-success blue ', '*.jpg;*.jpeg;*.gif;*.png', {
        'uploadType': 0
    }, 1, function(data) {

    	editFeedbackGuarantee.resUrl = data.resUrl;
        com.focusPage("#e_path").val(data.resUrl);
        com.focusPage("#e_infoPicture").attr("href", com.showImg(com.focusPage("#showImg"), data.resUrl, 150, 150, ''));
 
    });
    
    
    

	    // 多选设置
	$('input[name="echange_workType"]').click(function() {

		if ($(this).is(':checked')) {
			if (this.value == 1) {
				editFeedbackGuarantee.items.plumber‌.show("slow");
			}
			if (this.value == 2) {
				editFeedbackGuarantee.items.electrician‌.show("slow");
			}
			if (this.value == 3) {
				editFeedbackGuarantee.items.tiler‌.show("slow");
			}
			if (this.value == 4) {
				editFeedbackGuarantee.items.carpenter‌.show("slow");
			}
			if (this.value == 5) {
				editFeedbackGuarantee.items.painter‌.show("slow");
			}

		}
		if (!$(this).is(':checked')) {
			if (this.value == 1) {
				editFeedbackGuarantee.items.plumber‌.hide();
			}
			if (this.value == 2) {
				editFeedbackGuarantee.items.electrician‌.hide();
			}
			if (this.value == 3) {
				editFeedbackGuarantee.items.tiler‌.hide();
			}
			if (this.value == 4) {
				editFeedbackGuarantee.items.carpenter‌.hide();
			}
			if (this.value == 5) {
				editFeedbackGuarantee.items.painter‌.hide();
			}

		}
	});    
    
    
    com.post(api.customer.queryFeedbackGuaranteeByFgid, {
        "feedbackGuarantee.fgid": params.fgid
    }, function(res) {

        var $feedbackGuarantee = res.feedbackGuarantee;
        editFeedbackGuarantee.items.orderId.val($feedbackGuarantee.orderId);
        editFeedbackGuarantee.items.phone.val($feedbackGuarantee.phone);
        editFeedbackGuarantee.items.source.val($feedbackGuarantee.source);
        editFeedbackGuarantee.items.content.val($feedbackGuarantee.content);
        
        editFeedbackGuarantee.items.cutomerType.val($feedbackGuarantee.cutomerType);
        editFeedbackGuarantee.items.workType.val($feedbackGuarantee.workType);
        editFeedbackGuarantee.items.brandName.val($feedbackGuarantee.brands);
        editFeedbackGuarantee.items.reportedDate.val($feedbackGuarantee.reportedDate);
        editFeedbackGuarantee.bid=$feedbackGuarantee.bids
        editFeedbackGuarantee.items.renovationYear.val($feedbackGuarantee.renovationYear);
        editFeedbackGuarantee.items.repairResult.val($feedbackGuarantee.repairResult);
        repairResult
        var checkArray = $feedbackGuarantee.deptType.split(","); 
      
        $('#e_‌choiceDeptType input[type="checkbox"]').each(function() {
            var checkboxValue = $(this).val();
            if ($.inArray(checkboxValue, checkArray) !== -1) {
                $(this).prop('checked', true);
            }
        });
        
        var workTypeArray = $feedbackGuarantee.workType.split(","); 
        
        $('#checkboxs input[type="checkbox"]').each(function() {
            var checkboxValue = $(this).val();
            if ($.inArray(checkboxValue, workTypeArray) !== -1) {
                $(this).prop('checked', true);
            }
        });
    });
    
    
    com.focusPage('#editSaveBtn').on("click", function() {

        if (com.validate('editFeedbackGuarantee')) {
            return false;
        }

        var selectedValues = $('input[name="deptType"]:checked').map(function() {

            return $(this).val();
        }).get();
        
        var selectedWorkTypeValues = $('input[name="workType"]:checked').map(function() {

            return $(this).val();
        }).get();


        if (Array.isArray(selectedWorkTypeValues) && selectedWorkTypeValues.length>0) {

        if (Array.isArray(selectedValues) && selectedValues.length) {

            var options = {
                "feedbackGuarantee.fid": params.fid,
                "feedbackGuarantee.fgid": params.fgid,
                "feedbackGuarantee.orderId":editFeedbackGuarantee.items.orderId.val(),
                "feedbackGuarantee.source": editFeedbackGuarantee.items.source.val(),
                "feedbackGuarantee.phone": editFeedbackGuarantee.items.phone.val(),
                "feedbackGuarantee.cutomerType": editFeedbackGuarantee.items.cutomerType.val(),
                "feedbackGuarantee.deptType": selectedValues.join(','),
                "feedbackGuarantee.workType": selectedWorkTypeValues.join(','),
                "feedbackGuarantee.content": editFeedbackGuarantee.items.content.val(),
                "feedbackGuarantee.bids": editFeedbackGuarantee.bid,
                "feedbackGuarantee.brands": editFeedbackGuarantee.items.brandName.val(),
                "feedbackGuarantee.reportedDate": editFeedbackGuarantee.items.reportedDate.val(),
                "feedbackGuarantee.renovationYear": editFeedbackGuarantee.items.renovationYear.val(),
                "feedbackGuarantee.repairResult": editFeedbackGuarantee.items.repairResult.val(),
            };

            com.post(api.customer.updateFeedbackGuarantee, options, function(res) {

               if(editFeedbackGuarantee.resUrl && editFeedbackGuarantee.resUrl.length >0){
            	   
            	   var options1 = {};
                   options1["feedbackDrawing.fid"] = params.fid
                   options1["feedbackDrawing.sid"] = params.fgid
                   options1["feedbackDrawing.path"] = editFeedbackGuarantee.resUrl
                   options1["feedbackDrawing.type"] = 1;

                   com.post(api.customer.addFeedbackDrawing, options1, function(res) {

                       var feedbackDrawing = res.feedbackDrawing;

                   });
               }
                   
            });

            com.showAlert(com.info, "操作成功");
            com.closePopup();
           
        } else {
            com.showAlert(com.warning, "请选择部门类型");
        }
       }else{
      	  com.showAlert(com.warning, "请选择工种类型");
      } 

    });
    
});