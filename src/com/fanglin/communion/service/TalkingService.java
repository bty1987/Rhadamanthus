package com.fanglin.communion.service;

import java.util.List;

import com.fanglin.communion.vo.TalkingVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface TalkingService {

	public void pageTalking(Paging paging, List<Filter> filters, int company) ;
	
	public List<TalkingVO> queryTalking(List<Short> types, int company);
	
	public int addTalking(TalkingVO talkingVO, int company) throws FLException;
	
	public int updateTalking(TalkingVO talkingVO) throws FLException;
	
	public int updateTalkingForStatus(TalkingVO talkingVO) throws FLException;
	
	public int deleteTalking(TalkingVO talkingVO) throws FLException;
}
