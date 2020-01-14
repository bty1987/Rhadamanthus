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

	private long ppiid;// 计划项ID

	private ProductionPlanPO productionPlan;// 计划ID

	private String typeno;// 类型编号

	private String name;// 名称

	private int height;// 高

	private int width;// 宽

	private int thick;// 厚

	private String color;// 颜色

	private int unitprice;// 单价

	private int num;// 数量

	private long total;// 总价

	private String comment;// 备注

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

	@Column(name = "color")
	public String getColor() {
		return color;
	}

	public void setColor(String color) {
		this.color = color;
	}

	@Column(name = "unitprice")
	public int getUnitprice() {
		return unitprice;
	}

	public void setUnitprice(int unitprice) {
		this.unitprice = unitprice;
	}

	@Column(name = "num")
	public int getNum() {
		return num;
	}

	public void setNum(int num) {
		this.num = num;
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
