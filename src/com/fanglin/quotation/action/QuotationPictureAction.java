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
import com.fanglin.quotation.service.QuotationPictureService;
import com.fanglin.quotation.vo.QuotationPictureVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationPictureAction extends BaseListAction {

	private static final long serialVersionUID = -8366731978808959435L;

	@Autowired
	private QuotationPictureService quotationPictureService;

	private List<QuotationPictureVO> quotationPictures;

	private QuotationPictureVO quotationPicture;

	@Action(value = "queryQuotationPicture", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationPicture() throws FLException {

		quotationPictures = quotationPictureService.queryQuotationPicture(quotationPicture);

		return SUCCESS;
	}

	@Action(value = "addQuotationPicture", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addQuotationPicture() throws FLException {

		quotationPictureService.addQuotationPicture(quotationPictures, queryUserId());

		return SUCCESS;
	}

	@Action(value = "deleteQuotationPicture", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteQuotationPicture() throws FLException {

		quotationPictureService.deleteQuotationPicture(quotationPicture);

		return SUCCESS;
	}

	public List<QuotationPictureVO> getQuotationPictures() {
		return quotationPictures;
	}

	public void setQuotationPictures(List<QuotationPictureVO> quotationPictures) {
		this.quotationPictures = quotationPictures;
	}

	public QuotationPictureVO getQuotationPicture() {
		return quotationPicture;
	}

	public void setQuotationPicture(QuotationPictureVO quotationPicture) {
		this.quotationPicture = quotationPicture;
	}

}
