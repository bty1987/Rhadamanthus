/**
 * @File Name		: NoticeDepartmentService.java
 * @Package   	: com.fanglin.information.service
 * @Version		: 1.0
 * @Date			: 2017-7-15
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.information.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.information.vo.NoticeDepartmentVO;
import com.fanglin.information.vo.NoticeVO;

public interface NoticeDepartmentService {
	
	public List<NoticeDepartmentVO> queryNoticeDepartment(NoticeVO noticeVO) throws FLException;
	
	public int updateNoticeDepartment(List<Integer> dids, NoticeVO noticeVO) throws FLException;

}
