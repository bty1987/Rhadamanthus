package com.fanglin.decoration.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.service.DecorationActivityCostService;
import com.fanglin.decoration.vo.ActivityCostVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationActivityCostAction extends BaseAction {

	private static final long serialVersionUID = 6210070100000101L;

	private String orderId;

	private List<ActivityCostVO> activityCosts;

	@Autowired
	private DecorationActivityCostService decorationActivityCostService;

	/**
	 * 额度值独立更新入口: 按装修单重调 validate 接口回写 decorationactivitycost 缓存档(balance/toplimit/createTime)。
	 * 入参 orderId; 返回 activityCosts 逐行更新结果(summary 含 usable/reason)。
	 */
	@Action(value = "updateDecorationActivityCost", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateDecorationActivityCost() throws FLException {

		activityCosts = decorationActivityCostService.updateDecorationActivityCost(orderId);

		return SUCCESS;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public List<ActivityCostVO> getActivityCosts() {
		return activityCosts;
	}

	public void setActivityCosts(List<ActivityCostVO> activityCosts) {
		this.activityCosts = activityCosts;
	}
}
