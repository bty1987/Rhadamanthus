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

import java.util.ArrayList;
import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.service.AddOrReduceDetailService;
import com.fanglin.decoration.vo.AddOrReduceDetailVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class AddOrReduceDetailAction extends BaseListAction {

	private static final long serialVersionUID = -1599812124963548111L;

	protected Logger log = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private AddOrReduceDetailService addOrReduceDetailService;
	
	private AddOrReduceDetailVO addOrReduceDetail;

	private Integer addOrReduceId;
	
	private List<Integer> addOrReduceIds;
	
	private Integer breachContractFlag ;
	
	private List<AddOrReduceDetailVO> addOrReduceDetails;
	
	@Action(value = "queryAddOrReduceDetailById", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryAddOrReduceDetailById() throws FLException{
		
		addOrReduceDetail = addOrReduceDetailService.queryAddOrReduceDetailById(addOrReduceDetail);

		return SUCCESS;
	}
	
	@Action(value = "queryAddOrReduceDetailByIds", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryAddOrReduceDetailByIds() throws FLException{
		
		if(addOrReduceDetails == null){
			addOrReduceDetails = new ArrayList<AddOrReduceDetailVO>();
		}
	
		addOrReduceDetailService.queryAddOrReduceDetailByIds(addOrReduceIds, addOrReduceDetails);
		
		return SUCCESS;
	}
	
	@Action(value = "saveAddOrReduceDetail", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String saveAddOrReduceDetail() throws FLException{
		
		addOrReduceDetail.setDesignerId(getUserId());
		addOrReduceDetail.setDesigner(getUserName());
		
		addOrReduceDetailService.saveAddOrReduceDetail(addOrReduceDetail);
		
		return SUCCESS;
	}
	
	@Action(value = "submitAddOrReduceDetail", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String submitAddOrReduceDetail() throws FLException{
		
		addOrReduceDetail.setDesignerId(getUserId());
		addOrReduceDetail.setDesigner(getUserName());
		
		addOrReduceDetailService.submitAddOrReduceDetail(addOrReduceDetail);
		
		return SUCCESS;
	}
	
	@Action(value = "checkAddOrReduceForPenalty", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String checkAddOrReduceForPenalty() throws FLException{
		
		addOrReduceDetail.setDesignerId(getUserId());
		addOrReduceDetail.setDesigner(getUserName());
		
		breachContractFlag = addOrReduceDetailService.checkAddOrReduceForPenalty(addOrReduceDetail);
	    
		return SUCCESS;
	}
	
	public Integer getAddOrReduceId(){
		return addOrReduceId;
	}

	public void setAddOrReduceId(Integer addOrReduceId){
		this.addOrReduceId = addOrReduceId;
	}

	public AddOrReduceDetailVO getAddOrReduceDetail(){
		return addOrReduceDetail;
	}

	public void setAddOrReduceDetail(AddOrReduceDetailVO addOrReduceDetail){
		this.addOrReduceDetail = addOrReduceDetail;
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

	public void setAddOrReduceDetails(List<AddOrReduceDetailVO> addOrReduceDetails){
		this.addOrReduceDetails = addOrReduceDetails;
	}

	public List<AddOrReduceDetailVO> getAddOrReduceDetails(){
		return addOrReduceDetails;
	}
	
}
