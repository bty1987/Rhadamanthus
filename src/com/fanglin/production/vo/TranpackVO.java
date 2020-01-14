package com.fanglin.production.vo;

import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class TranpackVO {

	private Long tid;
	
	private ProductionVO production;
	
	private String no;
	
	private Long rid;
	
	private Short type;
	
	private UserBaseVO creater; 
	
	private UserBaseVO sender;
	
	private UserBaseVO mounter;
	
	private Timestamp createTime;
	
	private Timestamp planTime;
	
	private Timestamp tranTime;
	
	private Timestamp mountTime;
	
	private Short status;

	public TranpackVO() {
		super();
	}
	
	public TranpackVO(ProductionVO productionVO, UserBaseVO creater) {
		super();
		this.production = productionVO;
		this.creater = creater;
	}

	public TranpackVO(ProductionVO productionVO, UserBaseVO creater,
			UserBaseVO sender, UserBaseVO mounter) {
		super();
		this.production = productionVO;
		this.creater = creater;
		this.sender = sender;
		this.mounter = mounter;
	}

	public Long getTid() {
		return tid;
	}

	public void setTid(Long tid) {
		this.tid = tid;
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

	public Long getRid() {
		return rid;
	}

	public void setRid(Long rid) {
		this.rid = rid;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	public UserBaseVO getSender() {
		return sender;
	}

	public void setSender(UserBaseVO sender) {
		this.sender = sender;
	}

	public UserBaseVO getMounter() {
		return mounter;
	}

	public void setMounter(UserBaseVO mounter) {
		this.mounter = mounter;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
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

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}
}
