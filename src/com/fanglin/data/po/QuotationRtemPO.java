/**
 * @File Name		: QuotationItemPO.java
 * @Package   	: com.fanglin.entity
 * @Version		: 1.0
 * @Date			: 2014-7-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.po;

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

import com.fanglin.data.quotation.vo.QuotationRtemVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "quotationrtem", catalog = "quotation")
public class QuotationRtemPO implements Serializable {

	private static final long serialVersionUID = -5843504332581779330L;

	private long qrid;

	private QuotationItemPO source;

	private QuotationItemPO target;

	private short type;

	private String formula;

	private String comment;

	public QuotationRtemPO() {
		super();
	}

	public QuotationRtemPO(QuotationItemPO source, QuotationItemPO target) {
		super();
		this.source = source;
		this.target = target;
	}

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
	@JoinColumn(name = "sqiid", referencedColumnName = "qiid")
	public QuotationItemPO getSource() {
		return source;
	}

	public void setSource(QuotationItemPO source) {
		this.source = source;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "tqiid", referencedColumnName = "qiid")
	public QuotationItemPO getTarget() {
		return target;
	}

	public void setTarget(QuotationItemPO target) {
		this.target = target;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "formula")
	public String getFormula() {
		return formula;
	}

	public void setFormula(String formula) {
		this.formula = formula;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public QuotationRtemVO ptv(QuotationRtemVO quotationRtemVO) {

		BeanUtil.copyProperties(this, quotationRtemVO, Arrays.asList("source", "target"));

		if (quotationRtemVO.getSource() != null && getSource() != null) getSource().ptv(quotationRtemVO.getSource());
		if (quotationRtemVO.getTarget() != null && getTarget() != null) getTarget().ptv(quotationRtemVO.getTarget());

		return quotationRtemVO;
	}
}
