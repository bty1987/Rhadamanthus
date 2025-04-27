package com.fanglin.communion.vo;

import java.io.Serializable;

public class PricePoolVO implements Serializable {

	private static final long serialVersionUID = 3944259900193775069L;

	private Long ppid;

	private GoodsPoolVO goodsPool;

	private String name;

	private Short type; // 0-正价/1-特价

	private Integer purchase; // 进价

	private Integer selling; // 售价

	private Integer confine; // 限价

	private Short ctype; // 结算类型,0:底价,1:点位

	private Integer cvalue; // 结算值 , 点位结算对应结算值为0~1之前三位小数 , 底价结算对应结算值为浮点数

	private String content;

	private Short status; // 状态, 0:启用,1:禁用

	public PricePoolVO() {
		super();
	}

	public PricePoolVO(Long ppid) {
		super();
		this.ppid = ppid;
	}

	public PricePoolVO(GoodsPoolVO goodsPool) {
		super();
		this.goodsPool = goodsPool;
	}

	public Long getPpid() {
		return ppid;
	}

	public void setPpid(Long ppid) {
		this.ppid = ppid;
	}

	public GoodsPoolVO getGoodsPool() {
		return goodsPool;
	}

	public void setGoodsPool(GoodsPoolVO goodsPool) {
		this.goodsPool = goodsPool;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Integer getPurchase() {
		return purchase;
	}

	public void setPurchase(Integer purchase) {
		this.purchase = purchase;
	}

	public Integer getSelling() {
		return selling;
	}

	public void setSelling(Integer selling) {
		this.selling = selling;
	}

	public Integer getConfine() {
		return confine;
	}

	public void setConfine(Integer confine) {
		this.confine = confine;
	}

	public Short getCtype() {
		return ctype;
	}

	public void setCtype(Short ctype) {
		this.ctype = ctype;
	}

	public Integer getCvalue() {
		return cvalue;
	}

	public void setCvalue(Integer cvalue) {
		this.cvalue = cvalue;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

}
