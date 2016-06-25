package com.fanglin.approval.po;
// default package

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "approvalmaterialrefunditem", catalog = "platform")
public class ApprovalMaterialRefundItemPO implements java.io.Serializable {

	private static final long serialVersionUID = 7616304742054234800L;
	
	public static final String COLUMN_AMRID_STR = "amrId";

	private int amriId;
	
	private int amrId;
	
	private long msoId;
	
	private long msoiId;
	
	private float num;
	
	private float total;
	
	private String packageName;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "amriId")
	public int getAmriId() {
		return this.amriId;
	}

	public void setAmriId(int amriId) {
		this.amriId = amriId;
	}

	@Column(name = "amrId")
	public int getAmrId() {
		return this.amrId;
	}

	public void setAmrId(int amrId) {
		this.amrId = amrId;
	}

	@Column(name = "msoId")
	public long getMsoId() {
		return this.msoId;
	}

	public void setMsoId(long msoId) {
		this.msoId = msoId;
	}

	@Column(name = "msoiId")
	public long getMsoiId() {
		return this.msoiId;
	}

	public void setMsoiId(long msoiId) {
		this.msoiId = msoiId;
	}

	@Column(name = "num")
	public float getNum() {
		return this.num;
	}

	public void setNum(float num) {
		this.num = num;
	}

	@Column(name = "total")
	public float getTotal() {
		return this.total;
	}

	public void setTotal(float total) {
		this.total = total;
	}

	@Column(name = "packageName")
	public String getPackageName() {
		return this.packageName;
	}

	public void setPackageName(String packageName) {
		this.packageName = packageName;
	}

}