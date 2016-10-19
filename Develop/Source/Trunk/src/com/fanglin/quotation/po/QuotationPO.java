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

import com.fanglin.decoration.po.DecorationOrderPO;
import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "quotation", catalog = "platform")
public class QuotationPO implements Serializable {

	private static final long serialVersionUID = 3361405245563596740L;

	public static final int STATUS_DEFAULT_INT = 1;
	
	public static final short TYPE_PART_INT = 0;
	
	public static final short TYPE_WHOLE_INT = 1;

	private long qid;
	
	private DecorationOrderPO decorationOrder;
	
	private String quotationName;
	
	private String decorationStyle;
	
	private Timestamp createTime;
	
	private UserPO createUser;
	
	private float discount;
	
	private float totalPrice;
	
	private int status;
	
	private short type;

	private int saveStatus;
	
	private int calFlag = 1;
	
	private float latexCut;
	
	private float managePrice;
	
	private float manageRate;
	
	private float trafficPrice;
	
	private float setpackage;
	
	private float basicPrice;
	
	private float qdiff;
	
	private float mdiff;
	
	private String content;
	
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
	public DecorationOrderPO getDecorationOrder(){
		return decorationOrder;
	}

	public void setDecorationOrder(DecorationOrderPO decorationOrder){
		this.decorationOrder = decorationOrder;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "createUserId", referencedColumnName = "userId")
	public UserPO getCreateUser(){
		return createUser;
	}

	public void setCreateUser(UserPO createUser){
		this.createUser = createUser;
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

	public Timestamp getCreateTime(){
		return createTime;
	}

	public void setCreateTime(Timestamp createTime){
		this.createTime = createTime;
	}

	public String getContent(){
		return content;
	}

	public void setContent(String content){
		this.content = content;
	}

	public float getDiscount(){
		return discount;
	}

	public void setDiscount(float discount){
		this.discount = discount;
	}

	public int getStatus(){
		return status;
	}

	public void setStatus(int status){
		this.status = status;
	}

	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	public void setTotalPrice(float totalPrice){
		this.totalPrice = totalPrice;
	}

	public float getTotalPrice(){
		return totalPrice;
	}

	public void setSaveStatus(int saveStatus){
		this.saveStatus = saveStatus;
	}

	public int getSaveStatus(){
		return saveStatus;
	}

	public void setCalFlag(int calFlag){
		this.calFlag = calFlag;
	}

	public int getCalFlag(){
		return calFlag;
	}

	public float getLatexCut() {
		return latexCut;
	}

	public void setLatexCut(float latexCut) {
		this.latexCut = latexCut;
	}

	public float getManagePrice() {
		return managePrice;
	}

	public void setManagePrice(float managePrice) {
		this.managePrice = managePrice;
	}

	public float getManageRate() {
		return manageRate;
	}

	public void setManageRate(float manageRate) {
		this.manageRate = manageRate;
	}

	public float getTrafficPrice() {
		return trafficPrice;
	}

	public void setTrafficPrice(float trafficPrice) {
		this.trafficPrice = trafficPrice;
	}

	public float getSetpackage() {
		return setpackage;
	}

	public void setSetpackage(float setpackage) {
		this.setpackage = setpackage;
	}

	public float getBasicPrice() {
		return basicPrice;
	}

	public void setBasicPrice(float basicPrice) {
		this.basicPrice = basicPrice;
	}

	public float getQdiff() {
		return qdiff;
	}

	public void setQdiff(float qdiff) {
		this.qdiff = qdiff;
	}

	public float getMdiff() {
		return mdiff;
	}

	public void setMdiff(float mdiff) {
		this.mdiff = mdiff;
	}

}
