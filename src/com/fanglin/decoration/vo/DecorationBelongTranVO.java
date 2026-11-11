/**
 * @File Name		: DecorationBelongTranVO.java
 * @Package   	: com.fanglin.decoration.vo
 * @Version		: 1.0
 * @Date			: 2026-11-11
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 离职移交名单行(装修单×原移交人当类型生效归属)
 */

package com.fanglin.decoration.vo;

import java.io.Serializable;

public class DecorationBelongTranVO implements Serializable {

	private static final long serialVersionUID = -6023917485320977165L;

	private String orderId;

	private String customerName;

	private Short status;

	private Integer rate; // 原移交人该单该类型现行比例(千分率)

	private Short defaultFlag; // 原移交人现行是否默认(交接modal预填默认人勾选)

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getCustomerName() {
		return customerName;
	}

	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Integer getRate() {
		return rate;
	}

	public void setRate(Integer rate) {
		this.rate = rate;
	}

	public Short getDefaultFlag() {
		return defaultFlag;
	}

	public void setDefaultFlag(Short defaultFlag) {
		this.defaultFlag = defaultFlag;
	}

}
