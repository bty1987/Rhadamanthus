package com.fanglin.construction.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.construction.service.DrawlineProfileService;
import com.fanglin.construction.vo.DrawlineProfileVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DrawlineProfileAction extends BaseListAction {

	private static final long serialVersionUID = -710374698262609422L;

	@Autowired
	private DrawlineProfileService drawlineProfileService;

	private DrawlineProfileVO drawlineProfile;

	private List<DrawlineProfileVO> drawlineProfiles;

	@Action(value = "pageDrawlineProfile", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDrawlineProfile() throws FLException {

		drawlineProfileService.pageDrawlineProfile(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryDrawlineProfileByDlid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDrawlineProfileByDlid() throws FLException {

		drawlineProfiles = drawlineProfileService.queryDrawlineProfileByDlid(drawlineProfile);

		return SUCCESS;
	}

	@Action(value = "queryDrawlineProfileByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDrawlineProfileByOrderId() throws FLException {

		drawlineProfiles = drawlineProfileService.queryDrawlineProfileByOrderId(drawlineProfile);

		return SUCCESS;
	}

	@Action(value = "queryDrawlineProfileByDpid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDrawlineProfileByDpid() throws FLException {

		drawlineProfile = drawlineProfileService.queryDrawlineProfileByDpid(drawlineProfile);

		return SUCCESS;
	}

	@Action(value = "addDrawlineProfile", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addDrawlineProfile() throws FLException {

		drawlineProfileService.addDrawlineProfile(drawlineProfile, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "makeDrawlineProfile", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String makeDrawlineProfile() throws FLException {

		drawlineProfileService.makeDrawlineProfile(drawlineProfile, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "handleDrawlineProfile", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String handleDrawlineProfile() throws FLException {

		drawlineProfileService.handleDrawlineProfile(drawlineProfile);

		return SUCCESS;
	}

	public DrawlineProfileVO getDrawlineProfile() {
		return drawlineProfile;
	}

	public void setDrawlineProfile(DrawlineProfileVO drawlineProfile) {
		this.drawlineProfile = drawlineProfile;
	}

	public List<DrawlineProfileVO> getDrawlineProfiles() {
		return drawlineProfiles;
	}

	public void setDrawlineProfiles(List<DrawlineProfileVO> drawlineProfiles) {
		this.drawlineProfiles = drawlineProfiles;
	}

}
