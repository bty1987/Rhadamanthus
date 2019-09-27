package com.fanglin.salary.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "designersalary", catalog = "platform")
public class DesignerSalaryPO implements Serializable {

	private static final long serialVersionUID = 6430772053483572136L;

	public static final String COLUMN_DSID_STR = "dsid";

	public static final String COLUMN_DUID_STR = "duid";

	public static final String STATUS_INIT_STRA = "status";

	public static final short COLUMN_STATUS_STR = 0;

	public static final short COLUMN_STATUSONE_STR = 1;

	public static final short COLUMN_STATUSTWO_STR = 2;

	private long dsid;

	private UserPO duser;

	private UserPO cuser;

	private Timestamp createTime;

	private UserPO auser;

	private Timestamp approveTime;

	private Timestamp balanceTime;

	private long salary;

	private short status;

	public DesignerSalaryPO() {
		super();
	}

	public DesignerSalaryPO(UserPO duser, UserPO cuser, UserPO auser) {

		this.duser = duser;
		this.cuser = cuser;
		this.auser = auser;
	}

	public DesignerSalaryPO(UserPO duser, UserPO cuser) {

		this.duser = duser;
		this.cuser = cuser;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "dsid")
	public long getDsid() {
		return dsid;
	}

	public void setDsid(long dsid) {
		this.dsid = dsid;
	}

	@Column(name = "approveTime")
	public Timestamp getApproveTime() {
		return approveTime;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "duid", referencedColumnName = "uid")
	public UserPO getDuser() {
		return duser;
	}

	public void setDuser(UserPO duser) {
		this.duser = duser;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cuid", referencedColumnName = "uid")
	public UserPO getCuser() {
		return cuser;
	}

	public void setCuser(UserPO cuser) {
		this.cuser = cuser;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "auid", referencedColumnName = "uid")
	public UserPO getAuser() {
		return auser;
	}

	public void setAuser(UserPO auser) {
		this.auser = auser;
	}

	public void setApproveTime(Timestamp approveTime) {
		this.approveTime = approveTime;
	}

	@Column(name = "balanceTime")
	public Timestamp getBalanceTime() {
		return balanceTime;
	}

	public void setBalanceTime(Timestamp balanceTime) {
		this.balanceTime = balanceTime;
	}

	@Column(name = "salary")
	public long getSalary() {
		return salary;
	}

	public void setSalary(long salary) {
		this.salary = salary;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}
}
