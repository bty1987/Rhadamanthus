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
import com.fanglin.customer.service.ComplainService;
import com.fanglin.customer.vo.ComplainVO;
import com.fanglin.customer.vo.ComplaintVO;
import com.fanglin.customer.vo.ConsultionVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ComplainAction extends BaseListAction {

	private static final long serialVersionUID = 2488719896867884913L;
	
	@Autowired
	private ComplainService complainService;
	
	private ConsultionVO consultion;
	
	private List<ComplainVO> complains;
	
	private List<ComplaintVO> complaints;
	
	private ComplainVO complain;
	
	@Action(value = "pageComplain", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageComplain() throws FLException {

		complainService.pageComplain(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}
	
	@Action(value = "queryComplain", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryComplain() throws FLException {

		complains = complainService.queryComplain(complain);

		return SUCCESS;
	}
	
	@Action(value = "queryComplainByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryComplainByOrderId() throws FLException {

		complains = complainService.queryComplainByOrderId(complain);

		return SUCCESS;
	}
	
	@Action(value = "addComplain", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addComplain() throws FLException {
		
		complainService.addComplain(consultion, complain, complaints, queryUserId(), queryCompany());

		return SUCCESS;
	}
	
	@Action(value = "finishComplain", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String finishComplain() throws FLException {

		complainService.finishComplain(complain, queryUserId());

		return SUCCESS;
	}
	
	@Action(value = "closeComplain", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String closeComplain() throws FLException {

		complainService.closeComplain(complain, queryUserId());

		return SUCCESS;
	}

	public ConsultionVO getConsultion() {
		return consultion;
	}

	public void setConsultion(ConsultionVO consultion) {
		this.consultion = consultion;
	}

	public List<ComplainVO> getComplains() {
		return complains;
	}

	public void setComplains(List<ComplainVO> complains) {
		this.complains = complains;
	}

	public List<ComplaintVO> getComplaints() {
		return complaints;
	}

	public void setComplaints(List<ComplaintVO> complaints) {
		this.complaints = complaints;
	}

	public ComplainVO getComplain() {
		return complain;
	}

	public void setComplain(ComplainVO complain) {
		this.complain = complain;
	}

}
