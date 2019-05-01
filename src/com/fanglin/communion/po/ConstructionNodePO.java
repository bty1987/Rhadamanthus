package com.fanglin.communion.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;


@Entity
@Table(name = "constructionNode",catalog = "communion")
public class ConstructionNodePO implements Serializable {

	private static final long serialVersionUID = 7434364138129555698L;
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final short STATUS_START_SHORT = 0;
	
	private long cnid;
	
	private String name;
	
	private Float precheck;
	
	private Float postcheck;
	
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
	
	public Float getPrecheck() {
		return precheck;
	}

	public void setPrecheck(Float precheck) {
		this.precheck = precheck;
	}

	public Float getPostcheck() {
		return postcheck;
	}

	public void setPostcheck(Float postcheck) {
		this.postcheck = postcheck;
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
