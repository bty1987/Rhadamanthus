package com.fanglin.information.service;

import com.fanglin.information.vo.NoticeVO;
import com.fanglin.utils.Paging;


public interface NoticeDepartmentService {
	public void queryNoticeDepartmentByNoticeIdandDepartment(Paging paging, NoticeVO noticeVO, String userId);
	
}
