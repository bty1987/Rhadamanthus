package com.fanglin.payment.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "walletres", catalog = "payment")
public class WalletresPO implements java.io.Serializable {

	private static final long serialVersionUID = -2126787992908282145L;

	private long wrid;
	
	private long wid;
	
	private long picid;
	
	private String name;
	
	private String type;
	
	private String path;
	
	private String comment;

	public WalletresPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "wrid")
	public long getWrid() {
		return wrid;
	}

	public void setWrid(long wrid) {
		this.wrid = wrid;
	}

	@Column(name = "wid")
	public long getWid() {
		return wid;
	}

	public void setWid(long wid) {
		this.wid = wid;
	}

	@Column(name = "picid")
	public long getPicid() {
		return picid;
	}

	public void setPicid(long picid) {
		this.picid = picid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "type")
	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	@Column(name = "path")
	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}