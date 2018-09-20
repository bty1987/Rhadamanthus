package com.fanglin.customer.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.customer.service.ConstructionDrawingService;
import com.fanglin.customer.service.DecorationPictureService;

@ParentPackage("common")
@Namespace("/")
@Controller("PictureOrderAction")
public class PictureAction extends BaseListAction {

	private static final long serialVersionUID = -13239854832378882L;

	@Autowired
	private DecorationPictureService decorationPictureService;
	
	@Autowired
	private ConstructionDrawingService constructionDrawingService;
	
	private String orderId;
	
	private String unionId;
	
	private Long cid;
	
	private Short schedule;
	
	@Action(value = "queryCusDecorationPicture", results = {@Result (name = "success", type = "json", params = {"ignoreHierarchy", "false"})}, params = {"contentType", "text/html"})
	public String queryCusDecorationPicture() {
		
		decorationPictureService.queryCusDecorationPicture(getPaging(), getFilters(), orderId,unionId);
		
		return SUCCESS;
	}
	
	@Action(value = "queryCusConstructionDrawing", results = {@Result (name = "success", type = "json", params = {"ignoreHierarchy", "false"})}, params = {"contentType", "text/html"})
	public String queryCusConstructionDrawing() {
		
		constructionDrawingService.queryCusConstructionDrawing(getPaging(), getFilters(), cid, schedule);
		
		return SUCCESS;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}

	public Short getSchedule() {
		return schedule;
	}

	public void setSchedule(Short schedule) {
		this.schedule = schedule;
	}

	public String getUnionId() {
		return unionId;
	}

	public void setUnionId(String unionId) {
		this.unionId = unionId;
	}
	
}
