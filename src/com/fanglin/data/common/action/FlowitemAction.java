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
import com.fanglin.data.common.service.FlowitemService;
import com.fanglin.data.common.vo.FlowitemVO;
import com.fanglin.data.common.vo.FlowpathVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class FlowitemAction extends BaseListAction {

	private static final long serialVersionUID = 6771368786758871433L;

	@Autowired
	private FlowitemService flowitemService;

	private List<FlowitemVO> flowitems;

	private FlowpathVO flowpath;

	private FlowitemVO flowitem;

	@Action(value = "queryFlowitem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryFlowitem() throws FLException {

		flowitems = flowitemService.queryFlowitem(flowitem);

		return SUCCESS;
	}

	@Action(value = "addFlowitem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addFlowitem() throws FLException {

		flowitemService.addFlowitem(flowpath, flowitems);

		return SUCCESS;
	}

	@Action(value = "deleteFlowItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteFlowItem() throws FLException {

		flowitemService.deleteFlowItem(flowitem);

		return SUCCESS;
	}

	public List<FlowitemVO> getFlowitems() {
		return flowitems;
	}

	public FlowpathVO getFlowpath() {
		return flowpath;
	}

	public void setFlowpath(FlowpathVO flowpath) {
		this.flowpath = flowpath;
	}

	public void setFlowitems(List<FlowitemVO> flowitems) {
		this.flowitems = flowitems;
	}

	public FlowitemVO getFlowitem() {
		return flowitem;
	}

	public void setFlowitem(FlowitemVO flowitem) {
		this.flowitem = flowitem;
	}

}
