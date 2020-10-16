package com.fanglin.information.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.data.common.vo.TaskVO;
import com.fanglin.personel.vo.UserBaseVO;

public class PlanVO implements Serializable {

	private static final long serialVersionUID = -176596579933112324L;

	private Long pid;

	private TaskVO task;

	private String args;

	private UserBaseVO creater;

	private Timestamp createTime;

	private String executeTime;

	private String resultFilepath;

	private String infoFilepath;

	private Short schedule;

	private Short status;

	private String info;

	private PlanParamVO param;

	public PlanVO() {
		super();
	}

	public PlanVO(TaskVO task, UserBaseVO creater) {
		super();
		this.task = task;
		this.creater = creater;
	}

	public Long getPid() {
		return pid;
	}

	public void setPid(Long pid) {
		this.pid = pid;
	}

	public TaskVO getTask() {
		return task;
	}

	public void setTask(TaskVO task) {
		this.task = task;
	}

	public String getArgs() {
		return args;
	}

	public void setArgs(String args) {
		this.args = args;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public String getExecuteTime() {
		return executeTime;
	}

	public void setExecuteTime(String executeTime) {
		this.executeTime = executeTime;
	}

	public String getResultFilepath() {
		return resultFilepath;
	}

	public void setResultFilepath(String resultFilepath) {
		this.resultFilepath = resultFilepath;
	}

	public String getInfoFilepath() {
		return infoFilepath;
	}

	public void setInfoFilepath(String infoFilepath) {
		this.infoFilepath = infoFilepath;
	}

	public Short getSchedule() {
		return schedule;
	}

	public void setSchedule(Short schedule) {
		this.schedule = schedule;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public String getInfo() {
		return info;
	}

	public void setInfo(String info) {
		this.info = info;
	}

	public PlanVO add(PlanVO planVO) {
		return planVO;
	}

	public PlanParamVO getParam() {
		return param;
	}

	public void setParam(PlanParamVO param) {
		this.param = param;
	}

}
