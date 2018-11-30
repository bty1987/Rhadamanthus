package com.fanglin.communion.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "category", catalog = "communion")
public class CategoryPO implements java.io.Serializable {

	private static final long serialVersionUID = -8704336558286265464L;
	
	public static final String COLUMN_CID_STR = "cid";
	
	public static final String COLUMN_NO_STR = "no";
	
	private long cid;
	
	private String no;
	
	private String name;
	
	private String kino;
	
	private String kiname;

	public CategoryPO() {
		super();
	}

	public CategoryPO(long cid) {
		super();
		this.cid = cid;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "cid")
	public long getCid() {
		return this.cid;
	}

	public void setCid(long cid) {
		this.cid = cid;
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

}