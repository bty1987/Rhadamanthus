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

	private FeedbackComplaintProblemPO firstLevel;

	private FeedbackComplaintProblemPO secondary;

	private FeedbackComplaintProblemPO problemType;

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

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "firstLevel", referencedColumnName = "fcpid")
	public FeedbackComplaintProblemPO getFirstLevel() {
		return firstLevel;
	}

	public void setFirstLevel(FeedbackComplaintProblemPO firstLevel) {
		this.firstLevel = firstLevel;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "secondary", referencedColumnName = "fcpid")
	public FeedbackComplaintProblemPO getSecondary() {
		return secondary;
	}

	public void setSecondary(FeedbackComplaintProblemPO secondary) {
		this.secondary = secondary;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "problemType", referencedColumnName = "fcpid")
	public FeedbackComplaintProblemPO getProblemType() {
		return problemType;
	}

	public void setProblemType(FeedbackComplaintProblemPO problemType) {
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

		BeanUtil.copyPropertie(this, feedbackComplaintDeptVO, Arrays.asList("dept", "duty", "dutyUser", "firstLevel", "secondary", "problemType"));

		if (feedbackComplaintDeptVO.getDept() != null && getDept() != null) BeanUtil.copyProperties(getDept(), feedbackComplaintDeptVO.getDept());
		if (feedbackComplaintDeptVO.getDuty() != null && getDuty() != null) BeanUtil.copyProperties(getDuty(), feedbackComplaintDeptVO.getDuty());
		if (feedbackComplaintDeptVO.getDutyUser() != null && getDutyUser() != null) feedbackComplaintDeptVO.getDutyUser().ptv(getDutyUser());
		if (feedbackComplaintDeptVO.getFirstLevel() != null && getFirstLevel() != null) BeanUtil.copyProperties(getFirstLevel(), feedbackComplaintDeptVO.getFirstLevel());
		if (feedbackComplaintDeptVO.getSecondary() != null && getSecondary() != null) BeanUtil.copyProperties(getSecondary(), feedbackComplaintDeptVO.getSecondary());
		if (feedbackComplaintDeptVO.getProblemType() != null && getProblemType() != null) BeanUtil.copyProperties(getProblemType(), feedbackComplaintDeptVO.getProblemType());

		return feedbackComplaintDeptVO;
	}
}
