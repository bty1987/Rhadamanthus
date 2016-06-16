com = {
	alertDiv: 'fl-alert',
	error: 'error',
	warning: 'warning',
	info: 'info',
	genderType: {"女":true, "男":false, "true": "女", "false": "男"},
	isOrNotType: {"是":true, "否":false, "true": "是", "false": "否"},
	deptType: {"designRegion": "设计大区", "businessRegion": "业务大区", "designDept": "设计部", "businessDept": "业务部", "materialDept": "主材部", "engineeringDept": "工程部", "qualityDept": "质检部", "supervisionDept": "监理部", "dutyDept": "职能部", "adminDept": "行政部", "financeDept": "财务部"},
	currentTime: function() {
		var date = new Date();
		var str = "";
		str += date.getFullYear() + '-';
		str += date.getMonth() + 1 + '-';
		str += date.getDate() + " ";
		str += date.getHours() + ':';
		str += date.getMinutes() + ':';
		str += date.getSeconds();
		return str;
	}, resizeContainer: function(){
	}, post: function(url, options, callback, failCallback, asyncFlag) {
		var dfd = $.Deferred(); 
		var opts = $.extend({}, options || {});
		var optAsync = true;
		if(asyncFlag == undefined || asyncFlag == true){
			optAsync = true;
		}else{
			optAsync = false;
		}
		
		var server = "";
		if(url.server){
			server = params[url.server];
			opts["authentication"] = params.authentication;
		}else{
			server = params.hostServer;
		}
		
		url = server + url.url;
		
		$.ajax({
			url: url,
			data: opts,
			type: "post",
			dataType: "json",
			async: optAsync, //设为false就是同步请求
			success: function(res) {
				if(res == null){
					return;
				}
				
				if(res.errorCode == 0) {
					if(callback){
						callback(res);
					}else{
						com.showAlert(com.info, "操作成功");
						dfd.resolve(res);
						return res;
					}
				}else if(res.errorCode == 110005){
					isF5 = true;
					window.location.href = api.common.logout.url + "?timestamp="+new Date().getTime();
				}else{
					var errorMsg = res.errorMsg;
					com.showAlert(com.error, errorMsg);
					if(failCallback)
						failCallback(errorMsg);
					else{
						dfd.reject(res);
						return res;
					}
				}
			}, error: function(msg) {
				com.showAlert(com.error, msg);
				if(failCallback){
					failCallback(msg);
				}
			}
		});
		return dfd.promise();
	}, adaptDataArray: function(obj,callback){
		var result = [];
		if (obj != undefined){
			for(var i = 0; i < obj.length; i++){
				var node = callback(obj[i], i);
				result.push(node);
			}
		}

		return result;
	}, jgrid: {
		defaults: {
			datatype: "json",
			mtype: "POST",
			jsonReader: {root:"paging.data",page:"paging.page",total:"paging.totalPage",records:"paging.totalRecords"},
			emptyrecords: "暂无数据",
			viewrecords : true,
			multiselect : true,
	        //multiboxonly: true,
	        multiboxonly: false,
			rowNum:10,
			rowList:[10,20,30],
			altRows: true,
			rownumbers: true, 
			height: 'auto',
			autowidth: true,
			prmNames: {page:'paging.page',rows:'paging.rows'},
			shrinkToFit: true,
			forceFit:true,
			sortable:false,
			loadComplete : function(res) {
				var table = this;
				setTimeout(function(){
					
					if(res.errorCode == 110005){
						isF5 = true;
						window.location.href = api.common.logout.url + "?timestamp="+new Date().getTime();
						return false;
					}
					
					if(res.paging != undefined && res.paging.data != undefined){
						$(table).jqGrid("setGridParam", {data: res.paging.data});
					}
					
					$.jgrid.styleCheckbox(table);
					$.jgrid.updatePagerIcons(table);
					$(table).closest(".ui-jqgrid-bdiv").css({ 'overflow-x' : 'hidden' });
					$.jgrid.enableTooltips(table);
				}, 0);
			}
		}, styleCheckbox: function(table) {
			$(table).find('input:checkbox').addClass('ace').wrap('<label />').after('<span class="lbl align-top" />');
			$('.ui-jqgrid-labels th[id*="_cb"]').find('input.cbox[type=checkbox]').addClass('ace').wrap('<label />').after('<span class="lbl align-top" style="top:-10px;left:3px;"/>');
		}, updatePagerIcons: function(table) {
			var replacement = {
				'ui-icon-seek-first' : 'icon-double-angle-left bigger-140',
				'ui-icon-seek-prev' : 'icon-angle-left bigger-140',
				'ui-icon-seek-next' : 'icon-angle-right bigger-140',
				'ui-icon-seek-end' : 'icon-double-angle-right bigger-140'
			};
			
			$('.ui-pg-table:not(.navtable) > tbody > tr > .ui-pg-button > .ui-icon').each(function(){
				var icon = $(this);
				var $class = $.trim(icon.attr('class').replace('ui-icon', ''));
				
				if($class in replacement) icon.attr('class', 'ui-icon '+replacement[$class]);
			});
		}, enableTooltips: function(table) {
			$('.navtable .ui-pg-button').tooltip({container:'body'});
			$(table).find('.ui-pg-div').tooltip({container:'body'});
		}, aceSwitch: function(cellvalue, options, cell) {
			setTimeout(function(){
				$(cell).find('input[type=checkbox]').wrap('<label class="inline" />').addClass('ace ace-switch ace-switch-5').after('<span class="lbl"></span>');
			}, 0);
		}, pickDate: function(cellvalue, options, cell) {
			setTimeout(function(){
				$(cell).find('input[type=text]').datepicker({format:'yyyy-mm-dd' , autoclose:true}); 
			}, 0);
		}, style_edit_form: function(e) {
			var form = $(e[0]);
			var buttons = form.next().find('.EditButton .fm-button');
			
			form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />');
			form.find('input[name=sdate]').datepicker({format:'yyyy-mm-dd' , autoclose:true}).end().find('input[name=stock]').addClass('ace ace-switch ace-switch-5').wrap('<label class="inline" />').after('<span class="lbl"></span>');

			buttons.addClass('btn btn-sm').find('[class*="-icon"]').remove();//ui-icon, s-icon
			buttons.eq(0).addClass('btn-primary').prepend('<i class="icon-ok"></i>');
			buttons.eq(1).prepend('<i class="icon-remove"></i>');
			
			buttons = form.next().find('.navButton a');
			buttons.find('.ui-icon').remove();
			buttons.eq(0).append('<i class="icon-chevron-left"></i>');
			buttons.eq(1).append('<i class="icon-chevron-right"></i>');		
		}, style_delete_form: function(e) {
			var form = $(e[0]);
			var buttons = form.next().find('.EditButton .fm-button');
			
			if(form.data('styled')){
				return false;
			}
			
			form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />');
			
			buttons.addClass('btn btn-sm').find('[class*="-icon"]').remove();//ui-icon, s-icon
			buttons.eq(0).addClass('btn-danger').prepend('<i class="icon-trash"></i>');
			buttons.eq(1).prepend('<i class="icon-remove"></i>');
			
			form.data('styled', true);
		}, style_search_filters: function(form) {
			form.find('.delete-rule').val('X');
			form.find('.add-rule').addClass('btn btn-xs btn-primary');
			form.find('.add-group').addClass('btn btn-xs btn-success');
			form.find('.delete-group').addClass('btn btn-xs btn-danger');
			$(".opsel option[value='OR']", form).remove();
		}, style_search_form: function(e) {
			var form = $(e[0]);
			var dialog = form.closest('.ui-jqdialog');
			var buttons = dialog.find('.EditTable');
			
			form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />');
			buttons.find('.EditButton a[id*="_reset"]').addClass('btn btn-sm btn-info').find('.ui-icon').attr('class', 'icon-retweet');
			buttons.find('.EditButton a[id*="_query"]').addClass('btn btn-sm btn-inverse').find('.ui-icon').attr('class', 'icon-comment-alt');
			buttons.find('.EditButton a[id*="_search"]').addClass('btn btn-sm btn-purple').find('.ui-icon').attr('class', 'icon-search');
		}, deleteFunc: function(removeRow){
			return {
				recreateForm: true,
				beforeShowForm: $.jgrid.style_delete_form,
				onclickSubmit: removeRow,
				useDataProxy: false
			};
		}, searchFunc: function(e){
			return {
				recreateForm: true,
				afterShowSearch: $.jgrid.style_search_form,
				afterRedraw: function(){
					$.jgrid.style_search_filters(e);
				},
				multipleSearch: true,
				searchOnEnter: true,
				odata: ['cn'],
				closeAfterSearch: true,
				closeAfterReset: true,
				onSearch: function(filters){
					var opts = {};
					for(var i=0;i<filters.rules.length;i++){
						opts["filters["+i+"].field"] = filters.rules[i].field;
						opts["filters["+i+"].data"] = filters.rules[i].data;
						opts["filters["+i+"].op"] = filters.rules[i].op;
					}
					this.p.postData = opts;
				},onReset: function(){
					this.p.postData = {};
				}
			};
		}, refreshGrid: function($this, opts){
			$this[0].p.postData = {};
			$.extend($this[0].p.postData, opts);
			$this.jqGrid().trigger("reloadGrid");
		}, showSelectInfo: function(listgrid_id){
			$.jgrid.viewModal("#alertmod_" + listgrid_id, {gbox:"#gbox_" + listgrid_id, jqm:true});$("#jqg_alrt").focus();
		}, getRowData: function(k){
			$this = this;
			var num = $this.jqGrid("getGridParam", 'selrow');
			if(num == null){
				$.jgrid.showSelectInfo($this.attr("id"));
				return;
			}
			var row = $this.jqGrid("getRowData", num);
			$.each($this.jqGrid("getGridParam", "data"), function(i, v){
				if(v[k] == row[k]){
					$.extend(row, v);
					return false;
				}
			});
			return row;
		}
	}, cleanItems: function(items){
		for(var i in items){
			if(typeof items[i] != 'object') continue;
			if(items[i][0].type == 'checkbox'){
				items[i].prop("checked", false).trigger("change");
				continue;
			}else if(items[i][0].type=='select-one'){
				if(items[i][0].options[0] != undefined)
					items[i][0].options[0].selected = true;
			}else{
				items[i].val("");
			}
		}
	}, validator: {
		required: {
			type: "v_required", 
			errorMsg: "内容不能为空", 
			func: function(obj){
				if(obj.val() == null || obj.val() == undefined)
					return true;
				if(toString.apply(obj.val()) === '[object Array]')
					return obj.val().toString().trim().length == 0 ? true : false;
				return obj.val().trim().length == 0 ? true : false;
			}
		}, number: {
			type: "v_number", 
			regex: /^[0-9]*$/, 
			errorMsg: "请输入数字."
		}, float: {
			type: "v_float", 
			regex: /^(((\d)+(\.)?(\d)*)|(\d)*)$/, 
			errorMsg: "请输入浮点数."
		}, name: {
			type: "v_name", 
			regex: /^[\w\u4e00-\u9fa5-.@&!, \/()%\[\]（）*，;。；！、：:?？><]*$/, 
			errorMsg: "内容可以由汉字, 字母, 数字,基本标点符号,'-','>','<','_', '.', '@'组成."
		}, nameen:{
			type: "v_name_en", 
			regex: /^[\w-_]*$/, 
			errorMsg: "内容可以由字母, 数字, '-', '_'组成."
		}, email:{
			type: "v_email", 
			regex: /^(([a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+)|(\s)*)$/, 
			errorMsg: "内容可以由字母, 数字, '-', '_', '.', '@'组成.(如:muzh@163.com)"
		}, dateTime:{
			type: "v_dateTime",
			regex: /^((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-))(\s(20|21|22|23|[0-1]?\d):[0-5]?\d(:[0-5]?\d)?)?$/,
			errorMsg: "请输入正确格式的日期.(YYYY-MM-DD hh:mm:ss)"
		}, date:{
			type: "v_date",
			regex: /^((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-))(\s(20|21|22|23|[0-1]?\d):[0-5]?\d(:[0-5]?\d)?)?$/,
			errorMsg: "请输入正确格式的日期.(YYYY-MM-DD)"
		}, time:{
			type: "v_time",
			regex: /^(([01][0-9])|(2[0-3])):[0-5][0-9]:[0-5][0-9]$/,
			errorMsg: "请输入正确格式的时间.(hh:mm:ss)"
		}, phone: {
			type: "v_phone",
			regex: /^((1[3|4|5|7|8][0-9]{9})*)$/,
			errorMsg: "请输入正确的手机格式 (如:13619181918)."
		}, phones: {
			type: "v_phones",
			regex: /^(1[3|4|5|7|8][0-9]{9})((#1[3|4|5|7|8][0-9]{9})){0,4}$/,
			errorMsg: "请输入正确的手机格式 (如:13619181918).如果为多条电话请用#号分隔"
		}, phones2: {
			type: "v_phones2",
			regex: /^((1[3|4|5|7|8][0-9]{9})|(0[0-9]{10}))((#((1[3|4|5|7|8][0-9]{9})|(0[0-9]{10})))){0,4}$/,
			errorMsg: "请输入正确的手机号或固定电话 (如:13619181918#02425601918).如果为多条号码请用#号分隔"
		}, identity: {
			type: "v_identity",
			regex: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
			errorMsg: "请输入正确的身份证号码."
		}, price: {
			type: "v_price",
			regex: /^[0-9]+(\.[0-9]{1,2})?$/,
			errorMsg: "请输入正确的金额格式."
		}
	}, validate: function(scopeID){
		this.clearValidator(scopeID);
		
		var _scopeID = scopeID == undefined ? "" : "#" + scopeID;
		var _count = 0;
		$.each(this.validator, function(k, v){
			$(_scopeID + " ." + v.type + ":visible").each(function(i, obj){
				$this = $(obj);
				if(!$this.prop("disabled")){
					$obj = $this;
					if($this.data("for")){
						$obj = $("#"+$this.data("for"));
					}
					if(v.func){
						if(v.func($obj)){
							com.showTips($this, v.errorMsg);
							_count++;
						}
						return true;
					}
					if(!($obj.val() == null || $obj.val() == undefined)){
						v.regex.lastIndex = 0;
						if(!((v.regex).test($obj.val().trim()))){
							com.showTips($this, v.errorMsg);
							_count++;
						}
					}
				}
			});
		});
		return _count == 0 ? false : true;
	}, clearValidator: function(id, _isTip){
		isTip = _isTip || false;
		var count = 0;
		
		if(id != undefined && id != ""){
			id = id.indexOf("#") == 0 ? id : "#" + id;
		}else{
			id = "";
		}
		var popover = isTip == true ? "[data-toggle='popover']" : " [data-toggle='popover']";
		
		$.each($(id + popover), function(k, v){
			if($(this).data("tip") && !isTip){
				return true;
			}
			if($(this).data("addBorderWidth")){
				$(this).css("border-width", "0px");
			}
			if($(this).data("addBorderStyle")){
				$(this).css("border-style", "none");
			}
			$(this).css("border-color", "#b5b5b5");
				$(this).popover("destroy");
		});	
		
		return count;
	}, showTips: function($obj, msg, isTip){
		if($obj.css("border-width") == "0px"){
			$obj.css("border-width", "1px");
			$obj.data("addBorderWidth", true);
		}
		
		if($obj.css("border-style") == "none"){
			$obj.css("border-style", "solid");
			$obj.data("addBorderStyle", true);
		}
		
		$obj.css("border-color", "red");
		$obj.popover('destroy').popover({content:msg}).popover('show');
		
		if(isTip){
			$obj.data("tip", isTip);
		}
	}, showAlert: function(type, contents){
		
		var outtime = 1000;
		var gritterTypeClass = "gritter-info";
		var gritterLightClass = "gritter-light";
		
		if($.alert[type] == undefined){
			console.log("提示类型只能为<error>, <warning> 和 <info>");
		}
		
		if(type == com.error){
			gritterTypeClass = "gritter-error";
			gritterLightClass = "";
			outtime = 5000;
		}else if(type == com.warning){
			gritterTypeClass = "gritter-warning";
			gritterLightClass = "";
			outtime = 3000;
		}
		
		$.gritter.add({
			title: $.alert[type],
			text: contents,
			class_name: gritterTypeClass + ' gritter-center ' + gritterLightClass,
			time: outtime,
		});
	}, showInfo: function(title, contents){
		$.gritter.removeAll();
		
		setTimeout(function(){
			$.gritter.add({
				title: title,
				text: contents,
				class_name: 'gritter-info',
				time: 5000,
			});
		}, 500)
	}, 	dateramgepickerdefault: {
        format: 'YYYY/MM/DD',
        separator:'-',
        locale: {
          applyLabel: '确定',
          cancelLabel: '取消',
          fromLabel: '从',
          toLabel: '到',
          daysOfWeek: ['日', '一', '二', '三', '四', '五','六'],
          monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
      }        
	}
};

$(function(){
	$("input:text").focusin(function(){
		if(this.value.indexOf("请输入")!=-1)
			$(this).val("");
	}).focusout(function(){
		if($(this).val()=="")
			$(this).val($(this).attr("name") || "");
	});
	$('input[name=date-range-picker]').daterangepicker().prev().on(ace.click_event, function(){
		$(this).next().focus();
	});
});

Array.prototype.formatArrayMapToStr = function(k, v){
	var str = "";
	for(var i in this){
		var _i = this[i];
		if(typeof _i === "object" && _i != null){
			str += _i[k] + ":" + _i[v] + ";";
		}
	}
	return str;
};

Array.prototype.contains = function(v){
	for(var i in this){
		if(this[i] === v){
			return this[i];
		}
	}
	return undefined;
};

$.extend($, {
    jsonToString: function(jsonObj) {
        var THIS = this;
        switch (typeof (jsonObj)) {
	        case 'string':
	            return '"' + jsonObj.replace(/(["\\])/g, '\\$1') + '"';
	        case 'array':
	            return '[' + jsonObj.map(THIS.jsonToString).join(',') + ']';
	        case 'object':
	            if (jsonObj instanceof Array) {
	                var strArr = [];
	                var len = jsonObj.length;
	                for(var i=0;i<len;i++){
	                    strArr.push(THIS.jsonToString(jsonObj[i]));
	                }
	                return '[' + strArr.join(',') + ']';
	            }else if(jsonObj == null) {
	                return 'null';
	            }else{
	                var string = [];
	                for(var property in jsonObj){
	                    string.push(THIS.jsonToString(property) + ':' + THIS.jsonToString(jsonObj[property]));
	                }
	                return '{' + string.join(',') + '}';
	            }
	        case 'number':
	            return jsonObj;
	        case 'false':
	            return jsonObj;
        }
    }
});

(function($){
	
	$.extend(true, $.jgrid, com.jgrid);
	$.alert = {
		error: "错误",
		warning: '警告',
		info: '成功'
	};
	
	$.fn.statement = function(title, detail){
		return this.each(function(){
			$(this).empty().append("<div class='page-header'><h1>"+title+"<small><i class='icon-double-angle-right'></i> "+detail+"</small></h1></div>");
		});
	};
	
	$.fn.bindData = function(d, k, v, all, cb, o){
		if(this[0] != undefined && this[0].nodeName.toLowerCase() == "select" && d != undefined){
			this.empty();
			
			var optionHTML = "";
			
			if(all){
				optionHTML = "<option value=''>全部</option>";
			}
			
			for(var i=0;i<d.length;i++) {
				if(typeof d[i] == 'object'){
					if(k == undefined || v == undefined || k == "" || v == ""){
						console.log("该控件无法绑定列表数据");
						return this;
					}
					var _o = o ? "other='" + d[i][o] + "'" : "";
					optionHTML = optionHTML + "<option value='" + d[i][k] + "'" + _o + ">" + d[i][v] + "</option>";
				}else{
					optionHTML = optionHTML + "<option value='" + d[i] + "' multikey='multikey'>" + d[i] + "</option>";
				}
			}
			
			$(optionHTML).appendTo(this);
			
			if(cb){
				cb();
			}
		}else{
			console.log("该控件无法绑定列表数据");
		}
		return this;
	};
	$.fn.switchBtn = function(c){
		return this.each(function(){
			$this = $(this);
			_c = c || "";
			
			if(this.type != "checkbox"){
				return;
			}
			
			$this.addClass('ace ace-switch ace-switch-5').after("<span class='lbl "+_c+"'></span>");
		});
	};
	
	$.flSearch = {
		_count:0,
		_default: {
			url: "",
			postDataName: "",
			postParmas:{_search:true,}, // "paging.rows":10, "paging.page":1
			searchBtnName: "查询",
			successCallback: function(){},
			failCallback: function(){},
			listgrid: null
		},
		_searchBtn: $("<button class='btn btn-sm btn-info btn-search'></button>"),
		_item: {
			label: "name",
			id: "search_model_",
			class: '',
			name: "fieldName",
			type: "text",
			op: "cn"
		},
		_initParams: function($obj){
			$spans = $obj.children(".fl_search").children("span").toArray();
			
			var flag = true;
			var msg = "";
			
			var opts = {};
			var count = 0;
			
			for(var i in $spans){
				var span = $spans[i];
				var name = $(":nth-child(1)", $(span));
				var input = $(":nth-child(2)", $(span));
				var value = input.val();
				
				if(span.nodeName != "SPAN"){
					continue;
				}
				
				if(input.attr("notempty") == "notempty" && value == ""){
					flag = false;
					msg = name.text()+"不能为空";
					break;
				}
				
				if(value == undefined || value==null || value.trim() == ""){
					continue;
				}
				
				opts["filters["+count+"].field"] = $(span).data("item").name;
				opts["filters["+count+"].data"] = value;
				opts["filters["+count+"].op"] = $(span).data("item").op;
				
				count++;
			}
			
			return [flag, $.extend({}, opts, $obj.data("inst").postParmas), msg];
		},
		_postSearch: function(e){
			$obj = e.data;
			
			var _ = $.flSearch._initParams($obj);
			
			if(!_[0]){
				com.showAlert(com.warning, _[2]);
				return false;
			}
			
			var opts = _[1];
			
			var postDataName = $obj.data("inst").postDataName;
			
			if($obj.data("inst").postSearch){
				$obj.data("inst").postSearch(opts);
			}else{
				$.jgrid.refreshGrid($obj.data("inst").listgrid, opts);
			}
			
			if(postDataName != ""){
				
				var listgridPostData = $obj.data("inst").listgrid.getGridParam("postData");
				
				opts["paging.page"] = parseInt(listgridPostData["paging.page"]);
				opts["paging.rows"] = parseInt(listgridPostData["paging.rows"]);
				
				params[postDataName] = opts;
			}
		},
		_init: function($obj, opts){
			var inst = $.extend(true, {}, this._default, opts);
			var items = opts.items;
			var _params = {};
			var _paramIndexs = [];
			var param = params[opts.postDataName];
			
			$obj.data("inst", inst);
			$searchDiv = $("<div class='fl_search clearfix'></div>");
			
			if(opts.postDataName != "" && params[opts.postDataName] != undefined){
				
				for(var item in param){
					if(item.indexOf("filters") != -1){
						var filtersName = item.split('.')[0];
						var filtersField = item.split('.')[1];
						
						if(_paramIndexs.indexOf(filtersName) == -1 && filtersField == "field"){
							var field = param[filtersName+".field"];
							var data = param[filtersName+".data"];
							_params[field] = {"field":field, "data":data};
							
							_paramIndexs.push(field);
						}
					}
				}
			}
			
			for(var i in items){
				var inputObj = null;
				var item = items[i];
				
				if(typeof item !== "object"){
					continue;
				}
				
				this._item.id = this._item.id + this._count++;
				item = $.extend({}, this._item, item);
				$span = $("<span></span>").data("item", item).addClass("inline");
				$span.append("<span>" + item.label + "</span>:");
				
				if(item.type === "text"){
					inputObj = $input = $("<input type='text' id=" + item.id + " class='"+item.class+"' />");
					$span.append($input);
				}else if(item.type === "select"){
					inputObj = $select = $("<select id=" + item.id + " class='"+item.class+"'></select>");
					$span.append($select);
					if(item.data){
						$select.bindData(item.data, 'key', 'value', true);
					}
				}else if(item.type === "dateRangePicker"){
					inputObj = $input = $("<input type='text' id=" + item.id + " name='date-range-picker' class='"+item.class+"'/>");
					$span.append($input);
				}else if(item.type === "autoFillText"){
					inputObj = $input = $("<input type='text' id=" + item.id + " autocomplete='off' class='"+item.class+"'/>");
					$span.append($input);
					$input.typeahead({
						url: item.url,
					    source: function (query, process) {
					        var options = {autoFillParams: query};
					        if(typeof this.options.url !== "string"){
					        	$.error("the autoFillText has no any url.");
					        }
					        
					        com.post(this.options.url, options, function(data){
					        	process(data.autoFillList);
					        });
					    },
					    matcher: function (item) {
					        return true;
					    }
					});
				}else if(item.type === "datePicker"){
					inputObj = $div = $('<input class="date-picker '+item.class+'" id=' + item.id + ' type="text" data-date-format="dd-mm-yyyy" />');
					$span.append($div);
				}else if(item.type === "autoFillSelect"){
					inputObj = $select = $("<select id=" + item.id + " class='"+item.class+"'><option value=''>&nbsp;</option></select>");
					$span.append($select);
				}else if(item.type === "autoFillPinyinText"){
					inputObj = $input = $("<input type='text' id=" + item.id + " autocomplete='off' class='"+item.class+"'/>");
					$span.append($input);
					$input.typeahead({
						url: item.url,
						list: [],
						postData: item.postData,
					    source: function (query, process) {
					        var options = $.extend({pinyinName: query}, this.options.postData);
					        
//					        if(typeof this.options.url !== "string"){
//					        	$.error("the autoFillPinyinText has no any url.");
//					        }
					        
					        com.post(this.options.url, options, $.proxy(this.options.callback, this));
					    }, matcher: function (item) {
					        return true;
					    }, callback: function(data){
					    	this.options.list = data.autoFillList;
					    	this.process(this.options.list);
					    }
					});
				}
				$("input", $span).css("height", "30px");
				$searchDiv.append($span);
				
				if(item.notempty){
					inputObj.attr("notempty", "notempty");
				}
				
				if(_params[item.id] != undefined && inputObj != null){
					inputObj.val(_params[item.id].data);
				}
			}
			
			$searchDiv.append("<button class='btn btn-sm btn-info btn-search' id='fl_btn_"+$obj.attr("id")+"'>"+inst.searchBtnName+"</button>");
			$obj.append($searchDiv);
			this._searchBtn = $("#fl_btn_"+$obj.attr("id"));
			this._searchBtn.on("click", $obj, this._postSearch);
			
			$('input[name=date-range-picker]').daterangepicker(com.dateramgepickerdefault).prev().on(ace.click_event, function(){
				$(this).next().focus();
			});
			
			return $obj;
		}
	};
	
	$.fn.flSearch = function(options, callback){
		$this = $(this);
		var inst = $this.data("inst");
		
		if($this.length == 0){
			return this;
		}
		
		if(inst == undefined){
			if(typeof options !== "object"){
				console.log("the search model is not be initialized..");
				return this;
			}else{
				$.flSearch["_init"].call($.flSearch, $this, options);
				if(callback){
					callback();
				}
				
				return $this;
			}
		}
		
		if(options === "getSearchParams"){
			return $.flSearch._initParams($this);
		}
	};
	
	bootbox.setDefaults({
		locale: "zh_CN",
		show: true,
		backdrop: true,
		closeButton: true,
		animate: true,
		className: "my-modal"
	});
})(jQuery);
