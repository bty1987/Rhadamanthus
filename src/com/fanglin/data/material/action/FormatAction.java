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
import com.fanglin.data.material.service.FormatService;
import com.fanglin.data.material.vo.FormatVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class FormatAction extends BaseListAction {

	private static final long serialVersionUID = 4520901013078753807L;

	@Autowired
	private FormatService formatService;

	private List<FormatVO> formats;

	private FormatVO format;

	@Action(value = "queryFormatByGid", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType","text/html" })
	public String queryFormatByGid() {
		formats = formatService.queryFormatByGid(format);
		return SUCCESS;
	}

	@Action(value = "queryFormatForEnableByGid", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType","text/html" })
	public String queryFormatForEnableByGid() {
		formats = formatService.queryFormatForEnableByGid(format);
		return SUCCESS;
	}

	@Action(value = "addFormat", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType","text/html" })
	public String addFormat() throws FLException {
		formatService.addFormat(format);
		return SUCCESS;
	}

	@Action(value = "updateFormatForStatus", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType","text/html" })
	public String updateFormatForStatus() throws FLException {
		formatService.updateFormatForStatus(format);
		return SUCCESS;
	}

	public List<FormatVO> getFormats() {
		return formats;
	}

	public void setFormats(List<FormatVO> formats) {
		this.formats = formats;
	}

	public FormatVO getFormat() {
		return format;
	}

	public void setFormat(FormatVO format) {
		this.format = format;
	}

}
