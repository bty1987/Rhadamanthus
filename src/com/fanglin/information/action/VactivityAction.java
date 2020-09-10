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
import com.fanglin.information.service.VactivityService;
import com.fanglin.information.vo.VactivityVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class VactivityAction extends BaseListAction {

	private static final long serialVersionUID = -350260495973107326L;

	@Autowired
	private VactivityService vactivityService;

	private List<VactivityVO> vactivitys;

	private VactivityVO vactivity;

	@Action(value = "pageVactivity", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageVactivity() {

		vactivityService.pageVactivity(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "queryVactivity", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryVactivity() throws FLException {

		vactivitys = vactivityService.queryVactivity();

		return SUCCESS;
	}

	@Action(value = "updateVactivityForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateVactivityForStatus() throws FLException {

		vactivityService.updateVactivityForStatus(vactivity);

		return SUCCESS;
	}

	public List<VactivityVO> getVactivitys() {
		return vactivitys;
	}

	public void setVactivitys(List<VactivityVO> vactivitys) {
		this.vactivitys = vactivitys;
	}

	public VactivityVO getVactivity() {
		return vactivity;
	}

	public void setVactivity(VactivityVO vactivity) {
		this.vactivity = vactivity;
	}

}
