/**
 * Title: MessageDao
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: JH Corporation, China, Ltd.
 * @author Howard
 */

package com.fanglin.information.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.information.po.MessagePO;
import com.fanglin.utils.Paging;

public interface MessageDao extends Dao<MessagePO> {
	
	public List<MessagePO> pageMessages(Paging paging, List<FilterVO> filters, String userId);
	
	public List<MessagePO> queryMessageForUnreadByUserId(String userId);
	
	public int queryMessageCount(String userId);
	
	public int updateMessageForRead(List<Integer> messageIds);
	
	public void updateApproveMsgSerial(String msgSerial);
	
	public int deleteMessageByIdAStatusAUnType(List<Integer> messageIds, String status, List<String> unTypes);
	
}
