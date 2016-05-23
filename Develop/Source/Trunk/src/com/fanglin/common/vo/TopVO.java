/**
 * Title: TopVO
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: JH Corporation, China, Ltd.
 * @author bty1987
 *
 */

package com.fanglin.common.vo;

import java.io.Serializable;
import java.sql.Date;

import org.apache.struts2.json.annotations.JSON;

public class TopVO implements Serializable {

	private static final long serialVersionUID = -4417023051329234411L;

	private String topId;
	
	private String topName;
	
	private String topImg;
	
	private String topType;
	
	private Float topValue;
	
	private Date topDate;
	
	private String topKind;
	
	public TopVO(){
		super();
	}

	public String getTopId(){
		return topId;
	}
	
	public void setTopId(String topId){
		this.topId = topId;
	}

	public String getTopName(){
		return topName;
	}

	public void setTopName(String topName){
		this.topName = topName;
	}

	public String getTopImg(){
		return topImg;
	}

	public void setTopImg(String topImg){
		this.topImg = topImg;
	}

	public String getTopType(){
		return topType;
	}

	public void setTopType(String topType){
		this.topType = topType;
	}

	public Float getTopValue(){
		return topValue;
	}

	public void setTopValue(Float topValue){
		this.topValue = topValue;
	}

	@JSON(format = "yyyy-MM-dd")
	public Date getTopDate(){
		return topDate;
	}

	public void setTopDate(Date topDate){
		this.topDate = topDate;
	}

	public String getTopKind(){
		return topKind;
	}

	public void setTopKind(String topKind){
		this.topKind = topKind;
	}
	
}
