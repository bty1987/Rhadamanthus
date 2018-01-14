package com.fanglin.right.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.vo.ChainPageVO;
import com.fanglin.right.service.RoleChainPageService;
import com.fanglin.right.vo.RoleChainPageVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class RoleChainPageAction  extends BaseListAction {
	
	private static final long serialVersionUID = -6397710300820791047L;

	@Autowired
	private RoleChainPageService roleChainPageService;
	
	private RoleChainPageVO roleChainPage;
	
	private List<ChainPageVO> chainPages;
	
	private List<Long> cpids;
	
	@Action(value="queryRoleChainPageByRid", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryRoleChainPageByRid() throws FLException{
		
		chainPages = roleChainPageService.queryRoleChainPageByRid(roleChainPage);
		
		return SUCCESS;
	}

	@Action(value="updateRoleChainPage", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateRoleChainPage() throws FLException{
		
		roleChainPageService.updateRoleChainPage(roleChainPage, cpids);
		
		return SUCCESS;
	}

	public RoleChainPageVO getRoleChainPage() {
		return roleChainPage;
	}

	public void setRoleChainPage(RoleChainPageVO roleChainPage) {
		this.roleChainPage = roleChainPage;
	}

	public List<ChainPageVO> getChainPages() {
		return chainPages;
	}

	public void setChainPages(List<ChainPageVO> chainPages) {
		this.chainPages = chainPages;
	}

	public List<Long> getCpids() {
		return cpids;
	}

	public void setCpids(List<Long> cpids) {
		this.cpids = cpids;
	}

}
