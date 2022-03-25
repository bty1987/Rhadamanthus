package com.fanglin.customer.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "background", catalog = "customer")
public class BackgroundPO implements Serializable {

	private static final long serialVersionUID = 1220920179779677394L;

	public static final String COLUMN_UNIONID_STR = "unionId";

	private long bid;

	private String unionId;

	private String path;

	@Id
	@GeneratedValue
	@Column(name = "bid")
	public long getBid() {
		return bid;
	}

	public void setBid(long bid) {
		this.bid = bid;
	}

	@Column(name = "unionId")
	public String getUnionId() {
		return unionId;
	}

	public void setUnionId(String unionId) {
		this.unionId = unionId;
	}

	@Column(name = "path")
	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

}
