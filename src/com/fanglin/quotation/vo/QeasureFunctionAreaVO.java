package com.fanglin.quotation.vo;

import java.io.Serializable;
import java.util.List;

public class QeasureFunctionAreaVO implements Serializable {

	private static final long serialVersionUID = 4580548424640135089L;

	private Long qmfaid;

	private Long qmid;

	private Long faid;

	private String name;

	private List<QeasureItemVO> items;

	public QeasureFunctionAreaVO() {
		super();
	}

	public QeasureFunctionAreaVO(List<QeasureItemVO> items) {
		super();
		this.items = items;
	}

	public Long getQmfaid() {
		return qmfaid;
	}

	public void setQmfaid(Long qmfaid) {
		this.qmfaid = qmfaid;
	}

	public Long getQmid() {
		return qmid;
	}

	public void setQmid(Long qmid) {
		this.qmid = qmid;
	}

	public Long getFaid() {
		return faid;
	}

	public void setFaid(Long faid) {
		this.faid = faid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<QeasureItemVO> getItems() {
		return items;
	}

	public void setItems(List<QeasureItemVO> items) {
		this.items = items;
	}

}
