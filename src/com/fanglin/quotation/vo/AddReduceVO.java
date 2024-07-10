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

import com.fanglin.data.common.vo.ConstructionNodeVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.vo.UserBaseVO;

public class AddReduceVO implements Serializable {

	private static final long serialVersionUID = -882438841944489334L;

	private Long arId;

	private String orderId;

	private DecorationVO decoration;

	private Long dpId;

	private ConstructionNodeVO constructionNode;

	private Short type;

	private Short atttype;

	private Short paytype;

	private Integer discount;

	private Long managePrice;

	private Integer manageRate;

	private Short manageDiscount;

	private Long taxPrice;

	private Integer taxRate;

	private Short taxDiscount;

	private Long undisPrice;

	private Long disPrice;

	private Long uncalPrice;

	private Long calPrice;

	private Long consPrice;

	private Long total;

	private Short schedule;

	private Short status;

	private Short isAffirm;

	private Timestamp createTime;

	private Timestamp confirmTime;

	private Timestamp sendTime;

	private Timestamp affirmTime;

	private String content;

	private UserBaseVO creater;

	private List<AddReduceItemVO> addReduceItems;

	public AddReduceVO() {
		super();
	}

	public AddReduceVO(DecorationVO decoration, UserBaseVO creater, ConstructionNodeVO constructionNode) {
		super();
		this.decoration = decoration;
		this.creater = creater;
		this.constructionNode = constructionNode;
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

	public Long getDpId() {
		return dpId;
	}

	public void setDpId(Long dpId) {
		this.dpId = dpId;
	}

	public ConstructionNodeVO getConstructionNode() {
		return constructionNode;
	}

	public void setConstructionNode(ConstructionNodeVO constructionNode) {
		this.constructionNode = constructionNode;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getAtttype() {
		return atttype;
	}

	public void setAtttype(Short atttype) {
		this.atttype = atttype;
	}

	public Short getPaytype() {
		return paytype;
	}

	public void setPaytype(Short paytype) {
		this.paytype = paytype;
	}

	public Integer getDiscount() {
		return discount;
	}

	public void setDiscount(Integer discount) {
		this.discount = discount;
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

	public Short getManageDiscount() {
		return manageDiscount;
	}

	public void setManageDiscount(Short manageDiscount) {
		this.manageDiscount = manageDiscount;
	}

	public Long getTaxPrice() {
		return taxPrice;
	}

	public void setTaxPrice(Long taxPrice) {
		this.taxPrice = taxPrice;
	}

	public Integer getTaxRate() {
		return taxRate;
	}

	public void setTaxRate(Integer taxRate) {
		this.taxRate = taxRate;
	}

	public Short getTaxDiscount() {
		return taxDiscount;
	}

	public void setTaxDiscount(Short taxDiscount) {
		this.taxDiscount = taxDiscount;
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

	public Long getConsPrice() {
		return consPrice;
	}

	public void setConsPrice(Long consPrice) {
		this.consPrice = consPrice;
	}

	public Long getTotal() {
		return total;
	}

	public void setTotal(Long total) {
		this.total = total;
	}

	public Short getSchedule() {
		return schedule;
	}

	public void setSchedule(Short schedule) {
		this.schedule = schedule;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Short getIsAffirm() {
		return isAffirm;
	}

	public void setIsAffirm(Short isAffirm) {
		this.isAffirm = isAffirm;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public List<AddReduceItemVO> getAddReduceItems() {
		return addReduceItems;
	}

	public void setAddReduceItems(List<AddReduceItemVO> addReduceItems) {
		this.addReduceItems = addReduceItems;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getConfirmTime() {
		return confirmTime;
	}

	public void setConfirmTime(Timestamp confirmTime) {
		this.confirmTime = confirmTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getSendTime() {
		return sendTime;
	}

	public void setSendTime(Timestamp sendTime) {
		this.sendTime = sendTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getAffirmTime() {
		return affirmTime;
	}

	public void setAffirmTime(Timestamp affirmTime) {
		this.affirmTime = affirmTime;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}
}
