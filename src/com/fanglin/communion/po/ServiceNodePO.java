package com.fanglin.communion.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import cn.hutool.core.bean.BeanUtil;

import com.fanglin.communion.vo.ServiceNodeVO;

@Entity
@Table(name = "serviceNode", catalog = "communion")
public class ServiceNodePO implements Serializable {

	private static final long serialVersionUID = -8744642889073979368L;

	public static final short SERVICESTATUS_ENABLE_INT = 0;

	public static final short SERVICESTATUS_DISABLE_INT = 1;

	public static final short SERVICE_TYPE_DECORTAION_INT = 0;

	public static final short SERVICE_TYPE_MATERIAL_INT = 1;

	public static final short SERVICE_TYPE_CONSTRUCTION_INT = 2;

	public static final int SERVICE_COMPANY_INIT = 1;

	private long snid;

	private String name;

	private String detail;

	private short type;

	private short status;

	private int company;

	private long psnid;

	private short attnode;

	private int blankNum;

	private int workNum;

	private short loop;

	private short userType;

	@Id
	@GeneratedValue
	@Column(name = "snid")
	public long getSnid() {
		return snid;
	}

	public void setSnid(long snid) {
		this.snid = snid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "detail")
	public String getDetail() {
		return detail;
	}

	public void setDetail(String detail) {
		this.detail = detail;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	@Column(name = "psnid")
	public long getPsnid() {
		return psnid;
	}

	public void setPsnid(long psnid) {
		this.psnid = psnid;
	}

	@Column(name = "attnode")
	public short getAttnode() {
		return attnode;
	}

	public void setAttnode(short attnode) {
		this.attnode = attnode;
	}

	@Column(name = "blankNum")
	public int getBlankNum() {
		return blankNum;
	}

	public void setBlankNum(int blankNum) {
		this.blankNum = blankNum;
	}

	@Column(name = "workNum")
	public int getWorkNum() {
		return workNum;
	}

	public void setWorkNum(int workNum) {
		this.workNum = workNum;
	}

	@Column(name = "`loop`")
	public short getLoop() {
		return loop;
	}

	public void setLoop(short loop) {
		this.loop = loop;
	}

	@Column(name = "userType")
	public short getUserType() {
		return userType;
	}

	public void setUserType(short userType) {
		this.userType = userType;
	}

	public ServiceNodeVO ptv(ServiceNodeVO serviceNodeVO) {

		BeanUtil.copyProperties(this, serviceNodeVO);

		return serviceNodeVO;
	}

}
