package com.fanglin.information.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "vticket", catalog = "information", uniqueConstraints = { @UniqueConstraint(columnNames = "tno") })
public class VticketPO implements java.io.Serializable {

	private static final long serialVersionUID = -649765382182811374L;

	public static final String COLUMN_VTID_STR = "vtid";

	public static final String COLUMN_TNO_STR = "tno";

	public static final String COLUMN_ORDERID_STR = "orderId";

	public static final String COLUMN_NAME_STR = "name";

	public static final String COLUMN_BELONGER_STR = "belonger.uid";

	public static final String COLUMN_EXPIRE_STR = "expire";

	public static final short ISCOME_YES_INT = 1;

	public static final short ISREGIST_YES_INT = 1;

	public static final short EXPIRE_INIT_INT = 0;

	private long vtid;

	private String tno;

	private long vaid;

	private UserPO creater;

	private Timestamp createTime;

	private UserPO belonger;

	private DepartmentPO department;

	private DepartmentPO region;

	private String orderId;

	private String name;

	private String phone;

	private String address;

	private short isregist;

	private short iscome;

	private short expire;

	public VticketPO() {
		super();
	}

	public VticketPO(UserPO creater, UserPO belonger, DepartmentPO department, DepartmentPO region) {
		super();
		this.creater = creater;
		this.belonger = belonger;
		this.department = department;
		this.region = region;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "vtid")
	public long getVtid() {
		return vtid;
	}

	public void setVtid(long vtid) {
		this.vtid = vtid;
	}

	@Column(name = "tno")
	public String getTno() {
		return tno;
	}

	public void setTno(String tno) {
		this.tno = tno;
	}

	@Column(name = "vaid")
	public long getVaid() {
		return vaid;
	}

	public void setVaid(long vaid) {
		this.vaid = vaid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "buid", referencedColumnName = "uid")
	public UserPO getBelonger() {
		return belonger;
	}

	public void setBelonger(UserPO belonger) {
		this.belonger = belonger;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "did", referencedColumnName = "did")
	public DepartmentPO getDepartment() {
		return department;
	}

	public void setDepartment(DepartmentPO department) {
		this.department = department;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "rid", referencedColumnName = "did")
	public DepartmentPO getRegion() {
		return region;
	}

	public void setRegion(DepartmentPO region) {
		this.region = region;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "phone")
	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	@Column(name = "address")
	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	@Column(name = "isregist")
	public short getIsregist() {
		return isregist;
	}

	public void setIsregist(short isregist) {
		this.isregist = isregist;
	}

	@Column(name = "iscome")
	public short getIscome() {
		return iscome;
	}

	public void setIscome(short iscome) {
		this.iscome = iscome;
	}

	public short getExpire() {
		return expire;
	}

	public void setExpire(short expire) {
		this.expire = expire;
	}

}