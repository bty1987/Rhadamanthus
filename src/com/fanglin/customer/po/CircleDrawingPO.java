package com.fanglin.customer.po;

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
@Table(name="circledrawing",catalog="customer")
public class CircleDrawingPO implements Serializable{

	private static final long serialVersionUID = -3915880561720496271L;
	
	public static final String COLUMN_DCID_STR = "cid";
	
	private long cdid;
	
	private CirclePO circle;
	
	private String path;

	@Id
	@GeneratedValue
	@Column(name="cdid")
	public long getCdid() {
		return cdid;
	}

	public void setCdid(long cdid) {
		this.cdid = cdid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cid", referencedColumnName = "cid")
	public CirclePO getCircle() {
		return circle;
	}

	public void setCircle(CirclePO circle) {
		this.circle = circle;
	}

	@Column(name="path")
	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}
	
}
