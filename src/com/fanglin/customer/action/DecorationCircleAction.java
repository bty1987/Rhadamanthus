package com.fanglin.customer.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.service.DecorationCircleBackgroundService;
import com.fanglin.customer.service.DecorationCircleService;
import com.fanglin.customer.vo.DecorationCircleBackgroundVO;
import com.fanglin.customer.vo.DecorationCircleVO;

@ParentPackage("common")
@Namespace("/")
@Controller
public class DecorationCircleAction extends BaseListAction{

	private static final long serialVersionUID = -6385432330889201072L;
	
	@Autowired
	private DecorationCircleService decorationCircleService;
	
	@Autowired
	private DecorationCircleBackgroundService decorationCircleBackgroundService;
	
	private String unionId;
	
	private DecorationCircleVO decorationCircle;
	
	private List<DecorationCircleVO> decorationCircles;
	
	private DecorationCircleBackgroundVO decorationCircleBackground;
	
	@Action(value = "queryDecorationCircleByUnionId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationCircleByUnionId() throws FLException{
		
		decorationCircleService.queryDecorationCircleByUnionId(getPaging(),getFilters(),unionId);
		
		return SUCCESS;
	}
	
	@Action(value = "queryDecorationCircleByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationCircleByOrderId() throws FLException{
		
		decorationCircleService.queryDecorationCircleByOrderId(getPaging(),getFilters(),decorationCircle);
		
		return SUCCESS;
	}
	
	@Action(value = "updateDecorationCircleForLike", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateDecorationCircleForLike() throws FLException{
		
		decorationCircleService.updateDecorationCircleForLike(decorationCircle);
		
		return SUCCESS;
	}
	
	@Action(value = "queryDecorationCircleBackgroundByUnionId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationCircleBackgroundByUnionId() throws FLException{
		
		decorationCircleBackground = decorationCircleBackgroundService.queryDecorationCircleBackgroundByUnionId(decorationCircleBackground);
		
		return SUCCESS;
	}
	
	@Action(value = "updateDecorationCircleBackground", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateDecorationCircleBackground() throws FLException{
		
		decorationCircleBackgroundService.updateDecorationCircleBackground(decorationCircleBackground);
		
		return SUCCESS;
	}
	
	public String getUnionId() {
		return unionId;
	}

	public void setUnionId(String unionId) {
		this.unionId = unionId;
	}

	public DecorationCircleVO getDecorationCircle() {
		return decorationCircle;
	}

	public void setDecorationCircle(DecorationCircleVO decorationCircle) {
		this.decorationCircle = decorationCircle;
	}

	public List<DecorationCircleVO> getDecorationCircles() {
		return decorationCircles;
	}

	public void setDecorationCircles(List<DecorationCircleVO> decorationCircles) {
		this.decorationCircles = decorationCircles;
	}

	public DecorationCircleBackgroundVO getDecorationCircleBackground() {
		return decorationCircleBackground;
	}

	public void setDecorationCircleBackground(DecorationCircleBackgroundVO decorationCircleBackground) {
		this.decorationCircleBackground = decorationCircleBackground;
	}
	
}
