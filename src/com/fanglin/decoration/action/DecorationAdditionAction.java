package com.fanglin.decoration.action;

import java.util.Map;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.service.DecorationAdditionService;
import com.fanglin.decoration.vo.DecorationAdditionVO;
import com.fanglin.decoration.vo.DecorationVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationAdditionAction extends BaseListAction{

	private static final long serialVersionUID = 7402337300124518044L;

	@Autowired
	private DecorationAdditionService decorationAdditionService;
	
	private DecorationAdditionVO decorationAddition;
	
	private Map<String, Object> config;
	
	private DecorationVO decoration;
	
	@Action(value = "queryDecorationAdditionByOrderId", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationAdditionByOrderId() {

		decorationAddition = decorationAdditionService.queryDecorationAdditionByOrderId(decorationAddition);

		return SUCCESS;
	}
	
	@Action(value = "queryDecorationConfig", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationConfig() throws FLException {

		config = decorationAdditionService.queryDecorationConfig(decoration ,queryCompany());

		return SUCCESS;
	}

	public DecorationAdditionVO getDecorationAddition() {
		return decorationAddition;
	}

	public void setDecorationAddition(DecorationAdditionVO decorationAddition) {
		this.decorationAddition = decorationAddition;
	}

	public Map<String, Object> getConfig() {
		return config;
	}

	public void setConfig(Map<String, Object> config) {
		this.config = config;
	}

	public DecorationVO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationVO decoration) {
		this.decoration = decoration;
	}
	
}
