package com.fanglin.customer.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.service.ConstructerService;
import com.fanglin.customer.service.ConstructionService;
import com.fanglin.customer.vo.ConstructerVO;
import com.fanglin.customer.vo.ConstructionScheduleVO;
import com.fanglin.customer.vo.ConstructionVO;

@ParentPackage("base")
@Namespace("/")
@Controller("ConstructionOrderAction")
public class ConstructionAction extends BaseListAction {

	private static final long serialVersionUID = -5732285186970766340L;

	@Autowired
	private ConstructerService constructerService;

	@Autowired
	private ConstructionService constructionService;

	private ConstructionVO construction;

	private List<ConstructionScheduleVO> constructionSchedules;

	private List<ConstructerVO> constructionWorkers;

	private String orderId;

	private String unionId;

	@Action(value = "queryCusConstructer", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCusConstructer() {

		constructionWorkers = constructerService.queryCusConstructer(orderId);

		return SUCCESS;
	}

	@Action(value = "queryCusConstruction", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCusConstruction() {

		construction = constructionService.queryCusConstruction(orderId);

		return SUCCESS;
	}

	@Action(value = "queryCusConstructionSchedule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCusConsqueryCusConstructionScheduletruction() throws FLException {

		constructionSchedules = constructionService.queryCusConstructionSchedule(orderId);

		return SUCCESS;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public ConstructionVO getConstruction() {
		return construction;
	}

	public void setConstruction(ConstructionVO construction) {
		this.construction = construction;
	}

	public String getUnionId() {
		return unionId;
	}

	public void setUnionId(String unionId) {
		this.unionId = unionId;
	}

	public List<ConstructerVO> getConstructionWorkers() {
		return constructionWorkers;
	}

	public void setConstructionWorkers(List<ConstructerVO> constructionWorkers) {
		this.constructionWorkers = constructionWorkers;
	}

	public List<ConstructionScheduleVO> getConstructionSchedules() {
		return constructionSchedules;
	}

	public void setConstructionSchedules(List<ConstructionScheduleVO> constructionSchedules) {
		this.constructionSchedules = constructionSchedules;
	}

}
