package com.fanglin.information.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.information.service.VawardService;
import com.fanglin.information.vo.VawardVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class VawardAction extends BaseListAction {

	private static final long serialVersionUID = -4141641122501947005L;

	@Autowired
	private VawardService vawardService;

	private VawardVO vaward;

	private List<VawardVO> vawards;

	@Action(value = "queryVawardByNo", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryVawardByNo() throws FLException {

		vawards = vawardService.queryVawardByNo(vaward);

		return SUCCESS;
	}

	@Action(value = "addVaward", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addVaward() throws FLException {

		vawardService.addVaward(vaward);

		return SUCCESS;
	}

	@Action(value = "deleteVaward", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteVaward() throws FLException {

		vawardService.deleteVaward(vaward);

		return SUCCESS;
	}

	public VawardVO getVaward() {
		return vaward;
	}

	public void setVaward(VawardVO vaward) {
		this.vaward = vaward;
	}

	public List<VawardVO> getVawards() {
		return vawards;
	}

	public void setVawards(List<VawardVO> vawards) {
		this.vawards = vawards;
	}

}
