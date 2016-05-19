/**
 * @File Name		: ReworkDrawingPO.java
 * @Package   	: com.fanglin.entity
 * @Version		: 1.0
 * @Date			: 2014-9-24
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
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="reworkdrawing", catalog = "platform")
public class ReworkDrawingPO implements Serializable{

	private static final long serialVersionUID = 6799307327658765089L;
	
	public static String COLUMN_RWID_STR = "rwId";
	
	private int rwdId;
	
	private int rwId;
	
	private String operatorName;
	
	private Timestamp operateTime;
	
	private String rwdName;
	
	private String rwdUrl;
	
	private String rwdAddUrl;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="rwdId")
	public int getRwdId(){
		return rwdId;
	}

	public void setRwdId(int rwdId){
		this.rwdId = rwdId;
	}

	@Column(name="rwId")
	public int getRwId(){
		return rwId;
	}

	public void setRwId(int rwId){
		this.rwId = rwId;
	}

	@Column(name="rwdName")
	public String getRwdName(){
		return rwdName;
	}

	public void setRwdName(String rwdName){
		this.rwdName = rwdName;
	}

	@Column(name="rwdUrl")
	public String getRwdUrl(){
		return rwdUrl;
	}

	public void setRwdUrl(String rwdUrl){
		this.rwdUrl = rwdUrl;
	}

	@Column(name = "rwdAddUrl")
	public String getRwdAddUrl(){
		return rwdAddUrl;
	}

	public void setRwdAddUrl(String rwdAddUrl){
		this.rwdAddUrl = rwdAddUrl;
	}

	@Column(name = "operatorName")
	public String getOperatorName(){
		return operatorName;
	}

	public void setOperatorName(String operatorName){
		this.operatorName = operatorName;
	}

	@Column(name = "operateTime")
	public Timestamp getOperateTime(){
		return operateTime;
	}

	public void setOperateTime(Timestamp operateTime){
		this.operateTime = operateTime;
	}

}
