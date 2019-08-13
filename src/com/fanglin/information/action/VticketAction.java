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
import com.fanglin.information.service.VticketService;
import com.fanglin.information.vo.VticketVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class VticketAction extends BaseListAction {

	private static final long serialVersionUID = 2327633842496704953L;

	@Autowired
	private VticketService vticketService;

	private List<VticketVO> vtickets;

	private List<?> counts;

	private VticketVO vticket;

	@Action(value = "pageVticket", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageVticket() {

		vticketService.pageVticket(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "pageVticketForBelonger", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageVticketForBelonger() throws FLException {

		vticketService.pageVticketForBelonger(getPaging(), getFilters(), queryUserId());

		return SUCCESS;
	}

	@Action(value = "createVticket", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String createVticket() throws FLException {

		vticketService.createVticket(vticket, queryUserId());

		return SUCCESS;
	}

	@Action(value = "updateVticket", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateVticket() throws FLException {

		vticketService.updateVticket(vticket);

		return SUCCESS;
	}

	@Action(value = "comeVticket", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String comeVticket() throws FLException {

		vticketService.comeVticket(vticket);

		return SUCCESS;
	}

	@Action(value = "registVticket", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String registVticket() throws FLException {

		vticketService.registVticket(vticket);

		return SUCCESS;
	}

	@Action(value = "takeVticket", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String takeVticket() throws FLException {

		vticketService.takeVticket(queryUserId());

		return SUCCESS;
	}

	@Action(value = "freeVticket", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String freeVticket() throws FLException {

		vticketService.freeVticket(vticket, queryUserId());

		return SUCCESS;
	}

	public List<VticketVO> getVtickets() {
		return vtickets;
	}

	public void setVtickets(List<VticketVO> vtickets) {
		this.vtickets = vtickets;
	}

	public List<?> getCounts() {
		return counts;
	}

	public void setCounts(List<?> counts) {
		this.counts = counts;
	}

	public VticketVO getVticket() {
		return vticket;
	}

	public void setVticket(VticketVO vticket) {
		this.vticket = vticket;
	}

}
