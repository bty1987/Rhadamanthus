package com.fanglin.data.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "brandBalance", catalog = "data")
public class BrandBalancePO implements Serializable {

	private static final long serialVersionUID = 8602793046372222918L;

	private long bbid;
	
	private long bid;
	
	private String name;
	
	private short ctype;
	
	private int cvalue;
	
	private String comment;
	
	public BrandBalancePO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "bbid")
	public long getBbid() {
		return bbid;
	}

	public void setBbid(long bbid) {
		this.bbid = bbid;
	}

	@Column(name = "bid")
	public long getBid() {
		return bid;
	}

	public void setBid(long bid) {
		this.bid = bid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "ctype")
	public short getCtype() {
		return ctype;
	}

	public void setCtype(short ctype) {
		this.ctype = ctype;
	}

	@Column(name = "cvalue")
	public int getCvalue() {
		return cvalue;
	}

	public void setCvalue(int cvalue) {
		this.cvalue = cvalue;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
	
}
