package com.fanglin.system.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "cityproper", catalog = "communion")
public class CityProperPO implements Serializable {

	private static final long serialVersionUID = -187946615003407460L;

	public static final String COLUMN_NO_STR = "no";

	public static final String COLUMN_NAME_STR = "name";

	public static final String COLUMN_PINYIN_STR = "pinyin";

	private int cpid;

	private CityPO city;

	private String no;

	private String name;

	private String pinyin;

	private int x;

	private int y;

	public CityProperPO() {
	}

	public CityProperPO(int cpid) {
		this.cpid = cpid;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "cpid")
	public int getCpid() {
		return cpid;
	}

	public void setCpid(int cpid) {
		this.cpid = cpid;
	}

	@javax.persistence.ManyToOne(fetch = FetchType.EAGER)
	@javax.persistence.JoinColumn(nullable = false, name = "cid", referencedColumnName = "cid")
	public CityPO getCity() {
		return city;
	}

	public void setCity(CityPO city) {
		this.city = city;
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

	@Column(name = COLUMN_PINYIN_STR)
	public String getPinyin() {
		return pinyin;
	}

	public void setPinyin(String pinyin) {
		this.pinyin = pinyin;
	}

	@Column(name = "x")
	public int getX() {
		return x;
	}

	public void setX(int x) {
		this.x = x;
	}

	@Column(name = "y")
	public int getY() {
		return y;
	}

	public void setY(int y) {
		this.y = y;
	}

}
