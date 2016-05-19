/**
 * @FileName	: CityPO.java
 * @Package   	: com.fanglin.entity
 * @Version		: 1.0
 * @Date		: 2014-8-2
 * @Copyright	: Copyright Decoration 2014
 * @Author		: Howard
 * @Describing	: 
 */
package com.fanglin.decoration.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "backVisit", catalog = "platform")
public class BackVisitPO implements Serializable {

	private static final long serialVersionUID = 1000000000011112L;

	private long autoId;

	private DecorationOrderPO decorationOrderPO;

	private UserPO designerPO;
	
	private Timestamp createTime;
	
	private int grade;
	
	private String backVisitContent;

	@Id
	@GeneratedValue
	public long getAutoId(){
		return autoId;
	}

	public void setAutoId(long autoId){
		this.autoId = autoId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "orderId", referencedColumnName = "orderId")
	public DecorationOrderPO getDecorationOrderPO(){
		return decorationOrderPO;
	}

	public void setDecorationOrderPO(DecorationOrderPO decorationOrderPO){
		this.decorationOrderPO = decorationOrderPO;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "designerId", referencedColumnName = "userId")
	public UserPO getDesignerPO(){
		return designerPO;
	}

	public void setDesignerPO(UserPO designerPO){
		this.designerPO = designerPO;
	}

	public Timestamp getCreateTime(){
		return createTime;
	}

	public void setCreateTime(Timestamp createTime){
		this.createTime = createTime;
	}

	public int getGrade(){
		return grade;
	}

	public void setGrade(int grade){
		this.grade = grade;
	}

	public String getBackVisitContent(){
		return backVisitContent;
	}

	public void setBackVisitContent(String backVisitContent){
		this.backVisitContent = backVisitContent;
	}
}
