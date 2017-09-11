package com.fanglin.production.po;

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

import com.fanglin.personel.po.UserPO;

@Entity
@Table(name="productionworkplan" , catalog = "production")
public class ProductionWorkPlanPO implements Serializable{

	private static final long serialVersionUID = -8932739669037360188L;
	
	public static final String COLUMN_PPID_STR = "ppid";
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final Short STATUS_INIT_INT = 0;
	
	public static final Short STATUS_OPERATED_INT = 1;
	
	private Long pwpid;
	
	private Long ppid;
	
	private WorkplanPO workplan;
	
	private UserPO creater;
	
	private Timestamp createTime;
	
	private Short status;

	public ProductionWorkPlanPO() {
		super();
	}

	public ProductionWorkPlanPO(WorkplanPO workplan, UserPO creater) {
		super();
		this.workplan = workplan;
		this.creater = creater;
	}
	
	public ProductionWorkPlanPO(WorkplanPO workplan) {
		super();
		this.workplan = workplan;
	}
	@Id
	@GeneratedValue
	@Column(name="pwpid")
	public Long getPwpid() {
		return pwpid;
	}

	public void setPwpid(Long pwpid) {
		this.pwpid = pwpid;
	}
	
	@Column(name = "ppid")
	public Long getPpid() {
		return ppid;
	}

	public void setPpid(Long ppid) {
		this.ppid = ppid;
	}
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false ,name = "wpid", referencedColumnName="wpid")
	public WorkplanPO getWorkplan() {
		return workplan;
	}

	public void setWorkplan(WorkplanPO workplan) {
		this.workplan = workplan;
	}
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false ,name = "cuid", referencedColumnName="uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}
	
	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}
	@Column(name = "status")
	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}
	
	
	
}
