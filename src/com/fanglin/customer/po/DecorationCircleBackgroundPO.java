package com.fanglin.customer.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="decorationcirclebackground",catalog="customer")
public class DecorationCircleBackgroundPO implements Serializable{

	private static final long serialVersionUID = 1220920179779677394L;
	
	public static final String COLUMN_UNIONID_STR = "unionId";
	
	private long dcbid;
	
	private String unionId;
	
	private String path;

	@Id
	@GeneratedValue
	@Column(name="dcbid")
	public long getDcbid() {
		return dcbid;
	}

	public void setDcbid(long dcbid) {
		this.dcbid = dcbid;
	}

	@Column(name="unionId")
	public String getUnionId() {
		return unionId;
	}

	public void setUnionId(String unionId) {
		this.unionId = unionId;
	}

	@Column(name="path")
	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}
	
}
