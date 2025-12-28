/**
 * @File Name		: WeChatUserBindVO.java
 * @Package   	: com.fanglin.wechat.vo
 * @Version		: 1.0
 * @Date			: 2018-5-1
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 微信用户绑定值对象
 */

package com.fanglin.wechat.vo;

import java.io.Serializable;

/**
 * 微信用户绑定值对象
 * 用于传输微信用户与系统用户的绑定关系
 */
public class WeChatUserBindVO implements Serializable {

	private static final long serialVersionUID = 1L;

	/**
	 * 绑定ID（主键）
	 */
	private Long bindId;

	/**
	 * 微信用户唯一标识（UnionID）
	 */
	private String unionId;

	/**
	 * 系统用户ID
	 */
	private Long userId;

	/**
	 * 绑定时间
	 */
	private Long bindTime;

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
