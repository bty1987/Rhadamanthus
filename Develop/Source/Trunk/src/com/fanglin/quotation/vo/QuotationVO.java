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
	
	private Float orderTotalPrice;
	
	private String versionId;

	private String quotationName;
	
	private String decorationStyle;
	
	private String createrId;
	
	private String createrName;
	
	private Timestamp createTime;
	
	private Float discount;
	
	private Float totalPrice;
	
	private Integer status;
	
	private Integer saveStatus;
	
	private String content;
	
	private Float latexCut;
	
	private Float managePrice;
	
	private Float manageRate;
	
	private Float trafficPrice;
	
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

	public Integer getSaveStatus() {
		return saveStatus;
	}

	public void setSaveStatus(Integer saveStatus) {
		this.saveStatus = saveStatus;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Float getLatexCut() {
		return latexCut;
	}

	public void setLatexCut(Float latexCut) {
		this.latexCut = latexCut;
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

}
