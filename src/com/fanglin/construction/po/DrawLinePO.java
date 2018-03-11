/**
 * @File Name	: QuotationVersionPO.java
 * @Package   	: com.fanglin.entity
 * @Version		: 1.0
 * @Date		: 2014-7-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.data.po.DrawLineGroupPO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "drawline", catalog = "construction")
public class DrawLinePO implements Serializable {

	private static final long serialVersionUID = 1344461146L;

	private long dlId;
	
	private DecorationPO decoration;

	private Timestamp  applayTime;
	
	private String applayDes;
	
	private Timestamp actualStartTime;
	
	private Timestamp actualEndTime;
	
	private String status;
	
	private Integer applayCount;
	
	private UserPO applayUser;
	
	private DrawLineGroupPO drawLineGroup;
	
	private String drawLineGroupName;
	
	private UserPO drawLineUser;

	@Id
	@GeneratedValue
	@Column(name = "dlId")
	public long getDlId(){
		return dlId;
	}

	public void setDlId(long dlId){
		this.dlId = dlId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "orderId", referencedColumnName = "orderId")
	public DecorationPO getDecoration(){
		return decoration;
	}

	public void setDecoration(DecorationPO decoration){
		this.decoration = decoration;
	}
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "auid", referencedColumnName = "uid")
	public UserPO getApplayUser(){
		return applayUser;
	}

	public void setApplayUser(UserPO applayUser){
		this.applayUser = applayUser;
	}

	@Column(name = "applayTime")
	public Timestamp getApplayTime(){
		return applayTime;
	}

	public void setApplayTime(Timestamp applayTime){
		this.applayTime = applayTime;
	}

	@Column(name = "applayDes")
	public String getApplayDes(){
		return applayDes;
	}

	public void setApplayDes(String applayDes){
		this.applayDes = applayDes;
	}

	@Column(name = "actualStartTime")
	public Timestamp getActualStartTime(){
		return actualStartTime;
	}

	public void setActualStartTime(Timestamp actualStartTime){
		this.actualStartTime = actualStartTime;
	}

	@Column(name = "actualEndTime")
	public Timestamp getActualEndTime(){
		return actualEndTime;
	}

	public void setActualEndTime(Timestamp actualEndTime){
		this.actualEndTime = actualEndTime;
	}

	@Column(name = "status")
	public String getStatus(){
		return status;
	}

	public void setStatus(String status){
		this.status = status;
	}

	@Column(name = "applayCount")
	public Integer getApplayCount(){
		return applayCount;
	}

	public void setApplayCount(Integer applayCount){
		this.applayCount = applayCount;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true,name = "dgid", referencedColumnName = "gid")
	public DrawLineGroupPO getDrawLineGroup() {
		return drawLineGroup;
	}

	public void setDrawLineGroup(DrawLineGroupPO drawLineGroup) {
		this.drawLineGroup = drawLineGroup;
	}

	@Column(name = "drawLineGroup")
	public String getDrawLineGroupName() {
		return drawLineGroupName;
	}

	public void setDrawLineGroupName(String drawLineGroupName) {
		this.drawLineGroupName = drawLineGroupName;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "dluid", referencedColumnName = "uid")
	public UserPO getDrawLineUser(){
		return drawLineUser;
	}
	
	public void setDrawLineUser(UserPO drawLineUser){
		this.drawLineUser = drawLineUser;
	}
	
	
}
