/**
 * @File Name		: QuotationVersionPO.java
 * @Package   	: com.fanglin.entity
 * @Version		: 1.0
 * @Date			: 2014-10-02
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			:
 * @Describing	: 
 */

package com.fanglin.quotation.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.data.po.PresignItemPO;

@Entity
@Table(name = "protationitem", catalog = "quotation")
public class ProtationItemPO implements Serializable {

	private static final long serialVersionUID = -2130952839756855205L;

	public static final short TYPE_BASICS_INT = 0;// 基础

	public static final short TYPE_PROJECT_INT = 1;// 工程

	public static final short TYPE_PRINCIPAL_INT = 2;// 主材

	public static final short TYPE_ADDWORK_INT = 3;// 增工

	public static final short TYPE_ADDMAIN_INT = 4;// 增主

	public static final short TYPE_CUTWORK_INT = 5;// 减工

	public static final short TYPE_CUTMAIN_INT = 6;// 减主

	public static final short TYPE_ACCWORK_INT = 7;// 赋工

	public static final short TYPE_ACCMAIN_INT = 8;// 赋主

	private long piid;

	private long pid;

	private PresignItemPO item;

	private String name;

	private int basicNum;

	private long cost;

	private long price;

	private int num;

	private short type;

	private short areaCale;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "piid")
	public long getPiid() {
		return piid;
	}

	public void setPiid(long piid) {
		this.piid = piid;
	}

	@Column(name = "pid")
	public long getPid() {
		return pid;
	}

	public void setPid(long pid) {
		this.pid = pid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "basicNum")
	public int getBasicNum() {
		return basicNum;
	}

	public void setBasicNum(int basicNum) {
		this.basicNum = basicNum;
	}

	@Column(name = "cost")
	public long getCost() {
		return cost;
	}

	public void setCost(long cost) {
		this.cost = cost;
	}

	@Column(name = "price")
	public long getPrice() {
		return price;
	}

	public void setPrice(long price) {
		this.price = price;
	}

	@Column(name = "num")
	public int getNum() {
		return num;
	}

	public void setNum(int num) {
		this.num = num;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "areaCale")
	public short getAreaCale() {
		return areaCale;
	}

	public void setAreaCale(short areaCale) {
		this.areaCale = areaCale;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "ppiid", referencedColumnName = "piid")
	public PresignItemPO getItem() {
		return item;
	}

	public void setItem(PresignItemPO item) {
		this.item = item;
	}

}
