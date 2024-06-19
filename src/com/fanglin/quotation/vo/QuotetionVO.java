package com.fanglin.quotation.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.data.quotation.vo.QuotationVersionVO;

public class QuotetionVO implements Serializable {

	private static final long serialVersionUID = -8617663702337964395L;

	private Long qid;

	private String no;

	private String name;

	private QuotationVersionVO version;

	private Long cuid;

	private Timestamp createTime;

	private Timestamp updateTime;

	private Integer discount;

	private Long basePrice;

	private Long undisPrice;

	private Long disPrice;

	private Long totalPrice;

	private Long managePrice;

	private Integer manageRate;

	private Short manageDiscount;

	private Long trafficPrice;

	private Integer trafficRate;

	private Short trafficDiscount;

	private Long taxPrice;

	private Integer taxRate;

	private Short taxDiscount;

	private Long costPrice;

	private Long unachePrice;

	private Short keeprice;

	private String content;

	public QuotetionVO() {
		super();
	}

	public QuotetionVO(QuotationVersionVO version) {

		super();

		this.version = version;
	}

	public Long getQid() {
		return qid;
	}

	public void setQid(Long qid) {
		this.qid = qid;
	}

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public QuotationVersionVO getVersion() {
		return version;
	}

	public void setVersion(QuotationVersionVO version) {
		this.version = version;
	}

	public Long getCuid() {
		return cuid;
	}

	public void setCuid(Long cuid) {
		this.cuid = cuid;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Timestamp updateTime) {
		this.updateTime = updateTime;
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

	public Long getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(Long totalPrice) {
		this.totalPrice = totalPrice;
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

	public Long getBasePrice() {
		return basePrice;
	}

	public void setBasePrice(Long basePrice) {
		this.basePrice = basePrice;
	}

	public Long getCostPrice() {
		return costPrice;
	}

	public void setCostPrice(Long costPrice) {
		this.costPrice = costPrice;
	}

	public Long getUnachePrice() {
		return unachePrice;
	}

	public void setUnachePrice(Long unachePrice) {
		this.unachePrice = unachePrice;
	}

	public Short getKeeprice() {
		return keeprice;
	}

	public void setKeeprice(Short keeprice) {
		this.keeprice = keeprice;
	}

}
