package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class VscoreRecordVO implements Serializable {
	
	private static final long serialVersionUID = 7800980304053070233L;
	
	private Long vsrid;
	
	private String unionId;
	
	private String orderId;
	
	private Float score;
	
	private UserBaseVO operater; 
	
	private Timestamp operateTime;
	
	private Short type;
	
	private Short status;
	
	private String comment;
	
	public VscoreRecordVO(){
		super();
	}
	
	public VscoreRecordVO(UserBaseVO operater){
		super();
		this.operater = operater;
	}

	public Long getVsrid() {
		return vsrid;
	}

	public void setVsrid(Long vsrid) {
		this.vsrid = vsrid;
	}

	public String getUnionId() {
		return unionId;
	}

	public void setUnionId(String unionId) {
		this.unionId = unionId;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Float getScore() {
		return score;
	}

	public void setScore(Float score) {
		this.score = score;
	}

	public UserBaseVO getOperater() {
		return operater;
	}

	public void setOperater(UserBaseVO operater) {
		this.operater = operater;
	}
	
	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getOperateTime() {
		return operateTime;
	}

	public void setOperateTime(Timestamp operateTime) {
		this.operateTime = operateTime;
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
