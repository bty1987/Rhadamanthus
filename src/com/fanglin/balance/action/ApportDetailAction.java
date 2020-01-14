package com.fanglin.balance.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.balance.service.ApportDetailService;
import com.fanglin.balance.vo.ApportDetailVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ApportDetailAction extends BaseListAction {

	private static final long serialVersionUID = 4493385608040589247L;
	
	@Autowired
	private ApportDetailService apportDetailService;
	
	private ApportDetailVO apportDetail;
	
	private List<ApportDetailVO> apportDetails;
	
	@Action(value = "queryApportDetailForBalance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryApportDetailForBalance() throws FLException {

		apportDetails = apportDetailService.queryApportDetailForBalance(apportDetail);

		return SUCCESS;
	}
	
	@Action(value = "addApportDetail", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addApportDetail() throws FLException {

		apportDetailService.addApportDetail(apportDetail,queryUserId());

		return SUCCESS;
	}

	public ApportDetailVO getApportDetail() {
		return apportDetail;
	}

	public void setApportDetail(ApportDetailVO apportDetail) {
		this.apportDetail = apportDetail;
	}

	public List<ApportDetailVO> getApportDetails() {
		return apportDetails;
	}

	public void setApportDetails(List<ApportDetailVO> apportDetails) {
		this.apportDetails = apportDetails;
	}


}
