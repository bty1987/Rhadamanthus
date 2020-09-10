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
import com.fanglin.quotation.service.QuotetionService;
import com.fanglin.quotation.vo.QuotetionVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotetionAction extends BaseListAction {

	private static final long serialVersionUID = -2649421810011478487L;

	@Autowired
	private QuotetionService quotetionService;

	private QuotetionVO quotetion;

	private List<QuotetionVO> quotetions;

	@Action(value = "queryQuotetion", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotetion() throws FLException {

		quotetions = quotetionService.queryQuotetion(queryUserId());

		return SUCCESS;
	}

	@Action(value = "queryQuotetionByQid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotetionByQid() {

		quotetion = quotetionService.queryQuotetionByQid(quotetion);

		return SUCCESS;
	}

	@Action(value = "queryQuotetionByNo", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotetionByNo() {

		quotetion = quotetionService.queryQuotetionByNo(quotetion);

		return SUCCESS;
	}

	@Action(value = "addQuotetion", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addQuotetion() throws FLException {

		quotetionService.addQuotetion(quotetion, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateQuotetion", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQuotetion() throws FLException {

		quotetionService.updateQuotetion(quotetion);

		return SUCCESS;
	}

	@Action(value = "updateQuotetionForAdvance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQuotetionForAdvance() throws FLException {

		quotetionService.updateQuotetionForAdvance(quotetion);

		return SUCCESS;
	}

	@Action(value = "deleteQuotetion", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteQuotetion() throws FLException {

		quotetionService.deleteQuotetion(quotetion);

		return SUCCESS;
	}

	@Action(value = "replicaQuotetion", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String replicaQuotetion() throws FLException {

		quotetionService.replicaQuotetion(quotetion, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "cloneQuotetion", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String cloneQuotetion() throws FLException {

		quotetionService.cloneQuotetion(quotetion, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "copyQuotetion", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String copyQuotetion() throws FLException {

		quotetionService.copyQuotetion(quotetion, queryUserId(), queryCompany());

		return SUCCESS;
	}

	public QuotetionVO getQuotetion() {
		return quotetion;
	}

	public void setQuotetion(QuotetionVO quotetion) {
		this.quotetion = quotetion;
	}

	public List<QuotetionVO> getQuotetions() {
		return quotetions;
	}

	public void setQuotetions(List<QuotetionVO> quotetions) {
		this.quotetions = quotetions;
	}

}
