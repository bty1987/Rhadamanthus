package com.fanglin.salary.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.vo.UserBaseVO;

public class WorkerSalaryVO implements Serializable {

	private static final long serialVersionUID = -1896969348501581246L;

	private Long wsid;

	private DecorationVO decoration;

	private Long cid;

	private Long csid;

	private Long cwsid;

	private Long money;

	private Long deposit;

	private Long salary;

	private Short schedule;

	private Short type;

	private Short subtype;

	private Short onetype;

	private Short twotype;

	private Integer count;

	private Short isSend;

	private Short isAppr;

	private Short isCheck;

	private Short status;

	private UserBaseVO user;

	private UserBaseVO creater;

	private UserBaseVO checker;

	private UserBaseVO approver;

	private Timestamp createTime;

	private Timestamp checkTime;

	private Timestamp approveTime;

	private Timestamp balanceTime;

	private Timestamp finishTime;

	private String comment;

	public WorkerSalaryVO() {
		super();
	}

	public WorkerSalaryVO(DecorationVO decoration, UserBaseVO user, UserBaseVO creater, UserBaseVO approver, UserBaseVO checker) {
		super();
		this.decoration = decoration;
		this.user = user;
		this.creater = creater;
		this.approver = approver;
		this.checker = checker;
	}

	public Long getWsid() {
		return wsid;
	}

	public void setWsid(Long wsid) {
		this.wsid = wsid;
	}

	public Long getCwsid() {
		return cwsid;
	}

	public void setCwsid(Long cwsid) {
		this.cwsid = cwsid;
	}

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}

	public DecorationVO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationVO decoration) {
		this.decoration = decoration;
	}

	public UserBaseVO getUser() {
		return user;
	}

	public void setUser(UserBaseVO user) {
		this.user = user;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	public UserBaseVO getChecker() {
		return checker;
	}

	public void setChecker(UserBaseVO checker) {
		this.checker = checker;
	}

	public UserBaseVO getApprover() {
		return approver;
	}

	public void setApprover(UserBaseVO approver) {
		this.approver = approver;
	}

	public Long getSalary() {
		return salary;
	}

	public void setSalary(Long salary) {
		this.salary = salary;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Short getSubtype() {
		return subtype;
	}

	public void setSubtype(Short subtype) {
		this.subtype = subtype;
	}

	public Long getCsid() {
		return csid;
	}

	public void setCsid(Long csid) {
		this.csid = csid;
	}

	public Long getMoney() {
		return money;
	}

	public void setMoney(Long money) {
		this.money = money;
	}

	public Long getDeposit() {
		return deposit;
	}

	public void setDeposit(Long deposit) {
		this.deposit = deposit;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getOnetype() {
		return onetype;
	}

	public void setOnetype(Short onetype) {
		this.onetype = onetype;
	}

	public Short getTwotype() {
		return twotype;
	}

	public void setTwotype(Short twotype) {
		this.twotype = twotype;
	}

	public Short getSchedule() {
		return schedule;
	}

	public void setSchedule(Short schedule) {
		this.schedule = schedule;
	}

	public Integer getCount() {
		return count;
	}

	public void setCount(Integer count) {
		this.count = count;
	}

	public Short getIsSend() {
		return isSend;
	}

	public void setIsSend(Short isSend) {
		this.isSend = isSend;
	}

	public Short getIsAppr() {
		return isAppr;
	}

	public void setIsAppr(Short isAppr) {
		this.isAppr = isAppr;
	}

	public Short getIsCheck() {
		return isCheck;
	}

	public void setIsCheck(Short isCheck) {
		this.isCheck = isCheck;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getBalanceTime() {
		return balanceTime;
	}

	public void setBalanceTime(Timestamp balanceTime) {
		this.balanceTime = balanceTime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getApproveTime() {
		return approveTime;
	}

	public void setApproveTime(Timestamp approveTime) {
		this.approveTime = approveTime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(Timestamp finishTime) {
		this.finishTime = finishTime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCheckTime() {
		return checkTime;
	}

	public void setCheckTime(Timestamp checkTime) {
		this.checkTime = checkTime;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
