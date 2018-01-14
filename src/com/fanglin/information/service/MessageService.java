package com.fanglin.information.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.vo.MessageVO;
import com.fanglin.utils.Paging;

public interface MessageService {

	public void pageMessage(Paging paging, List<Filter> filters, String userId,int company);

	public List<MessageVO> queryMessageForUnRead(String userId,int company);
	
	public int countMessage(String userId,int company);
	
	public void sendMessage(MessageVO messageVO,int company) throws FLException;
	
	public void sendMessage(String receiver,String sender,String contents,short type,int company) throws FLException;
	
	public void updateMessageForRead(List<Integer> messageIds);

}
