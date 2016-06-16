/**
 * @File Name		: OrderBelongInfoAction
 * @Package   	: com.fanglin.action.orderBelongInfo
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.decoration.po.OrderBelongInfoPO;
import com.fanglin.decoration.service.OrderBelongInfoService;
import com.fanglin.decoration.vo.OrderBelongInfoVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class OrderBelongInfoAction extends BaseListAction {

	private static final long serialVersionUID = -1599812124963548192L;
	
	@Autowired
	private OrderBelongInfoService orderBelongInfoService;

	private OrderBelongInfoVO orderBelongInfo;
	
	private List<OrderBelongInfoVO> orderBelongInfos;

	@Action(value = "queryOrderBelongInfoForDesignAChangeByOrderId", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryOrderBelongInfoForDesignAChangeByOrderId(){

		String belongType = OrderBelongInfoPO.BELONGTYPE_DESIGN_STR;
		
		orderBelongInfos = orderBelongInfoService.queryOrderBelongInfoForChangeByOrderIdAType(orderBelongInfo.getOrderId(), belongType);

		return SUCCESS;
	}
	
	@Action(value = "queryOrderBelongInfoForDesignByOrderId", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryOrderBelongInfoForDesignByOrderId(){

		String belongType = OrderBelongInfoPO.BELONGTYPE_DESIGN_STR;
		
		orderBelongInfos = orderBelongInfoService.queryOrderBelongInfoForCurrentByOrderIdAType(orderBelongInfo.getOrderId(), belongType);

		return SUCCESS;
	}

	@Action(value = "queryOrderBelongInfoForBusinessnAChangeByOrderId", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryOrderBelongInfoForBusinessnAChangeByOrderId(){

		String belongType = OrderBelongInfoPO.BELONGTYPE_SALESMAN_STR;
		
		orderBelongInfos = orderBelongInfoService.queryOrderBelongInfoForChangeByOrderIdAType(orderBelongInfo.getOrderId(), belongType);
	    
		return SUCCESS;
	}
	
	@Action(value = "queryOrderBelongInfoForBusinessnByOrderId", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryOrderBelongInfoForBusinessnByOrderId(){

		String belongType = OrderBelongInfoPO.BELONGTYPE_SALESMAN_STR;
		orderBelongInfos = orderBelongInfoService.queryOrderBelongInfoForCurrentByOrderIdAType(orderBelongInfo.getOrderId(),belongType);
	    
		return SUCCESS;
	}
	
	public OrderBelongInfoVO getOrderBelongInfo(){
		return orderBelongInfo;
	}

	public void setOrderBelongInfo(OrderBelongInfoVO orderBelongInfo){
		this.orderBelongInfo = orderBelongInfo;
	}

	public void setOrderBelongInfos(List<OrderBelongInfoVO> orderBelongInfos){
		this.orderBelongInfos = orderBelongInfos;
	}

	public List<OrderBelongInfoVO> getOrderBelongInfos(){
		return orderBelongInfos;
	}
	
}
