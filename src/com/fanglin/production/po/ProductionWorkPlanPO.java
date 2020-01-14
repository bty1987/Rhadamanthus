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
@Table(name = "productionworkplan", catalog = "production")
public class ProductionWorkPlanPO implements Serializable {

	private static final long serialVersionUID = -8932739669037360188L;

	public static final String COLUMN_PPID_STR = "ppid";

	public static final String COLUMN_WFID_STR = "workplan.wpid";

	public static final String COLUMN_STATUS_STR = "status";

	public static final Short STATUS_INIT_INT = 0;

	public static final Short STATUS_OPERATED_INT = 1;//执行
	
	public static final Short STATUS_COMPLETE_INT = 2;//完成

	public static final Short STATUS_INVALID_INT = 3;//删除
	
	public static final Short NUM_ONE_INT = 1;

	private Long pwpid;// 工序组ID

	private Long ppid;// 计划ID

	private WorkplanPO workplan;// 工序组类型

	private UserPO creater;// 创建人

	private Timestamp createTime;// 创建时间
	
	private Timestamp finishTime;//完结时间

	private Short status;//初始0, 已执行1, 完成2
	
	private Short sort;//排序

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
	@Column(name = "pwpid")
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
	@JoinColumn(nullable = false, name = "wpid", referencedColumnName = "wpid")
	public WorkplanPO getWorkplan() {
		return workplan;
	}

	public void setWorkplan(WorkplanPO workplan) {
		this.workplan = workplan;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "cuid", referencedColumnName = "uid")
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

	@Column(name = "finishTime")
	public Timestamp getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(Timestamp finishTime) {
		this.finishTime = finishTime;
	}

	@Column(name = "status")
	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	@Column(name = "sort")
	public Short getSort() {
		return sort;
	}

	public void setSort(Short sort) {
		this.sort = sort;
	}

}
