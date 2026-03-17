package com.fanglin.sales.po;

import java.io.Serializable;
import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.sales.vo.OalesItemVO;
import com.fanglin.utils.BeanUtil;

/**
 * 其他销售单项目明细 (OalesItemPO)
 * 对应表：sales.oalesitem
 *
 * 职责：存储外销单的商品明细信息
 */
@Entity
@Table(name = "oalesitem", catalog = "sales")
public class OalesItemPO implements Serializable {

	private static final long serialVersionUID = 1L;

	public static final String COLUMN_OIID_STR = "oiid";

	public static final String COLUMN_OID_STR = "oid";

	/** 主键ID */
	private long oiid;

	/** 外销单ID（关联 oales.oid） */
	private long oid;

	/** 商品名称 */
	private String name;

	/** 规格 */
	private String format;

	/** 颜色 */
	private String color;

	/** 型号 */
	private String model;

	/** 价格（单位：分） */
	private int price;

	/** 数量 */
	private long num;

	/** 小计（价格 × 数量，单位：分） */
	private long total;

	/** 备注 */
	private String comment;

	/** 关联的外销单对象 */
	private OalesPO oales;

	public OalesItemPO() {
		super();
	}

	public OalesItemPO(String name, String format, String color, String model) {
		super();
		this.name = name;
		this.format = format;
		this.color = color;
		this.model = model;
	}

	@Id
	@GeneratedValue
	@Column(name = "oiid")
	public long getOiid() {
		return oiid;
	}

	public void setOiid(long oiid) {
		this.oiid = oiid;
	}

	@Column(name = "oid")
	public long getOid() {
		return oid;
	}

	public void setOid(long oid) {
		this.oid = oid;
	}

	@Column(name = "name", length = 200)
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "format", length = 100)
	public String getFormat() {
		return format;
	}

	public void setFormat(String format) {
		this.format = format;
	}

	@Column(name = "color", length = 100)
	public String getColor() {
		return color;
	}

	public void setColor(String color) {
		this.color = color;
	}

	@Column(name = "model", length = 100)
	public String getModel() {
		return model;
	}

	public void setModel(String model) {
		this.model = model;
	}

	@Column(name = "price")
	public int getPrice() {
		return price;
	}

	public void setPrice(int price) {
		this.price = price;
	}

	@Column(name = "num")
	public long getNum() {
		return num;
	}

	public void setNum(long num) {
		this.num = num;
	}

	@Column(name = "total")
	public long getTotal() {
		return total;
	}

	public void setTotal(long total) {
		this.total = total;
	}

	@Column(name = "comment", length = 500)
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "oid", insertable = false, updatable = false)
	public OalesPO getOales() {
		return oales;
	}

	public void setOales(OalesPO oales) {
		this.oales = oales;
	}

	/**
	 * PO 转 VO 方法
	 */
	public OalesItemVO ptv(OalesItemVO oalesItemVO) {
		BeanUtil.copyProperties(this, oalesItemVO, Arrays.asList("oales"));
		return oalesItemVO;
	}
}
