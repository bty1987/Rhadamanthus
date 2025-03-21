package com.fanglin.data.material.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.material.service.RemeasureFormatService;
import com.fanglin.data.material.vo.RemeasureFormatVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class RemeasureFormatAction extends BaseListAction {

	private static final long serialVersionUID = 2753758343176021213L;

	@Autowired
	private RemeasureFormatService remeasureFormatService;

	private RemeasureFormatVO remeasureFormat;

	private List<RemeasureFormatVO> remeasureFormats;

	@Action(value = "queryRemeasureFormatByBid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryRemeasureFormatByBid() throws FLException {

		remeasureFormats = remeasureFormatService.queryRemeasureFormatByBid(remeasureFormat);

		return SUCCESS;
	}

	@Action(value = "queryRemeasureFormatByRfid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryRemeasureFormatByRfid() throws FLException {

		remeasureFormat = remeasureFormatService.queryRemeasureFormatByRfid(remeasureFormat);

		return SUCCESS;
	}

	@Action(value = "addRemeasureFormat", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addRemeasureFormat() throws FLException {

		remeasureFormatService.addRemeasureFormat(remeasureFormat, queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateRemeasureFormat", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateRemeasureFormat() throws FLException {

		remeasureFormatService.updateRemeasureFormat(remeasureFormat);

		return SUCCESS;
	}

	@Action(value = "updateRemeasureFormatForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateRemeasureFormatForStatus() throws FLException {

		remeasureFormatService.updateRemeasureFormatForStatus(remeasureFormat);

		return SUCCESS;
	}

	public RemeasureFormatVO getRemeasureFormat() {
		return remeasureFormat;
	}

	public void setRemeasureFormat(RemeasureFormatVO remeasureFormat) {
		this.remeasureFormat = remeasureFormat;
	}

	public List<RemeasureFormatVO> getRemeasureFormats() {
		return remeasureFormats;
	}

	public void setRemeasureFormats(List<RemeasureFormatVO> remeasureFormats) {
		this.remeasureFormats = remeasureFormats;
	}

}
