package com.fanglin.approval.action;

import java.util.ArrayList;
import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.approval.service.ApproveUserService;
import com.fanglin.approval.vo.ApproveUserVO;
import com.fanglin.common.vo.KeyValueVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.vo.UserVO;


@ParentPackage("base")
@Namespace("/")
@Controller
public class ApproveUserAction extends BaseListAction {

	private static final long serialVersionUID = 4493385608040589247L;

	@Autowired
	private ApproveUserService approveUserService;
	
	private UserVO user;

	private ApproveUserVO approveUser;
	
	private List<ApproveUserVO> approvalUsers;
	
	private List<Integer> approveUserIds;
	
	private List<KeyValueVO> autoFillKeyValue;
	
	@Action(value = "pageApproveUser", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryPageapproveUser() throws FLException{
		
		approveUserService.pageApproveUser(getPaging(), getFilters(),queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "queryApproveUserByType", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryApproveUserByType() throws FLException{
		
		approvalUsers = approveUserService.queryApprovalUserByType(approveUser,queryCompany());
		
		return SUCCESS;
	}

	@Action(value = "addApproveUser", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addApproveUser() throws FLException{
		
		approveUserService.addApproveUser(approveUser);
		
		return SUCCESS;
	}

	@Action(value = "deleteApproveUser", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteApproveUser(){
		
		approveUserService.deleteApproveUser(approveUserIds);
		
		return SUCCESS;
	}

	public UserVO getUser() {
		return user;
	}

	public void setUser(UserVO user) {
		this.user = user;
	}

	public ApproveUserVO getApproveUser() {
		return approveUser;
	}

	public void setApproveUser(ApproveUserVO approveUser) {
		this.approveUser = approveUser;
	}

	public List<ApproveUserVO> getApprovalUsers() {
		return approvalUsers;
	}

	public void setApprovalUsers(List<ApproveUserVO> approvalUsers) {
		this.approvalUsers = approvalUsers;
	}

	public List<Integer> getApproveUserIds() {
		return approveUserIds;
	}

	public void setApproveUserIds(List<Integer> approveUserIds) {
		this.approveUserIds = approveUserIds;
	}

	public List<KeyValueVO> getAutoFillKeyValue() {
		if (autoFillKeyValue == null) {
		     autoFillKeyValue = new ArrayList<KeyValueVO>();
		    }
		return autoFillKeyValue;
	}

	public void setAutoFillKeyValue(List<KeyValueVO> autoFillKeyValue) {
		this.autoFillKeyValue = autoFillKeyValue;
	}



}
