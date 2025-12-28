/**
 * @File Name		: WeChatAppService.java
 * @Package   	: com.fanglin.wechat.service
 * @Version		: 1.0
 * @Date			: 2017-5-14
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 微信小程序服务接口
 */

package com.fanglin.wechat.service;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.wechat.vo.WeChatGroupInfoVO;
import com.fanglin.wechat.vo.WeChatPhoneInfoVO;
import com.fanglin.wechat.vo.WeChatUserInfoVO;

/**
 * 微信小程序服务
 * 用于处理微信小程序相关功能（登录、解密用户信息、获取手机号等）
 */
public interface WeChatAppService {

	/**
	 * 创建小程序 Session
	 * @param code 微信登录 code
	 * @param company 公司标识
	 * @return 微信用户信息（包含 openId 和 unionId）
	 * @throws FLException 业务异常
	 */
	public WeChatUserInfoVO makeSession(String code, String company) throws FLException;

	/**
	 * 获取用户信息（需要重新获取 session_key）
	 * @param code 微信登录 code
	 * @param encryptedData 加密数据
	 * @param iv 加密向量
	 * @param company 公司标识
	 * @return 微信用户信息
	 * @throws FLException 业务异常
	 */
	public WeChatUserInfoVO queryUserInfo(String code, String encryptedData, String iv, String company) throws FLException;

	/**
	 * 获取用户信息（使用缓存的 session_key）
	 * @param code 微信登录 code（用于查找 session）
	 * @param encryptedData 加密数据
	 * @param iv 加密向量
	 * @return 微信用户信息
	 * @throws FLException 业务异常
	 */
	public WeChatUserInfoVO queryUserInfo(String code, String encryptedData, String iv) throws FLException;

	/**
	 * 获取群组信息
	 * @param code 微信登录 code（用于查找 session）
	 * @param encryptedData 加密数据
	 * @param iv 加密向量
	 * @return 群组信息
	 * @throws FLException 业务异常
	 */
	public WeChatGroupInfoVO queryGroupInfo(String code, String encryptedData, String iv) throws FLException;

	/**
	 * 获取手机号信息
	 * @param code 微信登录 code
	 * @param encryptedData 加密数据
	 * @param iv 加密向量
	 * @param company 公司标识
	 * @return 手机号信息
	 * @throws FLException 业务异常
	 */
	public WeChatPhoneInfoVO queryPhoneInfo(String code, String encryptedData, String iv, String company) throws FLException;

	/**
	 * 删除过期的 Session
	 * @return 处理结果码
	 */
	public int deleteSession();

}
