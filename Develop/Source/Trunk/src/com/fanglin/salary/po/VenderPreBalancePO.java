package com.fanglin.salary.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "venderprebalance", catalog = "platform")
public class VenderPreBalancePO implements java.io.Serializable {

	private static final long serialVersionUID = 2147361893496016326L;
	
	public static String CURRENT_TIME_FORMAT_STR = "yyyy-MM-dd";
	
	public static int STATUS_TYPE_INIT_INT = 0;
	
	public static int STATUS_TYPE_PAYOFF_INT = 1;
	
	public static String COLUMN_VBID_STR = "vbId";
	
	public static String COLUMN_MSOID_STR = "msoId";
	
	public static String COLUMN_MATERIALBRANDID_STR = "materialBrandId";

	private int vpbId;
	
	private int vbId;
	
	private String orderId;
	
	private long msoId;
	
	private String msoNo;
	
	private int materialBrandId;
	
	private String materialBrandName;
	
	private String createTime;
	
	private float preBalance;
	
	private int status;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "vpbId")
	public int getVpbId() {
		return this.vpbId;
	}

	public void setVpbId(int vpbId) {
		this.vpbId = vpbId;
	}

	@Column(name = "vbId")
	public int getVbId() {
		return this.vbId;
	}

	public void setVbId(int vbId) {
		this.vbId = vbId;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return this.orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "msoId")
	public long getMsoId() {
		return this.msoId;
	}

	public void setMsoId(long msoId) {
		this.msoId = msoId;
	}

	@Column(name = "msoNo")
	public String getMsoNo() {
		return this.msoNo;
	}

	public void setMsoNo(String msoNo) {
		this.msoNo = msoNo;
	}

	@Column(name = "createTime")
	public String getCreateTime() {
		return this.createTime;
	}

	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}

	@Column(name = "preBalance")
	public float getPreBalance() {
		return this.preBalance;
	}

	public void setPreBalance(float preBalance) {
		this.preBalance = preBalance;
	}

	@Column(name = "status")
	public int getStatus() {
		return this.status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	@Column(name = "materialBrandId")
	public int getMaterialBrandId() {
		return materialBrandId;
	}

	public void setMaterialBrandId(int materialBrandId) {
		this.materialBrandId = materialBrandId;
	}

	@Column(name = "materialBrandName")
	public String getMaterialBrandName() {
		return materialBrandName;
	}

	public void setMaterialBrandName(String materialBrandName) {
		this.materialBrandName = materialBrandName;
	}

}