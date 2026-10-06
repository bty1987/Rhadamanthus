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
import com.fanglin.data.quotation.service.CormtimeService;
import com.fanglin.data.quotation.vo.CormtimeVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CormtimeAction extends BaseListAction {

	private static final long serialVersionUID = 6581325512288639783L;

	@Autowired
	CormtimeService cormtimeService;

	List<CormtimeVO> cormtimes;

	CormtimeVO cormtime;

	@Action(value = "pageCormtime", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageCormtime() throws FLException {

		cormtimeService.pageCormtime(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "queryCormtimeByQfid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCormtimeByQfid() throws FLException {

		cormtimes = cormtimeService.queryCormtimeByQfid(cormtime.getQfid());

		return SUCCESS;
	}

	@Action(value = "addCormtime", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addCormtime() throws FLException {

		cormtimeService.addCormtime(cormtime);

		return SUCCESS;
	}

	@Action(value = "deleteCormtime", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteCormtime() throws FLException {

		cormtimeService.deleteCormtime(cormtime);

		return SUCCESS;
	}

	public List<CormtimeVO> getCormtimes() {
		return cormtimes;
	}

	public void setCormtimes(List<CormtimeVO> cormtimes) {
		this.cormtimes = cormtimes;
	}

	public CormtimeVO getCormtime() {
		return cormtime;
	}

	public void setCormtime(CormtimeVO cormtime) {
		this.cormtime = cormtime;
	}

}
