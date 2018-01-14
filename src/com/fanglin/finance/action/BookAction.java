/**
 * @File Name		: BookAction.java
 * @Package   	: com.fanglin.finance.action
 * @Version		: 1.0
 * @Date			: 2016-4-17
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.finance.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.finance.service.BookService;

@ParentPackage("base")
@Namespace("/")
@Controller
public class BookAction extends BaseListAction {

	private static final long serialVersionUID = -1448529013327895560L;
	
	@Autowired
	private BookService bookService;
	
	private String period;
	
	@Action(value = "checkoutBook", results = { @Result(name = "success", type = "json" , params={"ignoreHierarchy","false"}) } )
	public String checkoutBook() throws Exception{
		
		bookService.checkoutBook();
		
		return SUCCESS;
	}
	
	@Action(value = "openBook", results = { @Result(name = "success", type = "json" , params={"ignoreHierarchy","false"}) } )
	public String openBook() throws Exception{
		
		bookService.openBook(period);
		
		return SUCCESS;
	}
	
	@Action(value = "closeBook", results = { @Result(name = "success", type = "json" , params={"ignoreHierarchy","false"}) } )
	public String closeBook() throws Exception{
		
		bookService.closeBook(period);
		
		return SUCCESS;
	}

	public String getPeriod() {
		return period;
	}

	public void setPeriod(String period) {
		this.period = period;
	}
	
}
