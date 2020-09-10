package com.fanglin.information.vo;

public class AwardStockVO implements java.io.Serializable {

	private static final long serialVersionUID = -4378086317997964900L;

	private Long asId;

	private String no;

	private String name;

	private Integer price;

	private Integer num;

	private Short status;

	private Short type;

	private Short subtype;

	private Short storeroom;

	private Short isPrefor; // 是否计算业绩

	private Short isStock; // 是否计算库存

	private Short isPayment;// 是否计入金额

	private String content;

	private Integer company;

	private String format;

	public Long getAsId() {
		return asId;
	}

	public void setAsId(Long asId) {
		this.asId = asId;
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

	public Integer getPrice() {
		return price;
	}

	public void setPrice(Integer price) {
		this.price = price;
	}

	public Integer getNum() {
		return num;
	}

	public void setNum(Integer num) {
		this.num = num;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getSubtype() {
		return subtype;
	}

	public void setSubtype(Short subtype) {
		this.subtype = subtype;
	}

	public Short getIsPrefor() {
		return isPrefor;
	}

	public void setIsPrefor(Short isPrefor) {
		this.isPrefor = isPrefor;
	}

	public Short getIsStock() {
		return isStock;
	}

	public void setIsStock(Short isStock) {
		this.isStock = isStock;
	}

	public Short getIsPayment() {
		return isPayment;
	}

	public void setIsPayment(Short isPayment) {
		this.isPayment = isPayment;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

	public Short getStoreroom() {
		return storeroom;
	}

	public void setStoreroom(Short storeroom) {
		this.storeroom = storeroom;
	}

	public String getFormat() {
		return format;
	}

	public void setFormat(String format) {
		this.format = format;
	}

}
