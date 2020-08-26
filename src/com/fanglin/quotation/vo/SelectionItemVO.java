package com.fanglin.quotation.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.data.material.vo.GoodsVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.vo.UserBaseVO;

public class SelectionItemVO implements Serializable {

	private static final long serialVersionUID = 1819457635219731341L;

	private Long siid;// 选材项ID
	
	private Long sid;// 选材单ID
	
	private Long quoteId;// 引用项ID
	
	private Short type;// 类型 , 0: 报价项 , 1: 拓展增项 , 2: 拓展减项 , 3: 增项 , 4: 减项 
	
	private GoodsVO goods;// 商品 
	
	private Integer num;// 数量
	
	private DecorationVO decoration;// 装修单号
	
	private Long areaId;// 功能区id
	
	private String areaName;// 功能区名字
	
	private Long suid;// 厂商id

	private Short status;// 状态 , 0: 初始 , 1: 配送 , 2: 审核 , 3: 确认 , 4: 结算
	
	private Integer initNum;// 工程量
	
	private Integer postprice;// 售价
	
	private Integer preprice;// 预算金额
	
	private Timestamp createTime;// 创建时间
	
	private Timestamp tranTime;// 配送时间
	
	private Timestamp checkTime;// 审核时间
	
	private Timestamp confirmTime;// 确认时间
	
	private Timestamp balanceTime;// 结算时间
	
	private Timestamp finishTime;// 完结时间
	
	private UserBaseVO traner;// 配送人
	
	private UserBaseVO checker;// 审核人
	
	private UserBaseVO confirmer;// 确认人
	
	private UserBaseVO balancer;// 结算人
	
	private UserBaseVO finish;// 完结人 
	
	private Integer refnum;// 退数量
	
	private String comment;// 注释
	
	private Integer company;// 公司
	
	public SelectionItemVO() {
		super();
	}
	
	public SelectionItemVO(GoodsVO goods) {
		super();
		this.goods = goods;
	}

	public SelectionItemVO(GoodsVO goods, DecorationVO decoration, UserBaseVO traner, UserBaseVO checker, UserBaseVO confirmer, UserBaseVO finish, UserBaseVO balancer) {
		super();
		this.goods = goods;
		this.decoration = decoration;
		this.traner = traner;
		this.checker = checker;
		this.confirmer = confirmer;
		this.finish = finish;
		this.balancer = balancer;
	}

	public Long getSiid() {
		return siid;
	}

	public void setSiid(Long siid) {
		this.siid = siid;
	}

	public Long getSid() {
		return sid;
	}

	public void setSid(Long sid) {
		this.sid = sid;
	}

	public Long getQuoteId() {
		return quoteId;
	}

	public void setQuoteId(Long quoteId) {
		this.quoteId = quoteId;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public GoodsVO getGoods() {
		return goods;
	}

	public void setGoods(GoodsVO goods) {
		this.goods = goods;
	}

	public Integer getNum() {
		return num;
	}

	public void setNum(Integer num) {
		this.num = num;
	}

	public DecorationVO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationVO decoration) {
		this.decoration = decoration;
	}

	public Long getAreaId() {
		return areaId;
	}

	public void setAreaId(Long areaId) {
		this.areaId = areaId;
	}

	public Long getSuid() {
		return suid;
	}

	public void setSuid(Long suid) {
		this.suid = suid;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Integer getInitNum() {
		return initNum;
	}

	public void setInitNum(Integer initNum) {
		this.initNum = initNum;
	}

	public Integer getPostprice() {
		return postprice;
	}

	public void setPostprice(Integer postprice) {
		this.postprice = postprice;
	}

	public Integer getPreprice() {
		return preprice;
	}

	public void setPreprice(Integer preprice) {
		this.preprice = preprice;
	}
	
	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getTranTime() {
		return tranTime;
	}

	public void setTranTime(Timestamp tranTime) {
		this.tranTime = tranTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCheckTime() {
		return checkTime;
	}

	public void setCheckTime(Timestamp checkTime) {
		this.checkTime = checkTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getConfirmTime() {
		return confirmTime;
	}

	public void setConfirmTime(Timestamp confirmTime) {
		this.confirmTime = confirmTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getBalanceTime() {
		return balanceTime;
	}

	public void setBalanceTime(Timestamp balanceTime) {
		this.balanceTime = balanceTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(Timestamp finishTime) {
		this.finishTime = finishTime;
	}

	public UserBaseVO getTraner() {
		return traner;
	}

	public void setTraner(UserBaseVO traner) {
		this.traner = traner;
	}

	public UserBaseVO getChecker() {
		return checker;
	}

	public void setChecker(UserBaseVO checker) {
		this.checker = checker;
	}

	public UserBaseVO getConfirmer() {
		return confirmer;
	}

	public void setConfirmer(UserBaseVO confirmer) {
		this.confirmer = confirmer;
	}

	public UserBaseVO getBalancer() {
		return balancer;
	}

	public void setBalancer(UserBaseVO balancer) {
		this.balancer = balancer;
	}

	public UserBaseVO getFinish() {
		return finish;
	}

	public void setFinish(UserBaseVO finish) {
		this.finish = finish;
	}

	public Integer getRefnum() {
		return refnum;
	}

	public void setRefnum(Integer refnum) {
		this.refnum = refnum;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public String getAreaName() {
		return areaName;
	}

	public void setAreaName(String areaName) {
		this.areaName = areaName;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}
	
}
