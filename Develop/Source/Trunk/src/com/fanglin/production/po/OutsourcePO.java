package com.fanglin.production.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import static javax.persistence.GenerationType.IDENTITY;

@Entity
@Table(name="outsource",catalog= "production")
public class OutsourcePO {
	
	public static final short COLMU_STATUS =0;
	
	public static final String  COLMU_PATH ="";
	
	public static final String  COLMU_STATUSTR ="status";
	
	public static final String  COLMU_PID ="pid";
	
	private long oid;
	
	private long pid;
	
	private short status;
	
	private String path;
	
	private String comment;
	
	public OutsourcePO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name="oid")
	public long getOid() {
		return oid;
	}

	public void setOid(long oid) {
		this.oid = oid;
	}
	
	@Column(name="pid")
	public long getPid() {
		return pid;
	}

	public void setPid(long pid) {
		this.pid = pid;
	}
	
	@Column(name="status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}
	
	@Column(name="path")
	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}
	
	@Column(name="comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	} 
	
}
