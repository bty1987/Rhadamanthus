package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class CircleVO implements Serializable{

	private static final long serialVersionUID = 1025890988179442605L;
	
	private Long cid;
	
	private String orderId;
	
	private String address;
	
	private UserBaseVO creater;
	
	private String content;
	
	private Timestamp createTime;
	
	private Integer praise;
	
	private List<CircleDrawingVO> drawings;
	
	public CircleVO() {
		super();
	}

	public CircleVO(UserBaseVO creater) {
		super();
		this.creater = creater;
	}

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public Integer getPraise() {
		return praise;
	}

	public void setPraise(Integer praise) {
		this.praise = praise;
	}

	public List<CircleDrawingVO> getDrawings() {
		return drawings;
	}

	public void setDrawings(List<CircleDrawingVO> drawings) {
		this.drawings = drawings;
	}
	
}
