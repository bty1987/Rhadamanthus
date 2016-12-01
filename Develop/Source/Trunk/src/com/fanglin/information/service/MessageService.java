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

	public void pageMessage(Paging paging, List<Filter> filters, String userId);

	public List<MessageVO> queryMessageForUnRead(String userId);
	
	public int countMessage(String userId);

	public void sendMessage(MessageVO messageVO) throws FLException;
	
	public void saveMessage(MessageVO messageVO);
	
	public void updateMessageForRead(List<Integer> messageIds);
	
	public void deleteMessageById(MessageVO messageVO) throws FLException ;

	public void deleteMessageByIds(List<Integer> ids);

}
