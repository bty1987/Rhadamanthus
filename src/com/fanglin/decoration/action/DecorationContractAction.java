/**
 * @File Name		: DecorationContractAction
 * @Package   	: com.fanglin.action.quotation
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.service.DecorationContractService;
import com.fanglin.decoration.vo.DecorationContractVO;
import com.fanglin.decoration.vo.DecorationMidpackVO;
import com.fanglin.decoration.vo.DecorationVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationContractAction extends BaseListAction {

	private static final long serialVersionUID = -1599812124963548111L;

	private DecorationContractVO decorationContract;
	
	private DecorationVO decoration;
	
	private String decorationOrderId;
	
	private DecorationMidpackVO decorationMidpack;
	
	@Autowired
	private DecorationContractService decorationContractService;
	
	@Action(value = "queryDecorationContractByOrderId", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationContractByOrderId() throws FLException{
		
		decorationContract = decorationContractService.queryDecorationContractByOrderId(decorationContract);
		
		return SUCCESS;
	}
	
	@Action(value = "saveDecorationContract", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String saveDecorationContract() throws FLException{
		
		decorationContractService.saveDecorationContract(decorationContract, queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "signDecorationContract", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String signDecorationContract() throws FLException{
		
		decorationContractService.signDecorationContract(decorationContract, authentication());
		
		return SUCCESS;
	}
	
	@Action(value = "resignDecorationContract", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String resignDecorationContract() throws FLException{
		
		decorationContractService.resignDecorationContract(decorationContract, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "presignDecorationContract", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String presignDecorationContract() throws FLException{
		
		decorationContractService.presignDecorationContract(decoration, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "makeDecorationMidpack", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String makeDecorationMidpack() throws FLException{
		
		decorationContractService.makeDecorationMidpack(decorationMidpack, queryUserId());
		
		return SUCCESS;
	}
	
	public String getDecorationOrderId(){
		return decorationOrderId;
	}

	public void setDecorationOrderId(String decorationOrderId){
		this.decorationOrderId = decorationOrderId;
	}

	public void setDecorationContract(DecorationContractVO decorationContract){
		this.decorationContract = decorationContract;
	}

	public DecorationContractVO getDecorationContract(){
		return decorationContract;
	}

	public DecorationVO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationVO decoration) {
		this.decoration = decoration;
	}

	public DecorationMidpackVO getDecorationMidpack() {
		return decorationMidpack;
	}

	public void setDecorationMidpack(DecorationMidpackVO decorationMidpack) {
		this.decorationMidpack = decorationMidpack;
	}
	
}
