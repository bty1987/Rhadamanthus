package com.fanglin.market.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.market.service.EopinionsService;
import com.fanglin.market.vo.EopinionsVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class EopinionsAction extends BaseListAction{

	private static final long serialVersionUID = 6343058646875475735L;

	@Autowired
	private EopinionsService opinionsService;

	private EopinionsVO eopinion;

	private List<EopinionsVO> eopinions;

	@Action(value = "pageEopinions", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageEopinions() throws FLException{

		opinionsService.pageEopinions(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "queryEopinionsByType", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType","text/html" })
	public String queryEopinionsByType(){

		eopinions = opinionsService.queryEopinionsByType(eopinion);

		return SUCCESS;
	}

	@Action(value = "addEopinion", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addEopinion() throws FLException{

		opinionsService.addEopinion(eopinion);

		return SUCCESS;
	}

	@Action(value = "updateEopinion", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateEcase() throws FLException{

		opinionsService.updateEopinion(eopinion);

		return SUCCESS;
	}

	@Action(value = "deleteEopinion", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteEopinion() throws FLException{

		opinionsService.deleteEopinion(eopinion);

		return SUCCESS;
	}

	public EopinionsVO getEopinion() {
		return eopinion;
	}

	public void setEopinion(EopinionsVO eopinion) {
		this.eopinion = eopinion;
	}

	public List<EopinionsVO> getEopinions() {
		return eopinions;
	}

	public void setEopinions(List<EopinionsVO> eopinions) {
		this.eopinions = eopinions;
	}

}
