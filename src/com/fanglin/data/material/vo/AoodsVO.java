package com.fanglin.data.material.vo;

import java.io.Serializable;

import com.fanglin.data.common.vo.ConstructionNodeVO;

public class AoodsVO implements Serializable {

	private static final long serialVersionUID = -7147159224652861599L;

	private Long aid;

	private String name;

	private Long gid;

	private GoodsVO goods;

	private AccessoriesTypeVO accessoriesType;

	private AccessoriesTypeVO sortType;

	private NoodsVO noods;

	private ConstructionNodeVO constructionNode;

	private String normunit;// 定额单位

	private Integer normnum;// 定额数量

	private String storeunit;// 库房单位

	private Integer storenum;// 库房数量

	private Integer balance;

	private Integer selling;

	private Short atttype;

	private Short checkup;

	private Short status;

	private Integer company;

	private String bompany;

	public AoodsVO() {
		super();
	}

	public AoodsVO(GoodsVO goods, AccessoriesTypeVO accessoriesType) {

		super();

		this.goods = goods;
		this.accessoriesType = accessoriesType;
	}

	public AoodsVO(GoodsVO goods, AccessoriesTypeVO accessoriesType, AccessoriesTypeVO sortType, NoodsVO noods, ConstructionNodeVO constructionNode) {

		super();

		this.goods = goods;
		this.accessoriesType = accessoriesType;
		this.sortType = sortType;
		this.noods = noods;
		this.constructionNode = constructionNode;
	}

	public Long getAid() {
		return aid;
	}

	public void setAid(Long aid) {
		this.aid = aid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public GoodsVO getGoods() {
		return goods;
	}

	public void setGoods(GoodsVO goods) {
		this.goods = goods;
	}

	public AccessoriesTypeVO getAccessoriesType() {
		return accessoriesType;
	}

	public void setAccessoriesType(AccessoriesTypeVO accessoriesType) {
		this.accessoriesType = accessoriesType;
	}

	public AccessoriesTypeVO getSortType() {
		return sortType;
	}

	public void setSortType(AccessoriesTypeVO sortType) {
		this.sortType = sortType;
	}

	public NoodsVO getNoods() {
		return noods;
	}

	public void setNoods(NoodsVO noods) {
		this.noods = noods;
	}

	public ConstructionNodeVO getConstructionNode() {
		return constructionNode;
	}

	public void setConstructionNode(ConstructionNodeVO constructionNode) {
		this.constructionNode = constructionNode;
	}

	public String getNormunit() {
		return normunit;
	}

	public void setNormunit(String normunit) {
		this.normunit = normunit;
	}

	public Integer getNormnum() {
		return normnum;
	}

	public void setNormnum(Integer normnum) {
		this.normnum = normnum;
	}

	public String getStoreunit() {
		return storeunit;
	}

	public void setStoreunit(String storeunit) {
		this.storeunit = storeunit;
	}

	public Integer getStorenum() {
		return storenum;
	}

	public void setStorenum(Integer storenum) {
		this.storenum = storenum;
	}

	public Short getCheckup() {
		return checkup;
	}

	public void setCheckup(Short checkup) {
		this.checkup = checkup;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

	public String getBompany() {
		return bompany;
	}

	public void setBompany(String bompany) {
		this.bompany = bompany;
	}

	public Long getGid() {
		return gid;
	}

	public void setGid(Long gid) {
		this.gid = gid;
	}

	public Integer getBalance() {
		return balance;
	}

	public void setBalance(Integer balance) {
		this.balance = balance;
	}

	public Integer getSelling() {
		return selling;
	}

	public void setSelling(Integer selling) {
		this.selling = selling;
	}

	public Short getAtttype() {
		return atttype;
	}

	public void setAtttype(Short atttype) {
		this.atttype = atttype;
	}

}
