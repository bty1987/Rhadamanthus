package com.fanglin.data.common.vo;

public class ChainPageVO  implements java.io.Serializable {

	private static final long serialVersionUID = -7575546845469152553L;

	private Long cpid;
	
	private String name;
	
	private String url;
	
	private String comment;

	private short companymark;
	
	public Long getCpid() {
		return cpid;
	}

	public void setCpid(Long cpid) {
		this.cpid = cpid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public short getCompanymark() {
		return companymark;
	}

	public void setCompanymark(short companymark) {
		this.companymark = companymark;
	}
	
}
