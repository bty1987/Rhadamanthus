package com.fanglin.production.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "workflow", catalog = "production")
public class WorkflowPO implements Serializable {

	private static final long serialVersionUID = -6551143213986337841L;

	public static final String COLUMN_WFID_STR = "wfid";

	// 启停状态：0=启用 1=禁用（前端 workflow.js/workflow2check.js 的"启用/禁用"开关）
	// 注：COLUMN_STATUS_STR 为历史误命名(实为 short=0 即启用值)，被 WorkflowDaoImpl/ServiceImpl
	// 引用为"启用状态"查询条件，保留不动以免破坏现有逻辑；新增语义清晰的 STATUS_* 常量供后续使用。
	public static final short COLUMN_STATUS_STR = 0;

	public static final short STATUS_ENABLE_SHORT = 0;

	public static final short STATUS_DISABLE_SHORT = 1;

	public static final String COLUMN_NAME_STR = "name";

	private long wfid;

	private String name;

	private short status;

	private int company;

	public WorkflowPO(long wfid) {
		super();
		this.wfid = wfid;
	}

	public WorkflowPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "wfid")
	public long getWfid() {
		return wfid;
	}

	public void setWfid(long wfid) {
		this.wfid = wfid;
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

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
