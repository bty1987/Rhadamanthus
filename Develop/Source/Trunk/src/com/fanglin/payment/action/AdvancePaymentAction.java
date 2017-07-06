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
import com.fanglin.data.common.vo.CustomerVO;
import com.fanglin.decoration.vo.DecorationOrderVO;
import com.fanglin.payment.service.AdvancePaymentService;

@ParentPackage("base")
@Namespace("/")
@Controller
public class AdvancePaymentAction extends BaseListAction {

	private static final long serialVersionUID = 2942569381438393302L;
	
	@Autowired
	private AdvancePaymentService advancePaymentService;
	
	private CustomerVO customer;
	
	private DecorationOrderVO decorationOrder;
	
	private float balanceAdvance;
	
	private float projectAdvance;
	
	private float materialAdvance;
	
	private float zaterialAdvance;
	
	@Action(value="queryAdvancePaymentByCustomerId", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryAdvancePaymentByCustomerId(){
		
		List<Float> advances = advancePaymentService.queryAdvancePaymentByCustomerId(customer);
		
		balanceAdvance = advances.get(0);
		projectAdvance = advances.get(1);
		materialAdvance = advances.get(2);
		zaterialAdvance = advances.get(3);
		
		return SUCCESS;
	}
	
	@Action(value="queryAdvancePaymentByOrderId", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryAdvancePaymentByOrderId() throws FLException{
		
		List<Float> advances = advancePaymentService.queryAdvancePaymentByOrderId(decorationOrder);
		
		balanceAdvance = advances.get(0);
		projectAdvance = advances.get(1);
		materialAdvance = advances.get(2);
		zaterialAdvance = advances.get(3);
		
		return SUCCESS;
	}

	public CustomerVO getCustomer() {
		return customer;
	}

	public void setCustomer(CustomerVO customer) {
		this.customer = customer;
	}

	public DecorationOrderVO getDecorationOrder() {
		return decorationOrder;
	}

	public void setDecorationOrder(DecorationOrderVO decorationOrder) {
		this.decorationOrder = decorationOrder;
	}

	public float getBalanceAdvance() {
		return balanceAdvance;
	}

	public void setBalanceAdvance(float balanceAdvance) {
		this.balanceAdvance = balanceAdvance;
	}

	public float getProjectAdvance() {
		return projectAdvance;
	}

	public void setProjectAdvance(float projectAdvance) {
		this.projectAdvance = projectAdvance;
	}

	public float getMaterialAdvance() {
		return materialAdvance;
	}

	public void setMaterialAdvance(float materialAdvance) {
		this.materialAdvance = materialAdvance;
	}

	public float getZaterialAdvance() {
		return zaterialAdvance;
	}

	public void setZaterialAdvance(float zaterialAdvance) {
		this.zaterialAdvance = zaterialAdvance;
	}

}
