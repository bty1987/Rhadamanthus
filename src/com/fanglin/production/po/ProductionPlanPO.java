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
@Table(name = "productionplan", catalog = "production")
public class ProductionPlanPO implements Serializable {

	private static final long serialVersionUID = 6565378267211756040L;

	public static final short STATUS_CREATE_INT = 0;//初始

	public static final short STATUS_FINISH_INT = 1;//完结
	
	public static final String COLUMN_PID_STR = "production.pid";
	
	public static final String COLUMN_COMPANY_STR = "company";

	public static final String COLUMN_NO_STR = "no";

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_STRATTIME_STR = "createTime";

	public static final String COLUMN_ENDTIME_STR = "finishTime";
	
	public static final String COLUMN_PNO_STR = "pno";
	
	public static final String COLUMN_PRODUCTIONPNO_STR = "production.pno";
	
	private long ppid;// 计划ID

	private ProductionPO production;// 生产单

	private String no;// 计划单编号

	private String path;// 路径
	
	private UserPO creater;// 创建人

	private Timestamp createTime;// 创建时间

	private Timestamp finishTime;// 完成时间
	
	private int timeLimit;// 工期

	private short status;// 状态 0: 初始, 1: 完结
	
	private int company;// 公司

	private String comment;// 备注

	public ProductionPlanPO() {
		super();
	}

	public ProductionPlanPO(long ppid) {
		super();
		this.ppid = ppid;
	}
	
	public ProductionPlanPO(ProductionPO production, UserPO creater) {
		super();
		this.production = production;
		this.creater = creater;
	}

	@Id
	@GeneratedValue
	@Column(name = "ppid")
	public long getPpid() {
		return ppid;
	}

	public void setPpid(long ppid) {
		this.ppid = ppid;
	}
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "pid", referencedColumnName = "pid")
	public ProductionPO getProduction() {
		return production;
	}

	public void setProduction(ProductionPO production) {
		this.production = production;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
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

	@Column(name = "timeLimit")
	public int getTimeLimit() {
		return timeLimit;
	}

	public void setTimeLimit(int timeLimit) {
		this.timeLimit = timeLimit;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}
	
	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
}
