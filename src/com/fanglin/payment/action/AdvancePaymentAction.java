/**
 * @File Name		: AdvancePaymentAction.java
 * @Package   	: com.fanglin.payment.action
 * @Version		: 1.0
 * @Date			: 2017-4-20
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
import com.fanglin.payment.service.AdvancePaymentService;
import com.fanglin.payment.vo.AdvancePaymentVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class AdvancePaymentAction extends BaseListAction {

	private static final long serialVersionUID = 2942569381438393302L;
	
	@Autowired
	private AdvancePaymentService advancePaymentService;
	
	private AdvancePaymentVO advancePayment;
	
	private long balanceAdvance;
	
	private long projectAdvance;
	
	private long materialAdvance;
	
	private long zaterialAdvance;
	
	@Action(value="pageAdvancePayment", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageAdvancePayment() throws FLException {
		
		advancePaymentService.pageAdvancePayment(getPaging(), getFilters(), queryCompany());
		
		return SUCCESS;
		
	}
	
	@Action(value="queryAdvancePaymentByOrderId", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryAdvancePaymentByOrderId() throws FLException{
		
		List<Long> advances = advancePaymentService.queryAdvancePaymentByOrderId(advancePayment);
		
		balanceAdvance = advances.get(0);
		projectAdvance = advances.get(1);
		materialAdvance = advances.get(2);
		zaterialAdvance = advances.get(3);
		
		return SUCCESS;
	}

	public AdvancePaymentVO getAdvancePayment() {
		return advancePayment;
	}

	public void setAdvancePayment(AdvancePaymentVO advancePayment) {
		this.advancePayment = advancePayment;
	}

	public long getBalanceAdvance() {
		return balanceAdvance;
	}

	public void setBalanceAdvance(long balanceAdvance) {
		this.balanceAdvance = balanceAdvance;
	}

	public long getProjectAdvance() {
		return projectAdvance;
	}

	public void setProjectAdvance(long projectAdvance) {
		this.projectAdvance = projectAdvance;
	}

	public long getMaterialAdvance() {
		return materialAdvance;
	}

	public void setMaterialAdvance(long materialAdvance) {
		this.materialAdvance = materialAdvance;
	}

	public long getZaterialAdvance() {
		return zaterialAdvance;
	}

	public void setZaterialAdvance(long zaterialAdvance) {
		this.zaterialAdvance = zaterialAdvance;
	}

}
