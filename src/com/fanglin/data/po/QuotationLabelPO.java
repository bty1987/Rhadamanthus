package com.fanglin.data.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.data.quotation.vo.QuotationLabelVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "quotationlabel", catalog = "quotation")
public class QuotationLabelPO implements Serializable {

	private static final long serialVersionUID = -615038657868256340L;

	public static final String COLUMN_NAME_STR = "name";

	private long qlid;

	private String name;

	public QuotationLabelPO() {
		super();
	}

	@Id
	@GeneratedValue
	@Column(name = "qlid")
	public long getQlid() {
		return qlid;
	}

	public void setQlid(long qlid) {
		this.qlid = qlid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public QuotationLabelVO ptv(QuotationLabelVO quotationLabelVO) {

		BeanUtil.copyProperties(this, quotationLabelVO);

		return quotationLabelVO;
	}

}
