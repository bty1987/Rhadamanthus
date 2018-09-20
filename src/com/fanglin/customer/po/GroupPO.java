package com.fanglin.customer.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "group", catalog = "customer")
public class GroupPO implements Serializable{

	private static final long serialVersionUID = -8021596170317836022L;
	
	public static final String COLUMN_OPENGID_STR = "opengid";
	
	private long gid;
	
	private String opengid;
	
	private String orderId;
	
	private String name;
	
	private String content;

	@Id
	@GeneratedValue
	@Column(name="gid")
	public long getGid() {
		return gid;
	}

	public void setGid(long gid) {
		this.gid = gid;
	}
	
	@Column(name="opengid")
	public String getOpengid() {
		return opengid;
	}

	public void setOpengid(String opengid) {
		this.opengid = opengid;
	}
	
	@Column(name="orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}
	
	@Column(name="name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name="content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}
	
}
