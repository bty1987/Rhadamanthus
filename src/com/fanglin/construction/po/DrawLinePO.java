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
	
	public static final short DRAWLINE_STATUS_QUEUE_SHORT = 0;
	
	public static final short DRAWLINE_STATUS_APPLICATION_SHORT = 1; 
	
	public static final short DRAWLINE_STATUS_SUCCESS_SHORT = 2; 
	
	public static final short DRAWLINE_STATUS_FAIL_SHORT = 3; 
	
	private long dlId;
	
	private DecorationPO decoration;

	private Timestamp  applayTime;
	
	private String content;
	
	private Timestamp actualStartTime;
	
	private Timestamp actualEndTime;
	
	private short status;
	
	private Integer count;
	
	private UserPO applayUser;
	
	private DrawLineGroupPO drawLineGroup;
	
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

	@Column(name = "content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
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
	public short getStatus(){
		return status;
	}

	public void setStatus(short status){
		this.status = status;
	}

	@Column(name = "count")
	public Integer getCount() {
		return count;
	}

	public void setCount(Integer count) {
		this.count = count;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true,name = "dgid", referencedColumnName = "gid")
	public DrawLineGroupPO getDrawLineGroup() {
		return drawLineGroup;
	}

	public void setDrawLineGroup(DrawLineGroupPO drawLineGroup) {
		this.drawLineGroup = drawLineGroup;
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
