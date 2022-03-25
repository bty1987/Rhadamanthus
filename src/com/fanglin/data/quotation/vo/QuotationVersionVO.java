/**
 * @File Name		: QuotationVersionVO.java
 * @Package   	: com.fanglin.vo
 * @Version		: 1.0
 * @Date			: 2014-7-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.quotation.vo;

import java.io.Serializable;

public class QuotationVersionVO implements Serializable {

	private static final long serialVersionUID = -6419575244318061433L;

	private Long qvId;

	private String no;

	private String name;

	private Integer trafficRate;

	private Short trafficDiscount;

	private Integer manageRate;

	private Short manageDiscount;

	private Integer offset;

	private Short type;

	private Short defaultFlag;

	private String comment;

	public Long getQvId() {
		return qvId;
	}

	public void setQvId(Long qvId) {
		this.qvId = qvId;
	}

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getTrafficRate() {
		return trafficRate;
	}

	public void setTrafficRate(Integer trafficRate) {
		this.trafficRate = trafficRate;
	}

	public Short getTrafficDiscount() {
		return trafficDiscount;
	}

	public void setTrafficDiscount(Short trafficDiscount) {
		this.trafficDiscount = trafficDiscount;
	}

	public Integer getManageRate() {
		return manageRate;
	}

	public void setManageRate(Integer manageRate) {
		this.manageRate = manageRate;
	}

	public Short getManageDiscount() {
		return manageDiscount;
	}

	public void setManageDiscount(Short manageDiscount) {
		this.manageDiscount = manageDiscount;
	}

	public Integer getOffset() {
		return offset;
	}

	public void setOffset(Integer offset) {
		this.offset = offset;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getDefaultFlag() {
		return defaultFlag;
	}

	public void setDefaultFlag(Short defaultFlag) {
		this.defaultFlag = defaultFlag;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
