/**
 * @File Name		: PeriodServiceImpl.java
 * @Package   	: com.fanglin.finance.service.impl
 * @Version		: 1.0
 * @Date			: 2016-4-18
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.finance.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.finance.dao.PeriodDao;
import com.fanglin.finance.po.PeriodPO;
import com.fanglin.finance.service.PeriodService;
import com.fanglin.finance.vo.PeriodVO;
import com.fanglin.utils.BeanUtil;

@Service("periodService")
@Transactional(readOnly=true)
public class PeriodServiceImpl implements PeriodService {
	
	@Autowired
	private PeriodDao periodDao;

	@Override
	public List<PeriodVO> queryPeriod() {
		
		List<PeriodPO> periodPOs = periodDao.queryPeriod();
		List<PeriodVO> periodVOs = new ArrayList<PeriodVO>();
		
		for(PeriodPO periodPO: periodPOs){
			PeriodVO periodVO = new PeriodVO();
			
			BeanUtil.copyProperties(periodPO, periodVO);
			
			periodVOs.add(periodVO);
		}
		
		return periodVOs;
	}

	@Override
	public PeriodVO queryPeriodForCurrent() {
		
		PeriodPO periodPO = periodDao.queryPeriodForCurrent();
		PeriodVO periodVO = new PeriodVO();
		
		BeanUtil.copyProperties(periodPO, periodVO);
		
		return periodVO;
	}

	@Override
	public List<PeriodVO> queryPeriodForOpen() {
		
		List<PeriodPO> periodPOs = periodDao.queryPeriodForOpen();
		List<PeriodVO> periodVOs = new ArrayList<PeriodVO>();
		
		for(PeriodPO periodPO: periodPOs){
			PeriodVO periodVO = new PeriodVO();
			
			BeanUtil.copyProperties(periodPO, periodVO);
			
			periodVOs.add(periodVO);
		}
		
		return periodVOs;
	}

}
