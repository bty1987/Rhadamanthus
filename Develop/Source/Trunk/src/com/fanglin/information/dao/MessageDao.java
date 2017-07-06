/**
 * Title: MessageDao
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 */

package com.fanglin.information.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.po.MessagePO;
import com.fanglin.utils.Paging;

public interface MessageDao extends Dao<MessagePO> {
	//分页查询
	public List<MessagePO> pageMessages(Paging paging, List<Filter> filters, String userId);
	
	public List<MessagePO> queryMessageForUnreadByUserId(String userId);
	//获取用户信息总数
	public int queryMessageCount(String userId);
	//修改为未读的消息为已读
	public int updateMessageForRead(List<Integer> messageIds);
	//修改
	public void updateApproveMsgSerial(String msgSerial);
	//删除多条方法
	public int deleteMessageByIdAStatusAUnType(List<Integer> messageIds, String status, List<String> unTypes);
	
}
