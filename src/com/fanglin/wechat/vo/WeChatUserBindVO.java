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

public class WeChatUserBindVO implements Serializable {

	private static final long serialVersionUID = 2210671005271377190L;

	private Long puid;

	private String unionId;

	private String userId;

	private Short status;

	public Long getPuid() {
		return puid;
	}

	public void setPuid(Long puid) {
		this.puid = puid;
	}

	public String getUnionId() {
		return unionId;
	}

	public void setUnionId(String unionId) {
		this.unionId = unionId;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

}
