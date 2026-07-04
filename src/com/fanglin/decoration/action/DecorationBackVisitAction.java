/**
 * @File Name		: DecorationBackVisitAction
 * @Package   	: com.fanglin.decoration.action
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: bty1987@163.com
 * @Describing	:
 */

package com.fanglin.decoration.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.service.DecorationBackVisitService;
import com.fanglin.decoration.vo.DecorationBackVisitVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationBackVisitAction extends BaseListAction {

	private static final long serialVersionUID = -1599812124963548192L;

	@Autowired
	private DecorationBackVisitService decorationBackVisitService;

	private DecorationBackVisitVO backVisit;

	private List<DecorationBackVisitVO> backVisits;

	@Action(value = "pageDecorationBackVisitByOrderId", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationBackVisitByOrderId(){

		decorationBackVisitService.pageDecorationBackVisitByOrderId(getPaging(), getFilters(), backVisit);

		return SUCCESS;
	}

	@Action(value = "queryDecorationBackVisitByOrderId", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationBackVisitByOrderId(){

		backVisits = decorationBackVisitService.queryDecorationBackVisitByOrderId(backVisit);

		return SUCCESS;
	}

	@Action(value = "addDecorationBackVisit", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addDecorationBackVisit() throws FLException{

		decorationBackVisitService.addDecorationBackVisit(backVisit, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "deleteDecorationBackVisitById", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteDecorationBackVisitById(){

		decorationBackVisitService.deleteDecorationBackVisitById(backVisit);

		return SUCCESS;
	}

	public DecorationBackVisitVO getBackVisit(){
		return backVisit;
	}

	public void setBackVisit(DecorationBackVisitVO backVisit){
		this.backVisit = backVisit;
	}

	public void setBackVisits(List<DecorationBackVisitVO> backVisits){
		this.backVisits = backVisits;
	}

	public List<DecorationBackVisitVO> getBackVisits(){
		return backVisits;
	}

}
