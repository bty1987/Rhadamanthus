/**
 * @File Name		: SubjectBalanceService.java
 * @Package   	: com.fanglin.finance.service
 * @Version		: 1.0
 * @Date			: 2016-4-17
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.finance.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.finance.vo.SubjectBalanceVO;
import com.fanglin.finance.vo.SubjectVO;
import com.fanglin.utils.Paging;

public interface SubjectBalanceService {

	public void pageSubjectBalance(Paging paging, List<Filter> filters);

	public List<SubjectBalanceVO> querySubjectBalance(List<Filter> filters);

	public int addSubjectBalanceForSubject(SubjectVO subjectVO);

	public int updateSubjectBalanceForBalance(SubjectBalanceVO subjectBalanceVO) throws FLException;

	public int alowSubjectBalanceForBalanceByCodeAPeriod(String code, String period, long debit, long credit);

	public int deleteSubjectBalanceBySId(long sId);

}
