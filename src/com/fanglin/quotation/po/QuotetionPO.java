package com.fanglin.quotation.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "quotetion", catalog = "quotetion")
public class QuotetionPO implements Serializable {

	private static final long serialVersionUID = -7574124519130135638L;

	private long qid;
	
	private String no;
	
	private String name;
	
	private String version;
	
	private long cuid;
	
	private Timestamp createTime;
	
	private float undisPrice;
	
	private float disPrice;
	
	private float discount;
	
	private float totalPrice;
	
	private String content;
	
	private float managePrice;
	
	private float manageRate;
	
	private float trafficPrice;
	
	private float trafficRate;
	
	public QuotetionPO() {
		super();
	}

	public QuotetionPO(long qid) {
		super();
		this.qid = qid;
	}

	@Id
	@GeneratedValue
	@Column(name = "qid")
	public long getQid() {
		return qid;
	}

	public void setQid(long qid) {
		this.qid = qid;
	}

	@Column(name = "no")
	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "version")
	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	@Column(name = "cuid")
	public long getCuid() {
		return cuid;
	}

	public void setCuid(long cuid) {
		this.cuid = cuid;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "undisPrice")
	public float getUndisPrice() {
		return undisPrice;
	}

	public void setUndisPrice(float undisPrice) {
		this.undisPrice = undisPrice;
	}
	
	@Column(name = "disPrice")
	public float getDisPrice() {
		return disPrice;
	}

	public void setDisPrice(float disPrice) {
		this.disPrice = disPrice;
	}

	@Column(name = "discount")
	public float getDiscount() {
		return discount;
	}
	
	public void setDiscount(float discount) {
		this.discount = discount;
	}

	@Column(name = "totalPrice")
	public float getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(float totalPrice) {
		this.totalPrice = totalPrice;
	}

	@Column(name = "content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@Column(name = "managePrice")
	public float getManagePrice() {
		return managePrice;
	}

	public void setManagePrice(float managePrice) {
		this.managePrice = managePrice;
	}

	@Column(name = "manageRate")
	public float getManageRate() {
		return manageRate;
	}

	public void setManageRate(float manageRate) {
		this.manageRate = manageRate;
	}

	@Column(name = "trafficPrice")
	public float getTrafficPrice() {
		return trafficPrice;
	}

	public void setTrafficPrice(float trafficPrice) {
		this.trafficPrice = trafficPrice;
	}

	@Column(name = "trafficRate")
	public float getTrafficRate() {
		return trafficRate;
	}

	public void setTrafficRate(float trafficRate) {
		this.trafficRate = trafficRate;
	}
	
	
}
