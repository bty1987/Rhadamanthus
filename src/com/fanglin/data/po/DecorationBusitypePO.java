package com.fanglin.data.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.data.common.vo.DecorationBusitypeVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "decorationbusitype", catalog = "data")
public class DecorationBusitypePO implements Serializable {

	private static final long serialVersionUID = -5869493702897809107L;

	public static final String COLUMN_NAME_STR = "name";

	public static final String COLUMN_STATUS_STR = "status";

	public static final short STATUS_ENABLE_INT = 0;

	public static final short STATUS_DISABLE_INT = 1;

	public static final short ISAWARD_AWARD_INT = 1;

	public static final short ISAWARD_AWARD_DEPT_INT = 2;

	public static final short ISMEMBER_COMMON_INT = 0;

	public static final short ISMEMBER_MEMBER_INT = 1;

	public static final short TYPE_COMMON_INT = 0;

	public static final short TYPE_ORIGIN_INT = 1;

	public static final short TYPE_SOURCE_INT = 2;

	private long dbid;

	private DecorationBusitypePO cascade;

	private int no;

	private String name;

	private String alias;

	private int notSalesmanRate;

	private short outside;

	private short isRefer;

	private short isAward;

	private short isMember;

	private short type;

	private short status;

	private int company;

	public DecorationBusitypePO() {
		super();
	}

	public DecorationBusitypePO(long dbid) {
		super();
		this.dbid = dbid;
	}

	public DecorationBusitypePO(long dbid, String name, short status, int company) {
		super();
		this.dbid = dbid;
		this.name = name;
		this.status = status;
		this.company = company;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "dbid")
	public long getDbid() {
		return dbid;
	}

	public void setDbid(long dbid) {
		this.dbid = dbid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "fdbid", referencedColumnName = "dbid")
	public DecorationBusitypePO getCascade() {
		return cascade;
	}

	public void setCascade(DecorationBusitypePO cascade) {
		this.cascade = cascade;
	}

	@Column(name = "no")
	public int getNo() {
		return no;
	}

	public void setNo(int no) {
		this.no = no;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "alias")
	public String getAlias() {
		return alias;
	}

	public void setAlias(String alias) {
		this.alias = alias;
	}

	@Column(name = "notSalesmanRate")
	public int getNotSalesmanRate() {
		return notSalesmanRate;
	}

	public void setNotSalesmanRate(int notSalesmanRate) {
		this.notSalesmanRate = notSalesmanRate;
	}

	@Column(name = "outside")
	public short getOutside() {
		return outside;
	}

	public void setOutside(short outside) {
		this.outside = outside;
	}

	@Column(name = "isRefer")
	public short getIsRefer() {
		return isRefer;
	}

	public void setIsRefer(short isRefer) {
		this.isRefer = isRefer;
	}

	@Column(name = "isAward")
	public short getIsAward() {
		return isAward;
	}

	public void setIsAward(short isAward) {
		this.isAward = isAward;
	}

	@Column(name = "isMember")
	public short getIsMember() {
		return isMember;
	}

	public void setIsMember(short isMember) {
		this.isMember = isMember;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	public DecorationBusitypeVO ptv(DecorationBusitypeVO decorationBusitypeVO) {

		BeanUtil.copyPropertie(this, decorationBusitypeVO, Arrays.asList("cascase"));

		if (decorationBusitypeVO.getCascade() != null && getCascade() != null) getCascade().ptv(decorationBusitypeVO.getCascade());

		return decorationBusitypeVO;
	}

}
