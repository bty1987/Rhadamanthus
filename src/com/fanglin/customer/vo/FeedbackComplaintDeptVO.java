package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.personel.vo.UserVO;

public class FeedbackComplaintDeptVO implements Serializable {

	private static final long serialVersionUID = -8887095762748129683L;

	private Long fcdid;

	private Long fcid;
	
	private DepartmentVO dept;

	private DutyVO duty;

	private UserVO dutyUser;

	private FeedbackComplaintProblemVO firstLevel;

	private FeedbackComplaintProblemVO secondary;

	private FeedbackComplaintProblemVO problemType;

	private Timestamp createTime;

	public FeedbackComplaintDeptVO() {
		super();
	}

	public FeedbackComplaintDeptVO(DepartmentVO dept, DutyVO duty, UserVO dutyUser, FeedbackComplaintProblemVO firstLevel, FeedbackComplaintProblemVO secondary, FeedbackComplaintProblemVO problemType) {
		super();
		this.dept = dept;
		this.duty = duty;
		this.dutyUser = dutyUser;
		this.firstLevel = firstLevel;
		this.secondary = secondary;
		this.problemType = problemType;
	}

	public Long getFcdid() {
		return fcdid;
	}

	public void setFcdid(Long fcdid) {
		this.fcdid = fcdid;
	}

	public Long getFcid() {
		return fcid;
	}

	public void setFcid(Long fcid) {
		this.fcid = fcid;
	}

	public DepartmentVO getDept() {
		return dept;
	}

	public void setDept(DepartmentVO dept) {
		this.dept = dept;
	}

	public DutyVO getDuty() {
		return duty;
	}

	public void setDuty(DutyVO duty) {
		this.duty = duty;
	}

	public UserVO getDutyUser() {
		return dutyUser;
	}

	public void setDutyUser(UserVO dutyUser) {
		this.dutyUser = dutyUser;
	}

	public FeedbackComplaintProblemVO getFirstLevel() {
		return firstLevel;
	}

	public void setFirstLevel(FeedbackComplaintProblemVO firstLevel) {
		this.firstLevel = firstLevel;
	}

	public FeedbackComplaintProblemVO getSecondary() {
		return secondary;
	}

	public void setSecondary(FeedbackComplaintProblemVO secondary) {
		this.secondary = secondary;
	}

	public FeedbackComplaintProblemVO getProblemType() {
		return problemType;
	}

	public void setProblemType(FeedbackComplaintProblemVO problemType) {
		this.problemType = problemType;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}
}
