/**
 * @File Name		: MaterialOutsidePaymentAction.java
 * @Package   	: com.fanglin.payment.action
 * @Version		: 1.0
 * @Date			: 2017-4-22
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.payment.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.payment.service.MaterialOutsidePaymentService;
import com.fanglin.payment.vo.MaterialOutsidePaymentVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class MaterialOutsidePaymentAction extends BaseListAction{
	
	private static final long serialVersionUID = -3839119170390679952L;
	
	@Autowired
	private MaterialOutsidePaymentService materialOutsidePaymentService;
	
	private MaterialOutsidePaymentVO materialOutsidePayment;

	@Action(value="pageMaterialOutsidePaymentForInit", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageMaterialOutsidePaymentForInit(){
		
		materialOutsidePaymentService.pageMaterialOutsidePaymentForInit(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value="pageMaterialOutsidePaymentForNotInit", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageMaterialOutsidePaymentForNotInit(){
		
		materialOutsidePaymentService.pageMaterialOutsidePaymentForNotInit(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value="collectMaterialOutsidePayment", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String collectMaterialOutsidePayment() throws FLException{
		
		materialOutsidePaymentService.collectMaterialOutsidePayment(materialOutsidePayment, queryUserId(), queryUserName());
		
		return SUCCESS;
	}

	public MaterialOutsidePaymentVO getMaterialOutsidePayment() {
		return materialOutsidePayment;
	}

	public void setMaterialOutsidePayment(MaterialOutsidePaymentVO materialOutsidePayment) {
		this.materialOutsidePayment = materialOutsidePayment;
	}

}
