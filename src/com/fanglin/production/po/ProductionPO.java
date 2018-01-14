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
import static javax.persistence.GenerationType.IDENTITY;

import com.fanglin.data.po.HousePO;
import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "production",catalog = "production")
public class ProductionPO implements Serializable{

	private static final long serialVersionUID = 5030560348335871591L;
	
	public static final String COLUMN_COMPANY_STR = "company";
	
	public static final String COLUMN_PNO_STR = "pno";
	
	public static final String COLUMN_ORDERID_STR = "orderId";
	
	public static final String COLUMN_STATUS_STR = "status";

	public static final short  STATUS_INIT_SHORT = 0;//初始
	
	public static final short  STATUS_SIGNED_SHORT = 1;//签约
	
	public static final short  STATUS_CONFIRM_SHORT = 2;//已审核
	
	public static final short  STATUS_PRODUCT_SHORT = 3;//生产
	
	public static final short  STATUS_DESTORY_SHORT = 4;//废单
	
	public static final short  STATUS_END_SHORT = 5;//完结
	
	public static final short  DELIVERSTATUS_UNDELIVER_SHORT = 0;//未送货
	
	public static final short  DELIVERSTATUS_DELIVERED_SHORT = 1;//已送货
	
	public static final short  TYPE_PRODUCTION_SHORT = 0;//生产单
	
	public static final short  TYPE_AFTERSERVICE_SHORT = 1;//售后单
	
	private long pid;
	
	private long orderId;
	
	private String pno;
	
	private HousePO house;
	
	private float total;
	
	private UserPO creater;
	
	private UserPO designer;
	
	private short status;
	
	private Timestamp createTime; 
	
	private Timestamp divideTime; 
	
	private Timestamp confirmTime;
	
	private short diliverystatus; 
	
	private Timestamp diliveryTime; 
	
	private float timeLimit;
	
	private String spid;
	
	private short type;
	
	private int company;
	
	public ProductionPO(){
		super();
	}
	
	public ProductionPO(HousePO house, UserPO creater, UserPO designer) {
		super();
		this.house = house;
		this.creater = creater;
		this.designer = designer;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name="pid")
	public long getPid() {
		return pid;
	}

	public void setPid(long pid) {
		this.pid = pid;
	}

	@Column(name="orderId")
	public long getOrderId() {
		return orderId;
	}

	public void setOrderId(long orderId) {
		this.orderId = orderId;
	}
	
	@Column(name="pno")
	public String getPno() {
		return pno;
	}

	public void setPno(String pno) {
		this.pno = pno;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "hid", referencedColumnName = "hid")
	public HousePO getHouse() {
		return house;
	}

	public void setHouse(HousePO house) {
		this.house = house;
	}

	@Column(name="total")
	public float getTotal() {
		return total;
	}

	public void setTotal(float total) {
		this.total = total;
	}
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "duid", referencedColumnName = "uid")
	public UserPO getDesigner() {
		return designer;
	}

	public void setDesigner(UserPO designer) {
		this.designer = designer;
	}

	
	@Column(name="status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name="createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name="divideTime")
	public Timestamp getDivideTime() {
		return divideTime;
	}

	public void setDivideTime(Timestamp divideTime) {
		this.divideTime = divideTime;
	}

	@Column(name="diliverystatus")
	public short getDiliverystatus() {
		return diliverystatus;
	}

	public void setDiliverystatus(short diliverystatus) {
		this.diliverystatus = diliverystatus;
	}

	@Column(name="diliveryTime")
	public Timestamp getDiliveryTime() {
		return diliveryTime;
	}

	public void setDiliveryTime(Timestamp diliveryTime) {
		this.diliveryTime = diliveryTime;
	}

	@Column(name="timeLimit")
	public float getTimeLimit() {
		return timeLimit;
	}

	public void setTimeLimit(float timeLimit) {
		this.timeLimit = timeLimit;
	}

	@Column(name="spid")
	public String getSpid() {
		return spid;
	}

	public void setSpid(String spid) {
		this.spid = spid;
	}

	@Column(name="type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name="company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	@Column(name="confirmTime")
	public Timestamp getConfirmTime() {
		return confirmTime;
	}

	public void setConfirmTime(Timestamp confirmTime) {
		this.confirmTime = confirmTime;
	}

	
}
