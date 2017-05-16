/**
 * @File Name		: SubjectBalanceDao.java
 * @Package   	: com.fanglin.finance.dao
 * @Version		: 1.0
 * @Date			: 2016-4-17
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.finance.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.finance.po.SubjectBalancePO;
import com.fanglin.utils.Paging;

public interface SubjectBalanceDao extends Dao<SubjectBalancePO> {
	
	public List<SubjectBalancePO> pageSubjectBalance(Paging paging, List<Filter> filters);
	
	public List<SubjectBalancePO> querySubjectBalance(List<Filter> filters);
	
	public List<SubjectBalancePO> querySubjectBalanceForInit();
	
	public List<SubjectBalancePO> querySubjectBalanceBySubjectCode(String code);
	
	public List<SubjectBalancePO> querySubjectBalanceBySubjectCodeGePeriod(String code, String period);
	
	public int expireSubjectBalance();
	
	public int deleteSubjectBalanceBySId(long sid);

}
