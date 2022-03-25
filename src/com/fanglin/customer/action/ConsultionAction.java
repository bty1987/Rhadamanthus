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
import com.fanglin.customer.service.ConsultionService;
import com.fanglin.customer.vo.ConsultionVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ConsultionAction extends BaseListAction {

	private static final long serialVersionUID = -1199487663865791810L;

	@Autowired
	private ConsultionService consultionService;

	private List<ConsultionVO> consultions;

	private ConsultionVO consultion;

	@Action(value = "pageConsultion", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageConsultion() throws FLException {

		consultionService.pageConsultion(getPaging(), getFilters(), queryUserId());

		return SUCCESS;
	}

	@Action(value = "queryConsultionByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryConsultionByOrderId() {

		consultions = consultionService.queryConsultionByOrderId(consultion);

		return SUCCESS;
	}

	@Action(value = "addConsultion", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addConsultion() throws FLException {

		consultionService.addConsultion(consultion, queryUserId(), queryCompany());

		return SUCCESS;
	}

	public List<ConsultionVO> getConsultions() {
		return consultions;
	}

	public void setConsultions(List<ConsultionVO> consultions) {
		this.consultions = consultions;
	}

	public ConsultionVO getConsultion() {
		return consultion;
	}

	public void setConsultion(ConsultionVO consultion) {
		this.consultion = consultion;
	}

}
