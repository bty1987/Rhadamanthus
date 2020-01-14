package com.fanglin.production.vo;

import java.io.Serializable;

public class ProductionPlanItemVO implements Serializable {

	private static final long serialVersionUID = 4002225185325794754L;

	private Long ppiid;

	private ProductionPlanVO productionPlan;

	private String typeno;

	private String name;

	private Integer height;

	private Integer width;

	private Integer thick;

	private String color;

	private Integer unitprice;

	private Integer num;

	private Long total;

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

	public Integer getHeight() {
		return height;
	}

	public void setHeight(Integer height) {
		this.height = height;
	}

	public Integer getWidth() {
		return width;
	}

	public void setWidth(Integer width) {
		this.width = width;
	}

	public Integer getThick() {
		return thick;
	}

	public void setThick(Integer thick) {
		this.thick = thick;
	}

	public String getColor() {
		return color;
	}

	public void setColor(String color) {
		this.color = color;
	}

	public Integer getUnitprice() {
		return unitprice;
	}

	public void setUnitprice(Integer unitprice) {
		this.unitprice = unitprice;
	}

	public Integer getNum() {
		return num;
	}

	public void setNum(Integer num) {
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
