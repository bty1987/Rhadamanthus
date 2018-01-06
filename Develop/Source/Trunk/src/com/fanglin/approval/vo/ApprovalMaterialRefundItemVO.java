package com.fanglin.approval.vo;

import com.fanglin.material.vo.MaterialItemVO;

public class ApprovalMaterialRefundItemVO implements java.io.Serializable {

	private static final long serialVersionUID = -6670407153414810186L;

	private Integer amriId;
	
	private Integer amrId;
	
	private Long msoId;
	
	private Float num;
	
	private Float total;
	
	private String packageName;
	
	private MaterialItemVO materialItem;

	public ApprovalMaterialRefundItemVO() {
		super();
	}

	public ApprovalMaterialRefundItemVO(MaterialItemVO materialItem) {
		super();
		this.materialItem = materialItem;
	}

	public Integer getAmriId() {
		return amriId;
	}

	public void setAmriId(Integer amriId) {
		this.amriId = amriId;
	}

	public Integer getAmrId() {
		return amrId;
	}

	public void setAmrId(Integer amrId) {
		this.amrId = amrId;
	}

	public Long getMsoId() {
		return this.msoId;
	}

	public void setMsoId(Long msoId) {
		this.msoId = msoId;
	}

	public Float getNum() {
		return this.num;
	}

	public void setNum(Float num) {
		this.num = num;
	}

	public Float getTotal() {
		return this.total;
	}

	public void setTotal(Float total) {
		this.total = total;
	}

	public String getPackageName() {
		return this.packageName;
	}

	public void setPackageName(String packageName) {
		this.packageName = packageName;
	}

	public MaterialItemVO getMaterialItem() {
		return materialItem;
	}

	public void setMaterialItem(MaterialItemVO materialItem) {
		this.materialItem = materialItem;
	}

}