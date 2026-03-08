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
import com.fanglin.data.quotation.service.NormtimeService;
import com.fanglin.data.quotation.vo.NormtimeVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class NormtimeAction extends BaseListAction {

	private static final long serialVersionUID = -3858046930028576178L;

	@Autowired
	NormtimeService normtimeService;

	List<NormtimeVO> normtimes;

	NormtimeVO normtime;

	@Action(value = "pageNormtime", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageNormtime() throws FLException {

		normtimeService.pageNormtime(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "queryNormtimeByQiid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryNormtimeByQiid() throws FLException {

		normtimes = normtimeService.queryNormtimeByQiid(normtime.getQuotationItem().getQiid());

		return SUCCESS;
	}

	@Action(value = "addNormtime", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addNormtime() throws FLException {

		normtimeService.addNormtime(normtime);

		return SUCCESS;
	}

	@Action(value = "deleteNormtime", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteNormtime() throws FLException {

		normtimeService.deleteNormtime(normtime);

		return SUCCESS;
	}

	public List<NormtimeVO> getNormtimes() {
		return normtimes;
	}

	public void setNormtimes(List<NormtimeVO> normtimes) {
		this.normtimes = normtimes;
	}

	public NormtimeVO getNormtime() {
		return normtime;
	}

	public void setNormtime(NormtimeVO normtime) {
		this.normtime = normtime;
	}

}
