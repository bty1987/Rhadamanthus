package com.fanglin.data.quotation.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.quotation.service.NormpackItemService;
import com.fanglin.data.quotation.vo.NormpackItemVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class NormpackItemAction extends BaseListAction {

	private static final long serialVersionUID = -7609393823523123034L;

	@Autowired
	private NormpackItemService normpackItemService;

	private List<NormpackItemVO> normpackItems;

	private NormpackItemVO normpackItem;

	@Action(value = "queryNormpackItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryNormpackItem() throws FLException {

		normpackItems = normpackItemService.queryNormpackItem(normpackItem);

		return SUCCESS;
	}

	@Action(value = "addNormpackItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addNormpackItem() throws FLException {

		normpackItemService.addNormpackItem(normpackItem);

		return SUCCESS;
	}

	@Action(value = "deleteNormpackItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteNormpackItem() throws FLException {

		normpackItemService.deleteNormpackItem(normpackItem);

		return SUCCESS;
	}

	public List<NormpackItemVO> getNormpackItems() {
		return normpackItems;
	}

	public void setNormpackItems(List<NormpackItemVO> normpackItems) {
		this.normpackItems = normpackItems;
	}

	public NormpackItemVO getNormpackItem() {
		return normpackItem;
	}

	public void setNormpackItem(NormpackItemVO normpackItem) {
		this.normpackItem = normpackItem;
	}

}
