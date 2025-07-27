package com.fanglin.sales.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.sales.vo.SalesProfileOptionVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "salesprofileoption", catalog = "sales")
public class SalesProfileOptionPO implements Serializable {

	private static final long serialVersionUID = -8561526221550476372L;

	public static short CHECKED_INIT_INT = 1;

	private long spoid;

	private long spiid;

	private long spid;

	private String title;

	private short checked;

	public SalesProfileOptionPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "spoid")
	public long getSpoid() {
		return spoid;
	}

	public void setSpoid(long spoid) {
		this.spoid = spoid;
	}

	@Column(name = "spiid")
	public long getSpiid() {
		return spiid;
	}

	public void setSpiid(long spiid) {
		this.spiid = spiid;
	}

	@Column(name = "spid")
	public long getSpid() {
		return spid;
	}

	public void setSpid(long spid) {
		this.spid = spid;
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

	public SalesProfileOptionVO ptv(SalesProfileOptionVO salesProfileOptionVO) {

		BeanUtil.copyPropertie(this, salesProfileOptionVO);

		return salesProfileOptionVO;
	}

}
