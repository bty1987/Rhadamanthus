/**
 * @File Name		: ApprovalAction.java
 * @Package   	: com.fanglin.approval.action
 * @Version		: 1.0
 * @Date			: 2015-10-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.seiya.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.construction.vo.AcceptanceVO;
import com.fanglin.construction.vo.ConstructerVO;
import com.fanglin.construction.vo.ConstructionScheduleVO;
import com.fanglin.construction.vo.ConstructionVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.vo.ConstructionNodeVO;
import com.fanglin.personel.vo.UserInfoVO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.seiya.service.A20251208Service;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class A20251208Action extends BaseListAction {

	private static final long serialVersionUID = 9177125723988196033L;

	@Autowired
	private A20251208Service a20251208Service;

	private UserVO user;

	private UserInfoVO userInfo;

	private ConstructerVO constructer;

	private ConstructionVO construction;

	private ConstructionScheduleVO constructionSchedule;

	private String approve;

	private String userId;

	private AcceptanceVO acceptance;

	private ConstructionNodeVO constructionNode;

	@Action(value = "saveOrUpdateUserForPlatforPm", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String saveOrUpdateUserForPlatforPm() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		a20251208Service.saveOrUpdateUserForPlatforPm(userInfo, queryUserId());

		return SUCCESS;
	}

	@Action(value = "tranUserForPlatforPm", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String tranUserForPlatforPm() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		if ("agree".equals(approve)) a20251208Service.tranUserForPlatforPm(user, queryUserId());

		return SUCCESS;
	}

	@Action(value = "quitUserForPlatforPm", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String quitUserForPlatforPm() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		if ("agree".equals(approve)) a20251208Service.quitUserForPlatforPm(new UserVO(userId), queryUserId());

		return SUCCESS;
	}

	@Action(value = "beginConstructionScheduleForPlatforPm", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String beginConstructionScheduleForPlatforPm() throws FLException {

		a20251208Service.beginConstructionScheduleForPlatforPm(constructionSchedule, queryUserId());

		return SUCCESS;
	}
	
	@Action(value = "finishConstructionScheduleForPlatforPm", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String finishConstructionScheduleForPlatforPm() throws FLException {

		a20251208Service.finishConstructionScheduleForPlatforPm(constructionSchedule, queryUserId());

		return SUCCESS;
	}

	@Action(value = "syncConstructionScheduleForPlatforPm", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String syncConstructionScheduleForPlatforPm() throws FLException {

		a20251208Service.syncConstructionScheduleForPlatforPm(constructionSchedule);

		return SUCCESS;
	}
	
	@Action(value = "addConstructerForPlatforPm", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addConstructerForPlatforPm() throws FLException {

		a20251208Service.addConstructerForPlatforPm(constructer, queryUserId());

		return SUCCESS;
	}
	
	@Action(value = "deleteConstructerForPlatforPm", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteConstructerForPlatforPm() throws FLException {

		a20251208Service.deleteConstructerForPlatforPm(constructer);

		return SUCCESS;
	}

	@Action(value = "beginConstructionForPlatforPm", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String beginConstructionForPlatforPm() throws FLException {

		a20251208Service.beginConstructionForPlatforPm(construction, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "syncConstructionForPlatforPm", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String syncConstructionForPlatforPm() throws FLException {

		a20251208Service.syncConstructionForPlatforPm(construction);

		return SUCCESS;
	}

	@Action(value = "updateAcceptanceForPlatforPm", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateAcceptanceForPlatforPm() throws FLException {

		a20251208Service.updateAcceptanceForPlatforPm(acceptance);

		return SUCCESS;
	}

	@Action(value = "syncConstructionNodeForPlatforPm", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String syncConstructionNodeForPlatforPm() throws FLException {

		a20251208Service.syncConstructionNodeForPlatforPm(constructionNode);

		return SUCCESS;
	}

	public UserInfoVO getUserInfo() {
		return userInfo;
	}

	public void setUserInfo(UserInfoVO userInfo) {
		this.userInfo = userInfo;
	}

	public ConstructerVO getConstructer() {
		return constructer;
	}

	public void setConstructer(ConstructerVO constructer) {
		this.constructer = constructer;
	}

	public ConstructionVO getConstruction() {
		return construction;
	}

	public void setConstruction(ConstructionVO construction) {
		this.construction = construction;
	}

	public ConstructionScheduleVO getConstructionSchedule() {
		return constructionSchedule;
	}

	public void setConstructionSchedule(ConstructionScheduleVO constructionSchedule) {
		this.constructionSchedule = constructionSchedule;
	}

	public UserVO getUser() {
		return user;
	}

	public void setUser(UserVO user) {
		this.user = user;
	}

	public String getApprove() {
		return approve;
	}

	public void setApprove(String approve) {
		this.approve = approve;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public AcceptanceVO getAcceptance() {
		return acceptance;
	}

	public void setAcceptance(AcceptanceVO acceptance) {
		this.acceptance = acceptance;
	}

	public ConstructionNodeVO getConstructionNode() {
		return constructionNode;
	}

	public void setConstructionNode(ConstructionNodeVO constructionNode) {
		this.constructionNode = constructionNode;
	}

}
