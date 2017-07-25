package com.fanglin.personel.vo;

import java.io.Serializable;


public class UserCompanyVO implements Serializable {

	private static final long serialVersionUID = 1338233896132683919L;

	private long ucid;
		
	private int uid;
		
	private int cid;
	
	public UserCompanyVO() {
		super();
	}

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
