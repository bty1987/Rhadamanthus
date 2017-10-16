package com.fanglin.report.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "materialdesignerregioncount", catalog = "report")
public class MaterialDesignerRegionCountPO implements java.io.Serializable {

	private static final long serialVersionUID = 2397559409972813226L;
	
	public static final String COLUMN_DESIGNERREGIONID_STR = "designerRegionId";
	
	public static final String COLUMN_DESIGNERREGIONNAME_STR = "designerRegionName";
	
	public static final String COLUMN_CREATETIME_STR = "createTime";
	
	public static final String COLUMN_TOTAL_STR = "total";
	
	private int mdrcId;
	
	private String designerRegionId;
	
	private String designerRegionName;
	
	private String createTime;
	
	private float total;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "mdrcId")
	public int getMdrcId(){
		return this.mdrcId;
	}

	public void setMdrcId(int mdrcId){
		this.mdrcId = mdrcId;
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
	public float getTotal(){
		return this.total;
	}

	public void setTotal(float total){
		this.total = total;
	}

	@Column(name = "designerRegionName")
	public String getDesignerRegionName() {
		return designerRegionName;
	}

	public void setDesignerRegionName(String designerRegionName) {
		this.designerRegionName = designerRegionName;
	}

}