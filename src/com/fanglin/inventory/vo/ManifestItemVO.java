package com.fanglin.inventory.vo;

import com.fanglin.data.material.vo.ColorVO;
import com.fanglin.data.material.vo.FormatVO;
import com.fanglin.data.material.vo.GoodsVO;

public class ManifestItemVO implements java.io.Serializable {

	private static final long serialVersionUID = 5004663304502267708L;

	private Long miid;

	private Long mid;
	
	private Long aiid;

	private Long siid;

	private GoodsVO goods;

	private ColorVO color;

	private FormatVO format;

	private StorehouseVO instorehouse;

	private StorehouseVO outstorehouse;
	
	private Integer inprice;
	
	private Integer outprice;

	private Integer num;
	
	private Integer surplus;

	private String comment;

	public Long getMiid() {
		return this.miid;
	}

	public void setMiid(Long miid) {
		this.miid = miid;
	}

	public ManifestItemVO() {
		super();
	}

	public ManifestItemVO(StorehouseVO instorehouse, StorehouseVO outstorehouse) {
		super();
		this.instorehouse = instorehouse;
		this.outstorehouse = outstorehouse;
	}

	public ManifestItemVO(GoodsVO goods, ColorVO color, FormatVO format, StorehouseVO instorehouse, StorehouseVO outstorehouse) {
		super();
		this.goods = goods;
		this.color = color;
		this.format = format;
		this.instorehouse = instorehouse;
		this.outstorehouse = outstorehouse;
	}

	public Long getMid() {
		return mid;
	}

	public void setMid(Long mid) {
		this.mid = mid;
	}

	public Long getAiid() {
		return aiid;
	}

	public void setAiid(Long aiid) {
		this.aiid = aiid;
	}

	public Long getSiid() {
		return siid;
	}

	public void setSiid(Long siid) {
		this.siid = siid;
	}

	public GoodsVO getGoods() {
		return goods;
	}

	public void setGoods(GoodsVO goods) {
		this.goods = goods;
	}

	public ColorVO getColor() {
		return color;
	}

	public void setColor(ColorVO color) {
		this.color = color;
	}

	public FormatVO getFormat() {
		return format;
	}

	public void setFormat(FormatVO format) {
		this.format = format;
	}

	public StorehouseVO getInstorehouse() {
		return instorehouse;
	}

	public void setInstorehouse(StorehouseVO instorehouse) {
		this.instorehouse = instorehouse;
	}

	public StorehouseVO getOutstorehouse() {
		return outstorehouse;
	}

	public void setOutstorehouse(StorehouseVO outstorehouse) {
		this.outstorehouse = outstorehouse;
	}

	
	
	public ManifestItemVO init(long gid, long cid, long fid, Long in, Long out, int inprice, int outprice, int num){
		
		setGoods(new GoodsVO(gid));
		setColor(new ColorVO(cid));
		setFormat(new FormatVO(fid));
		
		if(in != null) setInstorehouse(new StorehouseVO(in));
		if(out != null) setOutstorehouse(new StorehouseVO(out));
		
		setInprice(inprice);
		setOutprice(outprice);
		setNum(num);
		
		return this;
	}

	public Integer getInprice() {
		return inprice;
	}

	public void setInprice(Integer inprice) {
		this.inprice = inprice;
	}

	public Integer getOutprice() {
		return outprice;
	}

	public void setOutprice(Integer outprice) {
		this.outprice = outprice;
	}

	public Integer getNum() {
		return num;
	}

	public void setNum(Integer num) {
		this.num = num;
	}

	public Integer getSurplus() {
		return surplus;
	}

	public void setSurplus(Integer surplus) {
		this.surplus = surplus;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}