package com.fanglin.information.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.po.MessagePO;
import com.fanglin.utils.Paging;

public interface MessageDao extends Dao<MessagePO> {

	public List<MessagePO> pageMessages(Paging paging, List<Filter> filters, String userId, int company);

	public List<MessagePO> queryMessageForUnreadByUserId(String userId, int company);

	public int queryMessageCount(int uid, int company);

	public int updateMessageForRead(List<Integer> mids);

	public void updateApproveMsgSerial(String msgSerial);

	public int deleteMessageByIdAStatusAUnType(List<Integer> messageIds, short status, List<String> unTypes);

}
