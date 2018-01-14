/**
 * @File Name		: SubjectBalanceUpinfoServiceImpl.java
 * @Package   	: com.fanglin.finance.service.impl
 * @Version		: 1.0
 * @Date			: 2016-4-18
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.finance.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.finance.dao.SubjectBalanceUpinfoDao;
import com.fanglin.finance.po.SubjectBalanceUpinfoPO;
import com.fanglin.finance.service.SubjectBalanceService;
import com.fanglin.finance.service.SubjectBalanceUpinfoService;

@Service("subjectBalanceUpinfoService")
@Transactional(readOnly=true)
public class SubjectBalanceUpinfoServiceImpl implements SubjectBalanceUpinfoService {
	
	@Autowired
	private SubjectBalanceUpinfoDao subjectBalanceUpinfoDao;
	
	@Autowired
	private SubjectBalanceService subjectBalanceService;

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int handleSubjectBalanceUpinfoForInit() throws FLException {
		
		List<SubjectBalanceUpinfoPO> subjectBalanceUpinfoPOs = subjectBalanceUpinfoDao.querySubjectBalanceUpinfoForInit();
		
		for(SubjectBalanceUpinfoPO subjectBalanceUpinfoPO: subjectBalanceUpinfoPOs){
			subjectBalanceService.alowSubjectBalanceForBalanceByCodeAPeriod(subjectBalanceUpinfoPO.getCode(), subjectBalanceUpinfoPO.getPeriod(), subjectBalanceUpinfoPO.getDebit(), subjectBalanceUpinfoPO.getCredit());
			
			subjectBalanceUpinfoPO.setStatus(SubjectBalanceUpinfoPO.STATUS_HANDLED_INT);
			
			subjectBalanceUpinfoDao.update(subjectBalanceUpinfoPO);
		}
		
		return 0;
	}

}
