/**
 * @File Name		: UserService.java
 * @Package   	: com.fanglin.dingding.service
 * @Version		: 1.0
 * @Date			: 2015-11-10
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	:
 */

package com.fanglin.dingding.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.dingding.bean.User;

/**
 * 钉钉用户服务接口
 */
public interface UserService {

	/**
	 * 获取用户信息
	 * 
	 * @param code 临时授权码
	 * @param company 公司代码
	 * @return 用户信息
	 * @throws FLException 异常
	 */
	public User getUserInfo(String code, String company) throws FLException;

	/**
	 * 获取用户
	 * 
	 * @param userid 用户ID
	 * @param company 公司ID
	 * @return 用户信息
	 * @throws FLException 异常
	 */
	public User getUser(String userid, Integer company) throws FLException;

	/**
	 * 添加钉钉用户
	 * 
	 * @param usera 用户信息
	 * @param dids 部门ID列表
	 * @param company 公司ID
	 * @return 错误代码
	 * @throws FLException 异常
	 */
	public int addDingTalkUser(User usera, List<Long> dids, Integer company) throws FLException;

	/**
	 * 更新钉钉用户
	 * 
	 * @param usera 用户信息
	 * @param dids 部门ID列表
	 * @param company 公司ID
	 * @return 错误代码
	 * @throws FLException 异常
	 */
	public int updateDingTalkUser(User usera, List<Long> dids, Integer company) throws FLException;

	/**
	 * 删除钉钉用户
	 * 
	 * @param user 用户信息
	 * @param company 公司ID
	 * @return 错误代码
	 * @throws FLException 异常
	 */
	public int deleteDingTalkUser(User user, Integer company) throws FLException;

}
