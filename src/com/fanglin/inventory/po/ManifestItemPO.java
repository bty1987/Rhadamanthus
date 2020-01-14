package com.fanglin.inventory.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.data.po.ColorPO;
import com.fanglin.data.po.FormatPO;
import com.fanglin.data.po.GoodsPO;

@Entity
@Table(name = "manifestitem", catalog = "inventory")
public class ManifestItemPO implements java.io.Serializable {

	private static final long serialVersionUID = -2665091838341550211L;

	public static final String COLUMN_MID_STR = "mid";

	public static final String COLUMN_SIID_STR = "siid";

	private long miid;

	private long mid;

	private long siid;
	
	private long piid;
	
	private long aiid;
	
	private long qiid;

	private GoodsPO goods;

	private ColorPO color;

	private FormatPO format;

	private StorehousePO instorehouse;

	private StorehousePO outstorehouse;
	
	private short type;
	
	private int inprice;
	
	private int outprice;

	private int num;
	
	private int surplus;

	private String comment;

	public ManifestItemPO() {
		super();
	}

	public ManifestItemPO(GoodsPO goods) {
		super();
		this.goods = goods;
	}

	public ManifestItemPO(GoodsPO goods, ColorPO color, FormatPO format) {
		super();
		this.goods = goods;
		this.color = color;
		this.format = format;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "miid")
	public long getMiid() {
		return this.miid;
	}

	public void setMiid(long miid) {
		this.miid = miid;
	}

	@Column(name = "mid")
	public long getMid() {
		return mid;
	}

	public void setMid(long mid) {
		this.mid = mid;
	}

	@Column(name = "siid")
	public long getSiid() {
		return siid;
	}

	public void setSiid(long siid) {
		this.siid = siid;
	}

	public long getPiid() {
		return piid;
	}

	public void setPiid(long piid) {
		this.piid = piid;
	}

	public long getAiid() {
		return aiid;
	}

	public void setAiid(long aiid) {
		this.aiid = aiid;
	}

	public long getQiid() {
		return qiid;
	}

	public void setQiid(long qiid) {
		this.qiid = qiid;
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
	@JoinColumn(name = "ishid", referencedColumnName = "shid")
	public StorehousePO getInstorehouse() {
		return instorehouse;
	}

	public void setInstorehouse(StorehousePO instorehouse) {
		this.instorehouse = instorehouse;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "oshid", referencedColumnName = "shid")
	public StorehousePO getOutstorehouse() {
		return outstorehouse;
	}

	public void setOutstorehouse(StorehousePO outstorehouse) {
		this.outstorehouse = outstorehouse;
	}
	
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "inprice")
	public int getInprice() {
		return inprice;
	}

	public void setInprice(int inprice) {
		this.inprice = inprice;
	}

	@Column(name = "outprice")
	public int getOutprice() {
		return outprice;
	}

	public void setOutprice(int outprice) {
		this.outprice = outprice;
	}

	@Column(name = "num")
	public int getNum() {
		return num;
	}

	public void setNum(int num) {
		this.num = num;
	}
	
	@Column(name = "surplus")
	public int getSurplus() {
		return surplus;
	}

	public void setSurplus(int surplus) {
		this.surplus = surplus;
	}


	@Column(name = "comment")
	public String getComment() {
		return this.comment;
	}
	
	public void setComment(String comment) {
		this.comment = comment;
	}
	
	public ManifestItemPO init(long mid, Long siid, Long piid, Long aiid, Long qiid, long gid, long cid, long fid, short type, int inprice, int outprice, int num, StorehousePO inStorehousePO, StorehousePO outStorehousePO){
		
		setMid(mid);
		
		if(siid != null) setSiid(siid);
		if(piid != null) setPiid(piid);
		if(aiid != null) setAiid(aiid);
		if(qiid != null) setQiid(qiid);
		
		setGoods(new GoodsPO(gid));
		setColor(new ColorPO(cid));
		setFormat(new FormatPO(fid));
		
		setType(type);
		setInprice(inprice);
		setOutprice(outprice);
		setNum(num);
		setSurplus(num);
		
		setInstorehouse(inStorehousePO);
		setOutstorehouse(outStorehousePO);
		
		return this;
	}

}