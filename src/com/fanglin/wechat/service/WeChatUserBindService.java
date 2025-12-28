/**
 * @File Name		: WeChatUserBindService.java
 * @Package   	: com.fanglin.wechat.service
 * @Version		: 1.0
 * @Date			: 2018-5-1
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 微信用户绑定服务接口
 */

package com.fanglin.wechat.service;

import com.fanglin.wechat.vo.WeChatUserBindVO;

/**
 * 微信用户绑定服务
 * 用于管理微信用户与系统用户的绑定关系
 */
public interface WeChatUserBindService {

	/**
	 * 查询微信用户绑定的系统用户
	 * @param userBindVO 微信用户绑定对象（需包含 unionId）
	 * @return 包含 userId 的绑定对象
	 */
	public WeChatUserBindVO queryUserBind(WeChatUserBindVO userBindVO);

	/**
	 * 添加或更新微信用户绑定
	 * @param userBindVO 绑定对象（需包含 unionId 和 userId）
	 * @return 处理结果码
	 */
	public int addUserBind(WeChatUserBindVO userBindVO);

	/**
	 * 删除微信用户绑定
	 * @param userBindVO 绑定对象（需包含 unionId）
	 * @return 处理结果码
	 */
	public int deleteUserBind(WeChatUserBindVO userBindVO);

}
