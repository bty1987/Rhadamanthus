package com.fanglin.data.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "duty", catalog = "communion")
public class DutyPO implements Serializable {

	private static final long serialVersionUID = -5885986511194210020L;
	
	public static final String COLUMN_DID_STR = "did";

	public static final String COLUMN_NAME_STR = "name";
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final short COLUMN_STATUS_INT = 0;
	
	private long did;

	private String name;

	private short status;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "did")
	public long getDid() {
		return did;
	}

	public void setDid(long did) {
		this.did = did;
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
