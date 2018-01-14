package com.fanglin.building.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.data.po.CustomerPO;
import com.fanglin.personel.po.UserPO;

@Entity
@Table(name="customerSource", catalog = "building")
public class CustomerSourcePO implements Serializable{

	private static final long serialVersionUID = -4319485351492418005L;
	
	public static final String COLUMN_CID_STR = "customer.cid";
	
	public static final String COLUMN_UID_STR = "create.uid";
	
	public static final String COLUMN_NO_STR = "no";
	
	public static final String COLUMN_TYPE_STR = "type";
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final short STATUS_INIT_SHORT = 0;
	
	public static final short STATUS_SIGN_SHORT = 1;
	
	public static final short STATUS_DISABLE_SHORT = 2;
	
	private long csid;
	
	private String no;
	
	private CustomerPO customer;
	
	private short type;
	
	private String purpose;
	
	private String intention;
	
	private String price;
	
	private String area;
	
	private String familyType;
	
	private short orientation;
	
	private String conditions;
	
	private String grade;
	
	private UserPO create;
	
	private Timestamp createTime;
	
	private short status;
	
	private String comment;
	
	public CustomerSourcePO() {
		super();
	}
	
	public CustomerSourcePO(CustomerPO customer, UserPO create) {
		super();
		this.customer = customer;
		this.create = create;
	}
	
	@Id
	@GeneratedValue
	@Column(name="csid")
	public long getCsid() {
		return csid;
	}

	public void setCsid(long csid) {
		this.csid = csid;
	}
	
	@Column(name="no")
	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cid", referencedColumnName="cid")
	public CustomerPO getCustomer() {
		return customer;
	}

	public void setCustomer(CustomerPO customer) {
		this.customer = customer;
	}

	@Column(name="type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name="purpose")
	public String getPurpose() {
		return purpose;
	}

	public void setPurpose(String purpose) {
		this.purpose = purpose;
	}

	@Column(name="intention")
	public String getIntention() {
		return intention;
	}

	public void setIntention(String intention) {
		this.intention = intention;
	}

	@Column(name="price")
	public String getPrice() {
		return price;
	}

	public void setPrice(String price) {
		this.price = price;
	}

	@Column(name="area")
	public String getArea() {
		return area;
	}

	public void setArea(String area) {
		this.area = area;
	}

	@Column(name="familyType")
	public String getFamilyType() {
		return familyType;
	}

	public void setFamilyType(String familyType) {
		this.familyType = familyType;
	}

	@Column(name="orientation")
	public short getOrientation() {
		return orientation;
	}

	public void setOrientation(short orientation) {
		this.orientation = orientation;
	}

	@Column(name="conditions")
	public String getConditions() {
		return conditions;
	}

	public void setConditions(String conditions) {
		this.conditions = conditions;
	}

	@Column(name="grade")
	public String getGrade() {
		return grade;
	}

	public void setGrade(String grade) {
		this.grade = grade;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cuid", referencedColumnName="uid")
	public UserPO getCreate() {
		return create;
	}

	public void setCreate(UserPO create) {
		this.create = create;
	}

	@Column(name="createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name="status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name="comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
	
}
