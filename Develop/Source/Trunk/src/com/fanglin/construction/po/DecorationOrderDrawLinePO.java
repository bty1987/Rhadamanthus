/**
 * @File Name		: QuotationVersionPO.java
 * @Package   	: com.fanglin.entity
 * @Version		: 1.0
 * @Date			: 2014-7-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
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

import com.fanglin.decoration.po.DecorationOrderPO;
import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "decorationorderdrawline", catalog = "platform")
public class DecorationOrderDrawLinePO implements Serializable {

	private static final long serialVersionUID = 1344461146L;

	private long autoId;
	
	private DecorationOrderPO orderPO;

	private Timestamp  applayTime;
	
	private String applayDes;
	
	private Timestamp actualStartTime;
	
	private Timestamp actualEndTime;
	
	private String status;
	
	private Integer applayCount;
	
	private UserPO applayUserPO;
	
	private String drawLineGroup;
	
	private UserPO drawLineUserPO;
	
	@Id
	@GeneratedValue
	@Column(name = "autoId")
	public long getAutoId(){
		return autoId;
	}

	public void setAutoId(long autoId){
		this.autoId = autoId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "orderId", referencedColumnName = "orderId")
	public DecorationOrderPO getOrderPO(){
		return orderPO;
	}

	public void setOrderPO(DecorationOrderPO orderPO){
		this.orderPO = orderPO;
	}
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "applayUserId", referencedColumnName = "userId")
	public UserPO getApplayUserPO(){
		return applayUserPO;
	}

	public void setApplayUserPO(UserPO applayUserPO){
		this.applayUserPO = applayUserPO;
	}

	public Timestamp getApplayTime(){
		return applayTime;
	}

	public void setApplayTime(Timestamp applayTime){
		this.applayTime = applayTime;
	}

	public String getApplayDes(){
		return applayDes;
	}

	public void setApplayDes(String applayDes){
		this.applayDes = applayDes;
	}

	public Timestamp getActualStartTime(){
		return actualStartTime;
	}

	public void setActualStartTime(Timestamp actualStartTime){
		this.actualStartTime = actualStartTime;
	}

	public Timestamp getActualEndTime(){
		return actualEndTime;
	}

	public void setActualEndTime(Timestamp actualEndTime){
		this.actualEndTime = actualEndTime;
	}

	public String getStatus(){
		return status;
	}

	public void setStatus(String status){
		this.status = status;
	}

	public Integer getApplayCount(){
		return applayCount;
	}

	public void setApplayCount(Integer applayCount){
		this.applayCount = applayCount;
	}

	public void setDrawLineGroup(String drawLineGroup){
		this.drawLineGroup = drawLineGroup;
	}

	public String getDrawLineGroup(){
		return drawLineGroup;
	}

	
	public void setDrawLineUserPO(UserPO drawLineUserPO){
		this.drawLineUserPO = drawLineUserPO;
	}
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "drawLineUserId", referencedColumnName = "userId")
	public UserPO getDrawLineUserPO(){
		return drawLineUserPO;
	}

}
