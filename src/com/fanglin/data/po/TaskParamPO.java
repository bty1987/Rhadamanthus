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
	
	public static final short STATUS_INIT_SHORT = 0;
	
	private long tpid;
	
	private long tid;
	
	private String name;
	
	private String module;
	
	private short type;
	
	private short oneType;
	
	private String unionField;
	
	private long unionParam;
	
	private String field;
	
	private String alias;
	
	private String tableName;
	
	private short ismain;
	
	private String handle;
	
	private short status;
	
	private short sort;
	
	private short tableSort;
	
	private String comment;
	
	public TaskParamPO() {
		super();
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

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "module")
	public String getModule() {
		return module;
	}

	public void setModule(String module) {
		this.module = module;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}
	
	public void setType(short type) {
		this.type = type;
	}
	
	@Column(name = "oneType")
	public short getOneType() {
		return oneType;
	}

	public void setOneType(short oneType) {
		this.oneType = oneType;
	}
	
	@Column(name = "unionField")
	public String getUnionField() {
		return unionField;
	}

	public void setUnionField(String unionField) {
		this.unionField = unionField;
	}
	
	@Column(name = "unionParam")
	public long getUnionParam() {
		return unionParam;
	}

	public void setUnionParam(long unionParam) {
		this.unionParam = unionParam;
	}

	@Column(name = "field")
	public String getField() {
		return field;
	}

	public void setField(String field) {
		this.field = field;
	}

	@Column(name = "alias")
	public String getAlias() {
		return alias;
	}

	public void setAlias(String alias) {
		this.alias = alias;
	}

	@Column(name = "tableName")
	public String getTableName() {
		return tableName;
	}

	public void setTableName(String tableName) {
		this.tableName = tableName;
	}

	@Column(name = "ismain")
	public short getIsmain() {
		return ismain;
	}

	public void setIsmain(short ismain) {
		this.ismain = ismain;
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
	public short getSort() {
		return sort;
	}

	public void setSort(short sort) {
		this.sort = sort;
	}
	
	@Column(name = "tableSort")
	public short getTableSort() {
		return tableSort;
	}

	public void setTableSort(short tableSort) {
		this.tableSort = tableSort;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
}
