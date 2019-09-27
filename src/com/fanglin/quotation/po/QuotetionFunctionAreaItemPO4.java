package com.fanglin.quotation.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "quotetionfunctionareaitem4", catalog = "quotetion")
public class QuotetionFunctionAreaItemPO4 extends QuotetionFunctionAreaItemPO implements Serializable {

	private static final long serialVersionUID = -4976433733371052628L;

	private long qfaiId;

	private long qfaid;

	private long qiid;

	private String name;

	private int unitPrice;

	private int index;

	private String formula;

	private int num;

	private short type;

	private short subtype;

	private String measurementUnit;

	private String workType;

	private short discount;

	private String content;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "qfaiId")
	public long getQfaiId() {
		return qfaiId;
	}

	public void setQfaiId(long qfaiId) {
		this.qfaiId = qfaiId;
	}

	@Column(name = "qfaid")
	public long getQfaid() {
		return qfaid;
	}

	public void setQfaid(long qfaid) {
		this.qfaid = qfaid;
	}

	@Column(name = "qiid")
	public long getQiid() {
		return qiid;
	}

	public void setQiid(long qiid) {
		this.qiid = qiid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "unitPrice")
	public int getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(int unitPrice) {
		this.unitPrice = unitPrice;
	}

	@Column(name = "[index]")
	public int getIndex() {
		return index;
	}

	public void setIndex(int index) {
		this.index = index;
	}

	@Column(name = "formula")
	public String getFormula() {
		return formula;
	}

	public void setFormula(String formula) {
		this.formula = formula;
	}

	@Column(name = "num")
	public int getNum() {
		return num;
	}

	public void setNum(int num) {
		this.num = num;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "subtype")
	public short getSubtype() {
		return subtype;
	}

	public void setSubtype(short subtype) {
		this.subtype = subtype;
	}

	@Column(name = "measurementUnit")
	public String getMeasurementUnit() {
		return measurementUnit;
	}

	public void setMeasurementUnit(String measurementUnit) {
		this.measurementUnit = measurementUnit;
	}

	@Column(name = "workType")
	public String getWorkType() {
		return workType;
	}

	public void setWorkType(String workType) {
		this.workType = workType;
	}

	@Column(name = "discount")
	public short getDiscount() {
		return discount;
	}

	public void setDiscount(short discount) {
		this.discount = discount;
	}

	@Column(name = "content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

}
