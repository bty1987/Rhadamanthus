package com.fanglin.system.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "role", catalog = "communion")
public class RolePO implements Serializable {

	private static final long serialVersionUID = 8111974803190366547L;
	
	public static final String SUPER_NO_STR = "1";
	
	private int rid;

	private String no;

	private String name;
	
	private short level;

	private String content;
	
	private int company;
	
	private String pinyin;
	
	public RolePO(){
		super();
	}
	
	public RolePO(int rid) {
		super();
		this.rid = rid;
	}

	public RolePO(String no){
		super();
		this.no = no;
	}
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "rid") 
	public int getRid() {
		return rid;
	}

	public void setRid(int rid) {
		this.rid = rid;
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

	@Column(name = "level")
	public short getLevel() {
		return level;
	}

	public void setLevel(short level) {
		this.level = level;
	}

	@Column(name = "content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}
	
	@Column(name = "pinyin")
	public String getPinyin() {
		return pinyin;
	}

	public void setPinyin(String pinyin) {
		this.pinyin = pinyin;
	}

	
}
