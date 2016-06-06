/**
 * @File Name		: SystemDefineItemAction.java
 * @Package   	: com.fanglin.action
 * @Version		: 1.0
 * @Date			: 2014-7-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.quotation.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.quotation.service.SystemDefineItemService;
import com.fanglin.data.quotation.vo.SystemDefineItemVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SystemDefineItemAction extends BaseListAction {

	private static final long serialVersionUID = -9139698916609681549L;
	
	@Autowired
	private SystemDefineItemService systemDefineItemService;
	
	private SystemDefineItemVO systemDefineItem;
	
	private List<Long> ids;
	
	@Action(value="pageSystemDefineItem", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageSystemDefineItem(){
		
		systemDefineItemService.pageSystemDefineItem(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value="querySystemDefineItemByItemId", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String querySystemDefineItemByItemIdAndVersionId() throws FLException{
		
		systemDefineItem = systemDefineItemService.querySystemDefineItemByItemId(systemDefineItem);
		
		return SUCCESS;
	}
	
	@Action(value="addSystemDefineItem", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addSystemDefineItem() throws FLException{

		systemDefineItemService.saveOrUpdateSystemDefineItem(systemDefineItem);
		
		return SUCCESS;
	}
	
	@Action(value="updateSystemDefineItem", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateSystemDefineItem() throws FLException{

		systemDefineItemService.saveOrUpdateSystemDefineItem(systemDefineItem);
		
		return SUCCESS;
	}
	
	@Action(value="deleteSystemDefineItemByIds", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String deleteSystemDefineItemByIds(){

		systemDefineItemService.deleteSystemDefineItemByIds(ids);
	    
		return SUCCESS;
	}

	public SystemDefineItemVO getSystemDefineItem() {
		return systemDefineItem;
	}

	public void setSystemDefineItem(SystemDefineItemVO systemDefineItem) {
		this.systemDefineItem = systemDefineItem;
	}

	public List<Long> getIds() {
		return ids;
	}

	public void setIds(List<Long> ids) {
		this.ids = ids;
	}
	
}
