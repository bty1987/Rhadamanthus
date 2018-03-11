package com.fanglin.production.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="outsourceitem",catalog= "production")
public class OutsourceItemPO {

	public static final String COLUMN_OID =	 "oid" ;
	
	private long oiid;
	
	private long oid;
	
	private String name;
	
	private float height;
	
	private float width;
	
	private float thick;
	
	private String  modelling;
	
	private float num;
	
	private float unitprice;
	
	private long total;
	
	private String  comment;

	public OutsourceItemPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name="oiid")
	public long getOiid() {
		return oiid;
	}

	public void setOiid(long oiid) {
		this.oiid = oiid;
	}

	@Column(name="oid")
	public long getOid() {
		return oid;
	}

	public void setOid(long oid) {
		this.oid = oid;
	}
	
	@Column(name="name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name="height")
	public float getHeight() {
		return height;
	}

	public void setHeight(float height) {
		this.height = height;
	}

	@Column(name="width")
	public float getWidth() {
		return width;
	}

	public void setWidth(float width) {
		this.width = width;
	}

	@Column(name="thick")
	public float getThick() {
		return thick;
	}

	public void setThick(float thick) {
		this.thick = thick;
	}

	@Column(name="modelling")
	public String getModelling() {
		return modelling;
	}

	public void setModelling(String modelling) {
		this.modelling = modelling;
	}

	@Column(name="num")
	public float getNum() {
		return num;
	}

	public void setNum(float num) {
		this.num = num;
	}

	@Column(name="unitprice")
	public float getUnitprice() {
		return unitprice;
	}

	public void setUnitprice(float unitprice) {
		this.unitprice = unitprice;
	}
	
	@Column(name="total")
	public long getTotal() {
		return total;
	}

	public void setTotal(long total) {
		this.total = total;
	}
	
	@Column(name="comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
