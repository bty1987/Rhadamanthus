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
import com.fanglin.data.quotation.service.NormriceService;
import com.fanglin.data.quotation.vo.NormriceVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class NormriceAction extends BaseListAction {

	private static final long serialVersionUID = -3858046930028576177L;

	@Autowired
	NormriceService normriceService;

	List<NormriceVO> normrices;

	NormriceVO normrice;
	
	@Action(value = "pageNormrice", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageNormrice() throws FLException {

		normriceService.pageNormrice(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "queryNormriceByQiid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryNormriceByQiid() throws FLException {

		normrices = normriceService.queryNormriceByQiid(normrice.getQuotationItem().getQiid());

		return SUCCESS;
	}

	@Action(value = "addNormrice", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addNormrice() throws FLException {

		normriceService.addNormrice(normrice);

		return SUCCESS;
	}

	@Action(value = "deleteNormrice", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteNormrice() throws FLException {

		normriceService.deleteNormrice(normrice);

		return SUCCESS;
	}

	public List<NormriceVO> getNormrices() {
		return normrices;
	}

	public void setNormrices(List<NormriceVO> normrices) {
		this.normrices = normrices;
	}

	public NormriceVO getNormrice() {
		return normrice;
	}

	public void setNormrice(NormriceVO normrice) {
		this.normrice = normrice;
	}

}
