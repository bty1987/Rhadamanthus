/**
 * @File Name		: QuotationVersionPO.java
 * @Package   	: com.fanglin.entity
 * @Version		: 1.0
 * @Date			: 2014-7-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.po;

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

import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "decorationbelong", catalog = "decoration")
public class DecorationBelongPO implements Serializable {

	private static final long serialVersionUID = 11111344461146L;

	public static final Short BELONGTYPE_DESIGN_INT = 0;	
	
	public static final Short BELONGTYPE_SALESMAN_INT = 1;	
	
	public static final Short STATUS_INVALID_INT = 0;		
	
	public static final Short STATUS_EFFCTIVE_INT = 1;		
	
	public static final Short DEFAULTFLAG_TRUE_INT = 1;
	
	public static final Short DEFAULTFLAG_FALSE_INT = 0;

	private long dbid;
	
	private String orderId;
	
	private short type;
	
	private UserPO belonger;
	
	private DepartmentPO department;
	
	private DepartmentPO region;
	
	private float rate;
	
	private UserPO operater;
	
	private Timestamp operateTime;
	
	private short status;
	
	private short defaultFlag;

	@Id
	@GeneratedValue
	@Column(name = "dbid")
	public long getDbid() {
		return dbid;
	}

	public void setDbid(long dbid) {
		this.dbid = dbid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@JoinColumn(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "buid", referencedColumnName = "uid")
	public UserPO getBelonger() {
		return belonger;
	}

	public void setBelonger(UserPO belonger) {
		this.belonger = belonger;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "did", referencedColumnName = "did")
	public DepartmentPO getDepartment() {
		return department;
	}

	public void setDepartment(DepartmentPO department) {
		this.department = department;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn( name = "rid", referencedColumnName = "did")
	public DepartmentPO getRegion() {
		return region;
	}

	public void setRegion(DepartmentPO region) {
		this.region = region;
	}

	
	@JoinColumn(name = "rate")
	public float getRate() {
		return rate;
	}

	public void setRate(float rate) {
		this.rate = rate;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "ouid", referencedColumnName = "uid")
	public UserPO getOperater() {
		return operater;
	}

	public void setOperater(UserPO operater) {
		this.operater = operater;
	}

	
	public Timestamp getOperateTime(){
		return operateTime;
	}

	public void setOperateTime(Timestamp operateTime){
		this.operateTime = operateTime;
	}

	public short getStatus(){
		return status;
	}

	public void setStatus(short status){
		this.status = status;
	}
	
	public void setDefaultFlag(short defaultFlag){
		this.defaultFlag = defaultFlag;
	}

	public short getDefaultFlag(){
		return defaultFlag;
	}
	
}
