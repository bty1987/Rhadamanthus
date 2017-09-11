package com.fanglin.production.vo;

import java.io.Serializable;

import com.fanglin.personel.vo.UserVO;

public class ProductionWorkPlanVO implements Serializable{

	private static final long serialVersionUID = 3365713667618947626L;
	
	private long pwpid;
	
	private long ppid;
	
	private WorkplanVO workplan;
	
	private UserVO creater;
	
	private short status;

	public ProductionWorkPlanVO() {
		super();
	}

	public ProductionWorkPlanVO(WorkplanVO workplan, UserVO creater) {
		super();
		this.workplan = workplan;
		this.creater = creater;
	}

	public long getPwpid() {
		return pwpid;
	}

	public void setPwpid(long pwpid) {
		this.pwpid = pwpid;
	}

	public long getPpid() {
		return ppid;
	}

	public void setPpid(long ppid) {
		this.ppid = ppid;
	}

	public WorkplanVO getWorkplan() {
		return workplan;
	}

	public void setWorkplan(WorkplanVO workplan) {
		this.workplan = workplan;
	}

	public UserVO getCreater() {
		return creater;
	}

	public void setCreater(UserVO creater) {
		this.creater = creater;
	}

	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}
	
	
	
}
