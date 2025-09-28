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

import com.fanglin.data.material.vo.AoodsVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "aoods", catalog = "data")
public class AoodsPO implements Serializable {

	private static final long serialVersionUID = -7644266247269577044L;

	public static final String COLUMN_COMPANY_STR = "company";

	public static final String COLUMN_BOMPANY_STR = "bompany";

	public static final String COLUMN_AID_STR = "aid";

	public static final String COLUMN_NAME_STR = "goods.name";

	public static final String COLUMN_ANAME_STR = "accessoriesType.name";

	public static final String COLUMN_GID_STR = "goods.gid";

	public static final String COLUMN_NO_STR = "goods.no";

	public static final String COLUMN_PINYIN_STR = "goods.pinyin";

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_STATUS_ATTTYPE = "atttype";

	public static final short STATUS_ENABLE_INT = 0;

	public static final short CHECKUP_CHECK_INT = 0;

	private long aid;

	private String name;

	private GoodsPO goods;

	private AccessoriesTypePO accessoriesType;

	private NoodsPO noods;

	private ConstructionNodePO constructionNode;

	private String normunit; // 定额单位

	private int normnum; // 定额数量

	private String storeunit; // 库房单位

	private int storenum; // 库房数量

	private int balance;

	private int selling;

	private short atttype;

	private short checkup;

	private short status;

	private int company;

	private int bompany;

	public AoodsPO() {
		super();
	}

	public AoodsPO(long aid) {
		super();
		this.aid = aid;
	}

	public AoodsPO(AccessoriesTypePO accessoriesType, GoodsPO goods) {
		super();
		this.accessoriesType = accessoriesType;
		this.goods = goods;
	}

	public AoodsPO(ConstructionNodePO constructionNode) {
		super();
		this.constructionNode = constructionNode;
	}

	public AoodsPO(AccessoriesTypePO accessoriesType, GoodsPO goods, NoodsPO noods, ConstructionNodePO constructionNode) {
		super();
		this.accessoriesType = accessoriesType;
		this.goods = goods;
		this.noods = noods;
		this.constructionNode = constructionNode;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "aid")
	public long getAid() {
		return aid;
	}

	public void setAid(long aid) {
		this.aid = aid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "gid", referencedColumnName = "gid")
	public GoodsPO getGoods() {
		return goods;
	}

	public void setGoods(GoodsPO goods) {
		this.goods = goods;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "atid", referencedColumnName = "atid")
	public AccessoriesTypePO getAccessoriesType() {
		return accessoriesType;
	}

	public void setAccessoriesType(AccessoriesTypePO accessoriesType) {
		this.accessoriesType = accessoriesType;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "nid", referencedColumnName = "nid")
	public NoodsPO getNoods() {
		return noods;
	}

	public void setNoods(NoodsPO noods) {
		this.noods = noods;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cnid", referencedColumnName = "cnid")
	public ConstructionNodePO getConstructionNode() {
		return constructionNode;
	}

	public void setConstructionNode(ConstructionNodePO constructionNode) {
		this.constructionNode = constructionNode;
	}

	@Column(name = "normunit")
	public String getNormunit() {
		return normunit;
	}

	public void setNormunit(String normunit) {
		this.normunit = normunit;
	}

	@Column(name = "normnum")
	public int getNormnum() {
		return normnum;
	}

	public void setNormnum(int normnum) {
		this.normnum = normnum;
	}

	@Column(name = "storeunit")
	public String getStoreunit() {
		return storeunit;
	}

	public void setStoreunit(String storeunit) {
		this.storeunit = storeunit;
	}

	@Column(name = "storenum")
	public int getStorenum() {
		return storenum;
	}

	public void setStorenum(int storenum) {
		this.storenum = storenum;
	}

	@Column(name = "checkup")
	public short getCheckup() {
		return checkup;
	}

	public void setCheckup(short checkup) {
		this.checkup = checkup;
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

	@Column(name = "bompany")
	public int getBompany() {
		return bompany;
	}

	public void setBompany(int bompany) {
		this.bompany = bompany;
	}

	@Column(name = "balance")
	public int getBalance() {
		return balance;
	}

	public void setBalance(int balance) {
		this.balance = balance;
	}

	@Column(name = "selling")
	public int getSelling() {
		return selling;
	}

	public void setSelling(int selling) {
		this.selling = selling;
	}

	@Column(name = "atttype")
	public short getAtttype() {
		return atttype;
	}

	public void setAtttype(short atttype) {
		this.atttype = atttype;
	}

	public AoodsVO ptv(AoodsVO aoodsVO) {

		BeanUtil.copyProperties(this, aoodsVO, Arrays.asList("goods", "accessoriesType", "bompany", "noods", "constructionNode"));

		if (aoodsVO.getGoods() != null && getGoods() != null) {
			getGoods().ptv(aoodsVO.getGoods());

			aoodsVO.setGid(getGoods().getGid());
			aoodsVO.setName(getGoods().getName());
		}

		if (aoodsVO.getAccessoriesType() != null && getAccessoriesType() != null) getAccessoriesType().ptv(aoodsVO.getAccessoriesType());
		if (aoodsVO.getNoods() != null && getNoods() != null) getNoods().ptv(aoodsVO.getNoods());
		if (aoodsVO.getConstructionNode() != null && getConstructionNode() != null) getConstructionNode().ptv(aoodsVO.getConstructionNode());

		return aoodsVO;
	}

}
