package com.fanglin.inventory.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "format", catalog = "inventory")
public class FormatPO implements Serializable{

	private static final long serialVersionUID = -260512360916421162L;
	
	public static final String COLUMN_GID_STR = "gid";
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final short STATUS_ENABLE_INT = 0;
	
	public static final short STATUS_DISABLE_INT = 1;
	
	private Long fid;
	
	private Long gid;
	
	private String info;
	
	private Short status;
	
	public FormatPO() {
		super();
	}

	public FormatPO(Long fid) {
		super();
		this.fid = fid;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "fid")
	public Long getFid() {
		return fid;
	}

	public void setFid(Long fid) {
		this.fid = fid;
	}
	
	@Column(name = "gid")
	public Long getGid() {
		return gid;
	}

	public void setGid(Long gid) {
		this.gid = gid;
	}
	
	@Column(name = "info")
	public String getInfo() {
		return info;
	}

	public void setInfo(String info) {
		this.info = info;
	}
	
	@Column(name = "status")
	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}
	
}
