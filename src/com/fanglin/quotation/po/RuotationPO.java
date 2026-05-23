package com.fanglin.quotation.po;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.data.po.QuotationVersionPO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.quotation.vo.RuotationVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "ruotation", catalog = "quotation")
public class RuotationPO implements Serializable{

	private static final long serialVersionUID = -3339190398463881091L;

	private long qrid;

	private DecorationPO decoration;

	private QuotationPO quotation;

	private QuotationVersionPO version;

	private UserPO creater;
	
	private Timestamp createTime;

	private long totalPrice;

	private String content;

	@Id
	@GeneratedValue
	@Column(name = "qrid")
	public long getQrid() {
		return qrid;
	}

	public void setQrid(long qrid) {
		this.qrid = qrid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "orderId", referencedColumnName = "orderId")
	public DecorationPO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationPO decoration) {
		this.decoration = decoration;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "qid", referencedColumnName = "qid")
	public QuotationPO getQuotation() {
		return quotation;
	}

	public void setQuotation(QuotationPO quotation) {
		this.quotation = quotation;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "qvid", referencedColumnName = "qvId")
	public QuotationVersionPO getVersion() {
		return version;
	}

	public void setVersion(QuotationVersionPO version) {
		this.version = version;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "totalPrice")
	public long getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(long totalPrice) {
		this.totalPrice = totalPrice;
	}

	@Column(name = "content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public RuotationVO ptv(RuotationVO ruotationVO) {

		BeanUtil.copyProperties(this, ruotationVO, Arrays.asList("decoration", "quotation", "version", "creater"));

		if (ruotationVO.getDecoration() != null) getDecoration().ptvcascade(ruotationVO.getDecoration());
		if (ruotationVO.getQuotation() != null) BeanUtil.copyProperties(getQuotation(), ruotationVO.getQuotation(), Arrays.asList("decoration", "creater", "version"));
		if (ruotationVO.getVersion() != null) BeanUtil.copyProperties(getVersion(), ruotationVO.getVersion());
		if (ruotationVO.getCreater() != null) BeanUtil.copyProperties(getCreater(), ruotationVO.getCreater(), Arrays.asList("duty", "dept", "role"));

		return ruotationVO;
	}
}
