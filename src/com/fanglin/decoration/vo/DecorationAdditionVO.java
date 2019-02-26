package com.fanglin.decoration.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

public class DecorationAdditionVO implements Serializable {

	private static final long serialVersionUID = 7595006714231918458L;

	private Long daid;

	private String orderId;

	private String designer;

	private String designDepartment;

	private String designRegion;

	private String salesman;

	private String salesDepartment;

	private String salesRegion;

	private Timestamp designProtectTime;

	private Timestamp salesProtectTime;

	public Long getDaid() {
		return daid;
	}

	public void setDaid(Long daid) {
		this.daid = daid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getDesigner() {
		return designer;
	}

	public void setDesigner(String designer) {
		this.designer = designer;
	}

	public String getDesignDepartment() {
		return designDepartment;
	}

	public void setDesignDepartment(String designDepartment) {
		this.designDepartment = designDepartment;
	}

	public String getDesignRegion() {
		return designRegion;
	}

	public void setDesignRegion(String designRegion) {
		this.designRegion = designRegion;
	}

	public String getSalesman() {
		return salesman;
	}

	public void setSalesman(String salesman) {
		this.salesman = salesman;
	}

	public String getSalesDepartment() {
		return salesDepartment;
	}

	public void setSalesDepartment(String salesDepartment) {
		this.salesDepartment = salesDepartment;
	}

	public String getSalesRegion() {
		return salesRegion;
	}

	public void setSalesRegion(String salesRegion) {
		this.salesRegion = salesRegion;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getDesignProtectTime() {
		return designProtectTime;
	}

	public void setDesignProtectTime(Timestamp designProtectTime) {
		this.designProtectTime = designProtectTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getSalesProtectTime() {
		return salesProtectTime;
	}

	public void setSalesProtectTime(Timestamp salesProtectTime) {
		this.salesProtectTime = salesProtectTime;
	}

}
