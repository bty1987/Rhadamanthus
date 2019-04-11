package com.fanglin.quotation.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

public class QuotetionVO implements Serializable {

	private static final long serialVersionUID = -8617663702337964395L;

	private Long qid;
	
	private String no;
	
	private String name;
	
	private String version;
	
	private Long cuid;
	
	private Timestamp createTime;
	
	private Float undisPrice;
	
	private Float disPrice;
	
	private Float discount;
	
	private Float totalPrice;
	
	private String content;
	
	private Float managePrice;
	
	private Float manageRate;
	
	private Float trafficPrice;
	
	private Float trafficRate;
	
	private Float basePrice;

	public Long getQid() {
		return qid;
	}

	public void setQid(Long qid) {
		this.qid = qid;
	}

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	public Long getCuid() {
		return cuid;
	}

	public void setCuid(Long cuid) {
		this.cuid = cuid;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public Float getUndisPrice() {
		return undisPrice;
	}

	public void setUndisPrice(Float undisPrice) {
		this.undisPrice = undisPrice;
	}

	public Float getDisPrice() {
		return disPrice;
	}

	public void setDisPrice(Float disPrice) {
		this.disPrice = disPrice;
	}

	public Float getDiscount() {
		return discount;
	}

	public void setDiscount(Float discount) {
		this.discount = discount;
	}

	public Float getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(Float totalPrice) {
		this.totalPrice = totalPrice;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Float getManagePrice() {
		return managePrice;
	}

	public void setManagePrice(Float managePrice) {
		this.managePrice = managePrice;
	}

	public Float getManageRate() {
		return manageRate;
	}

	public void setManageRate(Float manageRate) {
		this.manageRate = manageRate;
	}

	public Float getTrafficPrice() {
		return trafficPrice;
	}

	public void setTrafficPrice(Float trafficPrice) {
		this.trafficPrice = trafficPrice;
	}

	public Float getTrafficRate() {
		return trafficRate;
	}

	public void setTrafficRate(Float trafficRate) {
		this.trafficRate = trafficRate;
	}

	public Float getBasePrice() {
		return basePrice;
	}

	public void setBasePrice(Float basePrice) {
		this.basePrice = basePrice;
	}
}
