package com.fanglin.data.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;


@Entity
@Table(name = "constructionNode",catalog = "construction")
public class ConstructionNodePO implements Serializable {

	private static final long serialVersionUID = 7434364138129555698L;
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final short STATUS_START_SHORT = 0;
	
	private long cnid;
	
	private String name;
	
	private short status;
	
	private short sort;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name="cnid")
	public long getCnid() {
		return cnid;
	}

	public void setCnid(long cnid) {
		this.cnid = cnid;
	}

	@Column(name="name")
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	@Column(name="status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name="sort")
	public short getSort() {
		return sort;
	}

	public void setSort(short sort) {
		this.sort = sort;
	}

}
