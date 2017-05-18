package com.fanglin.salary.vo;

import java.io.Serializable;
import java.sql.Timestamp;
import org.apache.struts2.json.annotations.JSON;
import com.fanglin.personel.vo.UserVO;

public class WorkerSalaryVO  implements Serializable{
	
	private static final long serialVersionUID = -1896969348501581246L;

	private Long wsId;
	
	private Long csId;
	
	private UserVO user;
	
	private Timestamp createTime;
	
	private Timestamp balanceTime;
	
	private Float salary;
	
	private Short type;
	
	private Short status;

	public Long getWsId() {
		return wsId;
	}

	public void setWsId(Long wsId) {
		this.wsId = wsId;
	}

	public Long getCsId() {
		return csId;
	}

	public void setCsId(Long csId) {
		this.csId = csId;
	}

	public UserVO getUser() {
		return user;
	}

	public void setUser(UserVO user) {
		this.user = user;
	}

	@JSON(format="yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}
	
	@JSON(format="yyyy-MM-dd HH:mm:ss")
	public Timestamp getBalanceTime() {
		return balanceTime;
	}

	public void setBalanceTime(Timestamp balanceTime) {
		this.balanceTime = balanceTime;
	}

	public Float getSalary() {
		return salary;
	}

	public void setSalary(Float salary) {
		this.salary = salary;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	} 
}
