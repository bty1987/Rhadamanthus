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

package com.fanglin.quotation.vo;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.decoration.vo.DecorationVO;

public class AddReduceVO implements Serializable {

	private static final long serialVersionUID = -882438841944489334L;

	private Long arId;

	private String orderId;

	private DecorationVO decoration;

	private Long dpId;

	private Short type;

	private Short paytype;

	private Long undisPrice;

	private Long disPrice;

	private Long uncalPrice;

	private Long calPrice;

	private Long managePrice;

	private Integer manageRate;

	private Long total;

	private Integer discount;

	private Short status;

	private Timestamp createTime;

	private String content;

	private List<AddReduceItemVO> addReduceItems;

	public AddReduceVO() {
		super();
	}

	public AddReduceVO(DecorationVO decoration) {
		super();
		this.decoration = decoration;
	}

	public Long getArId() {
		return arId;
	}

	public void setArId(Long arId) {
		this.arId = arId;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public DecorationVO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationVO decoration) {
		this.decoration = decoration;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getPaytype() {
		return paytype;
	}

	public void setPaytype(Short paytype) {
		this.paytype = paytype;
	}

	public Long getTotal() {
		return total;
	}

	public void setTotal(Long total) {
		this.total = total;
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

	public Long getUncalPrice() {
		return uncalPrice;
	}

	public void setUncalPrice(Long uncalPrice) {
		this.uncalPrice = uncalPrice;
	}

	public Long getCalPrice() {
		return calPrice;
	}

	public void setCalPrice(Long calPrice) {
		this.calPrice = calPrice;
	}

	public Integer getDiscount() {
		return discount;
	}

	public void setDiscount(Integer discount) {
		this.discount = discount;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Long getDpId() {
		return dpId;
	}

	public void setDpId(Long dpId) {
		this.dpId = dpId;
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

	public List<AddReduceItemVO> getAddReduceItems() {
		return addReduceItems;
	}

	public void setAddReduceItems(List<AddReduceItemVO> addReduceItems) {
		this.addReduceItems = addReduceItems;
	}

}
