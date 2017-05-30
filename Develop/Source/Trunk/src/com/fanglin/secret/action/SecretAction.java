/**
 * @File Name		: DecorationOrderAction.java
 * @Package   	: com.fanglin.secret.action
 * @Version		: 1.0
 * @Date			: 2017-5-28
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.secret.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseAction;
import com.fanglin.secret.service.SecretService;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SecretAction extends BaseAction {

	private static final long serialVersionUID = 4846642991702813595L;
	
	@Autowired
	private SecretService secretService;
	
	private String orderId;
	
	private String OTCVCJSC;
	
	@Action(value = "CVLIBHQMVWFSPQWU", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String CVLIBHQMVWFSPQWU(){
		
		OTCVCJSC = secretService.CVLIBHQMVWFSPQWU(orderId);
		
		return SUCCESS;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getOTCVCJSC() {
		return OTCVCJSC;
	}

	public void setOTCVCJSC(String oTCVCJSC) {
		OTCVCJSC = oTCVCJSC;
	}
	
}
