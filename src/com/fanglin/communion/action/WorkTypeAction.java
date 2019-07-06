package com.fanglin.communion.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.communion.service.WorkTypeService;
import com.fanglin.communion.vo.WorkTypeVO;
import com.fanglin.core.action.BaseListAction;

@ParentPackage("base")
@Namespace("/")
@Controller
public class WorkTypeAction extends BaseListAction {

	private static final long serialVersionUID = 1651273403349675468L;

	@Autowired
	private WorkTypeService workTypeService;

	private List<WorkTypeVO> workTypes;

	@Action(value = "queryWorkType", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryWorkType() {

		workTypes = workTypeService.queryWorkType();

		return SUCCESS;
	}

	public List<WorkTypeVO> getWorkTypes() {
		return workTypes;
	}

	public void setWorkTypes(List<WorkTypeVO> workTypes) {
		this.workTypes = workTypes;
	}

}
