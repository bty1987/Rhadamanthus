package com.fanglin.construction.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.data.po.AoodsPO;

@Entity
@Table(name = "constructionaccessory", catalog = "construction")
public class ConstructionAccessoryPO implements Serializable {

	private static final long serialVersionUID = 679281034031271054L;
	
	public static final String COLUMN_ATID_STR = "aoods.accessoriesType.atid";	
	
	public static final String COLUMN_CID_STR = "cid";
	
	public static final short CHECKUP_VERIFY_SHORT = 0;
	
	public static final short CHECKUP_PASS_SHORT = 1;
	
	private long caid;
	
	private long cid;
	
	private AoodsPO aoods;
	
	private short checkup;
	
	private long numLimit;
	
	private int num;
	
	private long total;

	public ConstructionAccessoryPO() {
		super();
	}
	
	public ConstructionAccessoryPO(AoodsPO aoods) {
		super();
		this.aoods = aoods;
	}
	
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "caid")
	public long getCaid() {
		return caid;
	}

	public void setCaid(long caid) {
		this.caid = caid;
	}

	@Column(name = "cid")
	public long getCid() {
		return cid;
	}

	public void setCid(long cid) {
		this.cid = cid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "aid", referencedColumnName = "aid")
	public AoodsPO getAoods() {
		return aoods;
	}

	public void setAoods(AoodsPO aoods) {
		this.aoods = aoods;
	}

	@Column(name = "checkup")
	public short getCheckup() {
		return checkup;
	}

	public void setCheckup(short checkup) {
		this.checkup = checkup;
	}

	@Column(name = "numLimit")
	public long getNumLimit() {
		return numLimit;
	}

	public void setNumLimit(long numLimit) {
		this.numLimit = numLimit;
	}
	
	@Column(name = "num")
	public int getNum() {
		return num;
	}

	public void setNum(int num) {
		this.num = num;
	}

	@Column(name = "total")
	public long getTotal() {
		return total;
	}

	public void setTotal(long total) {
		this.total = total;
	}
	
	
	
}
