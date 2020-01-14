package com.fanglin.quotation.vo;

import java.io.Serializable;

import com.fanglin.data.material.vo.GoodsVO;
import com.fanglin.decoration.vo.DecorationVO;


public class SelectionItemVO2 implements Serializable {

	private static final long serialVersionUID = 1819457635219731341L;

	private Long siid;// 选材项ID
	
	private SelectionVO selection;// 选材单ID
	
	private Long quoteId;// 引用项ID
	
	private Short type;// 类型 , 0: 报价项 , 1: 拓展增项 , 2: 拓展减项 , 3: 增项 , 4: 减项 
	
	private GoodsVO goods;// 商品 
	
	private Integer num;// 数量
	
	private DecorationVO decoration;// 装修单号
	
	private Long areaId;// 功能区id
	
	private Long suid;// 厂商id

	private Short status;// 状态 , 0: 初始 , 1: 配送 , 2: 审核 , 3: 确认 , 4: 结算
	
	private Integer initNum;// 工程量
	
	private Integer selling;// 售价

	public SelectionItemVO2() {
		super();
	}

	public SelectionItemVO2(SelectionVO selection, GoodsVO goods, DecorationVO decoration) {
		super();
		this.selection = selection;
		this.goods = goods;
		this.decoration = decoration;
	}

	public Long getSiid() {
		return siid;
	}

	public void setSiid(Long siid) {
		this.siid = siid;
	}

	public SelectionVO getSelection() {
		return selection;
	}

	public void setSelection(SelectionVO selection) {
		this.selection = selection;
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

	public Integer getSelling() {
		return selling;
	}

	public void setSelling(Integer selling) {
		this.selling = selling;
	}

}
