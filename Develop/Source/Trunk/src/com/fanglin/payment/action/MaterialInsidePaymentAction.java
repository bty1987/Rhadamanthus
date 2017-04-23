/**
 * @File Name		: MaterialInsidePaymentAction.java
 * @Package   	: com.fanglin.payment.action
 * @Version		: 1.0
 * @Date			: 2017-4-22
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.payment.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.payment.service.MaterialInsidePaymentService;
import com.fanglin.payment.vo.MaterialInsidePaymentVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class MaterialInsidePaymentAction extends BaseListAction{

	private static final long serialVersionUID = -7056639465181129390L;
	
	@Autowired
	private MaterialInsidePaymentService materialInsidePaymentService;
	
	private MaterialInsidePaymentVO materialInsidePayment;
	
	private List<Long> mipIds;
	
	@Action(value="pageMaterialInsidePaymentForInit", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageMaterialInsidePaymentByInit(){
		
		materialInsidePaymentService.pageMaterialInsidePaymentForInit(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value="pageMaterialInsidePaymentForNotInit", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageMaterialInsidePaymentForNotInit(){
		
		materialInsidePaymentService.pageMaterialInsidePaymentForNotInit(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value="collectMaterialInsidePayment", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String collectMaterialInsidePayment() throws FLException{
		
		materialInsidePaymentService.collectMaterialInsidePayment(materialInsidePayment, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value="confirmMaterialInsidePayment", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String confirmMaterialInsidePayment(){
		
		materialInsidePaymentService.confirmMaterialInsidePayment(mipIds);
		
		return SUCCESS;
	}

	public MaterialInsidePaymentVO getMaterialInsidePayment() {
		return materialInsidePayment;
	}

	public void setMaterialInsidePayment(MaterialInsidePaymentVO materialInsidePayment) {
		this.materialInsidePayment = materialInsidePayment;
	}

	public List<Long> getMipIds() {
		return mipIds;
	}

	public void setMipIds(List<Long> mipIds) {
		this.mipIds = mipIds;
	}

}
