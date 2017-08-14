/**
 * Title: NoticeService
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 */

package com.fanglin.information.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Authentication;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.vo.NoticeVO;
import com.fanglin.utils.Paging;


public interface NoticeService {
	
	public void pageNotice(Paging paging, List<Filter> filters, Authentication authentication);

	public void pageNoticeForSeenByType(Paging paging, NoticeVO noticeVO, Authentication authentication) throws FLException;
	
	public NoticeVO queryNoticeByNid(NoticeVO noticeVO) throws FLException;
	
	public int addNotice(NoticeVO noticeVO, Authentication authentication) throws FLException;
	
	public int updateNotice(NoticeVO noticeVO) throws FLException;
	
	public int deleteNotice(NoticeVO noticeVO) throws FLException;
	
}
