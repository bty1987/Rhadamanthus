package com.fanglin.construction.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.construction.vo.DrawlineProfileOptionVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "drawlineprofileoption", catalog = "construction")
public class DrawlineProfileOptionPO implements Serializable {

	private static final long serialVersionUID = 756152622055040619L;

	public static short CHECKED_INIT_INT = 1;

	private long dpoid;

	private long dpiid;

	private long dpid;

	private String title;

	private short checked;

	public DrawlineProfileOptionPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "dpoid")
	public long getDpoid() {
		return dpoid;
	}

	public void setDpoid(long dpoid) {
		this.dpoid = dpoid;
	}

	@Column(name = "dpiid")
	public long getDpiid() {
		return dpiid;
	}

	public void setDpiid(long dpiid) {
		this.dpiid = dpiid;
	}

	@Column(name = "dpid")
	public long getDpid() {
		return dpid;
	}

	public void setDpid(long dpid) {
		this.dpid = dpid;
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

	public DrawlineProfileOptionVO ptv(DrawlineProfileOptionVO drawlineProfileOptionVO) {

		BeanUtil.copyPropertie(this, drawlineProfileOptionVO);

		return drawlineProfileOptionVO;
	}

}
