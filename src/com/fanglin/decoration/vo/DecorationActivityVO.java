package com.fanglin.decoration.vo;

import com.fanglin.information.vo.ActivityVO;

public class DecorationActivityVO implements java.io.Serializable {

	private static final long serialVersionUID = 3947779921447838919L;

	private Long daId;

	private String orderId;

	private ActivityVO activity;
	
	private Short status;

	public Long getDaId() {
		return daId;
	}

	public void setDaId(Long daId) {
		this.daId = daId;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public ActivityVO getActivity() {
		return activity;
	}

	public void setActivity(ActivityVO activity) {
		this.activity = activity;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

}