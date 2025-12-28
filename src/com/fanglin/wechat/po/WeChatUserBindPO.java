/**
 * @File Name		: WeChatUserBindPO.java
 * @Package   	: com.fanglin.wechat.po
 * @Version		: 1.0
 * @Date			: 2018-5-1
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 微信用户绑定持久化对象
 */

package com.fanglin.wechat.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 微信用户绑定持久化对象 存储微信用户与系统用户的绑定关系
 */
@Entity
@Table(name = "wechatuserbind", catalog = "wechat")
public class WeChatUserBindPO implements Serializable {

	private static final long serialVersionUID = 1L;

	public static final String COLUMN_BINDID_STR = "bindId";

	public static final String COLUMN_UNIONID_STR = "unionId";

	public static final String COLUMN_USERID_STR = "userId";

	/**
	 * 主键ID
	 */
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "bindId")
	private Long bindId;

	/**
	 * 微信用户唯一标识（UnionID）
	 */
	@Column(name = "unionId", length = 100)
	private String unionId;

	/**
	 * 系统用户ID
	 */
	@Column(name = "userId")
	private Long userId;

	/**
	 * 绑定时间
	 */
	@Column(name = "bindTime")
	private Long bindTime;

	/**
	 * 默认构造函数
	 */
	public WeChatUserBindPO() {
	}

	/**
	 * 构造函数
	 * 
	 * @param unionId 微信用户唯一标识
	 * @param userId 系统用户ID
	 */
	public WeChatUserBindPO(String unionId, Long userId) {
		this.unionId = unionId;
		this.userId = userId;
		this.bindTime = System.currentTimeMillis();
	}

	/**
	 * 构造函数
	 * 
	 * @param unionId 微信用户唯一标识
	 * @param userId 系统用户ID
	 * @param bindTime 绑定时间
	 */
	public WeChatUserBindPO(String unionId, Long userId, Long bindTime) {
		this.unionId = unionId;
		this.userId = userId;
		this.bindTime = bindTime;
	}

	public Long getBindId() {
		return bindId;
	}

	public void setBindId(Long bindId) {
		this.bindId = bindId;
	}

	public String getUnionId() {
		return unionId;
	}

	public void setUnionId(String unionId) {
		this.unionId = unionId;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public Long getBindTime() {
		return bindTime;
	}

	public void setBindTime(Long bindTime) {
		this.bindTime = bindTime;
	}

}
