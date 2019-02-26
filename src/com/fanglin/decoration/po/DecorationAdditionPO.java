package com.fanglin.decoration.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "decorationaddition", catalog = "decoration")
public class DecorationAdditionPO implements Serializable{

	private static final long serialVersionUID = -8541537240982313346L;
	
	public static final String DECORATION_ORDERID_STR = "orderId";
	
	private long daid;
	
	private String orderId;
	
	private String designer;
	
	private String designDepartment;
	
	private String designRegion;
	
	private String salesman;
	
	private String salesDepartment;
	
	private String salesRegion;
	
	private Timestamp designProtectTime;
	
	private Timestamp salesProtectTime;
	
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "daid")
	public long getDaid() {
		return daid;
	}

	public void setDaid(long daid) {
		this.daid = daid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "designer")
	public String getDesigner() {
		return designer;
	}

	public void setDesigner(String designer) {
		this.designer = designer;
	}

	@Column(name = "designDepartment")
	public String getDesignDepartment() {
		return designDepartment;
	}

	public void setDesignDepartment(String designDepartment) {
		this.designDepartment = designDepartment;
	}

	@Column(name = "designRegion")
	public String getDesignRegion() {
		return designRegion;
	}

	public void setDesignRegion(String designRegion) {
		this.designRegion = designRegion;
	}

	@Column(name = "salesman")
	public String getSalesman() {
		return salesman;
	}

	public void setSalesman(String salesman) {
		this.salesman = salesman;
	}

	@Column(name = "salesDepartment")
	public String getSalesDepartment() {
		return salesDepartment;
	}

	public void setSalesDepartment(String salesDepartment) {
		this.salesDepartment = salesDepartment;
	}

	@Column(name = "salesRegion")
	public String getSalesRegion() {
		return salesRegion;
	}

	public void setSalesRegion(String salesRegion) {
		this.salesRegion = salesRegion;
	}
	
	@Column(name = "designProtectTime")
	public Timestamp getDesignProtectTime() {
		return designProtectTime;
	}

	public void setDesignProtectTime(Timestamp designProtectTime) {
		this.designProtectTime = designProtectTime;
	}
	@Column(name = "salesProtectTime")
	public Timestamp getSalesProtectTime() {
		return salesProtectTime;
	}

	public void setSalesProtectTime(Timestamp salesProtectTime) {
		this.salesProtectTime = salesProtectTime;
	}

	public void clearDesign(){
		this.designer = "";
		this.designDepartment = "";
		this.designRegion = "";
	}

	public void clearSales(){
		this.salesman = "";
		this.salesDepartment = "";
		this.salesRegion = "";
	}
	
	public void setDesign(String designer, String designDepartment, String designRegion){
		
		if(this.designer == null || "".equals(this.designer))this.designer = designer;
		else this.designer = String.format("%s/%s", this.designer, designer);
		
		if(this.designDepartment == null || "".equals(this.designDepartment)) this.designDepartment = designDepartment;
		else this.designDepartment = String.format("%s/%s", this.designDepartment, designDepartment);
		
		if(this.designRegion == null || "".equals(this.designRegion)) this.designRegion = designRegion;
		else this.designRegion = String.format("%s/%s", this.designRegion, designRegion);
	}
	
	public void setSales(String salesman, String salesDepartment, String salesRegion){
		
		if(this.salesman == null || "".equals(this.salesman))this.salesman = salesman;
		else this.salesman = String.format("%s/%s", this.salesman, salesman);
		
		if(this.salesDepartment == null || "".equals(this.salesDepartment)) this.salesDepartment = salesDepartment;
		else this.salesDepartment = String.format("%s/%s", this.salesDepartment, salesDepartment);
		
		if(this.salesRegion == null || "".equals(this.salesRegion)) this.salesRegion = salesRegion;
		else this.salesRegion = String.format("%s/%s", this.salesRegion, salesRegion);
	}

}
