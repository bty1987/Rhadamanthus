/**
 * @File Name		: QuotationTypeAction.java
 * @Package   	: com.fanglin.action
 * @Version		: 1.0
 * @Date			: 2014-7-27
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
import com.fanglin.data.quotation.service.QuotationTypeService;
import com.fanglin.data.quotation.vo.QuotationTypeVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationTypeAction extends BaseListAction {

	private static final long serialVersionUID = 2171262476853496669L;
	
	@Autowired
	private QuotationTypeService quotationTypeService;
	
	private List<QuotationTypeVO> quotationTypes;
	
	@Action(value="queryQuotationType", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryQuotationType(){
		
		quotationTypes = quotationTypeService.queryQuotationType();
		
		return SUCCESS;
	}

	public List<QuotationTypeVO> getQuotationTypes(){
		return quotationTypes;
	}

	public void setQuotationTypes(List<QuotationTypeVO> quotationTypes){
		this.quotationTypes = quotationTypes;
	}
	
}
