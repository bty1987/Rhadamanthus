/**
 * @File Name		: WeChatGroupInfoVO.java
 * @Package   	: com.fanglin.wechat.vo
 * @Version		: 1.0
 * @Date			: 2017-5-14
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 微信群组信息值对象
 */

package com.fanglin.wechat.vo;

import java.io.Serializable;

/**
 * 微信群组信息值对象
 * 用于传输微信小程序群组信息
 */
public class WeChatGroupInfoVO implements Serializable {

	private static final long serialVersionUID = 1L;

	/**
	 * 群 OpenID
	 */
	private String openGId;

	/**
	 * 群名称
	 */
	private String groupName;

	public String getOpenGId() {
		return openGId;
	}

	public void setOpenGId(String openGId) {
		this.openGId = openGId;
	}

	public String getGroupName() {
		return groupName;
	}

	public void setGroupName(String groupName) {
		this.groupName = groupName;
	}

}
