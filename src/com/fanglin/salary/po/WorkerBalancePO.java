package com.fanglin.salary.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

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
@Table(name = "workerbalance", catalog = "salary")
public class WorkerBalancePO implements Serializable {

	private static final long serialVersionUID = -4634252524595404538L;

	public static final String COLUMN_UID_STR = "user.uid";

	public static final short STATUS_VALID_INT = 0;// 有效

	public static final short STATUS_NULL_INT = 1;// 无效

	private long wbid;

	private UserPO user;

	private long deposit;

	private long salary;

	private long toplimit;

	private short status;

	private int company;

	public WorkerBalancePO() {
		super();
	}
	
	public WorkerBalancePO(UserPO user) {
		super();
		this.user = user;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "wbid")
	public long getWbid() {
		return wbid;
	}

	public void setWbid(long wbid) {
		this.wbid = wbid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "uid", referencedColumnName = "uid")
	public UserPO getUser() {
		return user;
	}

	public void setUser(UserPO user) {
		this.user = user;
	}

	@Column(name = "deposit")
	public long getDeposit() {
		return deposit;
	}

	public void setDeposit(long deposit) {
		this.deposit = deposit;
	}

	@Column(name = "salary")
	public long getSalary() {
		return salary;
	}

	public void setSalary(long salary) {
		this.salary = salary;
	}

	@Column(name = "toplimit")
	public long getToplimit() {
		return toplimit;
	}

	public void setToplimit(long toplimit) {
		this.toplimit = toplimit;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
