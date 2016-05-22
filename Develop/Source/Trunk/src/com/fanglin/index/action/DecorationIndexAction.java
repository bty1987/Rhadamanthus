/**
 * @File Name		: DecorationIndexAction.java
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
public class DecorationIndexAction extends BaseListAction {

	private static final long serialVersionUID = -1430813497989787528L;
	
	@Action(value = "decorationOrderAddOrReduceIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/decoration/decorationOrderAddOrReduce.html")})
	public String decorationOrderAddOrReduceIndex(){
		return SUCCESS;
	}
	
	@Action(value = "decorationOrderAddOrReduceDetailIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/decoration/decorationOrderAddOrReduceDetail.html")})
	public String decorationOrderAddOrReduceDetailIndex(){
		return SUCCESS;
	}
	
	@Action(value = "decorationOrderBackVisitIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/decoration/decorationOrderBackVisit.html")})
	public String decorationOrderBackVisitIndex(){
		return SUCCESS;
	}
	
	@Action(value = "createOrderIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/decoration/createOrder.html") })
	public String createOrderIndex(){
		return SUCCESS;
	}
	
	@Action(value = "decorationOrderDesignerIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/decoration/decorationOrderDesigner.html") })
	public String decorationOrderDesignerIndex(){
		return SUCCESS;
	}
	
	@Action(value = "decorationOrderSalesmanIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/decoration/decorationOrderSalesman.html") })
	public String decorationOrderSalesmanIndex(){
		return SUCCESS;
	}

	@Action(value = "decorationOrderCommonIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/decoration/decorationOrderCommon.html") })
	public String decorationOrderCommonIndex(){
		return SUCCESS;
	}
	
	@Action(value = "decorationOrderDetailDesignerIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/decoration/decorationOrderDetailDesigner.html") })
	public String decorationOrderDetailDesignerIndex(){
		return SUCCESS;
	}
	
	@Action(value = "decorationOrderDetailSalesmanIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/decoration/decorationOrderDetailSalesman.html") })
	public String decorationOrderDetailSalesmanIndex(){
		return SUCCESS;
	}
	
	@Action(value = "decorationOrderDetailCommonIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/decoration/decorationOrderDetailCommon.html") })
	public String decorationOrderDetailCommonIndex(){
		return SUCCESS;
	}
	
	@Action(value = "decorationOrderBelongIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/decoration/decorationOrderBelong.html") })
	public String decorationOrderBelongIndex(){
		return SUCCESS;
	}
	
	@Action(value = "decorationOrderBelongDetailIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/decoration/decorationOrderBelongDetail.html") })
	public String decorationOrderBelongDetailIndex(){
		return SUCCESS;
	}
	
	@Action(value = "decorationOrderBelongInfoViewIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/decoration/decorationOrderBelongInfoView.html") })
	public String decorationOrderBelongInfoViewIndex(){
		return SUCCESS;
	}
	
	@Action(value = "printAddOrReduceInfoIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/decoration/printAddOrReduceInfo.html") })
	public String printAddOrReduceInfoIndex(){
		return SUCCESS;
	}
	
}
