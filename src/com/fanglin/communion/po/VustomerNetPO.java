package com.fanglin.communion.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "vustomernet", catalog = "communion")
public class VustomerNetPO implements Serializable {

	private static final long serialVersionUID = 4043258313450694562L;
	
	public static final String COLUMN_UNIONID_STR = "unionId";
	
	public static final String COLUMN_NETUNIONID_STR = "netunionId";
	
	private long vnid;
	
	private String unionId;
	
	private String netunionId;
	
	public VustomerNetPO(){
		super();
	}

	@Id
	@GeneratedValue
	@Column(name = "vnid")
	public long getVnid() {
		return vnid;
	}

	public void setVnid(long vnid) {
		this.vnid = vnid;
	}
	
	@Column(name = "unionId")
	public String getUnionId() {
		return unionId;
	}

	public void setUnionId(String unionId) {
		this.unionId = unionId;
	}

	@Column(name = "netunionId")
	public String getNetunionId() {
		return netunionId;
	}

	public void setNetunionId(String netunionId) {
		this.netunionId = netunionId;
	}

	
}
