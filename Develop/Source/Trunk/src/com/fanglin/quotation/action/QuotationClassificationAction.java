/**
 * @File Name		: QuotationClassificationAction.java
 * @Package   	: com.fanglin.action
 * @Version		: 1.0
 * @Date			: 2014-7-29
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.quotation.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.quotation.service.QuotationClassificationService;
import com.fanglin.quotation.vo.QuotationClassificationVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationClassificationAction extends BaseListAction {

	private static final long serialVersionUID = -5156313632383961862L;
	
	@Autowired
	private QuotationClassificationService quotationClassificationService;
	
	private List<QuotationClassificationVO> quotationClassifications;
	
	@Action(value="queryQuotationClassification", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryQuotationClassification(){
		
		quotationClassifications = quotationClassificationService.queryQuotationClassification();
		
		return SUCCESS;
	}

	public List<QuotationClassificationVO> getQuotationClassifications(){
		return quotationClassifications;
	}

	public void setQuotationClassifications(List<QuotationClassificationVO> quotationClassifications){
		this.quotationClassifications = quotationClassifications;
	}
	
}
