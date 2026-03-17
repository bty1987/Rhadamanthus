package com.fanglin.sales.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.sales.service.OalesItemService;
import com.fanglin.sales.vo.OalesItemVO;
import com.fanglin.sales.vo.OalesVO;

/**
 * 其他销售单项目明细 Action
 *
 * 职责：处理外销单项目明细的前端请求
 */
@ParentPackage("base")
@Namespace("/")
@Controller
public class OalesItemAction extends BaseListAction {

	private static final long serialVersionUID = 1L;

	@Autowired
	private OalesItemService oalesItemService;

	/** 项目明细列表 */
	private List<OalesItemVO> oalesItems;

	/** 外销单对象 */
	private OalesVO oales;

	/** 项目明细对象 */
	private OalesItemVO oalesItem;

	/**
	 * 分页查询外销单项目明细
	 *
	 * 前端调用示例：
	 * com.post(api.oalesItem.pageOalesItem, {
	 *   "page.pageNo": 1,
	 *   "page.pageSize": 20,
	 *   "oalesItem.oid": 123
	 * }, callback);
	 */
	@Action(value = "pageOalesItem", results = {
			@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) },
			params = { "contentType", "text/html" })
	public String pageOalesItem() throws FLException {

		oalesItems = oalesItemService.pageOalesItem(getPaging(), getFilters(), oalesItem);

		return SUCCESS;
	}

	/**
	 * 查询外销单的所有项目明细
	 *
	 * 前端调用示例：
	 * com.post(api.oalesItem.queryOalesItem, {
	 *   "oalesItem.oid": 123
	 * }, callback);
	 */
	@Action(value = "queryOalesItem", results = {
			@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) },
			params = { "contentType", "text/html" })
	public String queryOalesItem() throws FLException {

		oalesItems = oalesItemService.queryOalesItem(oalesItem);

		return SUCCESS;
	}

	/**
	 * 添加外销单项目明细
	 *
	 * 前端调用示例：
	 * com.post(api.oalesItem.addOalesItem, {
	 *   "oales.oid": 123,
	 *   "oalesItem.name": "瓷砖",
	 *   "oalesItem.format": "800×800",
	 *   "oalesItem.color": "白色",
	 *   "oalesItem.model": "FL-001",
	 *   "oalesItem.price": 50000,
	 *   "oalesItem.num": 10
	 * }, callback);
	 */
	@Action(value = "addOalesItem", results = {
			@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) },
			params = { "contentType", "text/html" })
	public String addOalesItem() throws FLException {

		oalesItemService.addOalesItem(oales, oalesItem);

		return SUCCESS;
	}

	/**
	 * 删除外销单项目明细
	 *
	 * 前端调用示例：
	 * com.post(api.oalesItem.deleteOalesItem, {
	 *   "oalesItem.oiid": 456
	 * }, callback);
	 */
	@Action(value = "deleteOalesItem", results = {
			@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) },
			params = { "contentType", "text/html" })
	public String deleteOalesItem() throws FLException {

		oalesItemService.deleteOalesItem(oalesItem);

		return SUCCESS;
	}

	// ==================== Getter & Setter ====================

	public List<OalesItemVO> getOalesItems() {
		return oalesItems;
	}

	public void setOalesItems(List<OalesItemVO> oalesItems) {
		this.oalesItems = oalesItems;
	}

	public OalesVO getOales() {
		return oales;
	}

	public void setOales(OalesVO oales) {
		this.oales = oales;
	}

	public OalesItemVO getOalesItem() {
		return oalesItem;
	}

	public void setOalesItem(OalesItemVO oalesItem) {
		this.oalesItem = oalesItem;
	}
}
