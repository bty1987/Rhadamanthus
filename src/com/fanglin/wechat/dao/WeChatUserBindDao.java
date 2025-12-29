/**
 * @File Name		: WeChatUserBindDao.java
 * @Package   	: com.fanglin.wechat.dao
 * @Version		: 1.0
 * @Date			: 2018-5-1
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 微信用户绑定 DAO 接口
 */

package com.fanglin.wechat.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.wechat.po.WeChatUserBindPO;

/**
 * 微信用户绑定 DAO 接口
 */
public interface WeChatUserBindDao extends Dao<WeChatUserBindPO> {

	/**
	 * 根据 unionId 查询用户绑定
	 * 
	 * @param unionId 微信用户唯一标识
	 * @return 用户绑定持久化对象
	 */
	public WeChatUserBindPO queryWeChatUserBind(String unionId);

	/**
	 * 根据 userId 删除用户绑定
	 * 
	 * @param userId 系统用户ID
	 */
	public void deleteWeChatUserBind(String userId);

}
