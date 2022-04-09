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
import com.fanglin.report.service.QuotationRankService;
import com.fanglin.report.vo.AddReduceRankVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationRankAction extends BaseListAction {

	private static final long serialVersionUID = -4005684085957114814L;

	@Autowired
	private QuotationRankService quotationRankService;

	private List<AddReduceRankVO> addReduceRankVOs;

	@Action(value = "rankAddReduce", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String rankAddReduce() throws FLException {

		addReduceRankVOs = quotationRankService.rankAddReduce(queryCompany());

		return SUCCESS;
	}

	public List<AddReduceRankVO> getAddReduceRankVOs() {
		return addReduceRankVOs;
	}

	public void setAddReduceRankVOs(List<AddReduceRankVO> addReduceRankVOs) {
		this.addReduceRankVOs = addReduceRankVOs;
	}

}
