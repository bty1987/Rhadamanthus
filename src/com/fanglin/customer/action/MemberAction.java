package com.fanglin.customer.action;

import java.util.List;
import java.util.Map;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.service.MemberService;
import com.fanglin.customer.vo.MemberActivityVO;
import com.fanglin.customer.vo.MemberGoodsVO;
import com.fanglin.customer.vo.MemberOrderItemVO;
import com.fanglin.customer.vo.MemberOrderVO;
import com.fanglin.customer.vo.MemberPointDetailVO;
import com.fanglin.customer.vo.MemberPointVO;
import com.fanglin.customer.vo.MemberVO;

@ParentPackage("base")
@Namespace("/")
@Controller("CusMemberAction")
public class MemberAction extends BaseListAction {

	private static final long serialVersionUID = 942703705705538577L;

	@Autowired
	private MemberService memberService;

	private MemberVO member;

	private List<MemberVO> members;

	private Map<String, List<MemberVO>> resultMap;

	private List<MemberPointVO> memberPoints;

	private List<MemberPointDetailVO> decorationPointDetails;

	private List<MemberPointDetailVO> materialPointDetails;

	private MemberActivityVO memberActivity;

	private MemberOrderVO memberOrder;

	private MemberOrderItemVO memberOrderItem;

	private List<MemberOrderItemVO> memberOrderItems;

	private MemberGoodsVO memberGoods;

	private List<String> companys;

	@Action(value = "queryMemberByPhone", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryMemberByPhone() throws FLException {

		resultMap = memberService.queryMember(members);

		return SUCCESS;
	}

	@Action(value = "queryMemberPoint", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryMemberPoint() throws FLException {

		memberPoints = memberService.queryMemberPoint(memberPoints);

		return SUCCESS;
	}

	@Action(value = "queryMemberPointDetail", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryMemberPointDetail() throws FLException {

		if (memberPoints != null && !memberPoints.isEmpty() && memberPoints.get(0).getOrderId() != null) {
			String orderId = memberPoints.get(0).getOrderId();
			decorationPointDetails = memberService.queryDecorationPointDetailByOrderId(orderId);
			materialPointDetails = memberService.queryMaterialPointDetailByOrderId(orderId);
		}

		return SUCCESS;
	}

	@Action(value = "addMemberActivity", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addMemberActivity() throws FLException {

		memberService.addMemberActivity(memberActivity, companys, queryUserId());

		return SUCCESS;
	}

	@Action(value = "makeMemberOrder", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String makeMemberOrder() throws FLException {

		memberService.makeMemberOrder(memberOrder, memberOrderItems, queryUserId());

		return SUCCESS;
	}

	@Action(value = "cancelMemberOrder", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String cancelMemberOrder() throws FLException {

		memberService.cancelMemberOrder(memberOrder, queryUserId());

		return SUCCESS;
	}

	@Action(value = "makeMemberOrderItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String makeMemberOrderItem() throws FLException {

		memberService.makeMemberOrderItem(memberOrder, memberOrderItem, queryUserId());

		return SUCCESS;
	}

	@Action(value = "cancelMemberOrderItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String cancelMemberOrderItem() throws FLException {

		memberService.cancelMemberOrderItem(memberOrder, memberOrderItem, queryUserId());

		return SUCCESS;
	}

	@Action(value = "updateMemberGoods", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateMemberGoods() throws FLException {

		memberService.updateMemberGoods(memberGoods);

		return SUCCESS;
	}

	@Action(value = "queryMemberForInfo", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryMemberForInfo() throws FLException {

		resultMap = memberService.queryMemberForInfo(members, queryCompany());

		return SUCCESS;
	}

	public MemberVO getMember() {
		return member;
	}

	public void setMember(MemberVO member) {
		this.member = member;
	}

	public List<MemberVO> getMembers() {
		return members;
	}

	public void setMembers(List<MemberVO> members) {
		this.members = members;
	}

	public List<MemberPointVO> getMemberPoints() {
		return memberPoints;
	}

	public void setMemberPoints(List<MemberPointVO> memberPoints) {
		this.memberPoints = memberPoints;
	}

	public MemberActivityVO getMemberActivity() {
		return memberActivity;
	}

	public void setMemberActivity(MemberActivityVO memberActivity) {
		this.memberActivity = memberActivity;
	}

	public MemberOrderVO getMemberOrder() {
		return memberOrder;
	}

	public void setMemberOrder(MemberOrderVO memberOrder) {
		this.memberOrder = memberOrder;
	}

	public MemberOrderItemVO getMemberOrderItem() {
		return memberOrderItem;
	}

	public void setMemberOrderItem(MemberOrderItemVO memberOrderItem) {
		this.memberOrderItem = memberOrderItem;
	}

	public List<MemberOrderItemVO> getMemberOrderItems() {
		return memberOrderItems;
	}

	public void setMemberOrderItems(List<MemberOrderItemVO> memberOrderItems) {
		this.memberOrderItems = memberOrderItems;
	}

	public MemberGoodsVO getMemberGoods() {
		return memberGoods;
	}

	public void setMemberGoods(MemberGoodsVO memberGoods) {
		this.memberGoods = memberGoods;
	}

	public List<String> getCompanys() {
		return companys;
	}

	public void setCompanys(List<String> companys) {
		this.companys = companys;
	}

	public Map<String, List<MemberVO>> getResultMap() {
		return resultMap;
	}

	public void setResultMap(Map<String, List<MemberVO>> resultMap) {
		this.resultMap = resultMap;
	}

	public List<MemberPointDetailVO> getDecorationPointDetails() {
		return decorationPointDetails;
	}

	public void setDecorationPointDetails(List<MemberPointDetailVO> decorationPointDetails) {
		this.decorationPointDetails = decorationPointDetails;
	}

	public List<MemberPointDetailVO> getMaterialPointDetails() {
		return materialPointDetails;
	}

	public void setMaterialPointDetails(List<MemberPointDetailVO> materialPointDetails) {
		this.materialPointDetails = materialPointDetails;
	}

}
