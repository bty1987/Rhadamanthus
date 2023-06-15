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
import com.fanglin.data.quotation.service.CormriceService;
import com.fanglin.data.quotation.vo.CormriceVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CormriceAction extends BaseListAction {

	private static final long serialVersionUID = 9138615197897008685L;

	@Autowired
	CormriceService cormriceService;

	List<CormriceVO> cormrices;

	CormriceVO cormrice;

	@Action(value = "pageCormrice", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageCormrice() throws FLException {

		cormriceService.pageCormrice(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryCormriceByQcid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCormriceByQcid() throws FLException {

		cormrices = cormriceService.queryCormriceByQcid(cormrice.getQuotationCtem().getQcid());

		return SUCCESS;
	}

	@Action(value = "addCormrice", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addCormrice() throws FLException {

		cormriceService.addCormrice(cormrice, queryCompany());

		return SUCCESS;
	}

	@Action(value = "deleteCormrice", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteCormrice() throws FLException {

		cormriceService.deleteCormrice(cormrice);

		return SUCCESS;
	}

	public List<CormriceVO> getCormrices() {
		return cormrices;
	}

	public void setCormrices(List<CormriceVO> cormrices) {
		this.cormrices = cormrices;
	}

	public CormriceVO getCormrice() {
		return cormrice;
	}

	public void setCormrice(CormriceVO cormrice) {
		this.cormrice = cormrice;
	}

}
