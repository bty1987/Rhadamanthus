package com.fanglin.data.material.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserVO;

public class GoodsRecordVO implements Serializable {

	private static final long serialVersionUID = 2823514285059139865L;

	private Long grid;

	private GoodsVO goods;

	private Long sid;

	private SoodsVO soods;

	private AoodsVO aoods;

	private Short type; // 0: 商品, 1: 选材 , 2: 辅材

	private UserVO operator; // 创建人

	private Timestamp operateTime;

	private String comment;

	private Integer goodsNum;

	private String path;

	public GoodsRecordVO() {
		super();
	}

	public GoodsRecordVO(Long grid) {
		super();
		this.grid = grid;
	}

	public GoodsRecordVO(GoodsVO goods, UserVO operator) {
		super();
		this.goods = goods;
		this.operator = operator;
	}

	public Long getGrid() {
		return grid;
	}

	public void setGrid(Long grid) {
		this.grid = grid;
	}

	public GoodsVO getGoods() {
		return goods;
	}

	public void setGoods(GoodsVO goods) {
		this.goods = goods;
	}

	public Long getSid() {
		return sid;
	}

	public void setSid(Long sid) {
		this.sid = sid;
	}

	public SoodsVO getSoods() {
		return soods;
	}

	public void setSoods(SoodsVO soods) {
		this.soods = soods;
	}

	public AoodsVO getAoods() {
		return aoods;
	}

	public void setAoods(AoodsVO aoods) {
		this.aoods = aoods;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public UserVO getOperator() {
		return operator;
	}

	public void setOperator(UserVO operator) {
		this.operator = operator;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getOperateTime() {
		return operateTime;
	}

	public void setOperateTime(Timestamp operateTime) {
		this.operateTime = operateTime;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public Integer getGoodsNum() {
		return goodsNum;
	}

	public void setGoodsNum(Integer goodsNum) {
		this.goodsNum = goodsNum;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

}