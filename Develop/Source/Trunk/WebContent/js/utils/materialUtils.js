var materialUtils = {
	materialPaymentTypeData: {"1":"预付款", "2":"定金", "3":"补款", "4":"退款", "5":"补款退款", "6":"券退款"},
	materialPaymentRevTypeData: {"预付款":"1", "定金":"2", "补款":"3", "退款":"4", "补款退款":"5", "券退款":"6"},
	paymentTypeInit: function(cellvalue, options, rowdata){
		return '<span class="label label-info">' + materialUtils.materialPaymentTypeData[rowdata.paymentType];
	}, paymentStatusInit: function(paymentStatus){
		var result = '';
		
		if(paymentStatus == 1){
			result += '待确认';
		}else if(paymentStatus == 0){
			result += '待收款';
		}else{
			result += '已确认';
		}
		return result;
	}, unformatStatus: function(cellvalue, options, cell){
		if(cellvalue == "已确认"){
			return 1;
		}else{
			return 0;
		}
	}, infoInit: function(cellvalue, options, rowdata){
		
		var info = "";
		
		if(rowdata.cash != "0"){
			info += "现金: " + rowdata.cash + ", ";
		}
		if(rowdata.bank != "0"){
			info += "刷卡: " + rowdata.bank + " " + rowdata.bankInfo + ", ";
		}
		if(rowdata.checkv != "0"){
			info += "转账: " + rowdata.checkv + " " + rowdata.checkvBankName + ", ";
		}
		if(rowdata.installment != "0"){
			info += "分期: " + rowdata.installment + " " + rowdata.installmentBankName + ", ";
		}
		if(rowdata.accounts != "0"){
			info += "对公帐户: " + rowdata.accounts + " " + rowdata.accountsBankName + ", ";
		}
		if(rowdata.advance != "0"){
			info += "预付款: " + rowdata.advance + " " + rowdata.advanceType + ", ";
		}
		if(rowdata.coupon != "0"){
			info += "券: " + rowdata.coupon + " " + rowdata.couponInfo + ", ";
		}
		if(rowdata.des != null && rowdata.des != ""){
			info += "描述: " + rowdata.des + ", ";
		}
		
		var html = '<span class="btn btn-minier" data-rel="tooltip" data-placement="left" title="'+info.substring(0, info.length-2)+'">信息</span>';
		html += "<input type='text' class='hide' value='"+info.substring(0, info.length-2)+"' />";
		return html;
	}
}
