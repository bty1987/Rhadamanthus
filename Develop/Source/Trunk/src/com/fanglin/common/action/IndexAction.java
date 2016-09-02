/**
 * @File Name	: IndexAction.java
 * @Package		：com.fanglin.action 
 * @Version		: 1.0
 * @Date		: 2014-7-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email		: 
 * Describing	: 主页的相关action
 */

package com.fanglin.common.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.system.service.RoleSubfunctionService;
import com.fanglin.system.vo.TreeVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class IndexAction extends BaseAction {

	private static final long serialVersionUID = 597878314944213650L;
	
	@Autowired
	private RoleSubfunctionService roleSubfunctionService;
	
	private List<TreeVO> tree;
	
	@Action(value = "createTree", results = { @Result(name = "success", type = "json" , params={"ignoreHierarchy","false"}) } )
	public String createTree() throws FLException{
		
		tree = roleSubfunctionService.getTreeByRoleId(queryRoleId());
	
		return SUCCESS;
	}
	
	public List<TreeVO> getTree(){
		return tree;
	}

	public void setTree(List<TreeVO> tree){
		this.tree = tree;
	}
}
