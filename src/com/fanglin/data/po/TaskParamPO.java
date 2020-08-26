package com.fanglin.data.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "taskparam", catalog = "data")
public class TaskParamPO implements Serializable {

	private static final long serialVersionUID = 5787453455330623504L;
	
	private long tpid;
	
	private long tid;
	
	private long no;
	
	private String name;
	
	private String param;
	
	private String alias;
	
	private short type;
	
	private String handle;
	
	private short status;
	
	private long sort;
	
	private String comment;
	
	public TaskParamPO() {
		super();
	}
	
	public TaskParamPO(long tpid) {
		super();
		this.tpid = tpid;
	}

	public TaskParamPO(long tpid, long tid, long no, String name, String param,
		String alias, short type, String handle, short status, long sort,
		String comment) {
		super();
		this.tpid = tpid;
		this.tid = tid;
		this.no = no;
		this.name = name;
		this.param = param;
		this.alias = alias;
		this.type = type;
		this.handle = handle;
		this.status = status;
		this.sort = sort;
		this.comment = comment;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "tpid")
	public long getTpid() {
		return tpid;
	}

	public void setTpid(long tpid) {
		this.tpid = tpid;
	}

	@Column(name = "tid")
	public long getTid() {
		return tid;
	}

	public void setTid(long tid) {
		this.tid = tid;
	}

	@Column(name = "no")
	public long getNo() {
		return no;
	}

	public void setNo(long no) {
		this.no = no;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
	@Column(name = "param")
	public String getParam() {
		return param;
	}

	public void setParam(String param) {
		this.param = param;
	}
	
	@Column(name = "alias")
	public String getAlias() {
		return alias;
	}

	public void setAlias(String alias) {
		this.alias = alias;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "handle")
	public String getHandle() {
		return handle;
	}

	public void setHandle(String handle) {
		this.handle = handle;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "sort")
	public long getSort() {
		return sort;
	}

	public void setSort(long sort) {
		this.sort = sort;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
	
}
