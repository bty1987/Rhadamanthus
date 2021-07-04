package com.fanglin.data.material.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.material.service.AoodsService;
import com.fanglin.data.material.vo.AoodsVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class AoodsAction extends BaseListAction {

	private static final long serialVersionUID = 2247562694460186416L;

	@Autowired
	private AoodsService aoodsService;

	private AoodsVO aoods;

	private List<AoodsVO> aoodes;

	private String orderId;

	private String companyType;

	@Action(value = "pageAoods", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageAoods() throws FLException {

		aoodsService.pageAoods(getPaging(), getFilters(), queryCompany(), companyType);

		return SUCCESS;
	}

	@Action(value = "queryAoodsByAtid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryAoodsByAtid() throws FLException {

		aoodes = aoodsService.queryAoodsByAtid(aoods, orderId);

		return SUCCESS;
	}

	@Action(value = "queryAoodsByName", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryAoodsByName() throws FLException {

		aoodes = aoodsService.queryAoodsByName(aoods, queryCompany());

		return SUCCESS;
	}

	@Action(value = "addAoods", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addAoods() throws FLException {

		aoodsService.addAoods(aoods, queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateAoods", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateAoods() throws FLException {

		aoodsService.updateAoods(aoods);

		return SUCCESS;
	}

	@Action(value = "updateAoodsForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateAoodsForStatus() throws FLException {

		aoodsService.updateAoodsForStatus(aoods);

		return SUCCESS;
	}

	@Action(value = "copyAoods", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String copyAoods() throws FLException {

		aoodsService.copyAoods(aoods, queryCompany());

		return SUCCESS;
	}

	public AoodsVO getAoods() {
		return aoods;
	}

	public void setAoods(AoodsVO aoods) {
		this.aoods = aoods;
	}

	public List<AoodsVO> getAoodes() {
		return aoodes;
	}

	public void setAoodes(List<AoodsVO> aoodes) {
		this.aoodes = aoodes;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getCompanyType() {
		return companyType;
	}

	public void setCompanyType(String companyType) {
		this.companyType = companyType;
	}

}
