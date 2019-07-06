package com.fanglin.communion.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;

import com.fanglin.communion.service.ServiceNodeService;
import com.fanglin.communion.vo.ServiceNodeVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

public class ServiceNodeAction extends BaseListAction {

	private static final long serialVersionUID = 6998622928689732155L;

	@Autowired
	private ServiceNodeService serviceNodeService;

	private ServiceNodeVO serviceNode;

	@Action(value = "pageServiceNode", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageServiceNode() throws FLException {

		serviceNodeService.pageServiceNode(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "addServiceNode", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addServiceNode() throws FLException {

		serviceNodeService.addServiceNode(serviceNode);

		return SUCCESS;
	}

	@Action(value = "updateServiceNode", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateServiceNode() throws FLException {

		serviceNodeService.updateServiceNode(serviceNode);

		return SUCCESS;
	}

	@Action(value = "updateServiceNodeForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateServiceNodeForStatus() throws FLException {

		serviceNodeService.updateServiceNodeForStatus(serviceNode);

		return SUCCESS;
	}

	public ServiceNodeVO getServiceNode() {
		return serviceNode;
	}

	public void setServiceNode(ServiceNodeVO serviceNode) {
		this.serviceNode = serviceNode;
	}

}
