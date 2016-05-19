/**
 * @File Name		: MaterialIndexAction.java
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
public class MaterialIndexAction extends BaseListAction {

	private static final long serialVersionUID = -591884070483680682L;
	
	@Action(value="materialBrandIndex", results={@Result(name="success", type="dispatcher", location="/views/material/materialBrand.html")})
	public String materialBrandIndex(){
		return SUCCESS;
	}
	
	@Action(value = "materialInsideIndex", results={@Result(name="success", type="dispatcher", location="/views/material/materialInside.html")})
	public String materialInsideIndex(){
		return SUCCESS;
	}
	
	@Action(value = "materialInsidePaymentIndex", results={@Result(name="success", type="dispatcher", location="/views/finance/materialInsidePayment.html")})
	public String materialInsidePaymentIndex(){
		return SUCCESS;
	}
	
	@Action(value = "materialInsidePaymentCheckIndex", results={@Result(name="success", type="dispatcher", location="/views/finance/materialInsidePaymentCheck.html")})
	public String materialInsidePaymentCheckIndex(){
		return SUCCESS;
	}
	
	@Action(value="materialModelIndex", results={@Result(name="success", type="dispatcher", location="/views/material/materialModel.html")})
	public String materialModelIndex(){
		return SUCCESS;
	}
	
	@Action(value = "materialBrandRightIndex", results={@Result(name="success", type="dispatcher", location="/views/material/materialBrandRight.html")})
	public String materialBrandRightIndex(){
		return SUCCESS;
	}
	
	@Action(value = "materialBalanceValueIndex", results={@Result(name="success", type="dispatcher", location="/views/material/materialBalanceValue.html")})
	public String materialBalanceValueIndex(){
		return SUCCESS;
	}
	
	@Action(value = "materialSaleOrderIndex", results={@Result(name="success", type="dispatcher", location="/views/material/materialSaleOrder.html")})
	public String materialSaleOrderIndex(){
		return SUCCESS;
	}
	
	@Action(value = "materialOrderIndex", results={@Result(name="success", type="dispatcher", location="/views/material/materialOrder.html")})
	public String materialOrderIndex(){
		return SUCCESS;
	}
	
	@Action(value = "materialSubOrderIndex", results={@Result(name="success", type="dispatcher", location="/views/material/materialSubOrder.html")})
	public String materialSubOrderIndex(){
		return SUCCESS;
	}
	
	@Action(value = "materialSubOrderAddIndex", results={@Result(name="success", type="dispatcher", location="/views/material/materialSubOrderAdd.html")})
	public String materialSubOrderAddIndex(){
		return SUCCESS;
	}
	
	@Action(value = "materialSubOrderDetailIndex", results={@Result(name="success", type="dispatcher", location="/views/material/materialSubOrderDetail.html")})
	public String materialSubOrderDetailIndex(){
		return SUCCESS;
	}
	
	@Action(value = "materialSubOrderCollectionIndex", results={@Result(name="success", type="dispatcher", location="/views/material/materialSubOrderCollection.html")})
	public String materialSubOrderCollectionIndex(){
		return SUCCESS;
	}
	
	@Action(value = "materialOrderRefundIndex", results={@Result(name="success", type="dispatcher", location="/views/material/materialOrderRefund.html")})
	public String materialOrderRefundIndex(){
		return SUCCESS;
	}
	
	@Action(value="materialSubOrderReceipt", results={@Result(name="success", type="dispatcher", location="/views/material/materialSubOrderReceipt.html")})
	public String materialSubOrderReceipt(){
		return SUCCESS;
	}
	
	@Action(value = "materialOrderPreBalanceIndex", results={@Result(name="success", type="dispatcher", location="/views/material/materialOrderPreBalance.html")})
	public String materialOrderPreBalanceIndex(){
		return SUCCESS;
	}
	
	@Action(value = "materialOrderPreBalanceDetailIndex", results={@Result(name="success", type="dispatcher", location="/views/material/materialOrderPreBalanceDetail.html")})
	public String materialOrderPreBalanceDetailIndex(){
		return SUCCESS;
	}
	
	@Action(value = "materialOrderArrivalIndex", results={@Result(name="success", type="dispatcher", location="/views/material/materialOrderArrival.html")})
	public String materialOrderArrivalIndex(){
		return SUCCESS;
	}
	
	@Action(value = "materialOrderArrivalDetailIndex", results={@Result(name="success", type="dispatcher", location="/views/material/materialOrderArrivalDetail.html")})
	public String materialOrderArrivalDetailIndex(){
		return SUCCESS;
	}
	
	@Action(value = "materialOrderPostBalanceIndex", results={@Result(name="success", type="dispatcher", location="/views/material/materialOrderPostBalance.html")})
	public String materialOrderPostBalanceIndex(){
		return SUCCESS;
	}
	
	@Action(value = "materialOrderPostBalanceDetailIndex", results={@Result(name="success", type="dispatcher", location="/views/material/materialOrderPostBalanceDetail.html")})
	public String materialOrderPostBalanceDetailIndex(){
		return SUCCESS;
	}
	
	@Action(value = "materialOutsideIndex", results={@Result(name="success", type="dispatcher", location="/views/material/materialOutside.html")})
	public String materialOutsideIndex(){
		return SUCCESS;
	}
	
	@Action(value="materialTypeIndex", results={@Result(name="success", type="dispatcher", location="/views/material/materialType.html")})
	public String materialTypeIndex(){
		return SUCCESS;
	}

}
