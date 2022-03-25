package com.fanglin.customer.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.service.VustomerNetService;
import com.fanglin.customer.vo.VustomerNetVO;

@ParentPackage("common")
@Namespace("/")
@Controller
public class VustomerNetAction extends BaseListAction {

	private static final long serialVersionUID = 4798537623864098770L;

	@Autowired
	private VustomerNetService vustomerNetService;

	private VustomerNetVO vustomerNet;

	private List<?> counts;

	@Action(value = "countVustomerNetByUnionId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String countVustomerNetByUnionId() throws FLException {

		counts = vustomerNetService.countVustomerNetByUnionId(vustomerNet);

		return SUCCESS;
	}

	@Action(value = "buildVustomerNet", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String buildVustomerNet() throws FLException {

		vustomerNetService.buildVustomerNet(vustomerNet);

		return SUCCESS;
	}

	public VustomerNetVO getVustomerNet() {
		return vustomerNet;
	}

	public void setVustomerNet(VustomerNetVO vustomerNet) {
		this.vustomerNet = vustomerNet;
	}

	public List<?> getCounts() {
		return counts;
	}

	public void setCounts(List<?> counts) {
		this.counts = counts;
	}

}
