package com.fanglin.quotation.vo;

import java.io.Serializable;
import java.util.List;

public class QeasureItemVO implements Serializable {

	private static final long serialVersionUID = 5961847853767704918L;

	private Long qmiid;

	private Long qmid;

	private Long qmfaid;

	private String name;

	private Short type;

	private Short atttype;

	private Short require;

	private String content;

	private List<QeasureOptionVO> options;

	public QeasureItemVO() {
		super();
	}

	public QeasureItemVO(List<QeasureOptionVO> options) {
		super();
		this.options = options;
	}

	public QeasureItemVO(Long qmiid) {
		super();
		this.qmiid = qmiid;
	}

	public Long getQmiid() {
		return qmiid;
	}

	public void setQmiid(Long qmiid) {
		this.qmiid = qmiid;
	}

	public Long getQmid() {
		return qmid;
	}

	public void setQmid(Long qmid) {
		this.qmid = qmid;
	}

	public Long getQmfaid() {
		return qmfaid;
	}

	public void setQmfaid(Long qmfaid) {
		this.qmfaid = qmfaid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getAtttype() {
		return atttype;
	}

	public void setAtttype(Short atttype) {
		this.atttype = atttype;
	}

	public Short getRequire() {
		return require;
	}

	public void setRequire(Short require) {
		this.require = require;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public List<QeasureOptionVO> getOptions() {
		return options;
	}

	public void setOptions(List<QeasureOptionVO> options) {
		this.options = options;
	}

}
