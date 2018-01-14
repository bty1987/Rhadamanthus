/**
 * @File Name		: QuotationVO
 * @Package   	: com.fanglin.vo
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.quotation.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

public class QuotationVO implements Serializable {

	private static final long serialVersionUID = -62258203481876631L;

	private Long qid;
	
	private String orderId;
	
	private String orderAddr;
	
	private String customerName;
	
	private String designerName;
	
	private String supervisorName;
	
	private String designDepartmentName;
	
	private Float houseArea;
	
	private Float orderTotalPrice;
	
	private Float notSalesmanRate = 0f;
	
	private String versionId;

	private String quotationName;
	
	private String decorationStyle;
	
	private String createrId;
	
	private String createrName;
	
	private Timestamp createTime;
	
	private Float discount;
	
	private Float totalPrice;
	
	private Integer status;
	
	private Short type;
	
	private Float managePrice;
	
	private Float manageRate;
	
	private Float trafficPrice;
	
	private String content;
	
	private Float undisPrice;
	
	private Float disPrice;
	
	private Float trafficRate;
	
	public QuotationVO() {
		super();
	}

	public QuotationVO(Long qid) {
		super();
		this.qid = qid;
	}

	public Long getQid(){
		return qid;
	}

	public void setQid(Long qid){
		this.qid = qid;
	}

	public String getOrderId(){
		return orderId;
	}

	public void setOrderId(String orderId){
		this.orderId = orderId;
	}

	public String getOrderAddr() {
		return orderAddr;
	}

	public void setOrderAddr(String orderAddr) {
		this.orderAddr = orderAddr;
	}

	public String getCustomerName() {
		return customerName;
	}

	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}

	public String getDesignerName() {
		return designerName;
	}

	public String getDesignDepartmentName() {
		return designDepartmentName;
	}

	public String getSupervisorName() {
		return supervisorName;
	}

	public void setSupervisorName(String supervisorName) {
		this.supervisorName = supervisorName;
	}

	public void setDesignDepartmentName(String designDepartmentName) {
		this.designDepartmentName = designDepartmentName;
	}

	public Float getHouseArea() {
		return houseArea;
	}

	public void setHouseArea(Float houseArea) {
		this.houseArea = houseArea;
	}

	public void setDesignerName(String designerName) {
		this.designerName = designerName;
	}

	public String getQuotationName(){
		return quotationName;
	}

	public void setQuotationName(String quotationName){
		this.quotationName = quotationName;
	}

	public String getDecorationStyle(){
		return decorationStyle;
	}

	public void setDecorationStyle(String decorationStyle){
		this.decorationStyle = decorationStyle;
	}

	public String getCreaterId() {
		return createrId;
	}

	public void setCreaterId(String createrId) {
		this.createrId = createrId;
	}

	public String getCreaterName() {
		return createrName;
	}

	public void setCreaterName(String createrName) {
		this.createrName = createrName;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getCreateTime(){
		return createTime;
	}

	public void setCreateTime(Timestamp createTime){
		this.createTime = createTime;
	}

	public Float getDiscount(){
		return discount;
	}

	public void setDiscount(Float discount){
		this.discount = discount;
	}

	public Integer getStatus(){
		return status;
	}

	public void setStatus(Integer status){
		this.status = status;
	}

	public void setTotalPrice(Float totalPrice){
		this.totalPrice = totalPrice;
	}

	public Float getTotalPrice(){
		return totalPrice;
	}

	public void setVersionId(String versionId){
		this.versionId = versionId;
	}

	public String getVersionId(){
		return versionId;
	}

	public Float getOrderTotalPrice(){
		return orderTotalPrice;
	}

	public void setOrderTotalPrice(Float orderTotalPrice){
		this.orderTotalPrice = orderTotalPrice;
	}

	public Float getNotSalesmanRate() {
		return notSalesmanRate;
	}

	public void setNotSalesmanRate(Float notSalesmanRate) {
		this.notSalesmanRate = notSalesmanRate;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Float getManagePrice() {
		return managePrice;
	}

	public void setManagePrice(Float managePrice) {
		this.managePrice = managePrice;
	}

	public Float getManageRate() {
		return manageRate;
	}

	public void setManageRate(Float manageRate) {
		this.manageRate = manageRate;
	}

	public Float getTrafficPrice() {
		return trafficPrice;
	}

	public void setTrafficPrice(Float trafficPrice) {
		this.trafficPrice = trafficPrice;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Float getUndisPrice() {
		return undisPrice;
	}

	public void setUndisPrice(Float undisPrice) {
		this.undisPrice = undisPrice;
	}

	public Float getDisPrice() {
		return disPrice;
	}

	public void setDisPrice(Float disPrice) {
		this.disPrice = disPrice;
	}

	public Float getTrafficRate() {
		return trafficRate;
	}

	public void setTrafficRate(Float trafficRate) {
		this.trafficRate = trafficRate;
	}

}
