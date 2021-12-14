package com.fanglin.payment.vo;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class PaymentContractVO implements Serializable {

	private static final long serialVersionUID = 1706560589900646132L;

	private Long pcid;

	private Long rtid;

	private String orderId;

	private Short type;

	private Short paymentType;

	private String download;

	private String viewpdf;

	private String path;

	private UserBaseVO creater;

	private UserBaseVO signner;

	private UserBaseVO filinner;

	private Timestamp createTime;

	private Timestamp comsignTime;

	private Timestamp cussignTime;

	private Timestamp filingTime;

	private Short status;

	private List<DecorationPaymentVO> payments;

	private List<Integer> paymentRates;

	public PaymentContractVO() {
		super();
	}

	public PaymentContractVO(UserBaseVO creater, UserBaseVO signner, UserBaseVO filinner) {
		super();
		this.creater = creater;
		this.signner = signner;
		this.filinner = filinner;
	}

	public Long getPcid() {
		return pcid;
	}

	public void setPcid(Long pcid) {
		this.pcid = pcid;
	}

	public Long getRtid() {
		return rtid;
	}

	public void setRtid(Long rtid) {
		this.rtid = rtid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getPaymentType() {
		return paymentType;
	}

	public void setPaymentType(Short paymentType) {
		this.paymentType = paymentType;
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

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	public UserBaseVO getSignner() {
		return signner;
	}

	public void setSignner(UserBaseVO signner) {
		this.signner = signner;
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

	public List<DecorationPaymentVO> getPayments() {
		return payments;
	}

	public void setPayments(List<DecorationPaymentVO> payments) {
		this.payments = payments;
	}

	public List<Integer> getPaymentRates() {
		return paymentRates;
	}

	public void setPaymentRates(List<Integer> paymentRates) {
		this.paymentRates = paymentRates;
	}

	public UserBaseVO getFilinner() {
		return filinner;
	}

	public void setFilinner(UserBaseVO filinner) {
		this.filinner = filinner;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

}
