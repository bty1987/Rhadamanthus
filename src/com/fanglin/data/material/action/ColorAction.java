package com.fanglin.data.material.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.material.service.ColorService;
import com.fanglin.data.material.vo.ColorVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ColorAction extends BaseListAction{
	
	private static final long serialVersionUID = -1633891301538362524L;
	
	@Autowired
	private ColorService colorService;
	
	private List<ColorVO> colors;
	
	private ColorVO color;
	
	@Action(value = "queryColorByGid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryColorByGid(){
		colors = colorService.queryColorByGid(color);
		return SUCCESS;
	}
	
	@Action(value = "queryColorForEnableByGid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryColorForEnableByGid(){
		colors = colorService.queryColorForEnableByGid(color);
		return SUCCESS;
	}
	
	@Action(value = "addColor", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addColor() throws FLException{
		colorService.addColor(color);
		return SUCCESS;
	}
	
	@Action(value = "updateColorForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateColorForStatus() throws FLException{
		colorService.updataColorForStatus(color);
		return SUCCESS;
	}
	
	public List<ColorVO> getColors() {
		return colors;
	}
	
	public void setColors(List<ColorVO> colors) {
		this.colors = colors;
	}

	public ColorVO getColor() {
		return color;
	}

	public void setColor(ColorVO color) {
		this.color = color;
	}
	
}
