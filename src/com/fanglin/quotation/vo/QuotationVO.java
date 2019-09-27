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

	private Integer notSalesmanRate;

	private String no;

	private String quotationName;

	private String decorationStyle;

	private Integer creater;

	private Timestamp createTime;

	private Integer discount;

	private Long totalPrice;

	private Short defaults;

	private Short status;

	private Short type;

	private Long managePrice;

	private Integer manageRate;

	private Long trafficPrice;

	private String content;

	private Long undisPrice;

	private Long disPrice;

	private Integer trafficRate;

	private Long basePrice;

	public QuotationVO() {
		super();
	}

	public QuotationVO(Long qid) {
		super();
		this.qid = qid;
	}

	public Long getQid() {
		return qid;
	}

	public void setQid(Long qid) {
		this.qid = qid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getQuotationName() {
		return quotationName;
	}

	public void setQuotationName(String quotationName) {
		this.quotationName = quotationName;
	}

	public String getDecorationStyle() {
		return decorationStyle;
	}

	public void setDecorationStyle(String decorationStyle) {
		this.decorationStyle = decorationStyle;
	}

	public Integer getCreater() {
		return creater;
	}

	public void setCreater(Integer creater) {
		this.creater = creater;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public Integer getDiscount() {
		return discount;
	}

	public void setDiscount(Integer discount) {
		this.discount = discount;
	}

	public Short getDefaults() {
		return defaults;
	}

	public void setDefaults(Short defaults) {
		this.defaults = defaults;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public void setTotalPrice(Long totalPrice) {
		this.totalPrice = totalPrice;
	}

	public Long getTotalPrice() {
		return totalPrice;
	}

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public Integer getNotSalesmanRate() {
		return notSalesmanRate;
	}

	public void setNotSalesmanRate(Integer notSalesmanRate) {
		this.notSalesmanRate = notSalesmanRate;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Long getManagePrice() {
		return managePrice;
	}

	public void setManagePrice(Long managePrice) {
		this.managePrice = managePrice;
	}

	public Integer getManageRate() {
		return manageRate;
	}

	public void setManageRate(Integer manageRate) {
		this.manageRate = manageRate;
	}

	public Long getTrafficPrice() {
		return trafficPrice;
	}

	public void setTrafficPrice(Long trafficPrice) {
		this.trafficPrice = trafficPrice;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Long getUndisPrice() {
		return undisPrice;
	}

	public void setUndisPrice(Long undisPrice) {
		this.undisPrice = undisPrice;
	}

	public Long getDisPrice() {
		return disPrice;
	}

	public void setDisPrice(Long disPrice) {
		this.disPrice = disPrice;
	}

	public Integer getTrafficRate() {
		return trafficRate;
	}

	public void setTrafficRate(Integer trafficRate) {
		this.trafficRate = trafficRate;
	}

	public Long getBasePrice() {
		return basePrice;
	}

	public void setBasePrice(Long basePrice) {
		this.basePrice = basePrice;
	}

}
