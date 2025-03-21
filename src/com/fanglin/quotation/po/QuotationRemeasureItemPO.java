package com.fanglin.quotation.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.data.po.RemeasureFormatPO;
import com.fanglin.quotation.vo.QuotationRemeasureItemVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "quotationremeasureitem", catalog = "quotation")
public class QuotationRemeasureItemPO implements Serializable {

	private static final long serialVersionUID = 8570772744275679875L;

	private long qriid;

	private long qrid;

	private String orderId;

	private long areaId;

	private String areaName;

	private SelectionItemPO selectionItem;

	private RemeasureFormatPO remeasureFormat;

	private String name;

	private int value;

	private short status;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "qriid")
	public long getQriid() {
		return qriid;
	}

	public void setQriid(long qriid) {
		this.qriid = qriid;
	}

	@Column(name = "qrid")
	public long getQrid() {
		return qrid;
	}

	public void setQrid(long qrid) {
		this.qrid = qrid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "areaId")
	public long getAreaId() {
		return areaId;
	}

	public void setAreaId(long areaId) {
		this.areaId = areaId;
	}

	@Column(name = "areaName")
	public String getAreaName() {
		return areaName;
	}

	public void setAreaName(String areaName) {
		this.areaName = areaName;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "siid", referencedColumnName = "siid")
	public SelectionItemPO getSelectionItem() {
		return selectionItem;
	}

	public void setSelectionItem(SelectionItemPO selectionItem) {
		this.selectionItem = selectionItem;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "rfid", referencedColumnName = "rfid")
	public RemeasureFormatPO getRemeasureFormat() {
		return remeasureFormat;
	}

	public void setRemeasureFormat(RemeasureFormatPO remeasureFormat) {
		this.remeasureFormat = remeasureFormat;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "value")
	public int getValue() {
		return value;
	}

	public void setValue(int value) {
		this.value = value;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	public QuotationRemeasureItemVO ptv(QuotationRemeasureItemVO quotationRemeasureItemVO) {

		BeanUtil.copyProperties(this, quotationRemeasureItemVO, Arrays.asList("selectionItem", "remeasureFormat"));

		if (quotationRemeasureItemVO.getSelectionItem() != null && getSelectionItem() != null) getSelectionItem().ptv(quotationRemeasureItemVO.getSelectionItem());
		if (quotationRemeasureItemVO.getRemeasureFormat() != null && getRemeasureFormat() != null) getRemeasureFormat().ptv(quotationRemeasureItemVO.getRemeasureFormat());

		return quotationRemeasureItemVO;
	}
}
