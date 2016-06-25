/**
 * @File Name		: FinanceIndexAction.java
 * @Package   	: com.fanglin.common.action
 * @Version		: 1.0
 * @Date			: 2015-5-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.index.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;

@ParentPackage("base")
@Namespace("/")
@Controller
public class FinanceIndexAction extends BaseListAction {

	private static final long serialVersionUID = -7035266128096220810L;
	
	@Action(value = "decorationPaymentIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/finance/decorationPayment.html") })
	public String decorationPaymentIndex(){
		return SUCCESS;
	}

	@Action(value = "changeItemIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/finance/changePaymentItem.html") })
	public String changeItemIndex(){
		return SUCCESS;
	}

	@Action(value = "decorationPaymentCheckIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/finance/decorationPaymentCheck.html") })
	public String decorationPaymentCheckIndex(){
		return SUCCESS;
	}
	
	@Action(value = "decorationPaymentReceiptIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/finance/decorationPaymentReceipt.html") })
	public String decorationPaymentReceiptIndex(){
		return SUCCESS;
	}
	
	@Action(value = "materialPaymentIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/finance/materialPayment.html") })
	public String materialPaymentIndex(){
		return SUCCESS;
	}
	
	@Action(value = "materialPaymentReceiptIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/finance/materialPaymentReceipt.html") })
	public String materialPaymentReceiptIndex(){
		return SUCCESS;
	}
	
	@Action(value = "materialPaymentCheckIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/finance/materialPaymentCheck.html") })
	public String materialPaymentCheckIndex(){
		return SUCCESS;
	}
	
	@Action(value = "materialOutsideCheckIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/finance/materialOutsideCheck.html") })
	public String materialOutsideCheckIndex(){
		return SUCCESS;
	}
	
	@Action(value = "paymentIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/finance/payment.html") })
	public String paymentIndex(){
		return SUCCESS;
	}

	@Action(value = "paymentCheckIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/finance/paymentCheck.html") })
	public String paymentCheckIndex(){
		return SUCCESS;
	}
	
	@Action(value = "paymentReceiptIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/finance/paymentReceipt.html") })
	public String paymentReceiptIndex(){
		return SUCCESS;
	}

}
