package com.fanglin.quotation.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.quotation.vo.QeasureOptionVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "qeasureoption", catalog = "quotetion")
public class QeasureOptionPO implements Serializable {

	private static final long serialVersionUID = 4812405751327395342L;

	public static short CHECKED_INIT_INT = 1;

	private long qmoid;

	private long qmiid;

	private long qmfaid;

	private long qmid;

	private String title;

	private short checked;

	public QeasureOptionPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "qmoid")
	public long getQmoid() {
		return qmoid;
	}

	public void setQmoid(long qmoid) {
		this.qmoid = qmoid;
	}

	@Column(name = "qmiid")
	public long getQmiid() {
		return qmiid;
	}

	public void setQmiid(long qmiid) {
		this.qmiid = qmiid;
	}

	@Column(name = "qmfaid")
	public long getQmfaid() {
		return qmfaid;
	}

	public void setQmfaid(long qmfaid) {
		this.qmfaid = qmfaid;
	}

	@Column(name = "qmid")
	public long getQmid() {
		return qmid;
	}

	public void setQmid(long qmid) {
		this.qmid = qmid;
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

	public QeasureOptionVO ptv(QeasureOptionVO qeasureOptionVO) {

		BeanUtil.copyPropertie(this, qeasureOptionVO);

		return qeasureOptionVO;
	}

}
