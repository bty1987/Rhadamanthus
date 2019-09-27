package com.fanglin.sales.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class SalesBalanceVO implements Serializable{

	private static final long serialVersionUID = 8746688072267319344L;
	
	private Long sbid;
	
	private SalesVO sales;
	
	private RefundsVO refunds;
	
	private UserBaseVO creater;
	
	private Timestamp createTime;
	
	private UserBaseVO poster;
	
	private Timestamp postTime;
	
	private Timestamp venderTime;
	
	private Long allowance;
	
	private Long total;
	
	private Long balance;
	
	private Long difference;
	
	private Long vbalance;
	
	private Long pbalance;
	
	private Short type;
	
	private Short onetype;
	
	private Short status;
	
	private String comment;

	public SalesBalanceVO() {
		super();
	}

	public SalesBalanceVO(SalesVO sales, RefundsVO refunds, UserBaseVO creater,
			UserBaseVO poster) {
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

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}
	
	@JSON(format="yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public UserBaseVO getPoster() {
		return poster;
	}

	public void setPoster(UserBaseVO poster) {
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
	
	public Long getAllowance() {
		return allowance;
	}
	
	public void setAllowance(Long allowance) {
		this.allowance = allowance;
	}

	public Long getTotal() {
		return total;
	}

	public void setTotal(Long total) {
		this.total = total;
	}

	public Long getBalance() {
		return balance;
	}

	public void setBalance(Long balance) {
		this.balance = balance;
	}

	public Long getDifference() {
		return difference;
	}

	public void setDifference(Long difference) {
		this.difference = difference;
	}

	public Long getVbalance() {
		return vbalance;
	}

	public void setVbalance(Long vbalance) {
		this.vbalance = vbalance;
	}

	public Long getPbalance() {
		return pbalance;
	}

	public void setPbalance(Long pbalance) {
		this.pbalance = pbalance;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}
	
	public Short getOnetype() {
		return onetype;
	}
	
	public void setOnetype(Short onetype) {
		this.onetype = onetype;
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
