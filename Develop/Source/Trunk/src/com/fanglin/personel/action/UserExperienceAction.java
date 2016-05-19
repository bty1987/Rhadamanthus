package com.fanglin.personel.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.personel.service.UserExperienceService;
import com.fanglin.personel.vo.UserExperienceVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class UserExperienceAction extends BaseListAction {

	private static final long serialVersionUID = -5295311320323779589L;

	@Autowired
	private UserExperienceService userExperienceService;

	private List<UserExperienceVO> userExperienceList;
	
	private List<Long> userExperienceIds;
	
	private String editUserId;
	
	@Action(value = "pageUserExperienceByUserId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageUserExperienceByUserId(){
		
		userExperienceService.pageUserExperienceByUserId(getPaging(), getEditUserId());
		
		return SUCCESS;
	}

	public List<UserExperienceVO> getUserExperienceList(){
		return userExperienceList;
	}

	public void setUserExperienceList(List<UserExperienceVO> userExperienceList){
		this.userExperienceList = userExperienceList;
	}

	public List<Long> getUserExperienceIds(){
		return userExperienceIds;
	}

	public void setUserExperienceIds(List<Long> userExperienceIds){
		this.userExperienceIds = userExperienceIds;
	}

	public String getEditUserId(){
		return editUserId;
	}

	public void setEditUserId(String editUserId){
		this.editUserId = editUserId;
	}

}
