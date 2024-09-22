package com.fanglin.communion.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "brandpool", catalog = "communion")
public class BrandPoolPO implements Serializable {

	private static final long serialVersionUID = -5704447667448457706L;

	public static final short STATUS_ENABLE_INT = 0;

	private long bpid;

	private CategoryPO category;

	private String no;

	private String name;

	private String pinyin;

	private String kino;

	private String kiname;

	private short status;

	private String comment;

	@Id
	@GeneratedValue
	@Column(name = "bpid")
	public long getBpid() {
		return bpid;
	}

	public void setBpid(long bpid) {
		this.bpid = bpid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cid", referencedColumnName = "cid")
	public CategoryPO getCategory() {
		return category;
	}

	public void setCategory(CategoryPO category) {
		this.category = category;
	}

	@Column(name = "no")
	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "pinyin")
	public String getPinyin() {
		return pinyin;
	}

	public void setPinyin(String pinyin) {
		this.pinyin = pinyin;
	}

	@Column(name = "kino")
	public String getKino() {
		return kino;
	}

	public void setKino(String kino) {
		this.kino = kino;
	}

	@Column(name = "kiname")
	public String getKiname() {
		return kiname;
	}

	public void setKiname(String kiname) {
		this.kiname = kiname;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
}
