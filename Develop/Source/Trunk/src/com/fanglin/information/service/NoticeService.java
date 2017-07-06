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
import com.fanglin.core.vo.Filter;
import com.fanglin.information.vo.NoticeVO;
import com.fanglin.utils.Paging;


public interface NoticeService {
	
	public void pageNotice(Paging paging, List<Filter> filters, String userId);

	public NoticeVO queryNoticeById(Integer id);
	
	public List<NoticeVO> queryNoticeForValid(String type);
	
	public void pageNoticeForDeptAValid(Paging paging, NoticeVO noticeVO, String userId);
	//添加和修改信息
	public void saveOrUpdateNotice(NoticeVO noticeVO);
	//删除
	public void deleteNoticeById(Integer id);
	//删除多条
	public void deleteNotice(List<Integer> ids);
	
	public void updateNoticeDepartment(List<Integer> dids,NoticeVO noticev) throws FLException;
	
}
