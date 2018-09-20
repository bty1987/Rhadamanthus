package com.fanglin.store.vo;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;

import org.apache.struts2.json.annotations.JSON;

public class MorderVO implements Serializable{

	private static final long serialVersionUID = 1482416278109134854L;

	private Long oid;
	 
	private String no;
	
	private String unionId;
	
	private String rmunionId;
	
	private CouponVO coupon;
	
	private Float total;
	
	private Timestamp createTime;
	
	private Timestamp paymentTime;
	
	private String address;
	
	private Short status;
	
	private List<MorderItemVO> items;

	public MorderVO() {
		super();
	}

	public MorderVO(CouponVO coupon) {
		super();
		this.coupon = coupon;
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

	public String getUnionId() {
		return unionId;
	}

	public void setUnionId(String unionId) {
		this.unionId = unionId;
	}

	public String getRmunionId() {
		return rmunionId;
	}

	public void setRmunionId(String rmunionId) {
		this.rmunionId = rmunionId;
	}

	public CouponVO getCoupon() {
		return coupon;
	}

	public void setCoupon(CouponVO coupon) {
		this.coupon = coupon;
	}

	public Float getTotal() {
		return total;
	}

	public void setTotal(Float total) {
		this.total = total;
	}

	@JSON(format="yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@JSON(format="yyyy-MM-dd HH:mm:ss")
	public Timestamp getPaymentTime() {
		return paymentTime;
	}

	public void setPaymentTime(Timestamp paymentTime) {
		this.paymentTime = paymentTime;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}
	
	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public List<MorderItemVO> getItems() {
		return items;
	}

	public void setItems(List<MorderItemVO> items) {
		this.items = items;
	}

}
