jQuery(function($) {
	
	var version = {
		saveBtn : $("#saveBtn").on("click", saveData),
		cancelBtn : $("#cancelBtn").on("click", empty),
		modal : $("#versionModal").on("show.bs.modal", function(a) {
			com.clearValidator()
		}),
		items : {
			versionNumber : $("#versionNumber"),
			trialVersion : $("#trialVersion"),
			createTime : $("#createTime"),
			content : $("#content"),
			path : $("#path"),
			fileSize : $("#fileSize"),
		},
	};

	if (jQuery().datepicker) {
		$('.date-picker').datepicker({
			format : 'yyyy-mm-dd',// yyyy-mm-dd hh:ii,
			autoclose : true,
		});

	}

	var displayFunc = (function() {

		var renderList = function(tableId, listData) {
			var $tableWrap = $('#' + tableId).empty();
			var $ul = $('<ul></ul>').addClass(
					'item-list fl-table-list ui-sortable');

			if (listData && listData.length) {
				$.each(listData, function(i, v) {
					var $liLine = creatLine(v);

					$liLine.appendTo($ul);
				});

				$ul.appendTo($tableWrap);
			}
		};

		var creatLine = function(v) {
			var $liLine = $('<li></li>').addClass('item-blue clearfix');
			var $h3 = $('<h3></h3>').addClass('oid')
					.append(
							$('<small></small>').addClass('blue').html(
									v.versionNumber));
			var $ulProperty = $('<ul></ul>').addClass(
					'list-unstyled fl-inline-list clearfix');
			var $divBtnWrap = $('<div></div>').addClass(
					'pull-right action-buttons');

			var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger')
					.html('删除');

			var propertyArr = [ [ "最新版本:", v.versionNumber, "grey" ],
					[ "适用版本:", v.trialVersion, "green" ],
					[ "创建时间:", v.createTime, "grey" ],
					[ "版本说明:", v.content, "pink" ], [ "路径:", v.path, "blue" ], ];

			$.each(propertyArr, function(index, value) {
				var $liProperty = $('<li></li>');
				$('<strong></strong>').html(value[0]).appendTo($liProperty);
				$('<b></b>').html(value[1]).addClass(value[2]).appendTo(
						$liProperty);
				$liProperty.appendTo($ulProperty);
			});

			$divBtnWrap.append($btnDel).appendTo($h3);

			$liLine.append($h3).append($ulProperty);

			$btnDel.click(function() {
				bootbox.confirm("确定删除吗？", function(result) {
					if (result) {
						com.post(api.upgrade.deleteVersion, {
							"version.vid" : v.vid
						}, function() {
							versionSeacher.doSearch();
						})
					}
				});
			});

			return $liLine;
		};

		return {
			init : function(tableId, listData) {
				$('#' + tableId).html(null);
				renderList(tableId, listData);
			},
			drawLine : function(v) {
				return creatLine(v);
			}
		}
	})();

	var _condArr = [ 'versionNumber', 'versionCreateTime' ];
	var versionSeacher = new Searcher();
	versionSeacher.init(_condArr, "condList", api.upgrade.pageVersion,
			function(list) {
				displayFunc.init('resultList', list);
				if (jQuery().datepicker) {
					$('[name="versionCreateTime"]').datepicker({
						format : 'yyyy-mm-dd',// yyyy-mm-dd hh:ii,
						autoclose : true,
					});
				}
			}, "pagenation", "versionPostData", null, false, null, function() {

				var $adda = $('<a></a>').addClass(
						'btn btn-minier btn-primary pull-left').attr('name',
						'addVersion').css("margin", "0px 3px");
				var $addi = $('<i></i>').addClass('icon-plus bigger-110')
						.appendTo($adda);
				var $addspan = $('<span></span>').text('添加').appendTo($adda);

				$adda.click(function() {
					version.modal.modal("show")
				});

				return [ $adda ];
			});

	function saveData() {
		if (com.validate("versionModal")) {
			return false
		} else {
			var option = {
				"version.versionNumber" : version.items.versionNumber.val(),
				"version.trialVersion" : version.items.trialVersion.val(),
				"version.createTime" : version.items.createTime.val(),
				"version.content" : version.items.content.val(),
				"version.path" : version.items.path.val(),
				"version.fileSize" : version.items.fileSize.val(),
			}

			com.post(api.upgrade.addVersion, option, function() {
				com.showAlert(com.info, '添加成功');
				empty()
				versionSeacher.doSearch()
			})
			version.modal.modal("hide")
		}
	}

	$("#file").Huploadify({
		'debug' : false, // 开启调试
		'auto' : true, // 是否自动上传
		'successTimeout' : 99999, // 超时时间
		'formData' : { // 附带值
			'uploadType' : 0,
			'strutsUploadsFileName' : '',
			'username' : '用户名',
			'rnd' : '加密密文'
		},
		'overrideEvents' : [ 'onDialogClose' ], // 不执行默认的onSelect事件
		'fileObjName' : 'strutsUploads', // 服务器端脚本使用的文件对象的名称
											// $_FILES个['upload']
		'uploader' : config.media + api.common.uploadOther.url, // 上传处理程序
		'width' : '100', // 浏览按钮的宽度
		'height' : '32', // 浏览按钮的高度
		'fileTypeDesc' : '支持的格式:', // 在浏览窗口底部的文件类型下拉菜单中显示的文本
		'fileTypeExts' : '*.*', // 允许上传的文件后缀
		'fileSizeLimit' : '50MB', // 上传文件的大小限制
		'queueSizeLimit' : 25, // 上传数量
		'onUploadSuccess' : function(file, data, response) {
			var dateObj = eval("(" + data + ")");
			if (dateObj.errorCode == 0) {
				$("#path").val(dateObj.resUrl);
				$("#fileSize").val(file.size);
			} else {
				alert(data);
			}
		}
	});

	function empty() {
		$('#versionNumber').val("");
		$('#trialVersion').val("");
		$('#createTime').val("");
		$('#content').val("");
		$('#path').val("");
		$("#fileSize").val("");
	}

});