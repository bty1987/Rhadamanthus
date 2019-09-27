package com.fanglin.information.vo;

import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.personel.vo.UserVO;

public class VticketVO implements java.io.Serializable {

	private static final long serialVersionUID = -649776482182811374L;
	
	private Long vtid;
	
	private Long vaid;
	
	private String tno;
	
	private UserVO creater;
	
	private Timestamp createTime;
	
	private UserVO belonger;
	
	private DepartmentVO department;
	
	private DepartmentVO region;
	
	private String orderId;
	
	private String name;
	
	private String phone;
	
	private String address;
	
	private Short isregist;
	
	private Short iscome;
	
	public VticketVO() {
		super();
	}

	public VticketVO(UserVO creater, UserVO belonger, DepartmentVO department, DepartmentVO region) {
		super();
		this.creater = creater;
		this.belonger = belonger;
		this.department = department;
		this.region = region;
	}

	public Long getVtid() {
		return vtid;
	}

	public void setVtid(Long vtid) {
		this.vtid = vtid;
	}
	
	public Long getVaid() {
		return vaid;
	}

	public void setVaid(Long vaid) {
		this.vaid = vaid;
	}
	
	public String getTno() {
		return tno;
	}

	public void setTno(String tno) {
		this.tno = tno;
	}
	
	public UserVO getCreater() {
		return creater;
	}

	public void setCreater(UserVO creater) {
		this.creater = creater;
	}
	
	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}
	
	public UserVO getBelonger() {
		return belonger;
	}

	public void setBelonger(UserVO belonger) {
		this.belonger = belonger;
	}
	
	public DepartmentVO getDepartment() {
		return department;
	}

	public void setDepartment(DepartmentVO department) {
		this.department = department;
	}
	
	public DepartmentVO getRegion() {
		return region;
	}

	public void setRegion(DepartmentVO region) {
		this.region = region;
	}
	
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}
	
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}
	
	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}
	
	public Short getIsregist() {
		return isregist;
	}

	public void setIsregist(Short isregist) {
		this.isregist = isregist;
	}
	
	public Short getIscome() {
		return iscome;
	}

	public void setIscome(Short iscome) {
		this.iscome = iscome;
	}
	
}