package com.fanglin.personel.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.communion.po.DepartmentPO;

@Entity
@Table(name = "userrequire", catalog = "communion")
public class UserRequirePO implements Serializable {
	
	private static final long serialVersionUID = -6906947794151788540L;
	
	public static final short STATUS_INIT_INT = 0;//初始
	
	public static final short STATUS_THROUGH_INT = 1;//通过
	
	public static final short STATUS_REFUSED_INT = 2;//拒绝
	
	public static final short STATUS_COMPLETE_INT = 3;//完成
	
	private long urid;
	
	private UserPO creater; //创建人ID cuid 
	
	private DepartmentPO dept; //创建部门ID cdid
	
	private UserPO receiveId ; //接收人ID ruid
	
	private String content; // 备注
	
	private short status; // status(0初始 , 1通过 , 2拒绝 , 3完成)
	
	private short type; //type(0招聘, 1培训)
	
	private Timestamp createTime; // 创建时间
	
	private Timestamp approveTime; // 审批时间
	
	private Timestamp finishTime; // 完成时间

	public UserRequirePO(){
		super();
	}
	
	public UserRequirePO(UserPO creater, DepartmentPO dept, UserPO receiveId) {
		super();
		this.creater = creater;
		this.dept = dept;
		this.receiveId = receiveId;
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "urid")
	public long getUrid() {
		return urid;
	}

	public void setUrid(long urid) {
		this.urid = urid;
	}
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "cuid",referencedColumnName="uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cdid", referencedColumnName = "did", nullable = false)
	public DepartmentPO getDept() {
		return dept;
	}

	public void setDept(DepartmentPO dept) {
		this.dept = dept;
	}
	
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "ruid",referencedColumnName="uid")
	public UserPO getReceiveId() {
		return receiveId;
	}

	public void setReceiveId(UserPO receiveId) {
		this.receiveId = receiveId;
	}
	
	@Column(name = "content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}
	
	public void setStatus(short status) {
		this.status = status;
	}
	
	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}
	
	@Column(name = "approveTime")
	public Timestamp getApproveTime() {
		return approveTime;
	}

	public void setApproveTime(Timestamp approveTime) {
		this.approveTime = approveTime;
	}
	
	@Column(name = "finishTime")
	public Timestamp getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(Timestamp finishTime) {
		this.finishTime = finishTime;
	}
}
