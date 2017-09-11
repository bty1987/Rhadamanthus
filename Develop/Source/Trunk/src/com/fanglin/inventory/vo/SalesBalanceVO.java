package com.fanglin.inventory.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserVO;

public class SalesBalanceVO implements Serializable{

	private static final long serialVersionUID = 8746688072267319344L;
	
	private Long sbid;
	
	private SalesVO sales;
	
	private RefundsVO refunds;
	
	private UserVO creater;
	
	private Timestamp createTime;
	
	private UserVO poster;
	
	private Timestamp postTime;
	
	private Timestamp venderTime;
	
	private Float total;
	
	private Float balance;
	
	private Float difference;
	
	private Float vbalance;
	
	private Float pbalance;
	
	private Short type;
	
	private Short status;
	
	private String comment;

	public SalesBalanceVO() {
		super();
	}

	public SalesBalanceVO(SalesVO sales, RefundsVO refunds, UserVO creater,
			UserVO poster) {
		super();
		this.sales = sales;
		this.refunds = refunds;
		this.creater = creater;
		this.poster = poster;
	}

	public Long getSbid() {
		return sbid;
	}

	public void setSbid(Long sbid) {
		this.sbid = sbid;
	}

	public SalesVO getSales() {
		return sales;
	}

	public void setSales(SalesVO sales) {
		this.sales = sales;
	}

	public RefundsVO getRefunds() {
		return refunds;
	}

	public void setRefunds(RefundsVO refunds) {
		this.refunds = refunds;
	}

	public UserVO getCreater() {
		return creater;
	}

	public void setCreater(UserVO creater) {
		this.creater = creater;
	}
	
	@JSON(format="yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public UserVO getPoster() {
		return poster;
	}

	public void setPoster(UserVO poster) {
		this.poster = poster;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getPostTime() {
		return postTime;
	}

	public void setPostTime(Timestamp postTime) {
		this.postTime = postTime;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getVenderTime() {
		return venderTime;
	}

	public void setVenderTime(Timestamp venderTime) {
		this.venderTime = venderTime;
	}

	public Float getTotal() {
		return total;
	}

	public void setTotal(Float total) {
		this.total = total;
	}

	public Float getBalance() {
		return balance;
	}

	public void setBalance(Float balance) {
		this.balance = balance;
	}

	public Float getDifference() {
		return difference;
	}

	public void setDifference(Float difference) {
		this.difference = difference;
	}

	public Float getVbalance() {
		return vbalance;
	}

	public void setVbalance(Float vbalance) {
		this.vbalance = vbalance;
	}

	public Float getPbalance() {
		return pbalance;
	}

	public void setPbalance(Float pbalance) {
		this.pbalance = pbalance;
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

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
	
}
