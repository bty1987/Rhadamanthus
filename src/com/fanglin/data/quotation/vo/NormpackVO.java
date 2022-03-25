package com.fanglin.data.quotation.vo;

import java.io.Serializable;


public class NormpackVO implements Serializable {

	private static final long serialVersionUID = 1892909861596612250L;

	private long npid;

	private String name;

	private short status;	

	public NormpackVO() {
		super();
	}
	
	public long getNpid() {
		return npid;
	}

	public void setNpid(long npid) {
		this.npid = npid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}
	
}
