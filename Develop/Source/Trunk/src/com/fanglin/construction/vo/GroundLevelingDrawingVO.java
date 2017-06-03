package com.fanglin.construction.vo;

public class GroundLevelingDrawingVO implements java.io.Serializable {

	private static final long serialVersionUID = -4621939416199727243L;

	private Integer gldId;
	
	private Integer glcsId;
	
	private Long csId;
	
	private String drawingName;
	
	private String drawingUrl;
	
	private String drawingAddUrl;
	
	private Short type;

	public Integer getGldId(){
		return gldId;
	}

	public void setGldId(Integer gldId){
		this.gldId = gldId;
	}

	public Integer getGlcsId(){
		return glcsId;
	}

	public void setGlcsId(Integer glcsId){
		this.glcsId = glcsId;
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