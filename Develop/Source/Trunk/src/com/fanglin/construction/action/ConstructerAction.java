package com.fanglin.construction.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.construction.service.ConstructerService;
import com.fanglin.construction.vo.ConstructerVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.service.UserService;
import com.fanglin.personel.vo.UserVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ConstructerAction extends BaseListAction{

	private static final long serialVersionUID = 8606860452338747125L;
	
	@Autowired
	private ConstructerService constructerService;
	@Autowired
	private UserService userService;
	
	private ConstructerVO constructer;
	
	private List<ConstructerVO> constructers;
	
	private UserVO findUser;

	@Action(value = "queryConstructerByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryConstructerByOrderId() throws FLException{
		
		constructers = constructerService.queryConstructerByOrderId(constructer);
		
		return SUCCESS;
	}
	
	@Action(value = "queryConstructerByCsId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryConstructerByCsId(){
	
		constructers = constructerService.queryConstructerByCsId(constructer);
		
		return SUCCESS;
	}
	
	@Action(value = "addConstructer", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addConstructer() throws FLException{
		
		this.findUser = userService.queryUserByUserId(constructer.getUser().getUserId());
		constructerService.addConstructer(constructer, queryUserId());
		
		 return SUCCESS;
	}
	
	@Action(value = "updateConstructerForSalary", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateConstructerForSalary() throws FLException{
		constructerService.updateConstructerForSalary(constructer);
		return SUCCESS;
	}
	
	@Action(value = "updateConstructerForRate", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateConstructerForRate() throws FLException{
		constructerService.updateConstructerForRate(constructer);
		return SUCCESS;
	}
	
	@Action(value = "deleteConstructer", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteConstructer(){
		constructerService.deleteConstructer(constructer);
		return SUCCESS;
	}
	
	public ConstructerVO getConstructer() {
		return constructer;
	}

	public void setConstructer(ConstructerVO constructer) {
		this.constructer = constructer;
	}
	

	public List<ConstructerVO> getConstructers() {
		return constructers;
	}

	public void setConstructers(List<ConstructerVO> constructers) {
		this.constructers = constructers;
	}
	
	public UserVO getFindUser() {
		return findUser;
	}

	public void setFindUser(UserVO findUser) {
		this.findUser = findUser;
	}
	
}
