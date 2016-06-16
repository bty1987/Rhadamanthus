/**
 * @File Name		: ReworkDrawingVO.java
 * @Package   	: com.fanglin.vo
 * @Version		: 1.0
 * @Date			: 2014-9-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

public class ReworkDrawingVO implements Serializable {

	private static final long serialVersionUID = 5424178580915462699L;
	
	private int rwdId;
	
	private int rwId;
	
	private String operatorName;
	
	private Timestamp operateTime;
	
	private String rwdName;
	
	private String rwdUrl;
	
	private String rwdAddUrl;

	public int getRwdId(){
		return rwdId;
	}

	public void setRwdId(int rwdId){
		this.rwdId = rwdId;
	}

	public int getRwId(){
		return rwId;
	}

	public void setRwId(int rwId){
		this.rwId = rwId;
	}

	public String getRwdName(){
		return rwdName;
	}

	public void setRwdName(String rwdName){
		this.rwdName = rwdName;
	}

	public String getRwdUrl(){
		return rwdUrl;
	}

	public void setRwdUrl(String rwdUrl){
		this.rwdUrl = rwdUrl;
	}

	public String getRwdAddUrl(){
		return rwdAddUrl;
	}

	public void setRwdAddUrl(String rwdAddUrl){
		this.rwdAddUrl = rwdAddUrl;
	}

	public String getOperatorName(){
		return operatorName;
	}

	public void setOperatorName(String operatorName){
		this.operatorName = operatorName;
	}

	@JSON(format="yyyy-MM-dd HH:mm:ss")
	public Timestamp getOperateTime(){
		return operateTime;
	}

	public void setOperateTime(Timestamp operateTime){
		this.operateTime = operateTime;
	}

}
