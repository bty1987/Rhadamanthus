package com.fanglin.approval.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.approval.service.ApprovalManifestDBService;
import com.fanglin.approval.vo.ApprovalManifestDBItemVO;
import com.fanglin.approval.vo.ApprovalManifestDBVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ApprovalManifestDBAction extends BaseListAction{


	private static final long serialVersionUID = -3887295167120478138L;
	
	@Autowired
	private ApprovalManifestDBService approvalManifestDBService;

	private ApprovalVO approval;
	
	private ApprovalManifestDBVO approvalManifestDB;

	private List<ApprovalManifestDBItemVO> approvalManifestDBItems;
	
	private ApprovalManifestDBItemVO approvalManifestDBItem;
	
	@Action(value = "queryApprovalManifestDBItem", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType","text/html" })
	public String queryApprovalManifestDBItem() throws FLException {

		approvalManifestDBItems = approvalManifestDBService.queryApprovalManifestDBItem(approval);

		return SUCCESS;
	};
	@Action(value = "submitApprovalForManifestDB", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType","text/html" })
	public String submitApprovalForManifestDB() throws FLException {

		approvalManifestDBService.submitApprovalForManifestDB(approval,approvalManifestDB, approvalManifestDBItems, queryUserId());

		return SUCCESS;

	}
	

	public ApprovalVO getApproval() {
		return approval;
	}
	public void setApproval(ApprovalVO approval) {
		this.approval = approval;
	}
	public ApprovalManifestDBVO getApprovalManifestDB() {
		return approvalManifestDB;
	}
	public void setApprovalManifestDB(ApprovalManifestDBVO approvalManifestDB) {
		this.approvalManifestDB = approvalManifestDB;
	}
	public List<ApprovalManifestDBItemVO> getApprovalManifestDBItems() {
		return approvalManifestDBItems;
	}
	public void setApprovalManifestDBItems(
			List<ApprovalManifestDBItemVO> approvalManifestDBItems) {
		this.approvalManifestDBItems = approvalManifestDBItems;
	}
	public ApprovalManifestDBItemVO getApprovalManifestDBItem() {
		return approvalManifestDBItem;
	}
	public void setApprovalManifestDBItem(
			ApprovalManifestDBItemVO approvalManifestDBItem) {
		this.approvalManifestDBItem = approvalManifestDBItem;
	}

}
