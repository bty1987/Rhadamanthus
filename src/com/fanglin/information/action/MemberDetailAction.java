package com.fanglin.information.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.information.service.MemberDetailService;
import com.fanglin.information.vo.MemberCardVO;
import com.fanglin.information.vo.MemberDetailVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class MemberDetailAction  extends BaseListAction {

	private static final long serialVersionUID = -6041335146936745520L;
	
	@Autowired
	private MemberDetailService memberDetailService;
	
	private List<MemberDetailVO> memberDetails;
	
	private MemberCardVO memberCard;
	
	private MemberDetailVO memberDetail;
	
	@Action(value = "pageMemberDetail", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageMemberDetail(){
		
		memberDetailService.pageMemberDetail(getPaging(), getFilters());
		
		return SUCCESS;
	}

	@Action(value = "queryMemberDetailByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryMemberDetailByOrderId() throws FLException{
		
		memberDetails = memberDetailService.queryMemberDetailByOrderId(memberCard);
		
		return SUCCESS;
	}
	
	@Action(value = "addMemberDetail", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addMemberDetail() throws FLException{
		
		memberDetailService.addMemberDetail(memberDetail, queryUserId());
		
		return SUCCESS;
	}
	
	public List<MemberDetailVO> getMemberDetails() {
		return memberDetails;
	}

	public void setMemberDetails(List<MemberDetailVO> memberDetails) {
		this.memberDetails = memberDetails;
	}

	public MemberDetailVO getMemberDetail() {
		return memberDetail;
	}

	public void setMemberDetail(MemberDetailVO memberDetail) {
		this.memberDetail = memberDetail;
	}

	public MemberCardVO getMemberCard() {
		return memberCard;
	}

	public void setMemberCard(MemberCardVO memberCard) {
		this.memberCard = memberCard;
	}
}
