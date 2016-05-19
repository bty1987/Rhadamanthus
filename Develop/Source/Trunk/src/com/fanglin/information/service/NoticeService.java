/**
 * Title: NoticeService
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: JH Corporation, China, Ltd.
 * @author Howard
 */

package com.fanglin.information.service;

import java.util.List;

import com.fanglin.core.vo.FilterVO;
import com.fanglin.information.vo.NoticeVO;
import com.fanglin.utils.Paging;


public interface NoticeService {
	
	public void pageNotice(Paging paging, List<FilterVO> filters, String userId);

	public NoticeVO queryNoticeById(Integer id);
	
	public List<NoticeVO> queryNoticeForValid(String type);
	
	public void pageNoticeForDeptAValid(Paging paging, NoticeVO noticeVO, String userId);

	public void saveOrUpdateNotice(NoticeVO noticeVO);

	public void deleteNoticeById(Integer id);

	public void deleteNotice(List<Integer> ids);

}
