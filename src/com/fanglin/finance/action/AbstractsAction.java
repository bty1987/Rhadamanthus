/**
 * @File Name		: AbstractsAction.java
 * @Package   	: com.fanglin.finance.action
 * @Version		: 1.0
 * @Date			: 2016-4-3
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.finance.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.finance.service.AbstractsService;
import com.fanglin.finance.vo.AbstractsVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class AbstractsAction extends BaseAction {

	private static final long serialVersionUID = -3115204831991601153L;
	
	@Autowired
	private AbstractsService abstractsService;
	
	private List<AbstractsVO> abstractes;
	
	private AbstractsVO abstracts;
	
	@Action(value = "queryAbstracts", results = { @Result(name = "success", type = "json" , params={"ignoreHierarchy","false"}) } )
	public String queryAbstracts() throws FLException{
		
		abstractes = abstractsService.queryAbstractsByOwnerId(queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "addAbstracts", results = { @Result(name = "success", type = "json" , params={"ignoreHierarchy","false"}) } )
	public String addAbstracts() throws FLException{
		
		abstractsService.addAbstracts(abstracts, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "deleteAbstracts", results = { @Result(name = "success", type = "json" , params={"ignoreHierarchy","false"}) } )
	public String deleteAbstracts(){
		
		abstractsService.deleteAbstracts(abstracts);
		
		return SUCCESS;
	}

	public List<AbstractsVO> getAbstractes() {
		return abstractes;
	}

	public void setAbstractes(List<AbstractsVO> abstractes) {
		this.abstractes = abstractes;
	}

	public AbstractsVO getAbstracts() {
		return abstracts;
	}

	public void setAbstracts(AbstractsVO abstracts) {
		this.abstracts = abstracts;
	}
	
}
