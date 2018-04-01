/**
 * Title: UserContractAction
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.personel.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.personel.service.UserContractService;
import com.fanglin.personel.vo.UserContractVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class UserContractAction extends BaseListAction {

	private static final long serialVersionUID = -5295311320323779589L;

	@Autowired
	private UserContractService userContractService;

	private List<UserContractVO> userContractList;
	
	private List<String> userContractIds;
	
	private String editUserId;
	
	@Action(value = "pageUserContractByUserId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageUserContractByUserId(){
		
		userContractService.pageUserContractByUserId(getPaging(), getEditUserId());
		
		return SUCCESS;
	}

	 @Action(value="addUserContract", results={@org.apache.struts2.convention.annotation.Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	  public String addUserContract()
	  {
	    userContractService.saveOrUpdateUserContract(getUserContractList());

	    return "success";
	  }

	  @Action(value="updateUserContract", results={@org.apache.struts2.convention.annotation.Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	  public String updateUserContract()
	  {
	    userContractService.saveOrUpdateUserContract(getUserContractList());

	    return "success";
	  }

	  @Action(value="deleteUserContract", results={@org.apache.struts2.convention.annotation.Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	  public String deleteUserContract()
	  {
	    userContractService.deleteUserContract(getUserContractIds());

	    return "success";
	  }
	
	public List<UserContractVO> getUserContractList(){
		return userContractList;
	}

	public void setUserContractList(List<UserContractVO> userContractList){
		this.userContractList = userContractList;
	}

	public List<String> getUserContractIds(){
		return userContractIds;
	}

	public void setUserContractIds(List<String> userContractIds){
		this.userContractIds = userContractIds;
	}

	public String getEditUserId(){
		return editUserId;
	}

	public void setEditUserId(String editUserId){
		this.editUserId = editUserId;
	}

}
