package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class CustomerUserRuleVO implements Serializable {

	private static final long serialVersionUID = 6181887987054226386L;

	private Long curid;

	private UserBaseVO user;

	private String period;

	private Integer measureNum;

	private Integer contractNum;

	private Integer contractPrice;

	private Integer materialPrice;

	private Integer designPrice;

	private Integer score;

	private Integer rank;

	private Integer chance;

	private Integer surplus;

	private Integer polling;

	private UserBaseVO creater;

	private Timestamp createTime;

	private Timestamp finishTime;

	private Short status;

	private Integer company;

	public CustomerUserRuleVO() {
		super();
	}

	public CustomerUserRuleVO(UserBaseVO user, UserBaseVO creater) {
		super();
		this.user = user;
		this.creater = creater;
	}

	public Long getCurid() {
		return curid;
	}

	public void setCurid(Long curid) {
		this.curid = curid;
	}

	public UserBaseVO getUser() {
		return user;
	}

	public void setUser(UserBaseVO user) {
		this.user = user;
	}

	public String getPeriod() {
		return period;
	}

	public void setPeriod(String period) {
		this.period = period;
	}

	public Integer getMeasureNum() {
		return measureNum;
	}

	public void setMeasureNum(Integer measureNum) {
		this.measureNum = measureNum;
	}

	public Integer getContractNum() {
		return contractNum;
	}

	public void setContractNum(Integer contractNum) {
		this.contractNum = contractNum;
	}

	public Integer getContractPrice() {
		return contractPrice;
	}

	public void setContractPrice(Integer contractPrice) {
		this.contractPrice = contractPrice;
	}

	public Integer getMaterialPrice() {
		return materialPrice;
	}

	public void setMaterialPrice(Integer materialPrice) {
		this.materialPrice = materialPrice;
	}

	public Integer getDesignPrice() {
		return designPrice;
	}

	public void setDesignPrice(Integer designPrice) {
		this.designPrice = designPrice;
	}

	public Integer getScore() {
		return score;
	}

	public void setScore(Integer score) {
		this.score = score;
	}

	public Integer getRank() {
		return rank;
	}

	public void setRank(Integer rank) {
		this.rank = rank;
	}

	public Integer getChance() {
		return chance;
	}

	public void setChance(Integer chance) {
		this.chance = chance;
	}

	public Integer getSurplus() {
		return surplus;
	}

	public void setSurplus(Integer surplus) {
		this.surplus = surplus;
	}

	public Integer getPolling() {
		return polling;
	}

	public void setPolling(Integer polling) {
		this.polling = polling;
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

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(Timestamp finishTime) {
		this.finishTime = finishTime;
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
