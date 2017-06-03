/**
 * @File Name		: WaterwayCircuitPowerDrawingVO.java
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

public class WaterwayCircuitPowerDrawingVO implements Serializable{
	
	private static final long serialVersionUID = -8501977040811944126L;

	private Integer wcpdId;
	
	private Integer wcpcsId;
	
	private Long csId;
	
	private String drawingName;
	
	private String drawingUrl;

	private String drawingAddUrl;
	
	private Short type;

	public Integer getWcpdId(){
		return wcpdId;
	}

	public void setWcpdId(Integer wcpdId){
		this.wcpdId = wcpdId;
	}

	public Integer getWcpcsId(){
		return wcpcsId;
	}

	public void setWcpcsId(Integer wcpcsId){
		this.wcpcsId = wcpcsId;
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

	public Long getCsId() {
		return csId;
	}

	public void setCsId(Long csId) {
		this.csId = csId;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

}
