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
import com.fanglin.quotation.service.NormtimeItemService;
import com.fanglin.quotation.vo.NormtimeItemVO;
import com.fanglin.quotation.vo.NormtionVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class NormtimeItemAction extends BaseListAction {

	private static final long serialVersionUID = -5489550634835403988L;

	@Autowired
	private NormtimeItemService normtimeItemService;

	private NormtimeItemVO normtimeItem;

	private List<NormtimeItemVO> normtimeItems;

	private NormtionVO normtion;

	@Action(value = "queryNormtimeItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryNormtimeItem() {

		normtimeItems = normtimeItemService.queryNormtimeItem(normtimeItem);

		return SUCCESS;
	}

	@Action(value = "addNormtimeItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addNormtimeItem() throws FLException {

		normtimeItemService.addNormtimeItem(normtion, normtimeItem);
		return SUCCESS;
	}

	@Action(value = "deleteNormtimeItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteNormtimeItem() throws FLException {

		normtimeItemService.deleteNormtimeItem(normtion, normtimeItem);

		return SUCCESS;
	}

	public NormtimeItemVO getNormtimeItem() {
		return normtimeItem;
	}

	public void setNormtimeItem(NormtimeItemVO normtimeItem) {
		this.normtimeItem = normtimeItem;
	}

	public List<NormtimeItemVO> getNormtimeItems() {
		return normtimeItems;
	}

	public void setNormtimeItems(List<NormtimeItemVO> normtimeItems) {
		this.normtimeItems = normtimeItems;
	}

	public NormtionVO getNormtion() {
		return normtion;
	}

	public void setNormtion(NormtionVO normtion) {
		this.normtion = normtion;
	}

}
