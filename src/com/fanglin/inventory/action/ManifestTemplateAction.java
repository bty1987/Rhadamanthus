/**
 * @File Name		: ManifestTemplateAction.java
 * @Package   	: com.fanglin.inventory.action
 * @Version		: 1.0
 * @Date			: 2016-9-19
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.inventory.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.material.vo.GoodsVO;
import com.fanglin.inventory.service.ManifestTemplateItemService;
import com.fanglin.inventory.service.ManifestTemplateService;
import com.fanglin.inventory.vo.ManifestTemplateItemVO;
import com.fanglin.inventory.vo.ManifestTemplateVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ManifestTemplateAction extends BaseListAction {

	private static final long serialVersionUID = 3589382433694423368L;
	
	@Autowired
	private ManifestTemplateService manifestTemplateService;
	
	@Autowired
	private ManifestTemplateItemService manifestTemplateItemService;
	
	private ManifestTemplateVO manifestTemplate;
	
	private ManifestTemplateItemVO manifestTemplateItem;
	
	private List<ManifestTemplateVO> manifestTemplates;
	
	private List<ManifestTemplateItemVO> manifestTemplateItems;
	
	private List<GoodsVO> goodes;
	
	private List<Long> miids;
	
	private List<Long> mtiids;
	
	@Action(value = "pageManifestTemplate", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageManifestTemplate() throws FLException{
		
		manifestTemplateService.pageManifestTemplate(getPaging(), getFilters(),queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "queryManifestTemplate", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryManifestTemplate(){
		
		manifestTemplates = manifestTemplateService.queryManifestTemplate();
		
		return SUCCESS;
	}
	
	@Action(value = "queryManifestTemplateItemByMtid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryManifestTemplateItemByMtid(){
		
		manifestTemplateItems = manifestTemplateItemService.queryManifestTemplateItemByMtid(manifestTemplate);
		
		return SUCCESS;
	}
	
	@Action(value = "queryManifestItemByMtid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryManifestItemByMtid(){
		
		goodes = manifestTemplateItemService.queryGoodsByMtid(manifestTemplate);
		
		return SUCCESS;
	}
	
	@Action(value = "addManifestTemplate", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addManifestTemplate() throws FLException{
		
		manifestTemplateService.addManifestTemplate(manifestTemplate,queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "addManifestTemplateItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addManifestTemplateItem(){
		
		manifestTemplateItemService.addManifestTemplateItem(manifestTemplate, miids);
		
		return SUCCESS;
	} 
	
	@Action(value = "updateManifestTemplate", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateManifestTemplate() throws FLException{
		
		manifestTemplateService.updateManifestTemplate(manifestTemplate);
		
		return SUCCESS;
	}
	
	@Action(value = "updateManifestTemplateForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateManifestTemplateForStatus() throws FLException{
		
		manifestTemplateService.updateManifestTemplateForStatus(manifestTemplate);
		
		return SUCCESS;
	}
	
	@Action(value = "deleteManifestTemplate", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteManifestTemplate(){
		
		manifestTemplateService.deleteManifestTemplate(manifestTemplate);
		
		return SUCCESS;
	}
	
	@Action(value = "deleteManifestTemplateItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteManifestTemplateItem(){
		
		manifestTemplateItemService.deleteManifestTemplateItem(mtiids);
		
		return SUCCESS;
	}

	public ManifestTemplateVO getManifestTemplate() {
		return manifestTemplate;
	}

	public void setManifestTemplate(ManifestTemplateVO manifestTemplate) {
		this.manifestTemplate = manifestTemplate;
	}

	public ManifestTemplateItemVO getManifestTemplateItem() {
		return manifestTemplateItem;
	}

	public void setManifestTemplateItem(ManifestTemplateItemVO manifestTemplateItem) {
		this.manifestTemplateItem = manifestTemplateItem;
	}

	public List<ManifestTemplateVO> getManifestTemplates() {
		return manifestTemplates;
	}

	public void setManifestTemplates(List<ManifestTemplateVO> manifestTemplates) {
		this.manifestTemplates = manifestTemplates;
	}

	public List<ManifestTemplateItemVO> getManifestTemplateItems() {
		return manifestTemplateItems;
	}

	public void setManifestTemplateItems(List<ManifestTemplateItemVO> manifestTemplateItems) {
		this.manifestTemplateItems = manifestTemplateItems;
	}

	public List<GoodsVO> getGoodes() {
		return goodes;
	}

	public void setGoodes(List<GoodsVO> goodes) {
		this.goodes = goodes;
	}

	public List<Long> getMiids() {
		return miids;
	}

	public void setMiids(List<Long> miids) {
		this.miids = miids;
	}

	public List<Long> getMtiids() {
		return mtiids;
	}

	public void setMtiids(List<Long> mtiids) {
		this.mtiids = mtiids;
	}

}
