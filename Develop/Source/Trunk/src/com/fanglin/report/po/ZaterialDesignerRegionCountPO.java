package com.fanglin.report.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "zaterialdesignerregioncount", catalog = "platform")
public class ZaterialDesignerRegionCountPO implements java.io.Serializable {

	private static final long serialVersionUID = 4736436226536277259L;
	
	public static String COLUMN_DESIGNERREGIONID_STR = "designerRegionId";
	
	public static String COLUMN_DESIGNERREGIONNAME_STR = "designerRegionName";
	
	public static String COLUMN_CREATETIME_STR = "createTime";
	
	public static String COLUMN_TOTAL_STR = "total";

	private Integer zdrcId;
	
	private String designerRegionId;
	
	private String designerRegionName;
	
	private String materialBrand;
	
	private String createTime;
	
	private Float total;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "zdrcId")
	public Integer getZdrcId(){
		return this.zdrcId;
	}

	public void setZdrcId(Integer zdrcId){
		this.zdrcId = zdrcId;
	}

	@Column(name = "designerRegionId")
	public String getDesignerRegionId(){
		return this.designerRegionId;
	}

	public void setDesignerRegionId(String designerRegionId){
		this.designerRegionId = designerRegionId;
	}

	@Column(name = "createTime")
	public String getCreateTime(){
		return this.createTime;
	}

	public void setCreateTime(String createTime){
		this.createTime = createTime;
	}

	@Column(name = "total")
	public Float getTotal(){
		return this.total;
	}

	public void setTotal(Float total){
		this.total = total;
	}

	@Column(name = "designerRegionName")
	public String getDesignerRegionName() {
		return designerRegionName;
	}

	public void setDesignerRegionName(String designerRegionName) {
		this.designerRegionName = designerRegionName;
	}

	@Column(name="materialBrand")
	public String getMaterialBrand() {
		return materialBrand;
	}

	public void setMaterialBrand(String materialBrand) {
		this.materialBrand = materialBrand;
	}

}