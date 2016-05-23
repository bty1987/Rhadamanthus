/**
 * @File Name		: QuotationVersionPO.java
 * @Package   	: com.fanglin.entity
 * @Version		: 1.0
 * @Date			: 2014-10-02
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			:
 * @Describing	: 
 */

package com.fanglin.quotation.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "quotationfuncationareaitem", catalog = "platform")
public class QuotationFunctionAreaItemPO implements Serializable {
	
	private static final long serialVersionUID = 13444646L;
	
	public static int TYPE_QUOTATIONITEM_INT = 0; // 系统报价项
	
	public static String TYPE_ORIGINAL_STR = "原始报价";
	
	public static String TYPE_ADD_STR = "增项";
	
	public static String TYPE_REDUCE_STR = "减项";
	
	private long qfaiId;

	private String uuid;
	
	private QuotationFunctionAreaPO quotationFunctionArea;
	
	private QuotationItemPO quotationItem;
	
	private float num;
	
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "qfaiId") 
	public long getQfaiId() {
		return qfaiId;
	}

	public void setQfaiId(long qfaiId) {
		this.qfaiId = qfaiId;
	}

	@Id
	@Column(name="uuid")
	public String getUuid(){
		return uuid;
	}
	
	public void setUuid(String uuid){
		this.uuid = uuid;
	}

	public void setQuotationFunctionArea(QuotationFunctionAreaPO quotationFunctionArea){
		this.quotationFunctionArea = quotationFunctionArea;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "functionAreaId", referencedColumnName = "autoId")
	public QuotationFunctionAreaPO getQuotationFunctionArea(){
		return quotationFunctionArea;
	}

	public void setQuotationItem(QuotationItemPO quotationItem){
		this.quotationItem = quotationItem;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "quoteItemId", referencedColumnName = "autoId")
	public QuotationItemPO getQuotationItem(){
		return quotationItem;
	}

	public void setNum(float num){
		this.num = num;
	}

	public float getNum(){
		return num;
	}
	
}
