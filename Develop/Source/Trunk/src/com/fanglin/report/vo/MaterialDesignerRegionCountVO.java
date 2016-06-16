package com.fanglin.report.vo;

public class MaterialDesignerRegionCountVO implements java.io.Serializable {

	private static final long serialVersionUID = -6428956662341044365L;

	private Integer mdrcId;
	
	private String designerRegionId;
	
	private String designerRegionName;
	
	private String createTime;
	
	private Float total;

	public Integer getMdrcId(){
		return this.mdrcId;
	}

	public void setMdrcId(Integer mdrcId){
		this.mdrcId = mdrcId;
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