package com.fanglin.information.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "noticedepartment", catalog = "information")
public class NoticeDepartmentPO implements Serializable{

	private static final long serialVersionUID = 1145569082063384689L;
	
	private long ndid;
	
	private long nid;
	
	private int did;
		
	public NoticeDepartmentPO() {
		super();
	}

	public NoticeDepartmentPO(long nid, int did) {
		super();
		this.nid = nid;
		this.did = did;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "ndid")
	public long getNdid() {
		return ndid;
	}
	
	public void setNdid(long ndid) {
		this.ndid = ndid;
	}
	
	public long getNid() {
		return nid;
	}

	public void setNid(long nid) {
		this.nid = nid;
	}

	@Column(name = "did")
	public int getDid() {
		return did;
	}

	public void setDid(int did) {
		this.did = did;
	}
	
}
