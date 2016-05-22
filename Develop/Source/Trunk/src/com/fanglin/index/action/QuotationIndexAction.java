/**
 * @File Name		: QuotationIndexAction.java
 * @Package   	: com.fanglin.common.action
 * @Version		: 1.0
 * @Date			: 2015-5-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.index.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;

@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationIndexAction extends BaseListAction {

	private static final long serialVersionUID = 8498905497111361740L;
	
	@Action(value = "functionAreaIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/quotation/functionArea.html") })
	public String functionAreaIndex(){
		return SUCCESS;
	}
	
	@Action(value = "quotationIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/quotation/quotationIndex.html")})
	public String quotationIndex(){
		return SUCCESS;
	}
	
	@Action(value = "quotationDetailIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/quotation/quotationDetail.html")})
	public String quotationDetailIndex(){
		return SUCCESS;
	}
	
	@Action(value = "printQuotaionIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/quotation/quotationList.html")})
	public String printQuotaionIndex(){
		return SUCCESS;
	}
	
	@Action(value="quotationListIndex", results={@Result(name="success", type="dispatcher", location="/views/quotation/quotationList.html")})
	public String quotationListIndex(){
		return SUCCESS;
	}
	
	@Action(value="quotationItemIndex", results={@Result(name="success", type="dispatcher", location="/views/quotation/quotationItem.html")})
	public String quotationItemIndex(){
		return SUCCESS;
	}
	
	@Action(value="quotationVersionIndex", results={@Result(name="success", type="dispatcher", location="/views/quotation/quotationVersion.html")})
	public String quotationVersionIndex(){
		return SUCCESS;
	}
	
	@Action(value="systemDefineItemIndex", results={@Result(name="success", type="dispatcher", location="/views/quotation/systemDefineItem.html")})
	public String systemDefineItemIndex(){
		return SUCCESS;
	}
	
}
