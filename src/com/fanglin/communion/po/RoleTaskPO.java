package com.fanglin.communion.po;

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
@Table(name = "roletask", catalog = "communion")
public class RoleTaskPO implements Serializable {

	private static final long serialVersionUID = 5556511370996501114L;

	private long trrid;

	private int rid;

	private TaskPO task;

	private UserPO creater;

	private Timestamp createTime;

	private int company;

	public RoleTaskPO() {
		super();
	}

	public RoleTaskPO(int rid, TaskPO task, UserPO creater, int company) {

		super();

		this.rid = rid;
		this.task = task;
		this.creater = creater;
		this.company = company;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "trrid")
	public long getTrrid() {
		return trrid;
	}

	public void setTrrid(long trrid) {
		this.trrid = trrid;
	}

	@Column(name = "rid")
	public int getRid() {
		return rid;
	}

	public void setRid(int rid) {
		this.rid = rid;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "tid", referencedColumnName = "tid")
	public TaskPO getTask() {
		return task;
	}

	public void setTask(TaskPO task) {
		this.task = task;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
