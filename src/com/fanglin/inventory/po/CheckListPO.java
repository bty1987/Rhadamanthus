package com.fanglin.inventory.po;

import java.sql.Timestamp;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "checklist", catalog = "inventory")
public class CheckListPO implements java.io.Serializable {

	private static final long serialVersionUID = 8769612625675005252L;
	
	public static final String COLUMN_GOODS_NAME_STR = "goods.name";
	
	public static final String COLUMN_COLOR_NAME_STR = "color.name";
	
	public static final String COLUMN_FORMAT_NAME_STR = "format.name";
	
	public static final String COLUMN_STOREHOUSE_NAME_STR = "storehouse.name";
	
	public static final String COLUMN_NAME_STR = "name";
	
	public static final String COLUMN_BRAND_STR = "goods.brand";
	
	public static final String COLUMN_STOREHOUSE_SHID_STR = "storehouse.shid";
	
	private long clid;
	
	private GoodsPO goods;
	
	private ColorPO color;
	
	private FormatPO format;
	
	private StorehousePO storehouse;
	
	private short type;
	
	private float num;
	
	private Timestamp createTime;
	
	private UserPO creater;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "clid")
	public long getClid() {
		return clid;
	}

	public void setClid(long clid) {
		this.clid = clid;
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
	@JoinColumn(name = "cid", referencedColumnName = "cid")
	public ColorPO getColor() {
		return color;
	}

	public void setColor(ColorPO color) {
		this.color = color;
	}
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "fid", referencedColumnName = "fid")
	public FormatPO getFormat() {
		return format;
	}

	public void setFormat(FormatPO format) {
		this.format = format;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "shid", referencedColumnName = "shid")
	public StorehousePO getStorehouse() {
		return storehouse;
	}

	public void setStorehouse(StorehousePO storehouse) {
		this.storehouse = storehouse;
	}

	@Column(name = "type")
	public short getType() {
		return this.type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "num")
	public float getNum() {
		return this.num;
	}

	public void setNum(float num) {
		this.num = num;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return this.createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "uid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

}