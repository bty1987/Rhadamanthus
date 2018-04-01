package com.fanglin.production.po;

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
@Table(name = "productionplanitem", catalog = "production")
public class ProductionPlanItemPO implements Serializable {

	private static final long serialVersionUID = -1204202140506616437L;

	public static final String COLUMN_PPID_STR = "productionPlan.ppid";

	private long ppiid;

	private ProductionPlanPO productionPlan;

	private String typeno;

	private String name;

	private float height;

	private float width;

	private float thick;

	private String color;

	private float unitprice;

	private float num;

	private float total;

	private String comment;

	public ProductionPlanItemPO() {
		super();

	}

	public ProductionPlanItemPO(ProductionPlanPO productionPlan) {
		super();
		this.productionPlan = productionPlan;
	}

	@Id
	@GeneratedValue
	@Column(name = "ppiid")
	public long getPpiid() {
		return ppiid;
	}

	public void setPpiid(long ppiid) {
		this.ppiid = ppiid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "ppid", referencedColumnName = "ppid")
	public ProductionPlanPO getProductionPlan() {
		return productionPlan;
	}

	public void setProductionPlan(ProductionPlanPO productionPlan) {
		this.productionPlan = productionPlan;
	}

	@Column(name = "typeno")
	public String getTypeno() {
		return typeno;
	}

	public void setTypeno(String typeno) {
		this.typeno = typeno;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "height")
	public float getHeight() {
		return height;
	}

	public void setHeight(float height) {
		this.height = height;
	}

	@Column(name = "width")
	public float getWidth() {
		return width;
	}

	public void setWidth(float width) {
		this.width = width;
	}

	@Column(name = "thick")
	public float getThick() {
		return thick;
	}

	public void setThick(float thick) {
		this.thick = thick;
	}

	@Column(name = "color")
	public String getColor() {
		return color;
	}

	public void setColor(String color) {
		this.color = color;
	}

	@Column(name = "unitprice")
	public float getUnitprice() {
		return unitprice;
	}

	public void setUnitprice(float unitprice) {
		this.unitprice = unitprice;
	}

	@Column(name = "num")
	public float getNum() {
		return num;
	}

	public void setNum(float num) {
		this.num = num;
	}

	@Column(name = "total")
	public float getTotal() {
		return total;
	}

	public void setTotal(float total) {
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
