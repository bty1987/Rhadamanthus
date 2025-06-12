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
import com.fanglin.personel.service.UserPartnerService;
import com.fanglin.personel.vo.UserPartnerVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class UserPartnerAction extends BaseListAction {

	private static final long serialVersionUID = -8979514713025236539L;

	@Autowired
	private UserPartnerService userPartnerService;

	private List<UserPartnerVO> userPartners;

	private UserPartnerVO userPartner;

	@Action(value = "queryUserPartner", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryUserPartner() throws FLException {

		userPartners = userPartnerService.queryUserPartner(userPartner);

		return SUCCESS;
	}

	@Action(value = "addUserPartner", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addUserPartner() throws FLException {

		userPartnerService.addUserPartner(userPartner, queryCompany());

		return SUCCESS;
	}

	@Action(value = "deleteUserPartner", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteUserPartner() throws FLException {

		userPartnerService.deleteUserPartner(userPartner);

		return SUCCESS;
	}

	public List<UserPartnerVO> getUserPartners() {
		return userPartners;
	}

	public void setUserPartners(List<UserPartnerVO> userPartners) {
		this.userPartners = userPartners;
	}

	public UserPartnerVO getUserPartner() {
		return userPartner;
	}

	public void setUserPartner(UserPartnerVO userPartner) {
		this.userPartner = userPartner;
	}

}
