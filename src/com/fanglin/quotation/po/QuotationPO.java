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

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;


import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "quotation", catalog = "quotation")
public class QuotationPO implements Serializable {

	private static final long serialVersionUID = 3361405245563596740L;

	public static final int STATUS_DEFAULT_INT = 1;

	private long qid;
	
	private DecorationPO decoration;
	
	private String quotationName;
	
	private String decorationStyle;
	
	private Timestamp createTime;
	
	private UserPO createUser;
	
	private String content;

	private float undisPrice;
	
	private float disPrice;
	
	private float discount;
	
	private float totalPrice;
	
	private int status;
	
	private int saveStatus;
	
	private int calFlag = 1;
	
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

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(nullable = false, name = "orderId", referencedColumnName = "orderId")
	public DecorationPO getDecoration(){
		return decoration;
	}

	public void setDecoration(DecorationPO decoration){
		this.decoration = decoration;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "createUserId", referencedColumnName = "userId")
	public UserPO getCreateUser(){
		return createUser;
	}

	public void setCreateUser(UserPO createUser){
		this.createUser = createUser;
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
	
	@Column(name = "status")
	public int getStatus(){
		return status;
	}

	public void setStatus(int status){
		this.status = status;
	}
	
	@Column(name = "totalPrice")
	public float getTotalPrice(){
		return totalPrice;
	}

	public void setTotalPrice(float totalPrice){
		this.totalPrice = totalPrice;
	}
	
	@Column(name = "saveStatus")
	public int getSaveStatus(){
		return saveStatus;
	}
	
	public void setSaveStatus(int saveStatus){
		this.saveStatus = saveStatus;
	}
	
	@Column(name = "calFlag")
	public int getCalFlag(){
		return calFlag;
	}

	public void setCalFlag(int calFlag){
		this.calFlag = calFlag;
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

}
