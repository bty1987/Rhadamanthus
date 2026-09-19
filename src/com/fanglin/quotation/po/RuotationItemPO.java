package com.fanglin.quotation.po;

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

import com.fanglin.data.po.QuotationItemPO;
import com.fanglin.quotation.vo.RuotationItemVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "ruotationitem", catalog = "quotation")
public class RuotationItemPO implements Serializable {

	private static final long serialVersionUID = 8263037511645428514L;

	public static final short SOURCE_QUOTATION_INT = 0;// 报价项
	public static final short SOURCE_EXTENSION_INT = 1;// 扩展项
	public static final short SOURCE_ADDREDUCE_INT = 2;// 增减项

	private long qriid;

	private RuotationPO ruotation;

	private QuotationFunctionAreaPO quotationFunctionArea;

	private QuotationItemPO quotationItem;

	private String itemName;

	private String measurementUnit;

	private String workType;

	private int unitPrice;

	private int addPrice;

	private int subPrice;

	private String formula;

	private int initNum;

	private int num;

	private short type;

	private short subtype;

	private String content;

	private int index;

	private short source;

	private Long sourceItemId;

	private Long qfaiId;

	@Id
	@GeneratedValue
	@Column(name = "qriid")
	public long getQriid() {
		return qriid;
	}

	public void setQriid(long qriid) {
		this.qriid = qriid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "qrid", referencedColumnName = "qrid")
	public RuotationPO getRuotation() {
		return ruotation;
	}

	public void setRuotation(RuotationPO ruotation) {
		this.ruotation = ruotation;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "qfaid", referencedColumnName = "qfaId")
	public QuotationFunctionAreaPO getQuotationFunctionArea() {
		return quotationFunctionArea;
	}

	public void setQuotationFunctionArea(
			QuotationFunctionAreaPO quotationFunctionArea) {
		this.quotationFunctionArea = quotationFunctionArea;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "qiid", referencedColumnName = "qiid")
	public QuotationItemPO getQuotationItem() {
		return quotationItem;
	}

	public void setQuotationItem(QuotationItemPO quotationItem) {
		this.quotationItem = quotationItem;
	}

	@Column(name = "itemName")
	public String getItemName() {
		return itemName;
	}

	public void setItemName(String itemName) {
		this.itemName = itemName;
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

	@Column(name = "unitPrice")
	public int getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(int unitPrice) {
		this.unitPrice = unitPrice;
	}

	@Column(name = "addPrice")
	public int getAddPrice() {
		return addPrice;
	}

	public void setAddPrice(int addPrice) {
		this.addPrice = addPrice;
	}

	@Column(name = "subPrice")
	public int getSubPrice() {
		return subPrice;
	}

	public void setSubPrice(int subPrice) {
		this.subPrice = subPrice;
	}

	@Column(name = "formula")
	public String getFormula() {
		return formula;
	}

	public void setFormula(String formula) {
		this.formula = formula;
	}

	@Column(name = "initNum")
	public int getInitNum() {
		return initNum;
	}

	public void setInitNum(int initNum) {
		this.initNum = initNum;
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

	@Column(name = "content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@Column(name = "[index]")
	public int getIndex() {
		return index;
	}

	public void setIndex(int index) {
		this.index = index;
	}

	@Column(name = "source")
	public short getSource() {
		return source;
	}

	public void setSource(short source) {
		this.source = source;
	}

	@Column(name = "sourceItemId")
	public Long getSourceItemId() {
		return sourceItemId;
	}

	public void setSourceItemId(Long sourceItemId) {
		this.sourceItemId = sourceItemId;
	}

	@Column(name = "qfaiId")
	public Long getQfaiId() {
		return qfaiId;
	}

	public void setQfaiId(Long qfaiId) {
		this.qfaiId = qfaiId;
	}

	public RuotationItemVO ptv(RuotationItemVO ruotationItemVO) {

		BeanUtil.copyProperties(this, ruotationItemVO, Arrays.asList("ruotation", "quotationFunctionArea", "quotationItem"));

		if (ruotationItemVO.getRuotation() != null) getRuotation().ptv(ruotationItemVO.getRuotation());
		if (ruotationItemVO.getQuotationFunctionArea() != null) BeanUtil.copyProperties(getQuotationFunctionArea(), ruotationItemVO.getQuotationFunctionArea());
		if (ruotationItemVO.getQuotationItem() != null) getQuotationItem().ptv(ruotationItemVO.getQuotationItem());

		return ruotationItemVO;

	}
}
