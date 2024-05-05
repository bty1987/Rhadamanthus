package com.fanglin.salary.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.vo.UserBaseVO;

public class DecorationSalaryVO implements Serializable {

	private static final long serialVersionUID = -5661476815551561562L;

	private Long dsid;

	private DecorationVO decoration;

	private UserBaseVO belonger;

	private Timestamp createTime;

	private String period;

	private Long money;

	private Integer rate;

	private Short type;

	private Short atttype;

	private Short stage;

	private Short level;

	private Short status;

	private String comment;

	public DecorationSalaryVO() {
		super();
	}

	public DecorationSalaryVO(DecorationVO decoration, UserBaseVO belonger) {
		super();
		this.decoration = decoration;
		this.belonger = belonger;
	}

	public Long getDsid() {
		return dsid;
	}

	public void setDsid(Long dsid) {
		this.dsid = dsid;
	}

	public DecorationVO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationVO decoration) {
		this.decoration = decoration;
	}

	public UserBaseVO getBelonger() {
		return belonger;
	}

	public void setBelonger(UserBaseVO belonger) {
		this.belonger = belonger;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
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

	public Long getMoney() {
		return money;
	}

	public void setMoney(Long money) {
		this.money = money;
	}

	public Integer getRate() {
		return rate;
	}

	public void setRate(Integer rate) {
		this.rate = rate;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getAtttype() {
		return atttype;
	}

	public void setAtttype(Short atttype) {
		this.atttype = atttype;
	}

	public Short getStage() {
		return stage;
	}

	public void setStage(Short stage) {
		this.stage = stage;
	}

	public Short getLevel() {
		return level;
	}

	public void setLevel(Short level) {
		this.level = level;
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
