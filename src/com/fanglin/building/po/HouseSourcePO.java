package com.fanglin.building.po;

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

import com.fanglin.communion.po.CustomerPO;
import com.fanglin.communion.po.HousePO;
import com.fanglin.personel.po.UserPO;

@Entity
@Table(name="houseSource", catalog = "building")
public class HouseSourcePO implements Serializable{

	private static final long serialVersionUID = -4319485351492418004L;
	
	public static final String COLUMN_HSID_STR = "hsid";
	
	public static final String COLUMN_HID_STR = "house.hid";
	
	public static final String COLUMN_CID_STR = "customer.cid";
	
	public static final String COLUMN_NO_STR = "no";
	
	public static final String COLUMN_TYPE_STR = "type";
	
	public static final short STATUS_INIT_SHORT = 0;
	
	public static final short STATUS_SIGN_SHORT = 1;
	
	public static final short STATUS_DISABLE_SHORT = 1;
	
	private long hsid;
	
	private String no;
	
	private short type;
	
	private short sourceType;
	
	private HousePO house;
	
	private CustomerPO customer;
	
	private String deedNum;
	
	private float deedValue;
	
	private float unitPrice;
	
	private float totalPrice;
	
	private Timestamp decorateTime;
	
	private short decorateDegree;
	
	private short discussType;
	
	private short rentType;
	
	private String indoores;
	
	private String history;
	
	private float propertyFee;
	
	private short elevator;
	
	private short onlyHousing;
	
	private Timestamp documentsDate;
	
	private short allowLoan;
	
	private short beingLoan;
	
	private String checkingTime;
	
	private UserPO create;
	
	private Timestamp createTime;
	
	private UserPO followUser;
	
	private String housingGrade;
	
	private short status;
	
	private String path;
	
	private String comment;
	
	public HouseSourcePO() {
		super();
	}
	
	public HouseSourcePO(HousePO house, CustomerPO customer, UserPO create, UserPO followUser) {
		super();
		this.house = house;
		this.customer = customer;
		this.create = create;
		this.followUser = followUser;
	}
	
	@Id
	@GeneratedValue
	@Column(name="hsid")
	public long getHsid() {
		return hsid;
	}

	public void setHsid(long hsid) {
		this.hsid = hsid;
	}
	
	@Column(name="no")
	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	@Column(name="type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name="sourceType")
	public short getSourceType() {
		return sourceType;
	}

	public void setSourceType(short sourceType) {
		this.sourceType = sourceType;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "hid", referencedColumnName="hid")
	public HousePO getHouse() {
		return house;
	}

	public void setHouse(HousePO house) {
		this.house = house;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cid", referencedColumnName="cid")
	public CustomerPO getCustomer() {
		return customer;
	}

	public void setCustomer(CustomerPO customer) {
		this.customer = customer;
	}

	@Column(name="deedNum")
	public String getDeedNum() {
		return deedNum;
	}

	public void setDeedNum(String deedNum) {
		this.deedNum = deedNum;
	}

	@Column(name="deedValue")
	public float getDeedValue() {
		return deedValue;
	}

	public void setDeedValue(float deedValue) {
		this.deedValue = deedValue;
	}

	@Column(name="unitPrice")
	public float getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(float unitPrice) {
		this.unitPrice = unitPrice;
	}

	@Column(name="totalPrice")
	public float getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(float totalPrice) {
		this.totalPrice = totalPrice;
	}

	@Column(name="decorateTime")
	public Timestamp getDecorateTime() {
		return decorateTime;
	}

	public void setDecorateTime(Timestamp decorateTime) {
		this.decorateTime = decorateTime;
	}

	@Column(name="decorateDegree")
	public short getDecorateDegree() {
		return decorateDegree;
	}

	public void setDecorateDegree(short decorateDegree) {
		this.decorateDegree = decorateDegree;
	}

	@Column(name="discussType")
	public short getDiscussType() {
		return discussType;
	}

	public void setDiscussType(short discussType) {
		this.discussType = discussType;
	}

	@Column(name="rentType")
	public short getRentType() {
		return rentType;
	}

	public void setRentType(short rentType) {
		this.rentType = rentType;
	}

	@Column(name="indoores")
	public String getIndoores() {
		return indoores;
	}

	public void setIndoores(String indoores) {
		this.indoores = indoores;
	}

	@Column(name="history")
	public String getHistory() {
		return history;
	}

	public void setHistory(String history) {
		this.history = history;
	}

	@Column(name="propertyFee")
	public float getPropertyFee() {
		return propertyFee;
	}

	public void setPropertyFee(float propertyFee) {
		this.propertyFee = propertyFee;
	}

	@Column(name="elevator")
	public short getElevator() {
		return elevator;
	}

	public void setElevator(short elevator) {
		this.elevator = elevator;
	}

	@Column(name="onlyHousing")
	public short getOnlyHousing() {
		return onlyHousing;
	}

	public void setOnlyHousing(short onlyHousing) {
		this.onlyHousing = onlyHousing;
	}

	@Column(name="documentsDate")
	public Timestamp getDocumentsDate() {
		return documentsDate;
	}

	public void setDocumentsDate(Timestamp documentsDate) {
		this.documentsDate = documentsDate;
	}

	@Column(name="allowLoan")
	public short getAllowLoan() {
		return allowLoan;
	}

	public void setAllowLoan(short allowLoan) {
		this.allowLoan = allowLoan;
	}

	@Column(name="beingLoan")
	public short getBeingLoan() {
		return beingLoan;
	}

	public void setBeingLoan(short beingLoan) {
		this.beingLoan = beingLoan;
	}

	@Column(name="checkingTime")
	public String getCheckingTime() {
		return checkingTime;
	}

	public void setCheckingTime(String checkingTime) {
		this.checkingTime = checkingTime;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cuid", referencedColumnName="uid")
	public UserPO getCreate() {
		return create;
	}

	public void setCreate(UserPO create) {
		this.create = create;
	}

	@Column(name="createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "fuid", referencedColumnName="uid")
	public UserPO getFollowUser() {
		return followUser;
	}

	public void setFollowUser(UserPO followUser) {
		this.followUser = followUser;
	}

	@Column(name="housingGrade")
	public String getHousingGrade() {
		return housingGrade;
	}

	public void setHousingGrade(String housingGrade) {
		this.housingGrade = housingGrade;
	}

	@Column(name="status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name="path")
	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	@Column(name="comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
	
}
