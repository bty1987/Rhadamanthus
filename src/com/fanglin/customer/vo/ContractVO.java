package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

public class ContractVO implements Serializable {

	private static final long serialVersionUID = -6225111181876631L;

	private Long dcid;

	private String orderId;

	private ContractVO contract;

	private Short type;

	private String download;

	private String viewpdf;

	private String path;

	private Timestamp createTime;

	private Timestamp comsignTime;

	private Timestamp cussignTime;

	private Timestamp filingTime;

	private Short status;

	private Short ishow;

	public ContractVO() {
		super();
	}

	public ContractVO(ContractVO contract) {
		super();
		this.contract = contract;
	}

	public Long getDcid() {
		return dcid;
	}

	public void setDcid(Long dcid) {
		this.dcid = dcid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public ContractVO getContract() {
		return contract;
	}

	public void setContract(ContractVO contract) {
		this.contract = contract;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public String getDownload() {
		return download;
	}

	public void setDownload(String download) {
		this.download = download;
	}

	public String getViewpdf() {
		return viewpdf;
	}

	public void setViewpdf(String viewpdf) {
		this.viewpdf = viewpdf;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getComsignTime() {
		return comsignTime;
	}

	public void setComsignTime(Timestamp comsignTime) {
		this.comsignTime = comsignTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCussignTime() {
		return cussignTime;
	}

	public void setCussignTime(Timestamp cussignTime) {
		this.cussignTime = cussignTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getFilingTime() {
		return filingTime;
	}

	public void setFilingTime(Timestamp filingTime) {
		this.filingTime = filingTime;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Short getIshow() {
		return ishow;
	}

	public void setIshow(Short ishow) {
		this.ishow = ishow;
	}

}
