package com.fanglin.approval.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.inventory.po.ColorPO;
import com.fanglin.inventory.po.FormatPO;
import com.fanglin.inventory.po.GoodsPO;
import com.fanglin.inventory.po.StorehousePO;

@Entity
@Table(name = "approvalmanifestdbitem", catalog = "approval")
public class ApprovalManifestDBItemPO implements java.io.Serializable {

	private static final long serialVersionUID = -2816996256600150880L;

	public static final String COLUMN_AMDBID_STR = "amdbid";

	private long amdbiid;

	private long amdbid;

	private GoodsPO goods;

	private ColorPO color;

	private FormatPO format;

	private StorehousePO instorehouse;

	private StorehousePO outstorehouse;

	private float num;

	private String comment;

	public ApprovalManifestDBItemPO() {
		super();
	}

	public ApprovalManifestDBItemPO(GoodsPO goods, ColorPO color, FormatPO format, StorehousePO instorehouse, StorehousePO outstorehouse) {
		super();
		this.goods = goods;
		this.color = color;
		this.format = format;
		this.instorehouse = instorehouse;
		this.outstorehouse = outstorehouse;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "amdbiid")
	public long getAmdbiid() {
		return amdbiid;
	}

	public void setAmdbiid(long amdbiid) {
		this.amdbiid = amdbiid;
	}

	@Column(name = "amdbid")
	public long getAmdbid() {
		return amdbid;
	}

	public void setAmdbid(long amdbid) {
		this.amdbid = amdbid;
	}

	@ManyToOne
	@JoinColumn(name = "gid", referencedColumnName = "gid")
	public GoodsPO getGoods() {
		return goods;
	}

	public void setGoods(GoodsPO goods) {
		this.goods = goods;
	}

	@ManyToOne
	@JoinColumn(name = "cid", referencedColumnName = "cid")
	public ColorPO getColor() {
		return color;
	}

	public void setColor(ColorPO color) {
		this.color = color;
	}

	@ManyToOne
	@JoinColumn(name = "fid", referencedColumnName = "fid")
	public FormatPO getFormat() {
		return format;
	}

	public void setFormat(FormatPO format) {
		this.format = format;
	}

	@ManyToOne
	@JoinColumn(name = "ishid", referencedColumnName = "shid")
	public StorehousePO getInstorehouse() {
		return instorehouse;
	}

	public void setInstorehouse(StorehousePO instorehouse) {
		this.instorehouse = instorehouse;
	}

	@ManyToOne
	@JoinColumn(name = "oshid", referencedColumnName = "shid")
	public StorehousePO getOutstorehouse() {
		return outstorehouse;
	}

	public void setOutstorehouse(StorehousePO outstorehouse) {
		this.outstorehouse = outstorehouse;
	}

	@Column(name = "num")
	public float getNum() {
		return num;
	}

	public void setNum(float num) {
		this.num = num;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
