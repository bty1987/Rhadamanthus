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

import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.vo.UserBaseVO;

public class QuotationVO implements Serializable {

	private static final long serialVersionUID = -62258203481876631L;

	private Long qid;

	private String orderId;

	private DecorationVO decoration;

	private String name;

	private String style;

	private Timestamp createTime;

	private UserBaseVO creater;

	private Long basePrice;

	private Long undisPrice;

	private Long disPrice;

	private Integer discount;

	private Long managePrice;

	private Integer manageRate;

	private Short manageDiscount;

	private Long trafficPrice;

	private Integer trafficRate;

	private Short trafficDiscount;

	private Long taxPrice;

	private Integer taxRate;

	private Short taxDiscount;

	private Long unachePrice;

	private Long costPrice;

	private Long totalPrice;

	private Short defaults;

	private Short status;

	private String content;

	private Integer notSalesmanRate;

	private String no;

	private Short type;

	public QuotationVO() {
		super();
	}

	public QuotationVO(DecorationVO decoration, UserBaseVO creater) {
		super();
		this.decoration = decoration;
		this.creater = creater;
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

	public DecorationVO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationVO decoration) {
		this.decoration = decoration;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getStyle() {
		return style;
	}

	public void setStyle(String style) {
		this.style = style;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	public Long getBasePrice() {
		return basePrice;
	}

	public void setBasePrice(Long basePrice) {
		this.basePrice = basePrice;
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

	public Long getTrafficPrice() {
		return trafficPrice;
	}

	public void setTrafficPrice(Long trafficPrice) {
		this.trafficPrice = trafficPrice;
	}

	public Integer getTrafficRate() {
		return trafficRate;
	}

	public void setTrafficRate(Integer trafficRate) {
		this.trafficRate = trafficRate;
	}

	public Short getTrafficDiscount() {
		return trafficDiscount;
	}

	public void setTrafficDiscount(Short trafficDiscount) {
		this.trafficDiscount = trafficDiscount;
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

	public Long getUnachePrice() {
		return unachePrice;
	}

	public void setUnachePrice(Long unachePrice) {
		this.unachePrice = unachePrice;
	}

	public Long getCostPrice() {
		return costPrice;
	}

	public void setCostPrice(Long costPrice) {
		this.costPrice = costPrice;
	}

	public void setTotalPrice(Long totalPrice) {
		this.totalPrice = totalPrice;
	}

	public Long getTotalPrice() {
		return totalPrice;
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

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Integer getNotSalesmanRate() {
		return notSalesmanRate;
	}

	public void setNotSalesmanRate(Integer notSalesmanRate) {
		this.notSalesmanRate = notSalesmanRate;
	}

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

}
