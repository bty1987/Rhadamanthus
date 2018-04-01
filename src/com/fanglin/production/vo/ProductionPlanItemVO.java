package com.fanglin.production.vo;

import java.io.Serializable;

public class ProductionPlanItemVO implements Serializable {

	private static final long serialVersionUID = 4002225185325794754L;

	private Long ppiid;

	private ProductionPlanVO productionPlan;

	private String typeno;

	private String name;

	private Float height;

	private Float width;

	private Float thick;

	private String color;

	private Float unitprice;

	private Float num;

	private Float total;

	private String comment;

	public ProductionPlanItemVO() {
		super();
	}

	public ProductionPlanItemVO(ProductionPlanVO productionPlan) {
		super();
		this.productionPlan = productionPlan;
	}

	public Long getPpiid() {
		return ppiid;
	}

	public void setPpiid(Long ppiid) {
		this.ppiid = ppiid;
	}

	public ProductionPlanVO getProductionPlan() {
		return productionPlan;
	}

	public void setProductionPlan(ProductionPlanVO productionPlan) {
		this.productionPlan = productionPlan;
	}

	public String getTypeno() {
		return typeno;
	}

	public void setTypeno(String typeno) {
		this.typeno = typeno;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Float getHeight() {
		return height;
	}

	public void setHeight(Float height) {
		this.height = height;
	}

	public Float getWidth() {
		return width;
	}

	public void setWidth(Float width) {
		this.width = width;
	}

	public Float getThick() {
		return thick;
	}

	public void setThick(Float thick) {
		this.thick = thick;
	}

	public String getColor() {
		return color;
	}

	public void setColor(String color) {
		this.color = color;
	}

	public Float getUnitprice() {
		return unitprice;
	}

	public void setUnitprice(Float unitprice) {
		this.unitprice = unitprice;
	}

	public Float getNum() {
		return num;
	}

	public void setNum(Float num) {
		this.num = num;
	}

	public Float getTotal() {
		return total;
	}

	public void setTotal(Float total) {
		this.total = total;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
