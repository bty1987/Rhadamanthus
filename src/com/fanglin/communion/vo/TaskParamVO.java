package com.fanglin.communion.vo;

import java.io.Serializable;

public class TaskParamVO implements Serializable{

	private static final long serialVersionUID = -2573958022961800709L;

	private Long tpid;
	
	private Long tid;
		
	private String name;
	
	private String module;
	
	private Short type;
	
	private Short oneType;
	
	private String unionField;
	
	private Long unionParam;
	
	private String field;
	
	private String alias;
	
	private String tableName;
	
	private Short ismain;
	
	private String handle;
	
	private Short status;
	
	private Short sort;
	
	private Short tableSort;
	
	private String comment;

	public TaskParamVO() {
		super();
	}

	public Long getTpid() {
		return tpid;
	}

	public void setTpid(Long tpid) {
		this.tpid = tpid;
	}

	public Long getTid() {
		return tid;
	}

	public void setTid(Long tid) {
		this.tid = tid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getModule() {
		return module;
	}

	public void setModule(String module) {
		this.module = module;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getOneType() {
		return oneType;
	}

	public void setOneType(Short oneType) {
		this.oneType = oneType;
	}

	public String getUnionField() {
		return unionField;
	}

	public void setUnionField(String unionField) {
		this.unionField = unionField;
	}
	
	public Long getUnionParam() {
		return unionParam;
	}

	public void setUnionParam(Long unionParam) {
		this.unionParam = unionParam;
	}

	public String getField() {
		return field;
	}

	public void setField(String field) {
		this.field = field;
	}

	public String getAlias() {
		return alias;
	}

	public void setAlias(String alias) {
		this.alias = alias;
	}

	public String getTableName() {
		return tableName;
	}

	public void setTableName(String tableName) {
		this.tableName = tableName;
	}

	public Short getIsmain() {
		return ismain;
	}

	public void setIsmain(Short ismain) {
		this.ismain = ismain;
	}

	public String getHandle() {
		return handle;
	}

	public void setHandle(String handle) {
		this.handle = handle;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Short getSort() {
		return sort;
	}

	public void setSort(Short sort) {
		this.sort = sort;
	}

	public Short getTableSort() {
		return tableSort;
	}

	public void setTableSort(Short tableSort) {
		this.tableSort = tableSort;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
