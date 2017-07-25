package com.fanglin.salary.vo;

import java.io.Serializable;
import java.sql.Timestamp;
import org.apache.struts2.json.annotations.JSON;
import com.fanglin.decoration.vo.DecorationOrderVO;
import com.fanglin.personel.vo.UserVO;
/**
 * @author Administrator
 *
 */
public class WorkerSalaryVO  implements Serializable{
	
	private static final long serialVersionUID = -1896969348501581246L;

	private Long wsId;
	
	private DecorationOrderVO decorationOrder;
	
	private Long cid;
	
	private UserVO user;
	
	private  UserVO creater;
	
	private Timestamp createTime;
	
	private  UserVO   approver;
	
	private Timestamp approveTime ;
	
	private Float salary;
	
	private Short type;
	
	private Short subtype ;
	
	private Short status;
	
	private Timestamp balanceTime;
	
	private String comment ;

	public WorkerSalaryVO() {
		super();
	}


	public WorkerSalaryVO(DecorationOrderVO decorationOrder, UserVO user,UserVO creater,UserVO approver) {
		super();
		this.decorationOrder = decorationOrder;
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



	public Long getCid() {
		return cid;
	}


	public void setCid(Long cid) {
		this.cid = cid;
	}


	public DecorationOrderVO getDecorationOrder() {
		return decorationOrder;
	}

	public void setDecorationOrder(DecorationOrderVO decorationOrder) {
		this.decorationOrder = decorationOrder;
	}

	public UserVO getUser() {
		return user;
	}

	public void setUser(UserVO user) {
		this.user = user;
	}
	

	public UserVO getCreater() {
		return creater;
	}

	public void setCreater(UserVO creater) {
		this.creater = creater;
	}

	public UserVO getApprover() {
		return approver;
	}

	public void setApprover(UserVO approver) {
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
	
}
