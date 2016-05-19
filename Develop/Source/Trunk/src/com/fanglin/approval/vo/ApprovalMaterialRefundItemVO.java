package com.fanglin.approval.vo;

public class ApprovalMaterialRefundItemVO implements java.io.Serializable {

	private static final long serialVersionUID = -6670407153414810186L;

	private Integer amriId;
	
	private Integer amrId;
	
	private Long msoId;
	
	private Long msoiId;
	
	private Float num;
	
	private Float total;
	
	private String packageName;

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

	public Long getMsoiId() {
		return this.msoiId;
	}

	public void setMsoiId(Long msoiId) {
		this.msoiId = msoiId;
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

}