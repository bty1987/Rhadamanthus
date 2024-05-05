package com.fanglin.data.po;

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
@Table(name = "presignitem", catalog = "quotation")
public class PresignItemPP implements Serializable {

	private static final long serialVersionUID = 3540081715461628769L;

	public static final String COLUMN_STATUS_STR = "status";

	public static final short STATUS_ENABLE_INT = 0;

	public static final short STATUS_DISABLE_INT = 1;

	public static final short ONETYPE_COMMON_INT = 0;

	public static final short ONETYPE_STANDARD_INT = 1;

	public static final short ONETYPE_MATESUB_INT = 2;

	public static final short TYPE_BASICS_INT = 0;// 功能区

	public static final short TYPE_OPTIONAL_INT = 1;// 可选配

	public static final short TYPE_CUSTOM_INT = 2;// 个性

	public static final short TYPE_ADDTION_INT = 3;// 赋能

	public static final short ATTTYPE_CURRENT_INT = 0;// 通用

	public static final short ATTTYPE_ENGINEERING_INT = 1;// 工程

	public static final short ATTTYPE_MATERIAL_INT = 2;// 主材

	private long piid;

	private PresignProducePO presignProduce;

	private String name;

	private int basicNum;

	private long cost;

	private long price;

	private int addPrice;

	private int subPrice;

	private int achePrice;

	private short areaCale;

	private short type;

	private short onetype;

	private short atttype;

	private short status;

	private String content;

	public PresignItemPP() {
		super();
	}

	public PresignItemPP(PresignProducePO presignProduce) {
		super();
		this.presignProduce = presignProduce;
	}

	public PresignItemPP(long piid) {
		super();
		this.piid = piid;
	}

	@Id
	@GeneratedValue
	@Column(name = "piid")
	public long getPiid() {
		return piid;
	}

	public void setPiid(long piid) {
		this.piid = piid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "ppid", referencedColumnName = "ppid")
	public PresignProducePO getPresignProduce() {
		return presignProduce;
	}

	public void setPresignProduce(PresignProducePO presignProduce) {
		this.presignProduce = presignProduce;
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

	@Column(name = "addPrice")
	public int getAddPrice() {
		return addPrice;
	}

	public void setAddPrice(int addPrice) {
		this.addPrice = addPrice;
	}

	@Column(name = "subPrice")
	public int getSubPrice() {
		return subPrice;
	}

	public void setSubPrice(int subPrice) {
		this.subPrice = subPrice;
	}

	@Column(name = "achePrice")
	public int getAchePrice() {
		return achePrice;
	}

	public void setAchePrice(int achePrice) {
		this.achePrice = achePrice;
	}

	@Column(name = "areaCale")
	public short getAreaCale() {
		return areaCale;
	}

	public void setAreaCale(short areaCale) {
		this.areaCale = areaCale;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "onetype")
	public short getOnetype() {
		return onetype;
	}

	public void setOnetype(short onetype) {
		this.onetype = onetype;
	}

	@Column(name = "atttype")
	public short getAtttype() {
		return atttype;
	}

	public void setAtttype(short atttype) {
		this.atttype = atttype;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

}
