/**
 * @File Name		: DecorationRankAction.java
 * @Package   	: com.fanglin.report.action
 * @Version		: 1.0
 * @Date			: 2015-6-23
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.report.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.report.service.DecorationRankService;
import com.fanglin.report.vo.DecorationDepartmentRankVO;
import com.fanglin.report.vo.DecorationRankVO;
import com.fanglin.report.vo.DecorationRegionRankVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationRankAction extends BaseListAction {

	private static final long serialVersionUID = 3985855196344696431L;

	@Autowired
	private DecorationRankService decorationRankService;

	private DecorationRankVO decorationRank;

	private DecorationDepartmentRankVO decorationDepartmentRank;

	private DecorationRegionRankVO decorationRegionRank;

	private List<?> ranks;

	@Action(value = "queryDecorationRank", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationRank() throws FLException {

		ranks = decorationRankService.queryDecorationRankForTop(decorationRank, -1, queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryDecorationDepartmentRank", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationDepartmentRank() throws FLException {

		ranks = decorationRankService.queryDecorationDepartmentRankForTop(decorationDepartmentRank, -1, queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryDecorationRegionRank", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationRegionRank() throws FLException {

		ranks = decorationRankService.queryDecorationRegionRankForTop(decorationRegionRank, -1, queryCompany());

		return SUCCESS;
	}

	@Action(value = "decorationRank", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String decorationDesignerRank() throws FLException {

		ranks = decorationRankService.queryDecorationRankForTop(decorationRank, 10, queryCompany());

		return SUCCESS;
	}

	@Action(value = "decorationDepartmentRank", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String decorationDesignerDepartmentRank() throws FLException {

		ranks = decorationRankService.queryDecorationDepartmentRankForTop(decorationDepartmentRank, 10, queryCompany());

		return SUCCESS;
	}

	@Action(value = "decorationRegionRank", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String decorationRegionRank() throws FLException {

		ranks = decorationRankService.queryDecorationRegionRankForTop(decorationRegionRank, 10, queryCompany());

		return SUCCESS;
	}

	public DecorationRankVO getDecorationRank() {
		return decorationRank;
	}

	public void setDecorationRank(DecorationRankVO decorationRank) {
		this.decorationRank = decorationRank;
	}

	public DecorationDepartmentRankVO getDecorationDepartmentRank() {
		return decorationDepartmentRank;
	}

	public void setDecorationDepartmentRank(DecorationDepartmentRankVO decorationDepartmentRank) {
		this.decorationDepartmentRank = decorationDepartmentRank;
	}

	public DecorationRegionRankVO getDecorationRegionRank() {
		return decorationRegionRank;
	}

	public void setDecorationRegionRank(DecorationRegionRankVO decorationRegionRank) {
		this.decorationRegionRank = decorationRegionRank;
	}

	public List<?> getRanks() {
		return ranks;
	}

	public void setRanks(List<?> ranks) {
		this.ranks = ranks;
	}

}
