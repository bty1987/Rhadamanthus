package com.fanglin.decoration.vo;

import com.fanglin.information.vo.ActivityVO;

public class DecorationActivityVO implements java.io.Serializable {

	private static final long serialVersionUID = 3947779921447838919L;

	private Integer daId;
	
	private String orderId;
	
	private ActivityVO activity;
	
	private int type;
	
	private int defaults;

	public Integer getDaId() {
		return daId;
	}

	public void setDaId(Integer daId) {
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

	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	public int getDefaults() {
		return defaults;
	}

	public void setDefaults(int defaults) {
		this.defaults = defaults;
	}
	
	

}