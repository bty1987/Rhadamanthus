package com.fanglin.data.quotation.vo;

import java.io.Serializable;
import java.math.BigDecimal;

import com.fanglin.data.common.vo.ConstructionNodeVO;

public class NormtimeVO implements Serializable {

	private static final long serialVersionUID = -935031505848098478L;

	private Long ntid;// 定额工期id

	private QuotationItemVO quotationItem;// 报价

	private ConstructionNodeVO constructionNode;// 施工节点

	private String unit;

	private Integer trannum;

	private BigDecimal workdays;// 工时天数

	private Short status;

	private BigDecimal totalDays;// 总工时（计算字段）

	private Integer num;

	public NormtimeVO() {
		super();
	}

	public NormtimeVO(ConstructionNodeVO constructionNode, QuotationItemVO quotationItem) {
		super();
		this.quotationItem = quotationItem;
		this.constructionNode = constructionNode;
	}

	public Long getNtid() {
		return ntid;
	}

	public void setNtid(Long ntid) {
		this.ntid = ntid;
	}

	public QuotationItemVO getQuotationItem() {
		return quotationItem;
	}

	public void setQuotationItem(QuotationItemVO quotationItem) {
		this.quotationItem = quotationItem;
	}

	public ConstructionNodeVO getConstructionNode() {
		return constructionNode;
	}

	public void setConstructionNode(ConstructionNodeVO constructionNode) {
		this.constructionNode = constructionNode;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public Integer getTrannum() {
		return trannum;
	}

	public void setTrannum(Integer trannum) {
		this.trannum = trannum;
	}

	public BigDecimal getWorkdays() {
		return workdays;
	}

	public void setWorkdays(BigDecimal workdays) {
		this.workdays = workdays;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public BigDecimal getTotalDays() {
		return totalDays;
	}

	public void setTotalDays(BigDecimal totalDays) {
		this.totalDays = totalDays;
	}

	public Integer getNum() {
		return num;
	}

	public void setNum(Integer num) {
		this.num = num;
	}

}
