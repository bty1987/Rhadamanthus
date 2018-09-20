package com.fanglin.customer.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="decorationcirclepicture",catalog="customer")
public class DecorationCirclePicturePO implements Serializable{

	private static final long serialVersionUID = -3915880561720496271L;
	
	public static final String COLUMN_DCID_STR = "dcid";
	
	private long dcpid;
	
	private long dcid;
	
	private String path;

	@Id
	@GeneratedValue
	@Column(name="dcpid")
	public long getDcpid() {
		return dcpid;
	}

	public void setDcpid(long dcpid) {
		this.dcpid = dcpid;
	}

	@Column(name="dcid")
	public long getDcid() {
		return dcid;
	}

	public void setDcid(long dcid) {
		this.dcid = dcid;
	}

	@Column(name="path")
	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}
	
}
