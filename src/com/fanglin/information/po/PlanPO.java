package com.fanglin.information.po;

import static javax.persistence.GenerationType.IDENTITY;
import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "plan",catalog = "information")
public class PlanPO implements Serializable{
	
	private static final long serialVersionUID = 4258766333068282952L;
    
    public static final String COLUMN_CUID_STR = "cuid";
  
    public static final String COLUMN_STATUS_STR = "status";
	
	public static final Short COLUMN_STATUS_INT = 0;
	
	public static final Short COLUMN_STATUS_CANCEL_INT = 1;
	
	public static final String COLUMN_EXECUTETIME_STR ="executeTime";
	
	public static final Short COLUMN_STATUS_IMME_INT = 4;

	private long pid;
	
	private TaskPO task;
	
	private String args;
	
	private long cuid;
	
	private Timestamp createTime;
	
	private String executeTime;
	
	private String resultFilepath;
	
	private String infoFilepath;
	
	private short schedule;
	
	private short status;
	
	private String info;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "pid")
	public long getPid() {
		return pid;
	}

	public void setPid(long pid) {
		this.pid = pid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "tid", referencedColumnName = "tid")
	public TaskPO getTask() {
		return task;
	}

	public void setTask(TaskPO task) {
		this.task = task;
	}

	@Column(name = "args")
	public String getArgs() {
		return args;
	}

	public void setArgs(String args) {
		this.args = args;
	}

	@Column(name = "cuid")
	public long getCuid() {
		return cuid;
	}

	public void setCuid(long cuid) {
		this.cuid = cuid;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	
	@Column(name = "executeTime")
    public String getExecuteTime() {
		return executeTime;
	}

	public void setExecuteTime(String executeTime) {
		this.executeTime = executeTime;
	}

	@Column(name = "resultFilepath")
	public String getResultFilepath() {
		return resultFilepath;
	}

	public void setResultFilepath(String resultFilepath) {
		this.resultFilepath = resultFilepath;
	}

	@Column(name = "infoFilepath")
	public String getInfoFilepath() {
		return infoFilepath;
	}

	public void setInfoFilepath(String infoFilepath) {
		this.infoFilepath = infoFilepath;
	}

	@Column(name = "schedule")
	public short getSchedule() {
		return schedule;
	}

	public void setSchedule(short schedule) {
		this.schedule = schedule;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "info")
	public String getInfo() {
		return info;
	}

	public void setInfo(String info) {
		this.info = info;
	}
	
}
