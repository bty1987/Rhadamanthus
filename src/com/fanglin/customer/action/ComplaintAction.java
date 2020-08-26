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
import com.fanglin.customer.service.ComplaintService;
import com.fanglin.customer.vo.ComplaintVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ComplaintAction extends BaseListAction {
	
	private static final long serialVersionUID = 4764256911526157079L;
	
	@Autowired
	private ComplaintService complaintService;
	
	private List<ComplaintVO> complaints;
	
	private ComplaintVO complaint;
	
	@Action(value = "queryComplaint", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryComplaint() throws FLException {

		complaints = complaintService.queryComplaint(complaint);

		return SUCCESS;
	}
	
	@Action(value = "addComplaint", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addComplaint() throws FLException {

		complaintService.addComplaint(complaint, queryUserId());

		return SUCCESS;
	}
	
	@Action(value = "finishComplaint", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String finishComplaint() throws FLException {

		complaintService.finishComplaint(complaint, queryUserId());

		return SUCCESS;
	}
	
	@Action(value = "closeComplaint", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String closeComplaint() throws FLException {

		complaintService.closeComplaint(complaint, queryUserId());

		return SUCCESS;
	}

	public List<ComplaintVO> getComplaints() {
		return complaints;
	}

	public void setComplaints(List<ComplaintVO> complaints) {
		this.complaints = complaints;
	}

	public ComplaintVO getComplaint() {
		return complaint;
	}

	public void setComplaint(ComplaintVO complaint) {
		this.complaint = complaint;
	}

}
