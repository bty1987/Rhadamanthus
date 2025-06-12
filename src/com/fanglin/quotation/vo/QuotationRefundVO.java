package com.fanglin.quotation.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.data.quotation.vo.QuotationVersionVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.vo.UserBaseVO;

public class QuotationRefundVO implements Serializable {

	private static final long serialVersionUID = 1363788411461486270L;

	private Long qrid;

	private DecorationVO decoration;

	private QuotationVO quotation;

	private QuotationVersionVO version;

	private UserBaseVO creater;
	
	private Timestamp createTime;

	private Long totalPrice;

	private String content;

	public QuotationRefundVO() {
		super();
	}

	public QuotationRefundVO(DecorationVO decoration, QuotationVO quotation, QuotationVersionVO version, UserBaseVO creater) {
		super();

		this.decoration = decoration;
		this.quotation = quotation;
		this.version = version;
		this.creater = creater;
	}

	public Long getQrid() {
		return qrid;
	}

	public void setQrid(Long qrid) {
		this.qrid = qrid;
	}

	public DecorationVO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationVO decoration) {
		this.decoration = decoration;
	}

	public QuotationVO getQuotation() {
		return quotation;
	}

	public void setQuotation(QuotationVO quotation) {
		this.quotation = quotation;
	}

	public QuotationVersionVO getVersion() {
		return version;
	}

	public void setVersion(QuotationVersionVO version) {
		this.version = version;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public Long getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(Long totalPrice) {
		this.totalPrice = totalPrice;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}
}
