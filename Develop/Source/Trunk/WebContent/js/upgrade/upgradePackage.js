jQuery(function($) {
	
	var upgrade = {
		saveBtn : $("#saveBtn").on("click", saveData),
		cancelBtn : $("#cancelBtn").on("click", empty),
		modal : $("#upgradeModal").on("show.bs.modal", function(a) {
			com.clearValidator()
		}),
		items : {
			upgradeNumber : $("#upgradeNumber"),
			trialUpgrade : $("#trialUpgrade"),
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
			var $h3 = $('<h3></h3>').addClass('oid').append(
							$('<small></small>').addClass('blue').html(v.no));
			var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
			var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

			var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger')
					.html('删除');

			var propertyArr = [ [ "最新版本:", v.no, "grey" ],
					[ "适用版本:", v.trialno, "green" ],
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
						com.post(api.upgrade.deleteUpgrade, {
							"upgrade.ugid" : v.ugid
						}, function() {
							upgradeSeacher.doSearch();
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

	var _condArr = [ 'upgradeNumber', 'upgradeCreateTime' ];
	var upgradeSeacher = new Searcher();
	upgradeSeacher.init(_condArr, "condList", api.upgrade.pageUpgrade,
			function(list) {
				displayFunc.init('resultList', list);
				if (jQuery().datepicker) {
					$('[name="upgradeCreateTime"]').datepicker({
						format : 'yyyy-mm-dd',// yyyy-mm-dd hh:ii,
						autoclose : true,
					});
				}
			}, "pagenation", "upgradePostData", null, false, null, function() {

				var $adda = $('<a></a>').addClass(
						'btn btn-minier btn-primary pull-left').attr('name',
						'addUpgrade').css("margin", "0px 3px");
				var $addi = $('<i></i>').addClass('icon-plus bigger-110')
						.appendTo($adda);
				var $addspan = $('<span></span>').text('添加').appendTo($adda);

				$adda.click(function() {
					upgrade.modal.modal("show")
				});

				return [ $adda ];
			});

	function saveData() {
		if (com.validate("upgradeModal")) {
			return false
		} else {
			var option = {
				"upgrade.no" : upgrade.items.upgradeNumber.val(),
				"upgrade.trialno" : upgrade.items.trialUpgrade.val(),
				"upgrade.createTime" : upgrade.items.createTime.val(),
				"upgrade.content" : upgrade.items.content.val(),
				"upgrade.path" : upgrade.items.path.val(),
				"upgrade.fileSize" : upgrade.items.fileSize.val(),
			}

			com.post(api.upgrade.addUpgrade, option, function() {
				com.showAlert(com.info, '添加成功');
				empty()
				upgradeSeacher.doSearch()
			})
			upgrade.modal.modal("hide")
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
		$('#upgradeNumber').val("");
		$('#trialUpgrade').val("");
		$('#createTime').val("");
		$('#content').val("");
		$('#path').val("");
		$("#fileSize").val("");
	}

    function checkInfo() {

        var flag = true;

        if (!$('#cashDiv').hasClass('hide')) {

            var num = $('#cash');
            var numRex = /^(\d+|\d+\.[0-9]{1,4})$/;

            if (!(numRex.test(num.val()) && parseFloat(num.val()) >= 0)) {
                num.focus().select();
                num.addClass('tooltip-info').attr({
                    "data-rel": "popover",
                    "data-placement": "right",
                    "data-original-title": "",
                    "title": "",
                    "data-content": "价格输入内容格式错误!"
                }).popover('show');
                flag = false;
            } else {
                num.popover('destroy');
            }

        }



        return flag;

    }
});