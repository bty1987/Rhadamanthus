package com.fanglin.production.vo;

import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;


public class OutsourceVO {

	private Long oid;

	private ProductionVO production;
	
	private String no;// 编号 , L作为第一个字符 , 由日期加四位格式计数组成 , 例: L1601010001
	
	private UserBaseVO supplier;// 厂商 , 类型 user
	
	private UserBaseVO creater; // 创建人 , 类型 user
	
	private Timestamp createTime;// 创建时间
	
	private Timestamp finishTime;// 结束时间
	
	private Short status;

	private String path;
	
	private Integer timeLimit; //工期

	private String comment;
	
	private Integer num;
	
	private Integer company;

	public OutsourceVO() {
		super();
	}

	public OutsourceVO(ProductionVO production, UserBaseVO creater,
			UserBaseVO supplier) {
		super();
		this.production = production;
		this.creater = creater;
		this.supplier = supplier;
	}

	public Long getOid() {
		return oid;
	}

	public void setOid(Long oid) {
		this.oid = oid;
	}

	public ProductionVO getProduction() {
		return production;
	}

	public void setProduction(ProductionVO production) {
		this.production = production;
	}

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public UserBaseVO getSupplier() {
		return supplier;
	}

	public void setSupplier(UserBaseVO supplier) {
		this.supplier = supplier;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(Timestamp finishTime) {
		this.finishTime = finishTime;
	}

	public Integer getTimeLimit() {
		return timeLimit;
	}

	public void setTimeLimit(Integer timeLimit) {
		this.timeLimit = timeLimit;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

	public Integer getNum() {
		return num;
	}

	public void setNum(Integer num) {
		this.num = num;
	}
}
