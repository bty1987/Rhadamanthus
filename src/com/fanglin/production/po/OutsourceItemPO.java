package com.fanglin.production.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "outsourceitem", catalog = "production")
public class OutsourceItemPO {

	public static final String COLUMN_OID = "oid";

	private long oiid;

	private long oid;

	private String name;

	private int height;

	private int width;

	private int thick;

	private String modelling;

	private int num;

	private int unitprice;

	private long total;

	private String comment;

	public OutsourceItemPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
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

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "height")
	public int getHeight() {
		return height;
	}

	public void setHeight(int height) {
		this.height = height;
	}

	@Column(name = "width")
	public int getWidth() {
		return width;
	}

	public void setWidth(int width) {
		this.width = width;
	}

	@Column(name = "thick")
	public int getThick() {
		return thick;
	}

	public void setThick(int thick) {
		this.thick = thick;
	}

	@Column(name = "modelling")
	public String getModelling() {
		return modelling;
	}

	public void setModelling(String modelling) {
		this.modelling = modelling;
	}

	@Column(name = "num")
	public int getNum() {
		return num;
	}

	public void setNum(int num) {
		this.num = num;
	}

	@Column(name = "unitprice")
	public int getUnitprice() {
		return unitprice;
	}

	public void setUnitprice(int unitprice) {
		this.unitprice = unitprice;
	}

	@Column(name = "total")
	public long getTotal() {
		return total;
	}

	public void setTotal(long total) {
		this.total = total;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
