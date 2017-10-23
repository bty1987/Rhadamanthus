package com.fanglin.data.common.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.service.ChainPageService;
import com.fanglin.data.common.vo.ChainPageVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ChainPageAction  extends BaseListAction{

	private static final long serialVersionUID = -2241083409399632053L;

	@Autowired
	private ChainPageService chainPageService;
	
	private ChainPageVO chainPage;
	
	private List<ChainPageVO> chainPages;
	
	@Action(value = "queryChainPage", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryChainPage()throws FLException{
		
		chainPages=chainPageService.queryChainPage();
		
		return SUCCESS;
	}
	
	@Action(value = "queryChainPageForSelf", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryChainPageForSelf() throws FLException{
		
		chainPages=chainPageService.queryChainPageForSelf(queryRoleId(),queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "addChainPage", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addChainPage() throws FLException{
		
		chainPageService.addChainPage(chainPage);
		
		return SUCCESS;
	}
	
	@Action(value = "deleteChainPage", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteChainPage() throws FLException{
		
		chainPageService.deleteChainPage(chainPage);
		
		return SUCCESS;
	}
	 
	public ChainPageVO getChainPage() {
		return chainPage;
	}

	public void setChainPage(ChainPageVO chainPage) {
		this.chainPage = chainPage;
	}

	public List<ChainPageVO> getChainPages() {
		return chainPages;
	}

	public void setChainPages(List<ChainPageVO> chainPages) {
		this.chainPages = chainPages;
	}
	
	
	
}
