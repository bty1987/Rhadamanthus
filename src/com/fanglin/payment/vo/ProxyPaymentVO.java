package com.fanglin.payment.vo;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.core.vo.Filter;
import com.fanglin.personel.vo.UserBaseVO;

public class ProxyPaymentVO implements Serializable {

	private static final long serialVersionUID = 4936451514123661414L;

	private Long ppid;

	private ProxyReceiptVO proxyReceipt;

	private String title;

	private String name;

	private String phone;

	private String address;

	private String unionId;

	private String orderId;

	private Long referMoney;

	private UserBaseVO creater;

	private Timestamp createTime;

	private Integer did;

	private Integer rid;

	private Short type;

	private Short status;

	private Short isexpire;

	private Integer company;

	public ProxyPaymentVO() {
		super();
	}

	public ProxyPaymentVO(ProxyReceiptVO proxyReceipt, UserBaseVO creater) {
		super();
		this.proxyReceipt = proxyReceipt;
		this.creater = creater;
	}

	public Long getPpid() {
		return ppid;
	}

	public void setPpid(Long ppid) {
		this.ppid = ppid;
	}

	public ProxyReceiptVO getProxyReceipt() {
		return proxyReceipt;
	}

	public void setProxyReceipt(ProxyReceiptVO proxyReceipt) {
		this.proxyReceipt = proxyReceipt;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getUnionId() {
		return unionId;
	}

	public void setUnionId(String unionId) {
		this.unionId = unionId;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Long getReferMoney() {
		return referMoney;
	}

	public void setReferMoney(Long referMoney) {
		this.referMoney = referMoney;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public Integer getDid() {
		return did;
	}

	public void setDid(Integer did) {
		this.did = did;
	}

	public Integer getRid() {
		return rid;
	}

	public void setRid(Integer rid) {
		this.rid = rid;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Short getIsexpire() {
		return isexpire;
	}

	public void setIsexpire(Short isexpire) {
		this.isexpire = isexpire;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

	public ProxyPaymentVO filter(List<Filter> filters) {

		if (getStatus() != null) {
			filters.add(new Filter("status", String.valueOf(getStatus()), "eq"));
		}

		return this;
	}

}