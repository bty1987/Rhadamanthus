package com.fanglin.communion.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import com.fanglin.system.vo.CityProperVO;

public class VillageVO implements Serializable {

	private static final long serialVersionUID = 6573242903839888845L;

	private Long vid;

	private String no;

	private String name;

	private CityProperVO cityProper;

	private Integer cid;

	private VillageVO parentVillage;

	private String developer;

	private String salesPhone;

	private String deliveryTime;

	private Timestamp createTime;

	private Timestamp updateTime;

	private String rule;

	private String content;

	private Integer x;

	private Integer y;

	private Short status;

	private String url;

	private Long mileage;

	private Integer company;

	public VillageVO() {
		super();
	}

	public VillageVO(CityProperVO cityProper) {
		super();
		this.cityProper = cityProper;
	}

	public VillageVO(CityProperVO cityProper, VillageVO parentVillage) {
		super();
		this.cityProper = cityProper;
		this.parentVillage = parentVillage;
	}

	public VillageVO(VillageVO parentVillage) {
		super();
		this.parentVillage = parentVillage;
	}

	public Long getVid() {
		return vid;
	}

	public void setVid(Long vid) {
		this.vid = vid;
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

	public CityProperVO getCityProper() {
		return cityProper;
	}

	public void setCityProper(CityProperVO cityProper) {
		this.cityProper = cityProper;
	}

	public Integer getCid() {
		return cid;
	}

	public void setCid(Integer cid) {
		this.cid = cid;
	}

	public VillageVO getParentVillage() {
		return parentVillage;
	}

	public void setParentVillage(VillageVO parentVillage) {
		this.parentVillage = parentVillage;
	}

	public String getDeveloper() {
		return developer;
	}

	public void setDeveloper(String developer) {
		this.developer = developer;
	}

	public String getSalesPhone() {
		return salesPhone;
	}

	public void setSalesPhone(String salesPhone) {
		this.salesPhone = salesPhone;
	}

	public String getDeliveryTime() {
		return deliveryTime;
	}

	public void setDeliveryTime(String deliveryTime) {
		this.deliveryTime = deliveryTime;
	}

	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public Timestamp getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Timestamp updateTime) {
		this.updateTime = updateTime;
	}

	public String getRule() {
		return rule;
	}

	public void setRule(String rule) {
		this.rule = rule;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Integer getX() {
		return x;
	}

	public void setX(Integer x) {
		this.x = x;
	}

	public Integer getY() {
		return y;
	}

	public void setY(Integer y) {
		this.y = y;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public Long getMileage() {
		return mileage;
	}

	public void setMileage(Long mileage) {
		this.mileage = mileage;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

}
