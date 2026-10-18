/**
 * @File Name		: QuotationRtemAction.java
 * @Package   	: com.fanglin.action
 * @Version		: 1.0
 * @Date			: 2014-7-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

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
import com.fanglin.data.quotation.service.QuotationRtemService;
import com.fanglin.data.quotation.vo.QuotationRtemVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationRtemAction extends BaseListAction {

	private static final long serialVersionUID = 6043756863880446167L;

	@Autowired
	private QuotationRtemService quotationRtemService;

	private QuotationRtemVO quotationRtem;

	private List<QuotationRtemVO> quotationRtems;
	private long quotationId;

	@Action(value = "queryQuotationRtem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationRtem() throws FLException {

		quotationRtems = quotationRtemService.queryQuotationRtem(quotationRtem);

		return SUCCESS;
	}

	@Action(value = "queryQuotationRtemByQuotationId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationRtemByQuotationId() throws FLException {

		quotationRtems = quotationRtemService.queryQuotationRtemByQuotationId(quotationId);

		return SUCCESS;
	}

	@Action(value = "addQuotationRtem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addQuotationRtem() throws FLException {

		quotationRtemService.addQuotationRtem(quotationRtem);

		return SUCCESS;
	}

	@Action(value = "deleteQuotationRtem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteQuotationRtem() throws FLException {

		quotationRtemService.deleteQuotationRtem(quotationRtem);

		return SUCCESS;
	}

	public QuotationRtemVO getQuotationRtem() {
		return quotationRtem;
	}

	public void setQuotationRtem(QuotationRtemVO QuotationRtem) {
		this.quotationRtem = QuotationRtem;
	}

	public long getQuotationId() {
		return quotationId;
	}

	public void setQuotationId(long quotationId) {
		this.quotationId = quotationId;
	}

	public List<QuotationRtemVO> getQuotationRtems() {
		return quotationRtems;
	}

	public void setQuotationRtems(List<QuotationRtemVO> quotationRtems) {
		this.quotationRtems = quotationRtems;
	}

}
