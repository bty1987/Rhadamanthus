package com.fanglin.quotation.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.service.ExtensionService;
import com.fanglin.quotation.vo.ExtensionVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ExtensionAction extends BaseListAction {

	private static final long serialVersionUID = 8905137891123969804L;

	@Autowired
	private ExtensionService extensionService;

	private List<ExtensionVO> extensions;

	private ExtensionVO extension;

	@Action(value = "pageExtensionByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageExtensionByOrderId() {

		extensionService.pageExtensionByOrderId(getPaging(), getFilters(), extension);

		return SUCCESS;
	}

	@Action(value = "queryExtensionByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryExtensionByOrderId() {

		extensions = extensionService.queryExtensionByOrderId(extension);

		return SUCCESS;
	}

	@Action(value = "addExtension", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addExtension() throws FLException {

		extensionService.addExtension(extension);

		return SUCCESS;
	}

	@Action(value = "updateExtension", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateExtension() throws FLException {

		extensionService.updateExtension(extension);

		return SUCCESS;
	}

	@Action(value = "updateExtensionForAdvance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateExtensionForAdvance() throws FLException {

		extensionService.updateExtensionForAdvance(extension);

		return SUCCESS;
	}

	@Action(value = "deleteExtension", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteExtension() throws FLException {

		extensionService.deleteExtension(extension);

		return SUCCESS;
	}

	public List<ExtensionVO> getExtensions() {
		return extensions;
	}

	public void setExtensions(List<ExtensionVO> extensions) {
		this.extensions = extensions;
	}

	public ExtensionVO getExtension() {
		return extension;
	}

	public void setExtension(ExtensionVO extension) {
		this.extension = extension;
	}

}
