/**
 * @File Name	: ConstructionAction.java
 * @Package   	: com.fanglin.action.constructionSchedule
 * @Version		: 1.0
 * @Date		: 2014-9-29
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.construction.service.ConstructionScheduleService;
import com.fanglin.construction.vo.ConstructionScheduleVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ConstructionScheduleAction extends BaseListAction {

	private static final long serialVersionUID = 1830437899502700213L;

	@Autowired
	private ConstructionScheduleService constructionScheduleService;

	private ConstructionScheduleVO constructionSchedule;

	private List<ConstructionScheduleVO> constructionSchedules;

	@Action(value = "pageConstructionSchedule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageConstructionSchedule() throws FLException {

		constructionScheduleService.pageConstructionSchedule(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryConstructionScheduleByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryConstructionScheduleByOrderId() throws FLException {

		constructionSchedules = constructionScheduleService.queryConstructionScheduleByOrderId(constructionSchedule);

		return SUCCESS;
	}

	@Action(value = "queryConstructionScheduleByCid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryConstructionScheduleByCid() throws FLException {

		constructionSchedules = constructionScheduleService.queryConstructionScheduleByCid(constructionSchedule);

		return SUCCESS;
	}

	@Action(value = "queryConstructionScheduleByOrderIdASchedule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryConstructionScheduleByOrderIdASchedule() throws FLException {

		constructionSchedule = constructionScheduleService.queryConstructionScheduleByOrderIdASchedule(constructionSchedule);

		return SUCCESS;
	}

	@Action(value = "beginConstructionSchedule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String beginConstructionSchedule() throws FLException {

		constructionScheduleService.beginConstructionSchedule(constructionSchedule, queryUserId());

		return SUCCESS;
	}

	@Action(value = "finishConstructionSchedule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String finishConstructionSchedule() throws FLException {

		constructionScheduleService.finishConstructionSchedule(constructionSchedule, queryUserId());

		return SUCCESS;
	}

	@Action(value = "checkoutConstructionSchedule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String checkoutConstructionSchedule() throws FLException {

		constructionScheduleService.checkoutConstructionSchedule(constructionSchedule);

		return SUCCESS;
	}

	@Action(value = "enterConstructionSchedule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String enterConstructionSchedule() throws FLException {

		constructionScheduleService.enterConstructionSchedule(constructionSchedule);

		return SUCCESS;
	}

	@Action(value = "leaveConstructionSchedule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String leaveConstructionSchedule() throws FLException {

		constructionScheduleService.leaveConstructionSchedule(constructionSchedule);

		return SUCCESS;
	}

	public ConstructionScheduleVO getConstructionSchedule() {
		return constructionSchedule;
	}

	public void setConstructionSchedule(ConstructionScheduleVO constructionSchedule) {
		this.constructionSchedule = constructionSchedule;
	}

	public List<ConstructionScheduleVO> getConstructionSchedules() {
		return constructionSchedules;
	}

	public void setConstructionSchedules(List<ConstructionScheduleVO> constructionSchedules) {
		this.constructionSchedules = constructionSchedules;
	}

}
