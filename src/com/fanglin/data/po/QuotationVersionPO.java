/**
 * @File Name		: QuotationVersionPO.java
 * @Package   	: com.fanglin.entity
 * @Version		: 1.0
 * @Date			: 2014-7-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "quotationVersion", catalog = "quotation")
public class QuotationVersionPO implements Serializable {

	private static final long serialVersionUID = -852822561077114137L;

	public static final short DEFAULTFLAG_DEFAULT_INT = 1;

	public static final short DEFAULTFLAG_INIT_INT = 0;

	private long qvId;

	private String no;

	private String name;

	private int trafficRate;

	private short trafficDiscount;

	private int manageRate;

	private short manageDiscount;

	private int offset;

	private short type;

	private short defaultFlag;

	private String comment;

	private int company;

	public QuotationVersionPO() {
	}

	public QuotationVersionPO(String no) {
		this.no = no;
	}

	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "qvId")
	public long getQvId() {
		return qvId;
	}

	public void setQvId(long qvId) {
		this.qvId = qvId;
	}

	@Id
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

	@Column(name = "trafficRate")
	public int getTrafficRate() {
		return trafficRate;
	}

	public void setTrafficRate(int trafficRate) {
		this.trafficRate = trafficRate;
	}

	@Column(name = "trafficDiscount")
	public short getTrafficDiscount() {
		return trafficDiscount;
	}

	public void setTrafficDiscount(short trafficDiscount) {
		this.trafficDiscount = trafficDiscount;
	}

	@Column(name = "manageRate")
	public int getManageRate() {
		return manageRate;
	}

	public void setManageRate(int manageRate) {
		this.manageRate = manageRate;
	}

	@Column(name = "manageDiscount")
	public short getManageDiscount() {
		return manageDiscount;
	}

	public void setManageDiscount(short manageDiscount) {
		this.manageDiscount = manageDiscount;
	}

	@Column(name = "offset")
	public int getOffset() {
		return offset;
	}

	public void setOffset(int offset) {
		this.offset = offset;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "defaultFlag")
	public short getDefaultFlag() {
		return defaultFlag;
	}

	public void setDefaultFlag(short defaultFlag) {
		this.defaultFlag = defaultFlag;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
