package com.fanglin.report.vo;

public class ZaterialDesignerRegionCountVO implements java.io.Serializable {

	private static final long serialVersionUID = -2432749758467214616L;

	private Integer zdrcId;
	
	private String designerRegionId;
	
	private String designerRegionName;
	
	private String createTime;
	
	private Float total;

	public Integer getZdrcId(){
		return this.zdrcId;
	}

	public void setZdrcId(Integer zdrcId){
		this.zdrcId = zdrcId;
	}

	public String getDesignerRegionId(){
		return this.designerRegionId;
	}

	public void setDesignerRegionId(String designerRegionId){
		this.designerRegionId = designerRegionId;
	}

	public String getCreateTime(){
		return this.createTime;
	}

	public void setCreateTime(String createTime){
		this.createTime = createTime;
	}

	public Float getTotal(){
		return this.total;
	}

	public void setTotal(Float total){
		this.total = total;
	}

	public String getDesignerRegionName() {
		return designerRegionName;
	}

	public void setDesignerRegionName(String designerRegionName) {
		this.designerRegionName = designerRegionName;
	}

}