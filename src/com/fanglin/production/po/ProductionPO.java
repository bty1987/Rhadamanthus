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

import com.fanglin.communion.po.BrandPO;
import com.fanglin.communion.po.HousePO;
import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "production", catalog = "production")
public class ProductionPO implements Serializable {

	private static final long serialVersionUID = 5030560348335871591L;

	public static final String COLUMN_COMPANY_STR = "company";

	public static final String COLUMN_PNO_STR = "pno";
	
	public static final String COLUMN_TYPE_STR = "type";

	public static final String COLUMN_ORDERID_STR = "orderId";

	public static final String COLUMN_STATUS_STR = "status";

	public static final short STATUS_SIGNED_SHORT = 1;// 签约

	public static final short STATUS_CONFIRM_SHORT = 2;// 已审核

	public static final short STATUS_PRODUCT_SHORT = 3;// 生产

	public static final short STATUS_DESTORY_SHORT = 4;// 废单

	public static final short STATUS_END_SHORT = 5;// 完结
	
	public static final short STATUS_INIT_SHORT = 0;// 初始
	
	public static final short STATUS_DESIGN_SHORT = 1;// 设计状态
	
	public static final short STATUS_SPLIT_SHORT = 2;// 生产状态
	
	public static final short STATUS_INSTORE_SHORT = 3;// 入库状态
	
	public static final short STATUS_PLAN_SHORT = 4;// 物流状态
	
	public static final short STATUS_TRANSPORT_SHORT = 5;// 运输状态
	
	public static final short STATUS_MOUNT_SHORT = 6;// 安装状态
	
	public static final short STATUS_COMPLETE_SHORT = 7;// 完成状态
	
	public static final short STATUS_UPHOLD_SHORT = 8;// 售后状态
	
	public static final short STATUS_FINISH_SHORT = 9;// 完结状态
	
	public static final short STATUS_TERMINAL_SHORT = 10;// 废单状态

	public static final short DELIVERSTATUS_UNDELIVER_SHORT = 0;// 未送货

	public static final short DELIVERSTATUS_DELIVERED_SHORT = 1;// 已送货

	public static final short TYPE_PRODUCTION_SHORT = 0;// 生产单

	public static final short TYPE_AFTERSERVICE_SHORT = 1;// 售后单
	
	private long pid;// 生产单ID
	
	private String spid;// 父级生产单

	private String orderId;// 装修单号

	private String pno;// 生产单号

	private HousePO house;// 房产
	
	private BrandPO brand; //品牌
	
	private UserPO creater;// 创建人
	
	private UserPO salesman;//销售员

	private UserPO designer;// 设计师
	
	private UserPO spliter;// 拆单员

	private Timestamp createTime;// 创建时间
	
	private Timestamp designTime;// 设计时间

	private Timestamp divideTime;// 生产时间
	
	private Timestamp storeTime;// 入库时间
	
	private Timestamp planTime;// 物流时间
	
	private Timestamp tranTime;//运输时间
	
	private Timestamp mountTime;// 安装时间
	
	private Timestamp finishTime;// 完结时间
	
	private Timestamp updateTime;// 更新时间

	private int timeLimit;// 工期
	
	private short status;// 状态

	private short type;// 类型

	private int company;// 公司
	
	private long total;// 总价

	public ProductionPO() {
		super();
	}

	public ProductionPO(HousePO house, UserPO creater, UserPO salesman, UserPO designer, UserPO spliter) {
		super();
		this.house = house;
		this.creater = creater;
		this.salesman = salesman;
		this.designer = designer;
		this.spliter = spliter;
	}

	public ProductionPO(HousePO house, UserPO creater, UserPO salesman, UserPO designer) {
		super();
		this.house = house;
		this.creater = creater;
		this.salesman = salesman;
		this.designer = designer;
	}

	public ProductionPO(HousePO house, BrandPO brand, UserPO creater, UserPO salesman, UserPO designer, UserPO spliter) {
		super();
		this.house = house;
		this.brand = brand;
		this.creater = creater;
		this.salesman = salesman;
		this.designer = designer;
		this.spliter = spliter;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "pid")
	public long getPid() {
		return pid;
	}

	public void setPid(long pid) {
		this.pid = pid;
	}
	
	@Column(name = "spid")
	public String getSpid() {
		return spid;
	}

	public void setSpid(String spid) {
		this.spid = spid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "pno")
	public String getPno() {
		return pno;
	}

	public void setPno(String pno) {
		this.pno = pno;
	}
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "hid", referencedColumnName = "hId")
	public HousePO getHouse() {
		return house;
	}

	public void setHouse(HousePO house) {
		this.house = house;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "cuid", referencedColumnName = "uId")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "duid", referencedColumnName = "uId")
	public UserPO getDesigner() {
		return designer;
	}

	public void setDesigner(UserPO designer) {
		this.designer = designer;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "xuid", referencedColumnName = "uId")
	public UserPO getSalesman() {
		return salesman;
	}

	public void setSalesman(UserPO salesman) {
		this.salesman = salesman;
	}
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "suid", referencedColumnName = "uId")
	public UserPO getSpliter() {
		return spliter;
	}

	public void setSpliter(UserPO spliter) {
		this.spliter = spliter;
	}
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "bid", referencedColumnName = "bid")
	public BrandPO getBrand() {
		return brand;
	}

	public void setBrand(BrandPO brand) {
		this.brand = brand;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "divideTime")
	public Timestamp getDivideTime() {
		return divideTime;
	}

	public void setDivideTime(Timestamp divideTime) {
		this.divideTime = divideTime;
	}

	@Column(name = "designTime")
	public Timestamp getDesignTime() {
		return designTime;
	}

	public void setDesignTime(Timestamp designTime) {
		this.designTime = designTime;
	}
	
	@Column(name = "storeTime")
	public Timestamp getStoreTime() {
		return storeTime;
	}

	public void setStoreTime(Timestamp storeTime) {
		this.storeTime = storeTime;
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

	@Column(name = "finishTime")
	public Timestamp getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(Timestamp finishTime) {
		this.finishTime = finishTime;
	}

	@Column(name = "updateTime")
	public Timestamp getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Timestamp updateTime) {
		this.updateTime = updateTime;
	}

	@Column(name = "timeLimit")
	public int getTimeLimit() {
		return timeLimit;
	}

	public void setTimeLimit(int timeLimit) {
		this.timeLimit = timeLimit;
	}
	
	@Column(name = "total")
	public long getTotal() {
		return total;
	}

	public void setTotal(long total) {
		this.total = total;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
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
    
}
