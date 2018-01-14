/**
 * @File Name		: PeriodDao.java
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
import com.fanglin.core.interceptor.FLException;
import com.fanglin.finance.po.PeriodPO;

public interface PeriodDao extends Dao<PeriodPO> {
	
	public List<PeriodPO> queryPeriod();
	
	public List<PeriodPO> queryPeriodForOpen();
	
	public PeriodPO queryPeriodForCurrent();
	
	public PeriodPO queryPeriodByPeriod(String period) throws FLException;

}
