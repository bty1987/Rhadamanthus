package com.fanglin.market.vo;

import java.io.Serializable;

public class EopinionsVO implements Serializable{

	private static final long serialVersionUID = 2750276200748956182L;

	private Long eoid;

	private Long ecid;

	private Long esid;

	private Short type;

	private String title;

	private String content;

	public EopinionsVO() {
		super();
	}

	public Long getEoid() {
		return eoid;
	}

	public void setEoid(Long eoid) {
		this.eoid = eoid;
	}

	public Long getEcid() {
		return ecid;
	}

	public void setEcid(Long ecid) {
		this.ecid = ecid;
	}

	public Long getEsid() {
		return esid;
	}

	public void setEsid(Long esid) {
		this.esid = esid;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

}
