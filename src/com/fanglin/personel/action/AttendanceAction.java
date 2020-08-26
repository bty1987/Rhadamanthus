package com.fanglin.personel.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.core.action.BaseAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.service.AttendanceService;
import com.fanglin.personel.vo.AttendanceVO;


@ParentPackage("base")
@Namespace("/")
@Controller
public class AttendanceAction extends BaseAction {

	private static final long serialVersionUID = 807723655187424447L;

	@Autowired
	private AttendanceService attendanceService;

	private List<AttendanceVO> attendances;
	
	private JSONObject option;


	@Action(value = "queryAttendance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryAttendance() throws FLException {

		attendances = attendanceService.queryAttendance(queryUserId());

		return SUCCESS;
	}
	
	@Action(value = "reportAttendance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String reportAttendance() throws FLException {

		option = attendanceService.reportAttendance(queryUserId());

		return SUCCESS;
	}
	
	public JSONObject getOption() {
		return option;
	}

	public void setOption(JSONObject option) {
		this.option = option;
	}

	public List<AttendanceVO> getAttendances() {
		return attendances;
	}

	public void setAttendances(List<AttendanceVO> attendances) {
		this.attendances = attendances;
	}

}
