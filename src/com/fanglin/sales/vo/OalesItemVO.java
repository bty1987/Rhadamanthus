package com.fanglin.sales.vo;

import java.io.Serializable;

/**
 * 其他销售单项目明细值对象 (OalesItemVO)
 *
 * 职责：外销单项目明细的数据传输对象
 */
public class OalesItemVO implements Serializable {

	private static final long serialVersionUID = 1L;

	/** 主键ID */
	private Long oiid;

	/** 外销单ID */
	private Long oid;

	/** 商品名称 */
	private String name;

	/** 规格 */
	private String format;

	/** 颜色 */
	private String color;

	/** 型号 */
	private String model;

	/** 价格（单位：分） */
	private Integer price;

	/** 数量 */
	private Long num;

	/** 小计（价格 × 数量，单位：分） */
	private Long total;

	/** 备注 */
	private String comment;

	public OalesItemVO() {
		super();
	}

	public OalesItemVO(String name, String format, String color, String model) {
		super();
		this.name = name;
		this.format = format;
		this.color = color;
		this.model = model;
	}

	public Long getOiid() {
		return oiid;
	}

	public void setOiid(Long oiid) {
		this.oiid = oiid;
	}

	public Long getOid() {
		return oid;
	}

	public void setOid(Long oid) {
		this.oid = oid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getFormat() {
		return format;
	}

	public void setFormat(String format) {
		this.format = format;
	}

	public String getColor() {
		return color;
	}

	public void setColor(String color) {
		this.color = color;
	}

	public String getModel() {
		return model;
	}

	public void setModel(String model) {
		this.model = model;
	}

	public Integer getPrice() {
		return price;
	}

	public void setPrice(Integer price) {
		this.price = price;
	}

	public Long getNum() {
		return num;
	}

	public void setNum(Long num) {
		this.num = num;
	}

	public Long getTotal() {
		return total;
	}

	public void setTotal(Long total) {
		this.total = total;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
}
