/**
 * @FileName	: Region.java
 * @Package   	: com.fanglin.entity
 * @Version		: 1.0
 * @Date		: 2014-7-28
 * @Copyright	: Copyright Decoration 2014
 * @Author		: Howard
 * @Describing	: 
 */
package com.fanglin.system.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "region", catalog = "communion")
public class RegionPO implements Serializable {

	private static final long serialVersionUID = -3881595135226541201L;
	
	public static final String COLUMN_NO_STR = "no";
	
	public static final String COLUMN_NAME_STR = "name";
	
	public static final String COLUMN_PINYIN_STR = "pinyin";
	
	private int rid;

	private String no;
	
	private String name;
	
	private String pinyin;
	
	private double x;
	
	private double y;

	public RegionPO() {
		super();
	}

	public RegionPO(int rid) {
		super();
		this.rid = rid;
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
	
	@Column(name = COLUMN_NO_STR)
	public String getNo() {
		return no;
	}
	public void setNo(String no) {
		this.no = no;
	}
	
	@Column(name = COLUMN_NAME_STR)
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
	public double getX() {
		return x;
	}

	public void setX(double x) {
		this.x = x;
	}

	@Column(name = "y")
	public double getY() {
		return y;
	}

	public void setY(double y) {
		this.y = y;
	}

}
