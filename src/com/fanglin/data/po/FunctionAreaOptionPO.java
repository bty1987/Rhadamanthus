package com.fanglin.data.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.data.quotation.vo.FunctionAreaOptionVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "functionareaoption", catalog = "data")
public class FunctionAreaOptionPO implements Serializable {

	private static final long serialVersionUID = -433901213461897752L;

	public static short CHECKED_INIT_INT = 1;

	private long faoid;

	private long faiid;

	private long faid;

	private String title;

	private short checked;

	public FunctionAreaOptionPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "faoid")
	public long getFaoid() {
		return faoid;
	}

	public void setFaoid(long faoid) {
		this.faoid = faoid;
	}

	@Column(name = "faiid")
	public long getFaiid() {
		return faiid;
	}

	public void setFaiid(long faiid) {
		this.faiid = faiid;
	}

	@Column(name = "faid")
	public long getFaid() {
		return faid;
	}

	public void setFaid(long faid) {
		this.faid = faid;
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

	public FunctionAreaOptionVO ptv(FunctionAreaOptionVO functionAreaOptionVO) {

		BeanUtil.copyPropertie(this, functionAreaOptionVO);

		return functionAreaOptionVO;
	}

}
