package com.fanglin.decoration.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.data.po.QuotationItemPO;
import com.fanglin.quotation.po.QuotationFunctionAreaPO;

@Entity
@Table(name = "addreduceitem", catalog = "platform")
public class AddReduceItemPO implements java.io.Serializable {

	private static final long serialVersionUID = 5762586048215579423L;
	
	public static final String COLUMN_ARID_STR = "arId";

	private Long ariId;
	
	private Integer arId;
	
	private String itemName;
	
	private Short type;
	
	private String measurementUnit;
	
	private Integer workType;
	
	private Double unitPrice;
	
	private Double num;
	
	private QuotationFunctionAreaPO quotationFunctionArea;
	
	private QuotationItemPO quotationItem;
	
	private String content;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "ariId")
	public Long getAriId() {
		return this.ariId;
	}

	public void setAriId(Long ariId) {
		this.ariId = ariId;
	}

	@Column(name = "arId")
	public Integer getArId() {
		return this.arId;
	}

	public void setArId(Integer arId) {
		this.arId = arId;
	}

	@Column(name = "itemName")
	public String getItemName() {
		return this.itemName;
	}

	public void setItemName(String itemName) {
		this.itemName = itemName;
	}

	@Column(name = "type")
	public Short getType() {
		return this.type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	@Column(name = "measurementUnit")
	public String getMeasurementUnit() {
		return this.measurementUnit;
	}

	public void setMeasurementUnit(String measurementUnit) {
		this.measurementUnit = measurementUnit;
	}

	@Column(name = "workType", nullable = false)
	public Integer getWorkType() {
		return this.workType;
	}

	public void setWorkType(Integer workType) {
		this.workType = workType;
	}

	@Column(name = "unitPrice")
	public Double getUnitPrice() {
		return this.unitPrice;
	}

	public void setUnitPrice(Double unitPrice) {
		this.unitPrice = unitPrice;
	}

	@Column(name = "num")
	public Double getNum() {
		return this.num;
	}

	public void setNum(Double num) {
		this.num = num;
	}

	@javax.persistence.ManyToOne(fetch=FetchType.LAZY)
	@javax.persistence.JoinColumn(name="quotationFunctionAreaId", referencedColumnName="qfaId")
	public QuotationFunctionAreaPO getQuotationFunctionArea() {
		return quotationFunctionArea;
	}

	public void setQuotationFunctionArea(
			QuotationFunctionAreaPO quotationFunctionArea) {
		this.quotationFunctionArea = quotationFunctionArea;
	}

	@javax.persistence.ManyToOne(fetch=FetchType.LAZY)
	@javax.persistence.JoinColumn(name="quotationItemId", referencedColumnName="qiId")
	public QuotationItemPO getQuotationItem() {
		return quotationItem;
	}

	public void setQuotationItem(QuotationItemPO quotationItem) {
		this.quotationItem = quotationItem;
	}

	@Column(name = "content", length = 512)
	public String getContent() {
		return this.content;
	}

	public void setContent(String content) {
		this.content = content;
	}

}