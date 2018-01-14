package com.fanglin.data.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;




@Entity
@Table(name = "drawlinegroup", catalog = "platform")
public class DrawLineGroupPO implements Serializable {
	
	
	private static final long serialVersionUID = 8862506912150425769L;

	public static final String COLUMN_STATUS_STR = "status";
	
	public static final short STATUS_ENABLE_INT = 0;
	
	public static final short STATUS_DISABLE_INT = 1;
	
	public static final String COLUMN_NAME_STR = "name" ;
	
	public static final String COLUMN_GID_STR = "gid";
	
	public static final String COLUMN_COMPANY_STR = "company";
	
	private long gid ; 
	
	private String name ; 
	
	private short status;
	
	private String content ;

	private int company;
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="gid")
	public long getGid() {
		return gid;
	}

	public void setGid(long gid) {
		this.gid = gid;
	}

	@Column(name="name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}
	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	} 
	
}
