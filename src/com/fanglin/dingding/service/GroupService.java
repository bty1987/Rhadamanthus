/**
 * @File Name		: GroupService.java
 * @Package   	: com.fanglin.dingding.service
 * @Version		: 1.0
 * @Date			: 2022-5-12
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	:
 */

package com.fanglin.dingding.service;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.dingding.bean.Group;

/**
 * 钉钉群服务接口
 */
public interface GroupService {

	/**
	 * 查询群信息
	 * @param group 群信息
	 * @param company 公司ID
	 * @return 群信息
	 * @throws FLException 异常
	 */
	public Group query(Group group, int company) throws FLException;

	/**
	 * 创建群
	 * @param group 群信息
	 * @param company 公司ID
	 * @return 错误代码
	 * @throws FLException 异常
	 */
	public int create(Group group, int company) throws FLException;

	/**
	 * 更新群
	 * @param group 群信息
	 * @param company 公司ID
	 * @return 错误代码
	 * @throws FLException 异常
	 */
	public int update(Group group, int company) throws FLException;

	/**
	 * 设置群模板
	 * @param group 群信息
	 * @param company 公司ID
	 * @return 错误代码
	 * @throws FLException 异常
	 */
	public int template(Group group, int company) throws FLException;

	/**
	 * 发送群消息
	 * @param group 群信息
	 * @param message 消息内容
	 * @param company 公司ID
	 * @return 错误代码
	 * @throws FLException 异常
	 */
	public int send(Group group, JSONObject message, int company) throws FLException;

}
