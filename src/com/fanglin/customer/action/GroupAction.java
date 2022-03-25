package com.fanglin.customer.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.service.GroupService;
import com.fanglin.customer.vo.GroupVO;

@ParentPackage("common")
@Namespace("/")
@Controller
public class GroupAction extends BaseListAction {

	private static final long serialVersionUID = -2991353340507607956L;

	@Autowired
	private GroupService groupService;

	private GroupVO group;

	private String unionId;

	@Action(value = "queryGroup", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryGroup() throws FLException {

		group = groupService.queryGroup(group);

		return SUCCESS;
	}

	@Action(value = "updateGroup", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateGroup() throws FLException {

		groupService.updateGroup(group);

		return SUCCESS;
	}

	public GroupVO getGroup() {
		return group;
	}

	public void setGroup(GroupVO group) {
		this.group = group;
	}

	public String getUnionId() {
		return unionId;
	}

	public void setUnionId(String unionId) {
		this.unionId = unionId;
	}

}
