package com.fanglin.production.po;

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

import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "hardware", catalog = "production")
public class HardwarePO implements Serializable {

	private static final long serialVersionUID = 7448276950774568288L;

	public static final short STATUS_INIT_SHORT = 0; // 初始

	public static final short STATUS_PURCHASE_SHORT = 1; // 采购

	public static final short STATUS_INSTORE_SHORT = 2; // 入库
	
	public static final short STATUS_FINISH_SHORT = 3; // 完结

	public static final short STATUS_FAILURE_SHORT = 4; // 失效

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_HID_STR = "hid";

	public static final String COLUMN_PID_STR = "production.pid";
	
	public static final String COLUMN_PNO_STR = "production.pno";
	
	public static final String COLUMN_NO_STR = "no";
	
	public static final String COLUMN_CREATE_STR = "createTime";
	
	public static final String COLUMN_ENDTIME_STR = "finishTime";

	private long hid;

	private ProductionPO production;
	
	private String no;
	
	private UserPO creater;
	
	private Timestamp createTime;
	
	private Timestamp finishTime;
	
	private int timeLimit;

	private short status;

	private String path;
	
	private String comment;
	
	private int company;
	
	

	public HardwarePO() {
		super();
	}
	
	public HardwarePO(long hid) {
		super();
		this.hid = hid;
	}

	public HardwarePO(ProductionPO production, UserPO creater) {
		super();
		this.production = production;
		this.creater = creater;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "hid")
	public long getHid() {
		return hid;
	}

	public void setHid(long hid) {
		this.hid = hid;
	}
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "pid", referencedColumnName = "pid")
	public ProductionPO getProduction() {
		return production;
	}

	public void setProduction(ProductionPO production) {
		this.production = production;
	}

	@Column(name = "no")
	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
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

	@Column(name = "path")
	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
	
	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
