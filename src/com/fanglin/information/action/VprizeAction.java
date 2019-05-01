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
import com.fanglin.information.service.VprizeService;
import com.fanglin.information.vo.VprizeVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class VprizeAction extends BaseListAction {

	private static final long serialVersionUID = -350260495973107326L;

	@Autowired
	private VprizeService vprizeService;

	private List<VprizeVO> vprizes;

	private VprizeVO vprize;

	@Action(value = "pageVprize", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageVprize() {

		vprizeService.pageVprice(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "addVprize", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addVprize() throws FLException {

		vprizeService.addVprize(vprize);

		return SUCCESS;
	}

	@Action(value = "updateVprize", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateVprize() throws FLException {

		vprizeService.updateVprize(vprize);

		return SUCCESS;
	}

	@Action(value = "updateVprizeForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateVprizeForStatus() throws FLException {

		vprizeService.updateVprizeForStatus(vprize);

		return SUCCESS;
	}

	public List<VprizeVO> getVprizes() {
		return vprizes;
	}

	public void setVprizes(List<VprizeVO> vprizes) {
		this.vprizes = vprizes;
	}

	public VprizeVO getVprize() {
		return vprize;
	}

	public void setVprize(VprizeVO vprize) {
		this.vprize = vprize;
	}

}
