package com.fanglin.store.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

public class MorderVO implements Serializable{

	private static final long serialVersionUID = 1482416278109134854L;

	private Long oid;
	 
	private String no;
	
	private MuserVO muser;
	
	private AddressVO address;
	
	private Float total;
	
	private Timestamp createTime;
	
	private Timestamp paymentTime;
	
	private Short status;

	public MorderVO() {
		super();
	}

	public MorderVO(MuserVO muser, AddressVO address) {
		super();
		this.muser = muser;
		this.address = address;
	}

	public Long getOid() {
		return oid;
	}

	public void setOid(Long oid) {
		this.oid = oid;
	}

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public MuserVO getMuser() {
		return muser;
	}

	public void setMuser(MuserVO muser) {
		this.muser = muser;
	}

	public AddressVO getAddress() {
		return address;
	}

	public void setAddress(AddressVO address) {
		this.address = address;
	}

	public Float getTotal() {
		return total;
	}

	public void setTotal(Float total) {
		this.total = total;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getPaymentTime() {
		return paymentTime;
	}

	public void setPaymentTime(Timestamp paymentTime) {
		this.paymentTime = paymentTime;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}
	
}
