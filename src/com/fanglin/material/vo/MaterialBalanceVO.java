package com.fanglin.material.vo;

import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class MaterialBalanceVO implements java.io.Serializable {

	private static final long serialVersionUID = -7832029854932592374L;
	
	private Long mbid;
	
	private MaterialVO material;
	
	private UserBaseVO creater;
	
	private UserBaseVO instorer;
	
	private UserBaseVO poster;
	
	private Timestamp balanceTime;
	
	private Timestamp postTime;
	
	private Float balance;
	
	private Float difference;
	
	private Float vbalance;
	
	private Float post;
	
	private Timestamp vbalanceTime;
	
	private Float total;
	
	private Short status;
	
	private Short type;
	
	private Integer ident;
	
	private Long mpId;
	
	public MaterialBalanceVO() {
		super();
	}

	public MaterialBalanceVO(MaterialVO material, UserBaseVO creater, UserBaseVO instorer, UserBaseVO poster) {
		super();
		this.material = material;
		this.creater = creater;
		this.instorer = instorer;
		this.poster = poster;
	}

	public Long getMbid() {
		return mbid;
	}

	public void setMbid(Long mbid) {
		this.mbid = mbid;
	}

	public MaterialVO getMaterial() {
		return material;
	}

	public void setMaterial(MaterialVO material) {
		this.material = material;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	public UserBaseVO getInstorer() {
		return instorer;
	}

	public void setInstorer(UserBaseVO instorer) {
		this.instorer = instorer;
	}

	public UserBaseVO getPoster() {
		return poster;
	}

	public void setPoster(UserBaseVO poster) {
		this.poster = poster;
	}

	@JSON(format="yyyy-MM-dd HH:mm:ss")
	public Timestamp getBalanceTime() {
		return balanceTime;
	}

	public void setBalanceTime(Timestamp balanceTime) {
		this.balanceTime = balanceTime;
	}

	@JSON(format="yyyy-MM-dd HH:mm:ss")
	public Timestamp getPostTime() {
		return postTime;
	}

	public void setPostTime(Timestamp postTime) {
		this.postTime = postTime;
	}

	public Float getBalance() {
		return balance;
	}

	public void setBalance(Float balance) {
		this.balance = balance;
	}

	public Float getDifference() {
		return difference;
	}

	public void setDifference(Float difference) {
		this.difference = difference;
	}

	public Float getVbalance() {
		return vbalance;
	}

	public void setVbalance(Float vbalance) {
		this.vbalance = vbalance;
	}

	public Float getPost() {
		return post;
	}

	public void setPost(Float post) {
		this.post = post;
	}

	@JSON(format="yyyy-MM-dd HH:mm:ss")
	public Timestamp getVbalanceTime() {
		return vbalanceTime;
	}

	public void setVbalanceTime(Timestamp vbalanceTime) {
		this.vbalanceTime = vbalanceTime;
	}

	public Float getTotal() {
		return total;
	}

	public void setTotal(Float total) {
		this.total = total;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Integer getIdent() {
		return ident;
	}

	public void setIdent(Integer ident) {
		this.ident = ident;
	}

	public Long getMpId() {
		return mpId;
	}

	public void setMpId(Long mpId) {
		this.mpId = mpId;
	}
	
}