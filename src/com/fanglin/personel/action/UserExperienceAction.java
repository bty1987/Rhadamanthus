package com.fanglin.personel.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.service.UserExperienceService;
import com.fanglin.personel.vo.UserExperienceVO;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class UserExperienceAction extends BaseListAction {

	private static final long serialVersionUID = -5295311320323779589L;

	@Autowired
	private UserExperienceService userExperienceService;

	private List<UserExperienceVO> userExperiences;

	private UserExperienceVO userExperience;

	@Action(value = "queryUserExperienceByUid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryUserExperienceByUid() throws FLException {

		userExperiences = userExperienceService.queryUserExperienceByUid(userExperience);

		return SUCCESS;
	}

	@Action(value = "updateUserExperience", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateUserExperience() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		userExperienceService.updateUserExperience(userExperience);

		return SUCCESS;
	}

	public List<UserExperienceVO> getUserExperiences() {
		return userExperiences;
	}

	public void setUserExperiences(List<UserExperienceVO> userExperiences) {
		this.userExperiences = userExperiences;
	}

	public UserExperienceVO getUserExperience() {
		return userExperience;
	}

	public void setUserExperience(UserExperienceVO userExperience) {
		this.userExperience = userExperience;
	}

}
