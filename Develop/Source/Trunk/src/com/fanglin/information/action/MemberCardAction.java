package com.fanglin.information.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.information.service.MemberCardService;
import com.fanglin.information.vo.MemberCardVO;
import com.fanglin.information.vo.MemberDetailVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class MemberCardAction  extends BaseListAction {

	private static final long serialVersionUID = -1674856760866439772L;

	@Autowired
	private MemberCardService memberCardService;
	
	private MemberCardVO memberCard;
	
	private MemberCardVO outMemberCard;
	
	private MemberCardVO inMemberCard;
	
	private MemberDetailVO memberDetail;
	
	@Action(value = "pageMemberCard", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageMemberCard(){
		
		memberCardService.pageMemberCard(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value = "queryMemberCardByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryMemberCardByOrderId() throws FLException{
		
		memberCard = memberCardService.queryMemberCardByOrderId(memberCard);
		
		return SUCCESS;
	}
	
	@Action(value = "addMemberCard", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addMemberCard() throws FLException{
		
		memberCardService.addMemberCard(memberCard);
		
		return SUCCESS;
	}
	
	@Action(value = "updateMemberCard", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateMemberCard() throws FLException{
		
		memberCardService.updateMemberCard(memberCard);
		
		return SUCCESS;
	}
	
	@Action(value = "turnPointsForMemberCard", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String turnPointsForMemberCard() throws FLException{
		
		memberCardService.turnPointsForMemberCard(outMemberCard,inMemberCard,memberDetail,queryUserId());
		
		return SUCCESS;
	}

	public MemberCardVO getMemberCard() {
		return memberCard;
	}

	public void setMemberCard(MemberCardVO memberCard) {
		this.memberCard = memberCard;
	}

	public MemberCardVO getOutMemberCard() {
		return outMemberCard;
	}

	public void setOutMemberCard(MemberCardVO outMemberCard) {
		this.outMemberCard = outMemberCard;
	}

	public MemberCardVO getInMemberCard() {
		return inMemberCard;
	}

	public void setInMemberCard(MemberCardVO inMemberCard) {
		this.inMemberCard = inMemberCard;
	}

	public MemberDetailVO getMemberDetail() {
		return memberDetail;
	}

	public void setMemberDetail(MemberDetailVO memberDetail) {
		this.memberDetail = memberDetail;
	}
	
}
