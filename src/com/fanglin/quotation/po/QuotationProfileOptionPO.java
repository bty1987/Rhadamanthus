package com.fanglin.quotation.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.quotation.vo.QuotationProfileOptionVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "quotationprofileoption", catalog = "quotation")
public class QuotationProfileOptionPO implements Serializable {

	private static final long serialVersionUID = 7561526220550406171L;

	public static short CHECKED_INIT_INT = 1;

	private long qpoid;

	private long qpiid;

	private long qpid;

	private String title;

	private short checked;

	public QuotationProfileOptionPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "qpoid")
	public long getQpoid() {
		return qpoid;
	}

	public void setQpoid(long qpoid) {
		this.qpoid = qpoid;
	}

	@Column(name = "qpiid")
	public long getQpiid() {
		return qpiid;
	}

	public void setQpiid(long qpiid) {
		this.qpiid = qpiid;
	}

	@Column(name = "qpid")
	public long getQpid() {
		return qpid;
	}

	public void setQpid(long qpid) {
		this.qpid = qpid;
	}

	@Column(name = "title")
	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	@Column(name = "checked")
	public short getChecked() {
		return checked;
	}

	public void setChecked(short checked) {
		this.checked = checked;
	}

	public QuotationProfileOptionVO ptv(QuotationProfileOptionVO quotationProfileOptionVO) {

		BeanUtil.copyPropertie(this, quotationProfileOptionVO);

		return quotationProfileOptionVO;
	}

}
