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

import java.util.Date;
import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.decoration.service.AddOrReduceDetailService;
import com.fanglin.decoration.service.AddReduceService;
import com.fanglin.decoration.vo.AddReduceVO;
import com.fanglin.utils.DateUtil;

@ParentPackage("base")
@Namespace("/")
@Controller
public class AddReduceAction extends BaseListAction{

	private static final long serialVersionUID = 2068579060275398311L;
	
	@Autowired
	private AddReduceService addReduceService;
	
	@Autowired
	private AddOrReduceDetailService addOrReduceDetailService;
	
	private AddReduceVO addReduce;
	
	private List<Integer> arIds;
	
	private String deleteFlag;
	
	@Action(value = "pageAddReduceByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageAddReduceByOrderId(){
		
		addReduceService.pageAddReduceByOrderId(getPaging(), getFilters(), addReduce);
		
		return SUCCESS;
	}
	
	@Action(value = "pageAddReduceDetailByArId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageAddReduceDetailByArId(){
		
		addOrReduceDetailService.pageAddOrReduceDetailByArId(getPaging(), getFilters(), addReduce);
		
		return SUCCESS;
	}
	
	@Action(value = "addAddReduce", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addAddReduce(){
		
		addReduce.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		addReduceService.saveOrUpdateAddReduce(addReduce);
		
		return SUCCESS;
	}
	
	@Action(value = "updateAddReduce", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateAddReduce(){
		
		addReduceService.updateAddReduce(addReduce);
		
		return SUCCESS;
	}
	
	@Action(value = "deleteAddReduce", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteAddReduce(){
		
		deleteFlag = addReduceService.deleteAddReduce(arIds);
		
		return SUCCESS;
	}

	public AddReduceVO getAddReduce(){
		return addReduce;
	}

	public void setAddReduce(AddReduceVO addReduce){
		this.addReduce = addReduce;
	}

	public List<Integer> getArIds(){
		return arIds;
	}

	public void setArIds(List<Integer> arIds){
		this.arIds = arIds;
	}

	public String getDeleteFlag(){
		return deleteFlag;
	}

	public void setDeleteFlag(String deleteFlag){
		this.deleteFlag = deleteFlag;
	}
	
}
