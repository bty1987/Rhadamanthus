package com.fanglin.salary.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "venderpostbalance", catalog = "platform")
public class VenderPostBalancePO implements java.io.Serializable {

	private static final long serialVersionUID = 371186650620403178L;
	
	public static String CURRENT_TIME_FORMAT_STR = "yyyy-MM-dd";
	
	public static int STATUS_TYPE_INIT_INT = 0;
	
	public static int STATUS_YTPE_PAYOFF_INT = 1;
	
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
	
	private float postBalance;
	
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

	@Column(name = "materialBrandId")
	public int getMaterialBrandId() {
		return this.materialBrandId;
	}

	public void setMaterialBrandId(int materialBrandId) {
		this.materialBrandId = materialBrandId;
	}

	@Column(name = "materialBrandName")
	public String getMaterialBrandName() {
		return this.materialBrandName;
	}

	public void setMaterialBrandName(String materialBrandName) {
		this.materialBrandName = materialBrandName;
	}

	@Column(name = "createTime")
	public String getCreateTime() {
		return this.createTime;
	}

	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}

	@Column(name = "postBalance")
	public float getPostBalance() {
		return this.postBalance;
	}

	public void setPostBalance(float postBalance) {
		this.postBalance = postBalance;
	}

	@Column(name = "status")
	public int getStatus() {
		return this.status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

}