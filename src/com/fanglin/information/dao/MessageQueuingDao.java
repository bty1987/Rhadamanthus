package com.fanglin.information.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.information.po.MessageQueuingPO;

/**
 * Title: MessageQueuingDao
 * Description: 消息队列DAO接口
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */
public interface MessageQueuingDao extends Dao<MessageQueuingPO> {

	/**
	 * 查询未处理的消息队列
	 * @return 未处理的消息队列列表
	 */
	public List<MessageQueuingPO> queryPendingMessageQueuing();

	/**
	 * 更新消息队列状态为已处理
	 * @param mqid 消息队列ID
	 * @return 影响行数
	 */
	public int updateMessageQueuingStatusProcessed(long mqid);

	/**
	 * 根据操作类型查询未处理的消息队列
	 * @param operation 操作类型
	 * @return 未处理的消息队列列表
	 */
	public List<MessageQueuingPO> queryPendingMessageQueuingByOperation(String operation);

}
