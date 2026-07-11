package com.fanglin.communion.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.communion.service.ConstantService;
import com.fanglin.communion.vo.ConstantVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ConstantAction extends BaseListAction {

	private static final long serialVersionUID = -1996109605166449819L;

	@Autowired
	private ConstantService constantService;

	private ConstantVO constant;

	private List<ConstantVO> constants;

	@Action(value = "pageConstant", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageConstant() throws FLException {

		constantService.pageConstant(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "queryConstant", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryConstant() throws FLException {

		constants = constantService.queryConstant(constant);

		return SUCCESS;
	}

	@Action(value = "addConstant", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addConstant() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		constantService.addConstant(constant);

		return SUCCESS;
	}

	@Action(value = "updateConstant", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateConstant() throws FLException {

		constantService.updateConstant(constant);

		return SUCCESS;
	}

	@Action(value = "updateConstantForStatus", results = { @org.apache.struts2.convention.annotation.Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateConstantForStatus() throws FLException {

		constantService.updateConstantForStatus(constant);

		return "success";
	}

	@Action(value = "deleteConstant", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteConstant() throws FLException {

		constantService.deleteConstant(constant);

		return SUCCESS;
	}

	public ConstantVO getConstant() {
		return constant;
	}

	public void setConstant(ConstantVO constant) {
		this.constant = constant;
	}

	public List<ConstantVO> getConstants() {
		return constants;
	}

	public void setConstants(List<ConstantVO> constants) {
		this.constants = constants;
	}

}
