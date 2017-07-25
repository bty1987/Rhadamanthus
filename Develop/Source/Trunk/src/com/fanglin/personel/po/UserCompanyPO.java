package com.fanglin.personel.po;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "usercompany", catalog = "communion")
public class UserCompanyPO implements Serializable {

	private static final long serialVersionUID = -9073486016937854510L;

	private long ucid;
	
	private int uid;
	
	private int cid;
	
	public UserCompanyPO() {
		super();
	}

	public UserCompanyPO(int uid, int cid) {
		super();
		this.uid = uid;
		this.cid = cid;
	}

	@Id
	@GeneratedValue
	@Column(name = "ucid") 
	public long getUcid() {
		return ucid;
	}
	
	public void setUcid(long ucid) {
		this.ucid = ucid;
	}

	public int getUid() {
		return uid;
	}

	public void setUid(int uid) {
		this.uid = uid;
	}

	public int getCid() {
		return cid;
	}

	public void setCid(int cid) {
		this.cid = cid;
	}

	
}
