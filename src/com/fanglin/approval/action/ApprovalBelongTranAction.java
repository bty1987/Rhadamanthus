/**
 * @File Name		: ApprovalBelongTranAction.java
 * @Package   	: com.fanglin.approval.action
 * @Version		: 1.0
 * @Date			: 2026-11-11
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 人员离职归属移交审批端点
 */

package com.fanglin.approval.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.approval.service.ApprovalBelongTranService;
import com.fanglin.approval.vo.ApprovalBelongTranItemVO;
import com.fanglin.approval.vo.ApprovalBelongTranVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ApprovalBelongTranAction extends BaseListAction {

	private static final long serialVersionUID = 6127394250817394620L;

	@Autowired
	private ApprovalBelongTranService approvalBelongTranService;

	private ApprovalVO approval;

	private ApprovalBelongTranVO approvalBelongTran;

	private List<ApprovalBelongTranItemVO> approvalBelongTranItems;

	private long aid;

	@Action(value = "submitApprovalForBelongTran", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String submitApprovalForBelongTran() throws FLException {

		approvalBelongTranService.submitApprovalForBelongTran(approval, approvalBelongTran, approvalBelongTranItems, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryApprovalBelongTranByAId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryApprovalBelongTranByAId() throws FLException {

		// 兼容审批跟踪通用弹情的 approval.aid 参数口径, 独立页顶层 aid 亦可
		long queryAid = aid;

		if (queryAid == 0 && approval != null && approval.getAid() != null) queryAid = approval.getAid().longValue();

		if (queryAid == 0) {
			throw new FLException(110040, "请求参数格式不正确");
		}

		approvalBelongTran = approvalBelongTranService.queryApprovalBelongTranByAId(queryAid);

		approvalBelongTranItems = approvalBelongTranService.queryApprovalBelongTranItemByAId(queryAid);

		return SUCCESS;
	}

	public ApprovalVO getApproval() {
		return approval;
	}

	public void setApproval(ApprovalVO approval) {
		this.approval = approval;
	}

	public ApprovalBelongTranVO getApprovalBelongTran() {
		return approvalBelongTran;
	}

	public void setApprovalBelongTran(ApprovalBelongTranVO approvalBelongTran) {
		this.approvalBelongTran = approvalBelongTran;
	}

	public List<ApprovalBelongTranItemVO> getApprovalBelongTranItems() {
		return approvalBelongTranItems;
	}

	public void setApprovalBelongTranItems(List<ApprovalBelongTranItemVO> approvalBelongTranItems) {
		this.approvalBelongTranItems = approvalBelongTranItems;
	}

	public long getAid() {
		return aid;
	}

	public void setAid(long aid) {
		this.aid = aid;
	}

}
