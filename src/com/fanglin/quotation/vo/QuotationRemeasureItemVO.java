package com.fanglin.quotation.vo;

import java.io.Serializable;

import com.fanglin.data.material.vo.RemeasureFormatVO;

public class QuotationRemeasureItemVO implements Serializable {

	private static final long serialVersionUID = -816259975314101296L;

	private Long qriid;

	private Long qrid;

	private String orderId;

	private Long areaId;

	private String areaName;

	private SelectionItemVO selectionItem;

	private RemeasureFormatVO remeasureFormat;

	private String name;

	private Integer value;

	private Short status;

	public Long getQriid() {
		return qriid;
	}

	public void setQriid(Long qriid) {
		this.qriid = qriid;
	}

	public Long getQrid() {
		return qrid;
	}

	public void setQrid(Long qrid) {
		this.qrid = qrid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Long getAreaId() {
		return areaId;
	}

	public void setAreaId(Long areaId) {
		this.areaId = areaId;
	}

	public String getAreaName() {
		return areaName;
	}

	public void setAreaName(String areaName) {
		this.areaName = areaName;
	}

	public SelectionItemVO getSelectionItem() {
		return selectionItem;
	}

	public void setSelectionItem(SelectionItemVO selectionItem) {
		this.selectionItem = selectionItem;
	}

	public RemeasureFormatVO getRemeasureFormat() {
		return remeasureFormat;
	}

	public void setRemeasureFormat(RemeasureFormatVO remeasureFormat) {
		this.remeasureFormat = remeasureFormat;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getValue() {
		return value;
	}

	public void setValue(Integer value) {
		this.value = value;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}
}
