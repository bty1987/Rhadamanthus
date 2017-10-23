package com.fanglin.data.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "chainpage", catalog = "platform")
public class ChainPagePO  implements java.io.Serializable {

	private static final long serialVersionUID = 6637157649679178006L;
	
	private long cpid;
	
	private String name;
	
	private String url;
	
	private String comment;
	
	public ChainPagePO() {
		super();
	}
	public ChainPagePO(long cpid) {
		super();
		this.cpid = cpid;
	}
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "cpid")
	public long getCpid() {
		return cpid;
	}

	public void setCpid(long cpid) {
		this.cpid = cpid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "url")
	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}	
}
