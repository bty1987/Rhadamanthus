package com.fanglin.information.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "awardstock", catalog = "information")
public class AwardStockPO implements java.io.Serializable{
	
	private static final long serialVersionUID = 3752534956399849803L;
	
	public static final short STATUS_ABLE_SHORT = 0;
	
	public static final String STATUS_TYPE_STR = "type";
	
	public static final String COLUMN_NO_STR = "no";
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final String COLUMN_NAME_STR = "name";
	
	public static final String COLUMN_COMPANY_STR = "company";
	
	public static final short ISPREFOR_CAL_INT = 0; // 计算业绩
	
	public static final short ISSTOCK_CAL_INT = 0; // 计算库存
	
	public static final short TYPE_CG_INT = 0; // 入库
	
	public static final short TYPE_XG_INT = 1; // 出库
	
	public static final short TYPE_SURPLUS_INT = 2; // 盘盈
	
	public static final short TYPE_LOSSES_INT = 3; // 盘亏
	
	private long asId;
	
	private String no;
	
	private String name;
	
	private float num;
	
	private short status;
	
	private short type;
	
	private short isPrefor; //是否计算业绩
	
	private short isStock; //是否计算库存
	
	private String content;
	
	private int company;
	
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "asId")
	public long getAsId() {
		return asId;
	}

	public void setAsId(long asId) {
		this.asId = asId;
	}
	
	@Column(name = "no")
	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}
	
	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
	@Column(name = "num")
	public float getNum() {
		return num;
	}

	public void setNum(float num) {
		this.num = num;
	}
	
	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}
	
	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}
	
	@Column(name = "isPrefor")
	public short getIsPrefor() {
		return isPrefor;
	}

	public void setIsPrefor(short isPrefor) {
		this.isPrefor = isPrefor;
	}
	
	@Column(name = "isStock")
	public short getIsStock() {
		return isStock;
	}

	public void setIsStock(short isStock) {
		this.isStock = isStock;
	}

	@Column(name = "content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}
	
	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}
}
