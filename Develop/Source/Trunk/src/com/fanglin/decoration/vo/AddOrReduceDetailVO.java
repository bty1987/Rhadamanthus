/**
 * @File Name		: AddReduceVO.java
 * @Package   	: com.fanglin.vo
 * @Version		: 1.0
 * @Date			: 2014-9-22
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.vo;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;

import org.apache.struts2.json.annotations.JSON;

import com.google.gson.annotations.SerializedName;

public class AddOrReduceDetailVO implements Serializable {

	private static final long serialVersionUID = 7416960652933057166L;

	@SerializedName("增减项编号")
	private int arId;

	@SerializedName("订单编号")
	private String OrderId;

	@SerializedName("报价版本编号")
	private String versionId;

	@SerializedName("报价版本")
	private String versionName;
	
	@SerializedName("订单活动")
	private String orderActivity;
	
	@SerializedName("合同总额")
	private Float orderTotalPrice;
	
	@SerializedName("报价折扣")
	private Float quotationDiscount;
	
	@SerializedName("报价编号")
	private Long quotationId;
	
	@SerializedName("增减项类别")
	private int addReduceType;
	
	@SerializedName("总金额")
	private Float addReduceTotal;
	
	@SerializedName("收款状况")
	private int addReduceStatus;
	
	@SerializedName("创建时间")
	private Timestamp createTime;
	
	@SerializedName("增减项描述")
	private String addReduceDes;
	
	@SerializedName("收款编号")
	private Long orderPaymentId;
	
	@SerializedName("设计师编号")
	private String designerId;
	
	@SerializedName("设计师")
	private String designer;

	@SerializedName("增减项明细")
	private List<AddOrReduceItemVO> addOrReduceItems;
	
	public AddOrReduceDetailVO() {
		super();
	}

	public AddOrReduceDetailVO(int arId) {
		super();
		this.arId = arId;
	}

	public int getArId(){
		return arId;
	}

	public void setArId(int arId){
		this.arId = arId;
	}

	public String getOrderId(){
		return OrderId;
	}

	public void setOrderId(String orderId){
		OrderId = orderId;
	}

	public int getAddReduceType(){
		return addReduceType;
	}

	public void setAddReduceType(int addReduceType){
		this.addReduceType = addReduceType;
	}

	public Float getAddReduceTotal(){
		return addReduceTotal;
	}

	public void setAddReduceTotal(Float addReduceTotal){
		this.addReduceTotal = addReduceTotal;
	}

	public int getAddReduceStatus(){
		return addReduceStatus;
	}

	public void setAddReduceStatus(int addReduceStatus){
		this.addReduceStatus = addReduceStatus;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCreateTime(){
		return createTime;
	}

	public void setCreateTime(Timestamp createTime){
		this.createTime = createTime;
	}

	public String getAddReduceDes(){
		return addReduceDes;
	}

	public void setAddReduceDes(String addReduceDes){
		this.addReduceDes = addReduceDes;
	}

	public void setOrderPaymentId(Long orderPaymentId){
		this.orderPaymentId = orderPaymentId;
	}

	public Long getOrderPaymentId(){
		return orderPaymentId;
	}

	public void setAddOrReduceItems(List<AddOrReduceItemVO> addOrReduceItems){
		this.addOrReduceItems = addOrReduceItems;
	}

	public List<AddOrReduceItemVO> getAddOrReduceItems(){
		return addOrReduceItems;
	}

	public void setOrderTotalPrice(Float orderTotalPrice){
		this.orderTotalPrice = orderTotalPrice;
	}

	public Float getOrderTotalPrice(){
		return orderTotalPrice;
	}

	public void setQuotationDiscount(Float quotationDiscount){
		this.quotationDiscount = quotationDiscount;
	}

	public Float getQuotationDiscount(){
		return quotationDiscount;
	}

	public void setVersionName(String versionName){
		this.versionName = versionName;
	}

	public String getVersionName(){
		return versionName;
	}

	public void setVersionId(String versionId){
		this.versionId = versionId;
	}

	public String getVersionId(){
		return versionId;
	}

	public void setDesigner(String designer){
		this.designer = designer;
	}

	public String getDesigner(){
		return designer;
	}

	public void setDesignerId(String designerId){
		this.designerId = designerId;
	}

	public String getDesignerId(){
		return designerId;
	}

	public void setQuotationId(Long quotationId){
		this.quotationId = quotationId;
	}

	public Long getQuotationId(){
		return quotationId;
	}

	public void setOrderActivity(String orderActivity){
		this.orderActivity = orderActivity;
	}

	public String getOrderActivity(){
		return orderActivity;
	}

}
