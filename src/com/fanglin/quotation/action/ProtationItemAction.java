/**
 * @File Name		: QuotationAction
 * @Package   	: com.fanglin.action.quotation
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.quotation.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.service.ProtationItemService;
import com.fanglin.quotation.vo.ProtationItemVO;
import com.fanglin.quotation.vo.ProtationVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ProtationItemAction extends BaseListAction {

	private static final long serialVersionUID = -511880910578705528L;

	@Autowired
	private ProtationItemService protationItemService;

	private ProtationVO protation;

	private ProtationItemVO protationItem;

	private List<ProtationItemVO> protationItems;

	@Action(value = "queryProtationItemByPid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryProtationItemByPid() {

		protationItems = protationItemService.queryProtationItemByPid(protationItem);

		return SUCCESS;
	}

	@Action(value = "updateProtationItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateProtationItem() throws FLException {

		protationItemService.updateProtationItem(protation, protationItem);

		return SUCCESS;
	}

	@Action(value = "deleteProtationItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteProtationItem() throws FLException {

		protationItemService.deleteProtationItem(protation, protationItem);

		return SUCCESS;
	}

	public ProtationVO getProtation() {
		return protation;
	}

	public void setProtation(ProtationVO protation) {
		this.protation = protation;
	}

	public ProtationItemVO getProtationItem() {
		return protationItem;
	}

	public void setProtationItem(ProtationItemVO protationItem) {
		this.protationItem = protationItem;
	}

	public List<ProtationItemVO> getProtationItems() {
		return protationItems;
	}

	public void setProtationItems(List<ProtationItemVO> protationItems) {
		this.protationItems = protationItems;
	}

}
