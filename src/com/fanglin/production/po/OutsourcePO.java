package com.fanglin.production.po;

import static javax.persistence.GenerationType.IDENTITY;

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

import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "outsource", catalog = "production")
public class OutsourcePO implements Serializable{

	private static final long serialVersionUID = -167946567697769154L;

	public static final String COLMU_PATH = "";

	public static final String COLMU_STATUS_STR = "status";
	 
	public static final short STATUS_INIT_SHORT = 0;// 初始

	public static final short STATUS_RECEIVE_SHORT = 1;// 审核

	public static final short STATUS_CONFIRM_SHORT = 2;// 确认

	public static final short STATUS_END_SHORT = 3;// 完结

	public static final short STATUS_INVALID_SHORT = 4;// 失效

	public static final String COLUMN_NO_STR = "no";
	
	public static final String COLMU_SUPPLIER_STR = "supplier.uid";
	
	public static final String COLUMN_PNO_STR = "pno";
	
	public static final String COLUMN_COMPANY_STR = "company";
	
	private long oid;
	
	private ProductionPO production;
	
	private String no;// 编号 , L作为第一个字符 , 由日期加四位格式计数组成 , 例: L1601010001
	
	private UserPO supplier;// 厂商 , 类型 user
	
	private UserPO creater; // 创建人 , 类型 user
	
	private Timestamp createTime;// 创建时间
	
	private Timestamp finishTime;// 结束时间
	
	private short status;

	private String path;

	private int timeLimit; //工期

	private String comment;
	
	private int company;

	public OutsourcePO() {
		super();
	}

	public OutsourcePO(long oid) {
		super();
		this.oid = oid;
	}

	public OutsourcePO(ProductionPO production, UserPO creater, UserPO supplier) {
		super();
		this.production = production;
		this.creater = creater;
		this.supplier = supplier;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "oid")
	public long getOid() {
		return oid;
	}

	public void setOid(long oid) {
		this.oid = oid;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "path")
	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "pid", referencedColumnName = "pid")
	public ProductionPO getProduction() {
		return production;
	}

	public void setProduction(ProductionPO production) {
		this.production = production;
	}

	@Column(name = "no")
	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false,name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}
	
	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false,name = "fuid", referencedColumnName = "uid")
	public UserPO getSupplier() {
		return supplier;
	}

	public void setSupplier(UserPO supplier) {
		this.supplier = supplier;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "finishTime")
	public Timestamp getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(Timestamp finishTime) {
		this.finishTime = finishTime;
	}

	@Column(name = "timeLimit")
	public int getTimeLimit() {
		return timeLimit;
	}

	public void setTimeLimit(int timeLimit) {
		this.timeLimit = timeLimit;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}
}
