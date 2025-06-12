package com.fanglin.customer.po;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.communion.po.DutyPO;
import com.fanglin.customer.vo.FeedbackComplaintDeptVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "feedbackcomplaintdept", catalog = "customer")
public class FeedbackComplaintDeptPO implements Serializable {

	private static final long serialVersionUID = -8177944576189885526L;

	private long fcdid;
	
	private long fcid;

	private DepartmentPO dept;

	private DutyPO duty;

	private UserPO dutyUser;

	private short firstLevel;

	private short secondary;

	private short problemType;

	private Timestamp createTime;

	@Id
	@GeneratedValue
	@Column(name = "fcdid")
	public long getFcdid() {
		return fcdid;
	}

	public void setFcdid(long fcdid) {
		this.fcdid = fcdid;
	}

	@Column(name = "fcid")
	public long getFcid() {
		return fcid;
	}

	public void setFcid(long fcid) {
		this.fcid = fcid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "deptId", referencedColumnName = "did", nullable = false)
	public DepartmentPO getDept() {
		return dept;
	}

	public void setDept(DepartmentPO dept) {
		this.dept = dept;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "did", referencedColumnName = "did", nullable = false)
	public DutyPO getDuty() {
		return duty;
	}

	public void setDuty(DutyPO duty) {
		this.duty = duty;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "duid", referencedColumnName = "uid")
	public UserPO getDutyUser() {
		return dutyUser;
	}

	public void setDutyUser(UserPO dutyUser) {
		this.dutyUser = dutyUser;
	}

	@Column(name = "firstLevel")
	public short getFirstLevel() {
		return firstLevel;
	}

	public void setFirstLevel(short firstLevel) {
		this.firstLevel = firstLevel;
	}

	@Column(name = "secondary")
	public short getSecondary() {
		return secondary;
	}

	public void setSecondary(short secondary) {
		this.secondary = secondary;
	}

	@Column(name = "problemType")
	public short getProblemType() {
		return problemType;
	}

	public void setProblemType(short problemType) {
		this.problemType = problemType;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public FeedbackComplaintDeptVO ptv(FeedbackComplaintDeptVO feedbackComplaintDeptVO) {

		BeanUtil.copyPropertie(this, feedbackComplaintDeptVO, Arrays.asList("dept", "duty", "dutyUser"));

		if (feedbackComplaintDeptVO.getDept() != null && getDept() != null) BeanUtil.copyProperties(getDept(), feedbackComplaintDeptVO.getDept());
		if (feedbackComplaintDeptVO.getDuty() != null && getDuty() != null) BeanUtil.copyProperties(getDuty(), feedbackComplaintDeptVO.getDuty());
		if (feedbackComplaintDeptVO.getDutyUser() != null && getDutyUser() != null) feedbackComplaintDeptVO.getDutyUser().ptv(getDutyUser());

		return feedbackComplaintDeptVO;
	}
}
