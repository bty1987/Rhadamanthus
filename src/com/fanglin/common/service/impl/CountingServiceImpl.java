/**
 * @File Name		: CountingServiceImpl.java
 * @Package   	: com.fanglin.service.impl
 * @Version		: 1.0
 * @Date			: 2015-1-26
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.common.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.dao.CountingDao;
import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.utils.SystemConfig;

@Service("countingService")
@Transactional(readOnly = true)
public class CountingServiceImpl implements CountingService {
	
	@Autowired
	private CountingDao countingDao;

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int queryCountingByTypeDate(int type, String date, int company){
		
		CountingPO countingPO = countingDao.queryCountingByTypeDate(type, date, SystemConfig.getInt("multicompany" , 0) != 0 ? company : 0);
		
		int nextCount = 1;
		
		if(countingPO != null){
			
			nextCount = countingPO.getCount() + 1;
			countingPO.setCount(nextCount);
			
			countingDao.update(countingPO);
		}else{
			countingPO = new CountingPO();
			countingPO.setCount(nextCount);
			countingPO.setDate(date);
			countingPO.setType(type);
			countingPO.setCompany(company);
			
			countingDao.save(countingPO);
		}
		
		countingDao.flush();
		
		return nextCount;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateCountingByTypeDate(int type, String date, int company, int count){
		
		CountingPO countingPO = countingDao.queryCountingByTypeDate(type, date, SystemConfig.getInt("multicompany" , 0) != 0 ? company : 0);
		
		if(countingPO != null){
			countingPO.setCount(count);
			
			countingDao.update(countingPO);
		}else{
			countingPO = new CountingPO();
			countingPO.setCount(count);
			countingPO.setDate(date);
			countingPO.setType(type);
			
			countingDao.save(countingPO);
		}
	}

}
