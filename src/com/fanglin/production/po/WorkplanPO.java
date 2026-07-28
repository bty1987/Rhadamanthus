package com.fanglin.production.po;

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

@Entity
@Table(name = "workplan", catalog = "production")
public class WorkplanPO implements Serializable {

	private static final long serialVersionUID = -6815708248960675583L;

	public static final String COLUMN_WPID_STR = "wpid";

	public static final String COLUMN_NAME_STR = "name";

	public static final String COLUMN_COMPANY_STR = "company";

	// 启停状态：0=启用 1=禁用（前端 workplan.js 的"启用/禁用"开关）
	// 注：COLUMN_STATUS_SHORT 为历史误命名，被 WorkplanDaoImpl 引用为"启用状态"查询条件，保留不动。
	public static final short COLUMN_STATUS_SHORT = 0;

	public static final short STATUS_ENABLE_SHORT = 0;

	public static final short STATUS_DISABLE_SHORT = 1;

	private long wpid;

	private String name;

	private short status;

	private String comment;

	private WorkshopPO workshop;

	private int company;

	public WorkplanPO(long wpid) {
		super();
		this.wpid = wpid;
	}

	public WorkplanPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "wpid")
	public long getWpid() {
		return wpid;
	}

	public void setWpid(long wpid) {
		this.wpid = wpid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "wsid", referencedColumnName = "wsid")
	public WorkshopPO getWorkshop() {
		return workshop;
	}

	public void setWorkshop(WorkshopPO workshop) {
		this.workshop = workshop;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
