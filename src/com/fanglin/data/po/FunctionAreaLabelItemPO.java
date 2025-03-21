/**
 * @File Name		: QuotationVersionPO.java
 * @Package   	: com.fanglin.entity
 * @Version		: 1.0
 * @Date			: 2014-7-25
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
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.data.quotation.vo.FunctionAreaLabelItemVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "functionArealabelItem", catalog = "quotation")
public class FunctionAreaLabelItemPO implements Serializable {

	private static final long serialVersionUID = 3745934355422145305L;

	private long faliid;

	private long faiid;

	private long qiid;

	private QuotationLabelPO label;

	@Id
	@GeneratedValue
	@Column(name = "faliid", nullable = false)
	public long getFaliid() {
		return faliid;
	}

	public void setFaliid(long faliid) {
		this.faliid = faliid;
	}

	@Column(name = "faiid")
	public long getFaiid() {
		return faiid;
	}

	public void setFaiid(long faiid) {
		this.faiid = faiid;
	}

	@Column(name = "qiid")
	public long getQiid() {
		return qiid;
	}

	public void setQiid(long qiid) {
		this.qiid = qiid;
	}

	public QuotationLabelPO getLabel() {
		return label;
	}

	public void setLabel(QuotationLabelPO label) {
		this.label = label;
	}

	public FunctionAreaLabelItemVO ptv(FunctionAreaLabelItemVO functionAreaLabelItemVO) {

		BeanUtil.copyProperties(this, functionAreaLabelItemVO, Arrays.asList("label"));

		if (functionAreaLabelItemVO.getLabel() != null && getLabel() != null) getLabel().ptv(functionAreaLabelItemVO.getLabel());

		return functionAreaLabelItemVO;
	}
}
