/**
 * @File Name		: SubjectService.java
 * @Package   	: com.fanglin.finance.service
 * @Version		: 1.0
 * @Date			: 2015-12-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.finance.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.finance.vo.SubjectVO;
import com.fanglin.utils.Paging;

public interface SubjectService {
	
	public void pageSubject(Paging paging, List<Filter> filters);
	
	public List<SubjectVO> querySubject();
	
	public List<SubjectVO> querySubjectByNameOCode(SubjectVO subjectVO);
	
	public SubjectVO querySubjectByCode(SubjectVO subjectVO) throws FLException ;
	
	public int addSubject(SubjectVO subjectVO) throws FLException;
	
	public int updateSubject(SubjectVO subjectVO) throws FLException;
	
	public int updateSubjectForStatus(SubjectVO subjectVO) throws FLException;
	
	public int deleteSubject(SubjectVO subjectVO) throws FLException;

}
