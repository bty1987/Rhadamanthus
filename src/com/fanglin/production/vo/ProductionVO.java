package com.fanglin.production.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.communion.vo.BrandVO;
import com.fanglin.communion.vo.CategoryVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.personel.vo.UserBaseVO;

public class ProductionVO implements Serializable {

	private static final long serialVersionUID = 8400949857779897876L;

	private Long pid;

	private String orderId;
	
	private String spid;

	private String pno;

	private HouseVO house;
	
    private BrandVO brand; //品牌
	
	private CategoryVO category; //品类

	private UserBaseVO creater;
	
	private UserBaseVO salesman;//销售员

	private UserBaseVO designer;
	
	private UserBaseVO spliter;// 拆单员

	private Timestamp createTime;// 创建时间
	
	private Timestamp designTime;// 设计时间

	private Timestamp divideTime;// 生产时间
	
	private Timestamp storeTime;// 入库时间
	
	private Timestamp planTime;// 物流时间
	
	private Timestamp tranTime;//运输
	
	private Timestamp mountTime;// 安装时间
	
	private Timestamp finishTime;// 完结时间
	
	private Timestamp updateTime;// 更新时间

	private Integer timeLimit;
	
	private Long total;
	
	private Short status;

	private Short type;

	private Integer company;

	public ProductionVO() {
		super();
	}

	public ProductionVO(HouseVO house) {
		super();
		this.house = house;
	}

	public ProductionVO(HouseVO house, UserBaseVO creater, UserBaseVO salesman, UserBaseVO designer, UserBaseVO spliter) {
		super();
		this.house = house;
		this.creater = creater;
		this.salesman = salesman;
		this.designer = designer;
		this.spliter = spliter;
	}

	public ProductionVO(HouseVO house, BrandVO brand, CategoryVO category, UserBaseVO creater, UserBaseVO salesman, UserBaseVO designer, UserBaseVO spliter) {
		super();
		this.house = house;
		this.brand = brand;
		this.category = category;
		this.creater = creater;
		this.salesman = salesman;
		this.designer = designer;
		this.spliter = spliter;
	}

	public Long getPid() {
		return pid;
	}

	public void setPid(Long pid) {
		this.pid = pid;
	}
	
	public String getSpid() {
		return spid;
	}

	public void setSpid(String spid) {
		this.spid = spid;
	}
	
	public String getPno() {
		return pno;
	}

	public void setPno(String pno) {
		this.pno = pno;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}
	
	public HouseVO getHouse() {
		return house;
	}

	public void setHouse(HouseVO house) {
		this.house = house;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	public UserBaseVO getSalesman() {
		return salesman;
	}

	public void setSalesman(UserBaseVO salesman) {
		this.salesman = salesman;
	}

	public UserBaseVO getDesigner() {
		return designer;
	}

	public void setDesigner(UserBaseVO designer) {
		this.designer = designer;
	}

	public UserBaseVO getSpliter() {
		return spliter;
	}

	public void setSpliter(UserBaseVO spliter) {
		this.spliter = spliter;
	}

	public BrandVO getBrand() {
		return brand;
	}

	public void setBrand(BrandVO brand) {
		this.brand = brand;
	}

	public CategoryVO getCategory() {
		return category;
	}

	public void setCategory(CategoryVO category) {
		this.category = category;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getDesignTime() {
		return designTime;
	}

	public void setDesignTime(Timestamp designTime) {
		this.designTime = designTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getStoreTime() {
		return storeTime;
	}

	public void setStoreTime(Timestamp storeTime) {
		this.storeTime = storeTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getPlanTime() {
		return planTime;
	}

	public void setPlanTime(Timestamp planTime) {
		this.planTime = planTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getTranTime() {
		return tranTime;
	}

	public void setTranTime(Timestamp tranTime) {
		this.tranTime = tranTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getMountTime() {
		return mountTime;
	}

	public void setMountTime(Timestamp mountTime) {
		this.mountTime = mountTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(Timestamp finishTime) {
		this.finishTime = finishTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Timestamp updateTime) {
		this.updateTime = updateTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getDivideTime() {
		return divideTime;
	}

	public void setDivideTime(Timestamp divideTime) {
		this.divideTime = divideTime;
	}

	public Integer getTimeLimit() {
		return timeLimit;
	}

	public void setTimeLimit(Integer timeLimit) {
		this.timeLimit = timeLimit;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}
	
	public Long getTotal() {
		return total;
	}

	public void setTotal(Long total) {
		this.total = total;
	}
	
	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

}
