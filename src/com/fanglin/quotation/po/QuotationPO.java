/**
 * @File Name		: QuotationVersionPO.java
 * @Package   	: com.fanglin.entity
 * @Version		: 1.0
 * @Date			: 2014-7-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.quotation.po;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.DateUtil;

@Entity
@Table(name = "quotation", catalog = "quotation")
public class QuotationPO implements Serializable {

	private static final long serialVersionUID = 3361405245563596740L;

	public static final short 	DEFAULTS_NONDEFAULT_SHORT = 0;
	
	public static final short 	DEFAULTS_DEFAULT_SHORT = 1;
	
	public static final short STATUS_DISABLED_SHORT = 1;
	
	public static final short STATUS_ENABLED_SHORT = 0;

	private long qid;
	
	private String orderId;
	
	private String quotationName;
	
	private String decorationStyle;
	
	private Timestamp createTime;
	
	private UserPO creater;
	
	private String content;

	private float undisPrice;
	
	private float disPrice;
	
	private float discount;
	
	private float totalPrice;
	
	private short defaults;
	
	private short status;
	
	private float managePrice;
	
	private float manageRate;
	
	private float trafficPrice;
	
	private float trafficRate;

	public QuotationPO(long qid){
		this.qid = qid;
	}
	
	public QuotationPO(){
		
	}
	@Id
	@GeneratedValue
	@Column(name = "qId")
	public long getQid(){
		return qid;
	}

	public void setQid(long qid){
		this.qid = qid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}


	@Column(name = "quotationName")
	public String getQuotationName(){
		return quotationName;
	}

	public void setQuotationName(String quotationName){
		this.quotationName = quotationName;
	}
	
	@Column(name = "decorationStyle")
	public String getDecorationStyle(){
		return decorationStyle;
	}

	public void setDecorationStyle(String decorationStyle){
		this.decorationStyle = decorationStyle;
	}
	
	@Column(name = "createTime")
	public Timestamp getCreateTime(){
		return createTime;
	}

	public void setCreateTime(Timestamp createTime){
		this.createTime = createTime;
	}
	
	@Column(name = "content")
	public String getContent(){
		return content;
	}
	
	public void setContent(String content){
		this.content = content;
	}
	
	@Column(name = "discount")
	public float getDiscount(){
		return discount;
	}

	public void setDiscount(float discount){
		this.discount = discount;
	}
	
	@Column(name = "defaults")
	public short getDefaults() {
		return defaults;
	}

	public void setDefaults(short defaults) {
		this.defaults = defaults;
	}
	
	
	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "totalPrice")
	public float getTotalPrice(){
		return totalPrice;
	}

	public void setTotalPrice(float totalPrice){
		this.totalPrice = totalPrice;
	}
	
	@Column(name = "managePrice")
	public float getManagePrice() {
		return managePrice;
	}

	public void setManagePrice(float managePrice) {
		this.managePrice = managePrice;
	}
	
	@Column(name = "manageRate")
	public float getManageRate() {
		return manageRate;
	}

	public void setManageRate(float manageRate) {
		this.manageRate = manageRate;
	}
	
	@Column(name = "trafficPrice")
	public float getTrafficPrice() {
		return trafficPrice;
	}

	public void setTrafficPrice(float trafficPrice) {
		this.trafficPrice = trafficPrice;
	}
	
	@Column(name = "undisPrice")
	public float getUndisPrice() {
		return undisPrice;
	}

	public void setUndisPrice(float undisPrice) {
		this.undisPrice = undisPrice;
	}
	@Column(name = "disPrice")
	public float getDisPrice() {
		return disPrice;
	}

	public void setDisPrice(float disPrice) {
		this.disPrice = disPrice;
	}

	@Column(name = "trafficRate")
	public float getTrafficRate() {
		return trafficRate;
	}

	public void setTrafficRate(float trafficRate) {
		this.trafficRate = trafficRate;
	}
	
	public void ptp(String orderId,UserPO userPO,String name,String style){
		
		this.setOrderId(orderId);
		this.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		this.setCreater(userPO);
		this.setQuotationName(name);
		this.setDecorationStyle(style);
		this.setDiscount(10);
		this.setTotalPrice(0);
		this.setContent("");
		this.setDefaults(QuotationPO.DEFAULTS_DEFAULT_SHORT); // 设置复制报价为默认报价
	}
}
