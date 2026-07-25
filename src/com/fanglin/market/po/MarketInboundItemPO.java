package com.fanglin.market.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "market_inbound_item", catalog = "market")
public class MarketInboundItemPO implements Serializable {

	private static final long serialVersionUID = -5224730394699246365L;

	private long miiid;

	private long miid;

	private String fieldKey;

	private String fieldValue;

	@Id
	@GeneratedValue
	@Column(name = "miiid")
	public long getMiiid() {
		return miiid;
	}

	public void setMiiid(long miiid) {
		this.miiid = miiid;
	}

	@Column(name = "miid")
	public long getMiid() {
		return miid;
	}

	public void setMiid(long miid) {
		this.miid = miid;
	}

	@Column(name = "fieldKey")
	public String getFieldKey() {
		return fieldKey;
	}

	public void setFieldKey(String fieldKey) {
		this.fieldKey = fieldKey;
	}

	@Column(name = "fieldValue")
	public String getFieldValue() {
		return fieldValue;
	}

	public void setFieldValue(String fieldValue) {
		this.fieldValue = fieldValue;
	}

}
