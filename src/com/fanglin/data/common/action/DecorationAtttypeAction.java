package com.fanglin.data.common.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.service.DecorationAtttypeService;
import com.fanglin.data.common.vo.DecorationAtttypeVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationAtttypeAction extends BaseListAction {

	private static final long serialVersionUID = 5635520639945368700L;

	@Autowired
	private DecorationAtttypeService decorationAtttypeService;

	private List<DecorationAtttypeVO> decorationAtttypes;

	@Action(value = "pageDecorationAtttype", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationAtttype() throws FLException {

		decorationAtttypeService.pageDecorationAtttype(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryDecorationAtttype", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationAtttype() throws FLException {

		decorationAtttypes = decorationAtttypeService.queryDecorationAtttype(queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryDecorationAtttypeByTypeAndCompany", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationAtttypeByTypeAndCompany() throws FLException {

		short type = getShortParameter("type", (short)0);
		DecorationAtttypeVO atttype = decorationAtttypeService.queryDecorationAtttypeByTypeAndCompany(type, queryCompany());

		setJsonResult(atttype);

		return SUCCESS;
	}

	public List<DecorationAtttypeVO> getDecorationAtttypes() {
		return decorationAtttypes;
	}

	public void setDecorationAtttypes(List<DecorationAtttypeVO> decorationAtttypes) {
		this.decorationAtttypes = decorationAtttypes;
	}

}
