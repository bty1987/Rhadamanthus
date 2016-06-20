/**
 * @File Name		: AddOrReduceAction.java
 * @Package   	: com.fanglin.action.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-22
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.service.AddReduceService;
import com.fanglin.decoration.vo.AddReduceVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class AddReduceAction extends BaseListAction{

	private static final long serialVersionUID = 2068579060275398311L;
	
	@Autowired
	private AddReduceService addReduceService;
	
	private List<AddReduceVO> addReduces;
	
	private AddReduceVO addReduce;
	
	private List<Integer> arIds;
	
	@Action(value = "pageAddReduceByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageAddReduceByOrderId(){
		
		addReduceService.pageAddReduceByOrderId(getPaging(), getFilters(), addReduce);
		
		return SUCCESS;
	}
	
	@Action(value = "queryAddReduceByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryAddReduceByOrderId(){
		
		addReduces = addReduceService.queryAddReduceByOrderId(addReduce);
		
		return SUCCESS;
	}
	
	@Action(value = "addAddReduce", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addAddReduce(){
		
		addReduceService.addAddReduce(addReduce);
		
		return SUCCESS;
	}
	
	@Action(value = "updateAddReduce", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateAddReduce() throws FLException{
		
		addReduceService.updateAddReduce(addReduce);
		
		return SUCCESS;
	}
	
	@Action(value = "updateAddReduceForAdvance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateAddReduceForAdvance() throws FLException{
		
		addReduceService.updateAddReduceForAdvance(addReduce);
		
		return SUCCESS;
	}
	
	@Action(value = "deleteAddReduce", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteAddReduce() throws FLException{
		
		addReduceService.deleteAddReduceByArId(addReduce);
		
		return SUCCESS;
	}
	
	@Action(value = "submitAddReduce", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String submitAddReduce() throws FLException{
		
		addReduceService.submitAddReduce(addReduce, getUserId());
		
		return SUCCESS;
	}
	
	public AddReduceVO getAddReduce(){
		return addReduce;
	}

	public void setAddReduce(AddReduceVO addReduce){
		this.addReduce = addReduce;
	}

	public List<AddReduceVO> getAddReduces() {
		return addReduces;
	}

	public void setAddReduces(List<AddReduceVO> addReduces) {
		this.addReduces = addReduces;
	}

	public List<Integer> getArIds(){
		return arIds;
	}

	public void setArIds(List<Integer> arIds){
		this.arIds = arIds;
	}

}
