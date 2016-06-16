/**
 * @File Name		: BricklayDrawingVO.java
 * @Package   	: com.fanglin.vo.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.vo;

import java.io.Serializable;

public class BricklayDrawingVO implements Serializable{

	private static final long serialVersionUID = -5281477795064010196L;
	
	private Integer bdId;
	
	private Integer bcsId;
	
	private Integer csId;
	
	private String drawingName;
	
	private String drawingUrl;
	
	private String drawingAddUrl;
	
	private Short type;

	public Integer getBdId(){
		return bdId;
	}

	public void setBdId(Integer bdId){
		this.bdId = bdId;
	}

	public Integer getBcsId(){
		return bcsId;
	}

	public void setBcsId(Integer bcsId){
		this.bcsId = bcsId;
	}

	public String getDrawingName(){
		return drawingName;
	}

	public void setDrawingName(String drawingName){
		this.drawingName = drawingName;
	}

	public String getDrawingUrl(){
		return drawingUrl;
	}

	public void setDrawingUrl(String drawingUrl){
		this.drawingUrl = drawingUrl;
	}

	public String getDrawingAddUrl(){
		return drawingAddUrl;
	}

	public void setDrawingAddUrl(String drawingAddUrl){
		this.drawingAddUrl = drawingAddUrl;
	}

	public Integer getCsId() {
		return csId;
	}

	public void setCsId(Integer csId) {
		this.csId = csId;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

}
