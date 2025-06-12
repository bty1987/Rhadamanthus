package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class FeedbackComplaintVO implements Serializable {

	private static final long serialVersionUID = -7870753508040593266L;

	private Long fcid;

	private Long fid;

	private String orderId;

	private Short source;

	private String phone;

	private UserBaseVO servicer;

	private UserBaseVO materialer;

	private Short upgrade;

	private Short urgency;

	private String deptType;

	private UserBaseVO creater;

	private Timestamp createTime;

	private String content;

	private String appeal;

	private Short results;

	private Timestamp finishTime;

	public FeedbackComplaintVO() {
		super();
	}

	public FeedbackComplaintVO(UserBaseVO servicer, UserBaseVO materialer, UserBaseVO creater) {
		super();
		this.servicer = servicer;
		this.materialer = materialer;
		this.creater = creater;
	}

	public Long getFcid() {
		return fcid;
	}

	public void setFcid(Long fcid) {
		this.fcid = fcid;
	}

	public Long getFid() {
		return fid;
	}

	public void setFid(Long fid) {
		this.fid = fid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Short getSource() {
		return source;
	}

	public void setSource(Short source) {
		this.source = source;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public UserBaseVO getServicer() {
		return servicer;
	}

	public void setServicer(UserBaseVO servicer) {
		this.servicer = servicer;
	}

	public UserBaseVO getMaterialer() {
		return materialer;
	}

	public void setMaterialer(UserBaseVO materialer) {
		this.materialer = materialer;
	}

	public Short getUpgrade() {
		return upgrade;
	}

	public void setUpgrade(Short upgrade) {
		this.upgrade = upgrade;
	}

	public Short getUrgency() {
		return urgency;
	}

	public void setUrgency(Short urgency) {
		this.urgency = urgency;
	}

	public String getDeptType() {
		return deptType;
	}

	public void setDeptType(String deptType) {
		this.deptType = deptType;
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

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getAppeal() {
		return appeal;
	}

	public void setAppeal(String appeal) {
		this.appeal = appeal;
	}

	public Short getResults() {
		return results;
	}

	public void setResults(Short results) {
		this.results = results;
	}
	
	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(Timestamp finishTime) {
		this.finishTime = finishTime;
	}
}
