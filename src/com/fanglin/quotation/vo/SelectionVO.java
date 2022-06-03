package com.fanglin.quotation.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.vo.UserBaseVO;

public class SelectionVO implements Serializable {

	private static final long serialVersionUID = -2288485824151499913L;

	private Long sid;// 选材单ID

	private String orderId;// 装修单号

	private DecorationVO decoration;

	private Long qid;// 报价ID

	private Short status;// 状态 , 0: 初始 , 1: 锁定

	private Integer company;// 公司

	private Long total;// 总额

	private Long quotationTotal;// 报价总额

	private Long extensionAddTotal;// 拓展增总额

	private Long extensionReduceTotal;// 拓展减总额

	private Long addReduceAddTotal;// 增减增总额

	private Long addReduceMinusTotal;// 增减减总额

	private Timestamp createTime;

	private UserBaseVO creater;

	public SelectionVO() {
		super();
	}

	public SelectionVO(DecorationVO decoration, UserBaseVO creater) {
		super();
		this.decoration = decoration;
		this.creater = creater;
	}

	public Long getSid() {
		return sid;
	}

	public void setSid(Long sid) {
		this.sid = sid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public DecorationVO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationVO decoration) {
		this.decoration = decoration;
	}

	public Long getQid() {
		return qid;
	}

	public void setQid(Long qid) {
		this.qid = qid;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

	public Long getTotal() {
		return total;
	}

	public void setTotal(Long total) {
		this.total = total;
	}

	public Long getQuotationTotal() {
		return quotationTotal;
	}

	public void setQuotationTotal(Long quotationTotal) {
		this.quotationTotal = quotationTotal;
	}

	public Long getExtensionAddTotal() {
		return extensionAddTotal;
	}

	public void setExtensionAddTotal(Long extensionAddTotal) {
		this.extensionAddTotal = extensionAddTotal;
	}

	public Long getExtensionReduceTotal() {
		return extensionReduceTotal;
	}

	public void setExtensionReduceTotal(Long extensionReduceTotal) {
		this.extensionReduceTotal = extensionReduceTotal;
	}

	public Long getAddReduceAddTotal() {
		return addReduceAddTotal;
	}

	public void setAddReduceAddTotal(Long addReduceAddTotal) {
		this.addReduceAddTotal = addReduceAddTotal;
	}

	public Long getAddReduceMinusTotal() {
		return addReduceMinusTotal;
	}

	public void setAddReduceMinusTotal(Long addReduceMinusTotal) {
		this.addReduceMinusTotal = addReduceMinusTotal;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}
}
