package com.fanglin.data.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.data.material.vo.GoodsRecordVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "goodsRecord", catalog = "data")
public class GoodsRecordPO implements Serializable {

	private static final long serialVersionUID = -7441288984120218810L;

	public static final String COLUMN_GOODS_STR = "goods.gid";

	public static final String COLUMN_TYPE_STR = "type";

	public static final String COLUMN_OPERATOR_STR = "operator.userId";

	public static final String COLUMN_OPERATETIME_STR = "operateTime";

	public static final short TYPE_GOODS_SHORT = 0;

	public static final short TYPE_SOODS_SHORT = 1;

	public static final short TYPE_AOODS_SHORT = 2;

	private long grid;

	private GoodsPO goods;

	private long sid; // 选材&辅材ID

	private short type; // 0: 商品, 1: 选材 , 2: 辅材

	private UserPO operator; // 创建人

	private Timestamp operateTime;

	private String comment;

	private int goodsNum;

	private String path;

	public GoodsRecordPO() {
		super();
	}

	public GoodsRecordPO(long grid) {
		super();
		this.grid = grid;
	}

	public GoodsRecordPO(GoodsPO goods, UserPO operator) {
		super();
		this.goods = goods;
		this.operator = operator;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "grid")
	public long getGrid() {
		return grid;
	}

	public void setGrid(long grid) {
		this.grid = grid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "gid", referencedColumnName = "gid")
	public GoodsPO getGoods() {
		return goods;
	}

	public void setGoods(GoodsPO goods) {
		this.goods = goods;
	}

	@Column(name = "sid")
	public long getSid() {
		return sid;
	}

	public void setSid(long sid) {
		this.sid = sid;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "ouid", referencedColumnName = "uid")
	public UserPO getOperator() {
		return operator;
	}

	public void setOperator(UserPO operator) {
		this.operator = operator;
	}

	@Column(name = "operateTime")
	public Timestamp getOperateTime() {
		return operateTime;
	}

	public void setOperateTime(Timestamp operateTime) {
		this.operateTime = operateTime;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@Column(name = "goodsNum")
	public int getGoodsNum() {
		return goodsNum;
	}

	public void setGoodsNum(int goodsNum) {
		this.goodsNum = goodsNum;
	}

	@Column(name = "path")
	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public GoodsRecordVO ptv(GoodsRecordVO goodsRecordVO) {

		BeanUtil.copyProperties(this, goodsRecordVO, Arrays.asList("goods", "operator"));

		if (goodsRecordVO.getGoods() != null && getGoods() != null) getGoods().ptv(goodsRecordVO.getGoods());
		if (goodsRecordVO.getOperator() != null && getOperator() != null) goodsRecordVO.getOperator().ptv(getOperator());

		return goodsRecordVO;
	}

}
