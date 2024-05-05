package com.fanglin.information.vo;

import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class AwardPurchaseVO implements java.io.Serializable {

	private static final long serialVersionUID = -9114054458621965002L;

	private Long apid;

	private Long fapid;

	private AwardStockVO awardStock;

	private Integer inprice;

	private Integer baprice;

	private Integer num;

	private Integer surplus;

	private UserBaseVO creater;

	private UserBaseVO purchaser;

	private UserBaseVO instorer;

	private String activity;

	private String dept;

	private String comment;

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

	public Long getApid() {
		return apid;
	}

	public void setApid(Long apid) {
		this.apid = apid;
	}

	public Long getFapid() {
		return fapid;
	}

	public void setFapid(Long fapid) {
		this.fapid = fapid;
	}

	public AwardStockVO getAwardStock() {
		return awardStock;
	}

	public void setAwardStock(AwardStockVO awardStock) {
		this.awardStock = awardStock;
	}

	public Integer getInprice() {
		return inprice;
	}

	public void setInprice(Integer inprice) {
		this.inprice = inprice;
	}

	public Integer getBaprice() {
		return baprice;
	}

	public void setBaprice(Integer baprice) {
		this.baprice = baprice;
	}

	public Integer getNum() {
		return num;
	}

	public void setNum(Integer num) {
		this.num = num;
	}

	public Integer getSurplus() {
		return surplus;
	}

	public void setSurplus(Integer surplus) {
		this.surplus = surplus;
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

	public String getActivity() {
		return activity;
	}

	public void setActivity(String activity) {
		this.activity = activity;
	}

	public String getDept() {
		return dept;
	}

	public void setDept(String dept) {
		this.dept = dept;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getPurchaseTime() {
		return purchaseTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public void setPurchaseTime(Timestamp purchaseTime) {
		this.purchaseTime = purchaseTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getInstoreTime() {
		return instoreTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public void setInstoreTime(Timestamp instoreTime) {
		this.instoreTime = instoreTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getBalanceTime() {
		return balanceTime;
	}

	@JSON(format = "yyyy-MM-dd")
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
