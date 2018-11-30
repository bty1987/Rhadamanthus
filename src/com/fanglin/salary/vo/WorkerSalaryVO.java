package com.fanglin.salary.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.vo.UserBaseVO;


public class WorkerSalaryVO  implements Serializable{
	
	private static final long serialVersionUID = -1896969348501581246L;

	private Long wsId;
	
	private Long cwsid;
	
	private DecorationVO decoration;
	
	private Long cid;
	
	private UserBaseVO user;
	
	private  UserBaseVO creater;
	
	private Timestamp createTime;
	
	private  UserBaseVO approver;
	
	private Timestamp approveTime ;
	
	private Float salary;
	
	private Short type;
	
	private Short subtype ;
	
	private Short status;
	
	private Timestamp balanceTime;
	
	private String comment ;
	
	private Long csid;
	
	private Float money;
	
	private Float deposit;
	
	private Short onetype;
	
	private Short twotype;

	public WorkerSalaryVO() {
		super();
	}

	public WorkerSalaryVO(DecorationVO decoration, UserBaseVO user,UserBaseVO creater,UserBaseVO approver) {
		super();
		this.decoration = decoration;
		this.user = user;
		this.creater = creater;
		this.approver = approver;
	}
	
	public Long getWsId() {
		return wsId;
	}

	public void setWsId(Long wsId) {
		this.wsId = wsId;
	}

	public Long getCwsid() {
		return cwsid;
	}

	public void setCwsid(Long cwsid) {
		this.cwsid = cwsid;
	}

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}

	public DecorationVO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationVO decoration) {
		this.decoration = decoration;
	}

	public UserBaseVO getUser() {
		return user;
	}

	public void setUser(UserBaseVO user) {
		this.user = user;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	public UserBaseVO getApprover() {
		return approver;
	}

	public void setApprover(UserBaseVO approver) {
		this.approver = approver;
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
	@JSON(format="yyyy-MM-dd HH:mm:ss")
	public Timestamp getApproveTime() {
		return approveTime;
	}

	public void setApproveTime(Timestamp approveTime) {
		this.approveTime = approveTime;
	}

	public Short getSubtype() {
		return subtype;
	}

	public void setSubtype(Short subtype) {
		this.subtype = subtype;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public Long getCsid() {
		return csid;
	}

	public void setCsid(Long csid) {
		this.csid = csid;
	}

	public Float getMoney() {
		return money;
	}

	public void setMoney(Float money) {
		this.money = money;
	}

	public Float getDeposit() {
		return deposit;
	}

	public void setDeposit(Float deposit) {
		this.deposit = deposit;
	}

	public Short getOnetype() {
		return onetype;
	}

	public void setOnetype(Short onetype) {
		this.onetype = onetype;
	}

	public Short getTwotype() {
		return twotype;
	}

	public void setTwotype(Short twotype) {
		this.twotype = twotype;
	}
	
}
