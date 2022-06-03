package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.vo.ConversationVO;
import com.fanglin.utils.Paging;

public interface ConversationService {

	public void pageConversation(Paging paging, List<Filter> filters);

	public void requestConversation(ConversationVO conversation, String userId) throws FLException;

	public void responseConversation(ConversationVO conversation, String userId) throws FLException;

	public int deleteConversation(ConversationVO conversation);
}
