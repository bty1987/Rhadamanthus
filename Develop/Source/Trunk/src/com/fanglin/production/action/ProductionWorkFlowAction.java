package com.fanglin.production.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.production.service.ProductionWorkFlowService;
import com.fanglin.production.vo.ProductionWorkFlowVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ProductionWorkFlowAction extends BaseAction{

	private static final long serialVersionUID = -4698130786922078759L;

	@Autowired
	private ProductionWorkFlowService productionWorkFlowService;	
	private ProductionWorkFlowVO productionWorkFlow;
	private List<ProductionWorkFlowVO> productionWorkFlows;
	private String no;
	private Long uid;
	
	@Action(value = "queryProductionWorkFlowByPwpid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryProductionWorkFlowByPwpid(){
		productionWorkFlows = productionWorkFlowService.queryProductionWorkFlowByPwpid(productionWorkFlow);
		return SUCCESS;
	}
	
	@Action(value = "queryProductionWorkFlowByPwpidAWfid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryProductionWorkFlowByPwpidAWfid() throws FLException{
		productionWorkFlow = productionWorkFlowService.queryProductionWorkFlowByPwpidAWfid(productionWorkFlow);
		return SUCCESS;
	}
	
	@Action(value = "operateProductionWorkFlow", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String operateProductionWorkFlow() throws FLException{
		productionWorkFlowService.operateProductionWorkFlow(no, uid, productionWorkFlow);
		return SUCCESS;
	}
	
	public ProductionWorkFlowVO getProductionWorkFlow() {
		return productionWorkFlow;
	}

	public void setProductionWorkFlow(ProductionWorkFlowVO productionWorkFlow) {
		this.productionWorkFlow = productionWorkFlow;
	}

	public List<ProductionWorkFlowVO> getProductionWorkFlows() {
		return productionWorkFlows;
	}

	public void setProductionWorkFlows(
			List<ProductionWorkFlowVO> productionWorkFlows) {
		this.productionWorkFlows = productionWorkFlows;
	}
	public String getNo() {
		return no;
	}
	public void setNo(String no) {
		this.no = no;
	}
	public Long getUid() {
		return uid;
	}
	public void setUid(Long uid) {
		this.uid = uid;
	}
	
	
	
}
