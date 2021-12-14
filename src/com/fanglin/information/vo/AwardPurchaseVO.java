package com.fanglin.information.vo;

import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class AwardPurchaseVO implements java.io.Serializable {
	
	private static final long serialVersionUID = -9114054458621965002L;

	private Long apId;
	
	private AwardStockVO awardStock;
	
	private Long inprice;
	
	private Long baprice;
	
	private Integer num;
	
	private UserBaseVO creater;
	
	private UserBaseVO purchaser;
	
	private UserBaseVO instorer;
	
	private Timestamp createTime;
	
	private Timestamp purchaseTime;
	
	private Timestamp instoreTime;
	
	private Timestamp balanceTime;
	
	private Short status;
	
	private Integer company;
	
	public AwardPurchaseVO() {
		super();
	}

	public AwardPurchaseVO(AwardStockVO awardStock, UserBaseVO creater, UserBaseVO purchaser, UserBaseVO instorer) {
		super();
		this.awardStock = awardStock;
		this.creater = creater;
		this.purchaser = purchaser;
		this.instorer = instorer;
	}
	
	
	public Long getApId() {
		return apId;
	}

	public void setApId(Long apId) {
		this.apId = apId;
	}

	public AwardStockVO getAwardStock() {
		return awardStock;
	}

	public void setAwardStock(AwardStockVO awardStock) {
		this.awardStock = awardStock;
	}

	public Long getInprice() {
		return inprice;
	}

	public void setInprice(Long inprice) {
		this.inprice = inprice;
	}

	public Long getBaprice() {
		return baprice;
	}

	public void setBaprice(Long baprice) {
		this.baprice = baprice;
	}

	public Integer getNum() {
		return num;
	}

	public void setNum(Integer num) {
		this.num = num;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	public UserBaseVO getPurchaser() {
		return purchaser;
	}

	public void setPurchaser(UserBaseVO purchaser) {
		this.purchaser = purchaser;
	}

	public UserBaseVO getInstorer() {
		return instorer;
	}

	public void setInstorer(UserBaseVO instorer) {
		this.instorer = instorer;
	}
	
	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getPurchaseTime() {
		return purchaseTime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public void setPurchaseTime(Timestamp purchaseTime) {
		this.purchaseTime = purchaseTime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getInstoreTime() {
		return instoreTime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public void setInstoreTime(Timestamp instoreTime) {
		this.instoreTime = instoreTime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getBalanceTime() {
		return balanceTime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public void setBalanceTime(Timestamp balanceTime) {
		this.balanceTime = balanceTime;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}
	
}
