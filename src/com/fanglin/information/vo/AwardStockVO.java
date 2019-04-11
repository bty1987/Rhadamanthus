package com.fanglin.information.vo;

public class AwardStockVO implements java.io.Serializable {
	
	private static final long serialVersionUID = -4378086317997964900L;

	private Long asId;
	
	private String no;
	
	private String name;
	
	private Float price;
	
	private Float num;
	
	private Short status;
	
	private Short type;
	
	private Short storeroom;
	
	private short isPrefor; //是否计算业绩
	
	private short isStock; //是否计算库存
	
	private short isPayment;//是否计入金额
	
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
	
	public Float getPrice() {
		return price;
	}

	public void setPrice(Float price) {
		this.price = price;
	}

	public Float getNum() {
		return num;
	}

	public void setNum(Float num) {
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

	public short getIsPrefor() {
		return isPrefor;
	}

	public void setIsPrefor(short isPrefor) {
		this.isPrefor = isPrefor;
	}

	public short getIsStock() {
		return isStock;
	}

	public void setIsStock(short isStock) {
		this.isStock = isStock;
	}

	
	public short getIsPayment() {
		return isPayment;
	}

	public void setIsPayment(short isPayment) {
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
