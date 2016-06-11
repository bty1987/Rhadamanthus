/**
 * @File Name		: AddOrReduceDetailAction
 * @Package   	: com.fanglin.action.quotation
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class AddOrReduceDetailAction extends BaseListAction {

	private static final long serialVersionUID = -1599812124963548111L;

	protected Logger log = LoggerFactory.getLogger(getClass());
	
	private Integer addOrReduceId;
	
	private List<Integer> addOrReduceIds;
	
	private Integer breachContractFlag ;
	
	@Action(value = "queryAddOrReduceDetailById", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryAddOrReduceDetailById() throws FLException{
		
		return SUCCESS;
	}
	
	@Action(value = "queryAddOrReduceDetailByIds", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryAddOrReduceDetailByIds() throws FLException{
		
		return SUCCESS;
	}
	
	@Action(value = "saveAddOrReduceDetail", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String saveAddOrReduceDetail() throws FLException{
		
		return SUCCESS;
	}
	
	@Action(value = "checkAddOrReduceForPenalty", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String checkAddOrReduceForPenalty() throws FLException{
		
		return SUCCESS;
	}
	
	public Integer getAddOrReduceId(){
		return addOrReduceId;
	}

	public void setAddOrReduceId(Integer addOrReduceId){
		this.addOrReduceId = addOrReduceId;
	}

	public void setBreachContractFlag(Integer breachContractFlag){
		this.breachContractFlag = breachContractFlag;
	}

	public Integer getBreachContractFlag(){
		return breachContractFlag;
	}

	public void setAddOrReduceIds(List<Integer> addOrReduceIds){
		this.addOrReduceIds = addOrReduceIds;
	}

	public List<Integer> getAddOrReduceIds(){
		return addOrReduceIds;
	}
	
}
