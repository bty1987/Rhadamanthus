package com.fanglin.production.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import static javax.persistence.GenerationType.IDENTITY;

@Entity
@Table(name = "quotetype", catalog = "production")
public class QuoteTypePO implements Serializable{

	private static final long serialVersionUID = -3131366859922020943L;
	
	public static final String COLUMN_NAME_STR = "name";
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final short STATUS_ENABLE_SHORT = 0;
	
	public static final short STATUS_DISABLE_SHORT = 1;

	private long qtid;
	
	private String name;
	
	private short status;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "qtid")
	public long getQtid() {
		return qtid;
	}

	public void setQtid(long qtid) {
		this.qtid = qtid;
	}

	@Column(name = "name")
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
	
	

	
}
