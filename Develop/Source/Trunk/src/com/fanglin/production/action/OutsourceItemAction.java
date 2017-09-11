package com.fanglin.production.action;

import java.util.List;
import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.production.service.OutsourceItemService;
import com.fanglin.production.vo.OutsourceItemVO;
import com.fanglin.production.vo.OutsourceVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class OutsourceItemAction extends BaseListAction{

	private static final long serialVersionUID = -5430236603609546877L;
	
	@Autowired
	private OutsourceItemService  outsourceItemService;
	
	private OutsourceItemVO outsourceItem;
	
	private OutsourceVO outsource;
	
	private List<OutsourceItemVO> outsourceItems;
	
	@Action(value = "pageOutsourceItemByOid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public  String pageOutsourceItemByOid (){
	
		outsourceItems = outsourceItemService.pageOutsourceItemByOid(outsourceItem);
		
		return  SUCCESS;
	}
	
	@Action(value = "addOutsourceItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public  String addOutsourceItem() throws FLException{
	
		outsourceItemService.addOutsourceItem(outsourceItem,outsource);
		
		return  SUCCESS;
	}
	
	@Action(value = "deleteOutsourceItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public  String deleteOutsourceItem() throws FLException{
	
		outsourceItemService.deleteOutsourceItem(outsourceItem);
		
		return  SUCCESS;
	}

	public OutsourceItemVO getOutsourceItem() {
		return outsourceItem;
	}

	public void setOutsourceItem(OutsourceItemVO outsourceItem) {
		this.outsourceItem = outsourceItem;
	}

	public List<OutsourceItemVO> getOutsourceItems() {
		return outsourceItems;
	}

	public void setOutsourceItems(List<OutsourceItemVO> outsourceItems) {
		this.outsourceItems = outsourceItems;
	}

	public OutsourceVO getOutsource() {
		return outsource;
	}

	public void setOutsource(OutsourceVO outsource) {
		this.outsource = outsource;
	}
	
}
