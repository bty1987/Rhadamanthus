package com.fanglin.construction.vo;

public class WaterwayCircuitCheckDrawingVO implements java.io.Serializable {
	
	private static final long serialVersionUID = -8277553878150710324L;

	private Integer wccdId;
	
	private Integer wcccsId;
	
	private Integer csId;
	
	private String drawingName;
	
	private String drawingUrl;
	
	private String drawingAddUrl;
	
	private Short type;

	public Integer getWccdId(){
		return wccdId;
	}

	public void setWccdId(Integer wccdId){
		this.wccdId = wccdId;
	}

	public Integer getWcccsId(){
		return wcccsId;
	}

	public void setWcccsId(Integer wcccsId){
		this.wcccsId = wcccsId;
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