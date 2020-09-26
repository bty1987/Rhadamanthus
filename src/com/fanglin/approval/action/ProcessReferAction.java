package com.fanglin.approval.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.approval.service.ProcessReferService;
import com.fanglin.approval.vo.ProcessReferVO;
import com.fanglin.core.action.BaseListAction;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ProcessReferAction extends BaseListAction {

	private static final long serialVersionUID = -9025991353347448575L;

	@Autowired
	private ProcessReferService processReferService;

	private List<ProcessReferVO> processRefers;
	
	@Action(value = "queryProcessRefer", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryProcessRefer() {

		processRefers = processReferService.queryProcessRefer();

		return SUCCESS;
	}

	public List<ProcessReferVO> getProcessRefers() {
		return processRefers;
	}

	public void setProcessRefers(List<ProcessReferVO> processRefers) {
		this.processRefers = processRefers;
	}

}
