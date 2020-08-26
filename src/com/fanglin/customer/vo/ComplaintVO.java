package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.communion.vo.BrandVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.personel.vo.UserBaseVO;

public class ComplaintVO implements Serializable {
	
	private static final long serialVersionUID = -3608490930141996506L;

	private Long ctid;
	
	private Long cid;
		
	private Short type;
	
	private DepartmentVO dept;
	
	private UserBaseVO staff;
	
	private BrandVO brand;
	
	private String content;
	
	private UserBaseVO creater;
	
	private UserBaseVO updater;
	
	private Timestamp createTime;
	
	private Timestamp updateTime;
	
	private Timestamp finishTime;
	
	private Short status;

	public ComplaintVO() {
		super();
	}

	public ComplaintVO(DepartmentVO dept, UserBaseVO staff, BrandVO brand,
			UserBaseVO creater, UserBaseVO updater) {
		super();
		this.dept = dept;
		this.staff = staff;
		this.brand = brand;
		this.creater = creater;
		this.updater = updater;
	}

	public Long getCtid() {
		return ctid;
	}

	public void setCtid(Long ctid) {
		this.ctid = ctid;
	}

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public DepartmentVO getDept() {
		return dept;
	}

	public void setDept(DepartmentVO dept) {
		this.dept = dept;
	}

	public UserBaseVO getStaff() {
		return staff;
	}

	public void setStaff(UserBaseVO staff) {
		this.staff = staff;
	}

	public BrandVO getBrand() {
		return brand;
	}

	public void setBrand(BrandVO brand) {
		this.brand = brand;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	public UserBaseVO getUpdater() {
		return updater;
	}

	public void setUpdater(UserBaseVO updater) {
		this.updater = updater;
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

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(Timestamp finishTime) {
		this.finishTime = finishTime;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

}
