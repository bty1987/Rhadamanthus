/**
 * @File Name		: CarpentDrawingVO.java
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

public class CarpentDrawingVO implements Serializable {

	private static final long serialVersionUID = 2927516493623447838L;
	
	private Integer cdId;
	
	private Integer ccsId;
	
	private Integer csId;
	
	private String drawingName;
	
	private String drawingUrl;
	
	private String drawingAddUrl;
	
	private Short type;

	public Integer getCdId(){
		return cdId;
	}

	public void setCdId(Integer cdId){
		this.cdId = cdId;
	}

	public Integer getCcsId(){
		return ccsId;
	}

	public void setCcsId(Integer ccsId){
		this.ccsId = ccsId;
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
