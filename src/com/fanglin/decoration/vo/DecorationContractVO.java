package com.fanglin.decoration.vo;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.payment.vo.DecorationPaymentVO;
import com.fanglin.personel.vo.UserBaseVO;

public class DecorationContractVO implements Serializable {

	private static final long serialVersionUID = -6225111181876631L;

	private Long dcid;

	private String orderId;

	private Long cid;// 合同ID

	private String no;// 合同编号

	private String name;// 名称

	private String title;// 标题

	private Short type;

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

	private Short ishow;

	private Integer filesize;

	private List<DecorationPaymentVO> payments;

	private List<Integer> paymentRates;

	public DecorationContractVO() {
		super();
	}

	public DecorationContractVO(String orderId) {
		super();
		this.orderId = orderId;
	}

	public DecorationContractVO(UserBaseVO creater, UserBaseVO signner, UserBaseVO filinner) {
		super();
		this.creater = creater;
		this.signner = signner;
		this.filinner = filinner;
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

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
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

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
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

	public UserBaseVO getFilinner() {
		return filinner;
	}

	public void setFilinner(UserBaseVO filinner) {
		this.filinner = filinner;
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

	public Integer getFilesize() {
		return filesize;
	}

	public void setFilesize(Integer filesize) {
		this.filesize = filesize;
	}

}
