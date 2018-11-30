package com.fanglin.market.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.market.service.CardService;
import com.fanglin.market.vo.CardVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CardAction extends BaseListAction{

	private static final long serialVersionUID = 5406386221489003981L;
	
	@Autowired
	private CardService cardService;
	
	private CardVO card;
	
	@Action(value = "pageCard", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageCard() throws FLException{
		
		cardService.pageCard(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value = "deleteCard", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteCard() throws FLException{
		
		cardService.deleteCard(card);
		
		return SUCCESS;
	}

	public CardVO getCard() {
		return card;
	}

	public void setCard(CardVO card) {
		this.card = card;
	}

}
