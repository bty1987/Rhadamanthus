package com.fanglin.quotation.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.quotation.vo.QeasureFunctionAreaVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "qeasurefunctionarea", catalog = "quotetion")
public class QeasureFunctionAreaPO implements Serializable {

	private static final long serialVersionUID = 9119268993724712530L;

	private long qmfaid;

	private long qmid;

	private long faid;

	private String name;

	public QeasureFunctionAreaPO() {
		super();
	}

	@Id
	@GeneratedValue
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

	@Column(name = "faid")
	public long getFaid() {
		return faid;
	}

	public void setFaid(long faid) {
		this.faid = faid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public QeasureFunctionAreaVO ptv(QeasureFunctionAreaVO qeasureFunctionAreaVO) {

		BeanUtil.copyProperties(this, qeasureFunctionAreaVO, "");

		return qeasureFunctionAreaVO;
	}

}
