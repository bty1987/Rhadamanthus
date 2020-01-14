package com.fanglin.production.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class ProductionWorkPlanVO implements Serializable {

	private static final long serialVersionUID = 3365713667618947626L;

	private long pwpid;

	private long ppid;

	private WorkplanVO workplan;

	private UserBaseVO creater;
	
	private Timestamp createTime;
	
	private Timestamp finishTime;
	
	private short sort;

	private short status;

	public ProductionWorkPlanVO() {
		super();
	}

	public ProductionWorkPlanVO(WorkplanVO workplan, UserBaseVO creater) {
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

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(Timestamp finishTime) {
		this.finishTime = finishTime;
	}

	public short getSort() {
		return sort;
	}

	public void setSort(short sort) {
		this.sort = sort;
	}

}
