package com.fanglin.data.common.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.service.HolidayService;
import com.fanglin.data.common.vo.HolidayVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class HolidayAction extends BaseListAction {

	private static final long serialVersionUID = -3116257532854558261L;

	@Autowired
	private HolidayService holidayService;

	private HolidayVO holiday;

	private List<HolidayVO> holidays;

	@Action(value = "pageHoliday", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageHoliday() throws FLException {

		holidayService.pageHoliday(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "queryHoliday", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryHoliday() throws FLException {

		holidays = holidayService.queryHoliday(holiday);

		return SUCCESS;
	}

	@Action(value = "addHoliday", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addHoliday() throws FLException {

		holidayService.addHoliday(holiday);

		return SUCCESS;
	}

	@Action(value = "updateHoliday", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateHoliday() throws FLException {

		holidayService.updateHoliday(holiday);

		return SUCCESS;
	}

	@Action(value = "deleteHoliday", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteHoliday() throws FLException {

		holidayService.deleteHoliday(holiday);

		return SUCCESS;
	}

	public HolidayVO getHoliday() {
		return holiday;
	}

	public void setHoliday(HolidayVO holiday) {
		this.holiday = holiday;
	}

	public List<HolidayVO> getHolidays() {
		return holidays;
	}

	public void setHolidays(List<HolidayVO> holidays) {
		this.holidays = holidays;
	}

}
