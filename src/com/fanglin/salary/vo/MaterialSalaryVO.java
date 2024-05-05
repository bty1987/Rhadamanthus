package com.fanglin.salary.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.sales.vo.SalesVO;

public class MaterialSalaryVO implements Serializable {

	private static final long serialVersionUID = 2178245573693991636L;

	private Long msid;

	private DecorationVO decoration;

	private SalesVO sales;

	private Long sbid;

	private UserBaseVO belonger;

	private Timestamp createTime;

	private String period;

	private Integer money;

	private Integer rate;

	private Short stage;

	private Short status;

	private String comment;

	public MaterialSalaryVO() {
		super();
	}

	public MaterialSalaryVO(DecorationVO decoration, SalesVO sales, UserBaseVO belonger) {

		super();

		this.decoration = decoration;
		this.sales = sales;
		this.belonger = belonger;
	}

	public Long getMsid() {
		return msid;
	}

	public void setMsid(Long msid) {
		this.msid = msid;
	}

	public DecorationVO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationVO decoration) {
		this.decoration = decoration;
	}

	public SalesVO getSales() {
		return sales;
	}

	public void setSales(SalesVO sales) {
		this.sales = sales;
	}

	public Long getSbid() {
		return sbid;
	}

	public void setSbid(Long sbid) {
		this.sbid = sbid;
	}

	public UserBaseVO getBelonger() {
		return belonger;
	}

	public void setBelonger(UserBaseVO belonger) {
		this.belonger = belonger;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public String getPeriod() {
		return period;
	}

	public void setPeriod(String period) {
		this.period = period;
	}

	public Integer getMoney() {
		return money;
	}

	public void setMoney(Integer money) {
		this.money = money;
	}

	public Integer getRate() {
		return rate;
	}

	public void setRate(Integer rate) {
		this.rate = rate;
	}

	public Short getStage() {
		return stage;
	}

	public void setStage(Short stage) {
		this.stage = stage;
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
