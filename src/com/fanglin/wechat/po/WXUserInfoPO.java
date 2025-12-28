package com.fanglin.common.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "wxuserinfo", catalog = "hades")
public class WXUserInfoPO implements java.io.Serializable {

	private static final long serialVersionUID = -5843127834142096154L;
	
	public static final String COLUMN_UNIONID_STR = "unionid";
	
	private Long wxuiid;
	
	private String unionid;
	
	private String nickname;
	
	private Short sex;
	
	private String city;
	
	private String province;
	
	private String country;
	
	private long createTime;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "wxuiid")
	public Long getWxuiid() {
		return this.wxuiid;
	}

	public void setWxuiid(Long wxuiid) {
		this.wxuiid = wxuiid;
	}

	@Column(name = "unionid")
	public String getUnionid() {
		return unionid;
	}

	public void setUnionid(String unionid) {
		this.unionid = unionid;
	}

	@Column(name = "nickname")
	public String getNickname() {
		return this.nickname;
	}

	public void setNickname(String nickname) {
		this.nickname = nickname;
	}

	@Column(name = "sex")
	public Short getSex() {
		return this.sex;
	}

	public void setSex(Short sex) {
		this.sex = sex;
	}

	@Column(name = "city")
	public String getCity() {
		return this.city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	@Column(name = "province")
	public String getProvince() {
		return this.province;
	}

	public void setProvince(String province) {
		this.province = province;
	}

	@Column(name = "country")
	public String getCountry() {
		return this.country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	@Column(name = "createTime")
	public long getCreateTime() {
		return createTime;
	}

	public void setCreateTime(long createTime) {
		this.createTime = createTime;
	}

}