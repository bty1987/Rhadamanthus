package com.fanglin.salary.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "designerpostbalancesalary", catalog = "platform")
public class DesignerPostBalanceSalaryPO implements java.io.Serializable, DesignerBalanceSalary {

	private static final long serialVersionUID = -3115019180389167982L;
	
	public static String CURRENT_TIME_FORMAT_STR = "yyyy-MM-dd";
	
	public static int STATUS_TYPE_INIT_INT = 0;
	
	public static int STATUS_TYPE_PAYOFF_INT = 1;
	
	public static String COLUMN_DSID_STR = "dsId";
	
	public static String COLUMN_ORDERID_STR = "orderId";
	
	public static String COLUMN_MSOID_STR = "msoId";
	
	public static String COLUMN_MSONO_STR = "msoNo";
	
	public static String COLUMN_STATUS_STR = "status";
	
	public static String COLUMN_USERID_STR = "userId";

	private int dpobsId;
	
	private int dsId;
	
	private String orderId;
	
	private long msoId;
	
	private String msoNo;
	
	private String userId;
	
	private String userName;
	
	private String createTime;
	
	private Float postBalance;
	
	private int status;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "dpobsId")
	public int getDpobsId() {
		return this.dpobsId;
	}

	public void setDpobsId(int dpobsId) {
		this.dpobsId = dpobsId;
	}

	@Column(name = "dsId")
	public int getDsId() {
		return this.dsId;
	}

	public void setDsId(int dsId) {
		this.dsId = dsId;
	}

	@Column(name = "msoId")
	public long getMsoId() {
		return this.msoId;
	}

	public void setMsoId(long msoId) {
		this.msoId = msoId;
	}

	@Column(name = "userId")
	public String getUserId() {
		return this.userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	@Column(name = "userName")
	public String getUserName() {
		return this.userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	@Column(name = "createTime")
	public String getCreateTime() {
		return this.createTime;
	}

	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}

	@Column(name = "postBalance")
	public Float getPostBalance() {
		return this.postBalance;
	}

	public void setPostBalance(Float postBalance) {
		this.postBalance = postBalance;
	}

	@Column(name = "status")
	public int getStatus() {
		return this.status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "msoNo")
	public String getMsoNo() {
		return msoNo;
	}

	public void setMsoNo(String msoNo) {
		this.msoNo = msoNo;
	}

}