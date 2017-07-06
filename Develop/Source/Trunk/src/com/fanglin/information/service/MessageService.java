/**
 * Title: MessageService
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 */

package com.fanglin.information.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.vo.MessageVO;
import com.fanglin.utils.Paging;

public interface MessageService {
	//分页查询
	public void pageMessage(Paging paging, List<Filter> filters, String userId);

	public List<MessageVO> queryMessageForUnRead(String userId);
	//获得用户未读信息总数
	public int countMessage(String userId);
	//发送信息
	public void sendMessage(MessageVO messageVO) throws FLException;
	
	public void saveMessage(MessageVO messageVO);
	//修改未读的消息为已读
	public void updateMessageForRead(List<Integer> messageIds);
	//通过id删除用户信息
	public void deleteMessageById(MessageVO messageVO) throws FLException ;
	//删除多条信息
	public void deleteMessageByIds(List<Integer> ids);
	

}
