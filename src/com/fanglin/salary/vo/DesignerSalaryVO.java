package com.fanglin.salary.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserVO;

public class DesignerSalaryVO implements Serializable {

	private static final long serialVersionUID = 4153564414258241141L;

	private Long dsid;

	private UserVO duser;

	private UserVO cuser;

	private Timestamp createTime;

	private UserVO auser;

	private Timestamp approveTime;

	private Timestamp balanceTime;

	private Long salary;

	private Short status;

	public DesignerSalaryVO() {
		super();
	}

	public DesignerSalaryVO(UserVO duser, UserVO cuser, UserVO auser) {
		this.duser = duser;
		this.cuser = cuser;
		this.auser = auser;
	}

	public Long getDsid() {
		return dsid;
	}

	public void setDsid(Long dsid) {
		this.dsid = dsid;
	}

	public UserVO getDuser() {
		return duser;
	}

	public void setDuser(UserVO duser) {
		this.duser = duser;
	}

	public UserVO getCuser() {
		return cuser;
	}

	public void setCuser(UserVO cuser) {
		this.cuser = cuser;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public UserVO getAuser() {
		return auser;
	}

	public void setAuser(UserVO auser) {
		this.auser = auser;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getApproveTime() {
		return approveTime;
	}

	public void setApproveTime(Timestamp approveTime) {
		this.approveTime = approveTime;
	}

	public Timestamp getBalanceTime() {
		return balanceTime;
	}

	public void setBalanceTime(Timestamp balanceTime) {
		this.balanceTime = balanceTime;
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

}
