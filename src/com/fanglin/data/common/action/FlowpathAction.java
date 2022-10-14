package com.fanglin.data.common.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.service.FlowpathService;
import com.fanglin.data.common.vo.FlowpathVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class FlowpathAction extends BaseListAction {

	private static final long serialVersionUID = 6771368786758871433L;

	@Autowired
	private FlowpathService flowpathService;

	private List<FlowpathVO> flowpaths;

	private FlowpathVO flowpath;

	@Action(value = "pageFlowpath", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageFlowpath() throws FLException {

		flowpathService.pageFlowpath(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "queryFlowpath", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryFlowpath() throws FLException {

		flowpaths = flowpathService.queryFlowpath(flowpath);

		return SUCCESS;
	}

	@Action(value = "addFlowpath", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addFlowpath() throws FLException {

		flowpathService.addFlowpath(flowpath);

		return SUCCESS;
	}

	@Action(value = "updateFlowpath", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateFlowpath() throws FLException {

		flowpathService.updateFlowpath(flowpath);

		return SUCCESS;
	}

	@Action(value = "deleteFlowpath", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteSoods() throws FLException {

		flowpathService.deleteFlowpath(flowpath);

		return SUCCESS;
	}

	public List<FlowpathVO> getFlowpaths() {
		return flowpaths;
	}

	public void setFlowpaths(List<FlowpathVO> flowpaths) {
		this.flowpaths = flowpaths;
	}

	public FlowpathVO getFlowpath() {
		return flowpath;
	}

	public void setFlowpath(FlowpathVO flowpath) {
		this.flowpath = flowpath;
	}

}
