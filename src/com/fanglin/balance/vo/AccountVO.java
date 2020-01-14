package com.fanglin.balance.vo;

import java.sql.Timestamp;



import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class AccountVO implements java.io.Serializable {

	private static final long serialVersionUID = 701696245084630736L;
	
	private Long aid;
	
	private String name;
	
	private UserBaseVO belonger;
	
	private UserBaseVO creater;
	
	private Timestamp createTime;
	
	private Long referMoney;
	
	private Long realMoney;
	
	private Long money;
	
	private Long surplus;
	
	private Short type;
	
	private Short status;
	
	private Integer company;


	public AccountVO() {
		super();
	}

	public AccountVO(UserBaseVO belonger, UserBaseVO creater) {
		super();
		this.belonger = belonger;
		this.creater = creater;
	}

	public Long getAid() {
		return aid;
	}

	public void setAid(Long aid) {
		this.aid = aid;
	}

	public UserBaseVO getBelonger() {
		return belonger;
	}

	public void setBelonger(UserBaseVO belonger) {
		this.belonger = belonger;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public Long getReferMoney() {
		return referMoney;
	}

	public void setReferMoney(Long referMoney) {
		this.referMoney = referMoney;
	}

	public Long getRealMoney() {
		return realMoney;
	}

	public void setRealMoney(Long realMoney) {
		this.realMoney = realMoney;
	}

	public Long getMoney() {
		return money;
	}

	public void setMoney(Long money) {
		this.money = money;
	}

	public Long getSurplus() {
		return surplus;
	}

	public void setSurplus(Long surplus) {
		this.surplus = surplus;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}


	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}
	
	

}
