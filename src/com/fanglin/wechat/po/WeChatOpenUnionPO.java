/**
 * @File Name		: WXOpenUnionPO.java
 * @Package   	: com.fanglin.common.po
 * @Version		: 1.0
 * @Date			: 2017-6-1
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.wechat.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "wechatopenunion", catalog = "hades")
public class WeChatOpenUnionPO implements java.io.Serializable {

	private static final long serialVersionUID = -1509245053817804190L;

	public static final String COLUMN_UNIONID_STR = "unionId";

	public static final String COLUMN_OPENID_STR = "openId";

	public static final String COLUMN_TYPE_STR = "type";

	public static final String COLUMN_COMPANY_STR = "company";

	public static final short TYPE_PUBLIC_INT = 0;

	public static final short TYPE_APPLET_INT = 1;

	private long wouId;

	private String unionId;

	private String openId;

	private short type;

	private int company;

	public WeChatOpenUnionPO() {
		super();
	}

	public WeChatOpenUnionPO(String unionId, String openId, short type, int company) {
		super();
		this.unionId = unionId;
		this.openId = openId;
		this.type = type;
		this.company = company;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "wouId")
	public long getWouId() {
		return wouId;
	}

	public void setWouId(long wouId) {
		this.wouId = wouId;
	}

	@Column(name = "unionId")
	public String getUnionId() {
		return unionId;
	}

	public void setUnionId(String unionId) {
		this.unionId = unionId;
	}

	@Column(name = "openId")
	public String getOpenId() {
		return openId;
	}

	public void setOpenId(String openId) {
		this.openId = openId;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
