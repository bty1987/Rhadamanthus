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
import com.fanglin.construction.service.ConstructionProfileService;
import com.fanglin.construction.vo.ConstructionProfileVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ConstructionProfileAction extends BaseListAction {

	private static final long serialVersionUID = -710374698262609421L;

	@Autowired
	private ConstructionProfileService constructionProfileService;

	private ConstructionProfileVO constructionProfile;

	private List<ConstructionProfileVO> constructionProfiles;

	@Action(value = "pageConstructionProfile", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageConstructionProfile() throws FLException {

		constructionProfileService.pageConstructionProfile(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryConstructionProfileByCid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryConstructionProfileByCid() throws FLException {

		constructionProfiles = constructionProfileService.queryConstructionProfileByCid(constructionProfile);

		return SUCCESS;
	}

	@Action(value = "queryConstructionProfileByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryConstructionProfileByOrderId() throws FLException {

		constructionProfiles = constructionProfileService.queryConstructionProfileByOrderId(constructionProfile);

		return SUCCESS;
	}

	@Action(value = "queryConstructionProfileByCpid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryConstructionProfileByCpid() throws FLException {

		constructionProfile = constructionProfileService.queryConstructionProfileByCpid(constructionProfile);

		return SUCCESS;
	}

	@Action(value = "addConstructionProfile", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addConstructionProfile() throws FLException {

		constructionProfileService.addConstructionProfile(constructionProfile, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "makeConstructionProfile", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String makeConstructionProfile() throws FLException {

		constructionProfileService.makeConstructionProfile(constructionProfile, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "handleConstructionProfile", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String handleConstructionProfile() throws FLException {

		constructionProfileService.handleConstructionProfile(constructionProfile);

		return SUCCESS;
	}

	public ConstructionProfileVO getConstructionProfile() {
		return constructionProfile;
	}

	public void setConstructionProfile(ConstructionProfileVO constructionProfile) {
		this.constructionProfile = constructionProfile;
	}

	public List<ConstructionProfileVO> getConstructionProfiles() {
		return constructionProfiles;
	}

	public void setConstructionProfiles(List<ConstructionProfileVO> constructionProfiles) {
		this.constructionProfiles = constructionProfiles;
	}

}
