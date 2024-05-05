package com.fanglin.communion.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "assistanceitem", catalog = "communion")
public class AssistanceItemPO implements Serializable {

	private static final long serialVersionUID = -7900519666635150174L;

	public static final short TYPE_HELP_INT = 5;

	private long aiid;

	private long aid;

	private String title;

	private String content;

	private short sort;

	public AssistanceItemPO() {
		super();
	}

	@Id
	@GeneratedValue
	@Column(name = "aiid")
	public long getAiid() {
		return aiid;
	}

	public void setAiid(long aiid) {
		this.aiid = aiid;
	}

	@Column(name = "aid")
	public long getAid() {
		return aid;
	}

	public void setAid(long aid) {
		this.aid = aid;
	}

	@Column(name = "title")
	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	@Column(name = "content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@Column(name = "sort")
	public short getSort() {
		return sort;
	}

	public void setSort(short sort) {
		this.sort = sort;
	}

}
