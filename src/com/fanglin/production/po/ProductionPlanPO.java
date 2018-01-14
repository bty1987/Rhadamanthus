package com.fanglin.production.po;

import java.io.Serializable;
import java.sql.Timestamp;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "productionplan" , catalog = "production")
public class ProductionPlanPO implements Serializable{

	private static final long serialVersionUID = 6565378267211756040L;
	
	public  static final String COLUMN_PID_STR = "pid";
	
	public static final String COLUMN_NO_STR = "no";
	
	public  static final short STATUS_INIT_INT = 0;
	
	public  static final short STATUS_STOREHOUSE_INT = 1;
	
	public  static final short STATUS_DILIVERY_INT = 2;
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final String COLUMN_STRATTIME_STR = "startTime";
	
	public static final String COLUMN_ENDTIME_STR = "endTime";
	
	private long ppid;
	
	private long pid;
	
	private String no;
	
	private String path;
	
	private Timestamp startTime;
	
	private Timestamp endTime;
	
	private short status;
	
	private String comment;

	public ProductionPlanPO() {
		super();
	}

	public ProductionPlanPO(long ppid) {
		super();
		this.ppid = ppid;
	}


	@Id
	@GeneratedValue
	@Column(name="ppid")
	public long getPpid() {
		return ppid;
	}

	public void setPpid(long ppid) {
		this.ppid = ppid;
	}
	
	@Column(name = "pid")
	public long getPid() {
		return pid;
	}

	public void setPid(Long pid) {
		this.pid = pid;
	}

	@Column(name = "no")
	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}
	@Column(name = "path")
	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}
	@Column(name = "startTime")
	public Timestamp getStartTime() {
		return startTime;
	}

	public void setStartTime(Timestamp startTime) {
		this.startTime = startTime;
	}
	@Column(name = "endTime")
	public Timestamp getEndTime() {
		return endTime;
	}

	public void setEndTime(Timestamp endTime) {
		this.endTime = endTime;
	}
	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}
	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
	
	
}
