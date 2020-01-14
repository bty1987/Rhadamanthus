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
@Table(name = "tranpack", catalog = "production")
public class TranpackPO implements Serializable {

	private static final long serialVersionUID = -6568708993467178168L;

	public static final short STATUS_INIT_SHORT = 0;// 初始

	public static final short STATUS_INSTORE_SHORT = 1;// 入库
	
	public static final short STATUS_LOGISTICS_SHORT = 2;// 物流

	public static final short STATUS_TRANSPORT_SHORT = 3;// 运输

	public static final short STATUS_INSTALLATION_SHORT = 4;// 安装
	
	public static final short STATUS_COMPLETE_SHORT = 5;// 完成

	public static final short STATUS_LOSS_SHORT = 6;// 丢失

	public static final String COLUMN_PNO_STR = "pno";

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_TYPE_STR = "type";

	public static final String COLUMN_TNO_STR = "no";

	public static final short TYPE_OUTSOURCE_INT = 0;

	public static final short TYPE_HARDWARE_INT = 1;

	public static final short TYPE_PRODUCTIONPLAN_INT = 2;
	
	public static final String TIME_CREATE_STR = "createTime";
	
	public static final String TIME_PLAN_STR = "planTime";
	
	public static final String TIME_TRAN_STR = "tranTime";
	
	public static final String TIME_MOUNT_STR = "mountTime";
	
	public static final int COUNT_ONE_INT = 1;
	
	private long tid;
	
	private ProductionPO production;
	
	private String no;
	
	private long rid;
	
	private short type;
	
	private UserPO creater; 
	
	private UserPO sender;
	
	private UserPO mounter;
	
	private Timestamp createTime;
	
	private Timestamp planTime;
	
	private Timestamp tranTime;
	
	private Timestamp mountTime;
	
	private short status;
	
	public TranpackPO() {
		super();
	}

	public TranpackPO(ProductionPO production, UserPO creater, UserPO sender, UserPO mounter) {
		super();
		this.production = production;
		this.creater = creater;
		this.sender = sender;
		this.mounter = mounter;
	}

	public TranpackPO(ProductionPO production, UserPO creater) {
		super();
		this.production = production;
		this.creater = creater;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "tid")
	public long getTid() {
		return tid;
	}

	public void setTid(long tid) {
		this.tid = tid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "pid", referencedColumnName = "pid")
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

	@Column(name = "rid")
	public long getRid() {
		return rid;
	}

	public void setRid(long rid) {
		this.rid = rid;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "suid", referencedColumnName = "uid")
	public UserPO getSender() {
		return sender;
	}

	public void setSender(UserPO sender) {
		this.sender = sender;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "muid", referencedColumnName = "uid")
	public UserPO getMounter() {
		return mounter;
	}

	public void setMounter(UserPO mounter) {
		this.mounter = mounter;
	}
	
	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "planTime")
	public Timestamp getPlanTime() {
		return planTime;
	}

	public void setPlanTime(Timestamp planTime) {
		this.planTime = planTime;
	}

	@Column(name = "tranTime")
	public Timestamp getTranTime() {
		return tranTime;
	}

	public void setTranTime(Timestamp tranTime) {
		this.tranTime = tranTime;
	}

	@Column(name = "mountTime")
	public Timestamp getMountTime() {
		return mountTime;
	}

	public void setMountTime(Timestamp mountTime) {
		this.mountTime = mountTime;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}
}

