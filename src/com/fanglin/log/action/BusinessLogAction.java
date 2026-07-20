/**
 * @File Name		: BusinessLogAction.java
 * @Package 		: com.fanglin.log.action
 * @Version			: 1.0
 * @Date			: 2026-07-20
 * @Describing		: 业务日志统一查询入口（客户电话/图纸下载/金蝶同步）
 *
 *  说明：
 *    - 三个 page 路由供前端 businessLog.html 的 Tab 页调用
 *    - 写入不在此暴露（写入由业务模块的 ServiceImpl 委托 log 模块 Service 完成）
 */

package com.fanglin.log.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.log.service.CustomerPhoneLogService;
import com.fanglin.log.service.DecorationPictureLogService;
import com.fanglin.log.service.KingdeeSyncLogService;

@ParentPackage("base")
@Namespace("/")
@Controller
public class BusinessLogAction extends BaseListAction {

	private static final long serialVersionUID = 1L;

	@Autowired
	private CustomerPhoneLogService customerPhoneLogService;

	@Autowired
	private DecorationPictureLogService decorationPictureLogService;

	@Autowired
	private KingdeeSyncLogService kingdeeSyncLogService;

	@Action(value = "pageCustomerPhoneLog", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false"}) }, params = {"contentType", "text/html"})
	public String pageCustomerPhoneLog(){
		customerPhoneLogService.pageCustomerPhoneLog(getPaging(), getFilters());
		return SUCCESS;
	}

	@Action(value = "pageDecorationPictureLog", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false"}) }, params = {"contentType", "text/html"})
	public String pageDecorationPictureLog(){
		decorationPictureLogService.pageDecorationPictureLog(getPaging(), getFilters());
		return SUCCESS;
	}

	@Action(value = "pageKingdeeSyncLog", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false"}) }, params = {"contentType", "text/html"})
	public String pageKingdeeSyncLog(){
		kingdeeSyncLogService.pageKingdeeSyncLog(getPaging(), getFilters());
		return SUCCESS;
	}

}
