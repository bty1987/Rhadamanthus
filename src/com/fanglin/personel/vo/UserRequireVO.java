package com.fanglin.personel.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.communion.vo.DepartmentVO;


public class UserRequireVO implements Serializable{
	
	private static final long serialVersionUID = 8807638170445056358L;

	private Long urid;
	
	private UserBaseVO creater; //创建人ID cuid
	
	private DepartmentVO dept; //创建部门ID cdid
	
	private UserBaseVO receiveId ; //接收人ID ruid
	
	private String content; // 备注
	
	private Short status; // status(0初始 , 1通过 , 2拒绝 , 3完成)
	
	private Short type;//type(0招聘, 1培训)
	
	private Timestamp createTime; // 创建时间
	
	private Timestamp approveTime; // 审批时间
	
	private Timestamp finishTime; // 完成时间
	
	public UserRequireVO (){
		super();
	}
	
	public UserRequireVO(UserBaseVO creater, DepartmentVO dept, UserBaseVO receiveId) {
		super();
		this.creater = creater;
		this.dept = dept;
		this.receiveId = receiveId;
	}

	public Long getUrid() {
		return urid;
	}

	public void setUrid(Long urid) {
		this.urid = urid;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	public DepartmentVO getDept() {
		return dept;
	}

	public void setDept(DepartmentVO dept) {
		this.dept = dept;
	}

	public UserBaseVO getReceiveId() {
		return receiveId;
	}

	public void setReceiveId(UserBaseVO receiveId) {
		this.receiveId = receiveId;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
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

	@JSON(format="yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}
	
	@JSON(format="yyyy-MM-dd")
	public Timestamp getApproveTime() {
		return approveTime;
	}

	public void setApproveTime(Timestamp approveTime) {
		this.approveTime = approveTime;
	}
	
	@JSON(format="yyyy-MM-dd")
	public Timestamp getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(Timestamp finishTime) {
		this.finishTime = finishTime;
	}
}
