package com.fanglin.quotation.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.vo.UserBaseVO;

public class NormtionVO implements Serializable {

	private static final long serialVersionUID = 8578508128383664267L;

	private Long nid;

	private String orderId;

	private DecorationVO decoration;

	private Long qid;

	private Long moodTotal;

	private Long mriceTotal;

	private Integer moodPrintNum;

	private Integer mricePriceNum;

	private Short status;

	private Timestamp createTime;

	private UserBaseVO creater;

	public NormtionVO() {
		super();
	}

	public NormtionVO(DecorationVO decoration, UserBaseVO creater) {
		super();
		this.decoration = decoration;
		this.creater = creater;
	}

	public Long getNid() {
		return nid;
	}

	public void setNid(Long nid) {
		this.nid = nid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public DecorationVO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationVO decoration) {
		this.decoration = decoration;
	}

	public Long getQid() {
		return qid;
	}

	public void setQid(Long qid) {
		this.qid = qid;
	}

	public Long getMoodTotal() {
		return moodTotal;
	}

	public void setMoodTotal(Long moodTotal) {
		this.moodTotal = moodTotal;
	}

	public Long getMriceTotal() {
		return mriceTotal;
	}

	public void setMriceTotal(Long mriceTotal) {
		this.mriceTotal = mriceTotal;
	}

	public Integer getMoodPrintNum() {
		return moodPrintNum;
	}

	public void setMoodPrintNum(Integer moodPrintNum) {
		this.moodPrintNum = moodPrintNum;
	}

	public Integer getMricePriceNum() {
		return mricePriceNum;
	}

	public void setMricePriceNum(Integer mricePriceNum) {
		this.mricePriceNum = mricePriceNum;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

}
