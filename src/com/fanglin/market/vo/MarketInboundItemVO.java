package com.fanglin.market.vo;

import java.io.Serializable;

public class MarketInboundItemVO implements Serializable {

	private static final long serialVersionUID = -8809153246091954432L;

	private Long miiid;

	private Long miid;

	private String fieldKey;

	private String fieldValue;

	public Long getMiiid() {
		return miiid;
	}

	public void setMiiid(Long miiid) {
		this.miiid = miiid;
	}

	public Long getMiid() {
		return miid;
	}

	public void setMiid(Long miid) {
		this.miid = miid;
	}

	public String getFieldKey() {
		return fieldKey;
	}

	public void setFieldKey(String fieldKey) {
		this.fieldKey = fieldKey;
	}

	public String getFieldValue() {
		return fieldValue;
	}

	public void setFieldValue(String fieldValue) {
		this.fieldValue = fieldValue;
	}

}
