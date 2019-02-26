package com.fanglin.personel.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.PerformanceDao;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.PerformancePO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.service.PerformanceService;
import com.fanglin.personel.vo.PerformanceVO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("performanceService")
@Transactional(readOnly=true)
public class PerformanceServiceImpl implements PerformanceService{
	
	@Autowired
	PerformanceDao performanceDao;
	
	@Autowired
	UserDao userDao;

	@Override
	public void pagePerformance(Paging paging, List<Filter> filters) {
		
		List<PerformancePO> PerformancePOs = performanceDao.pagePerformance(paging, filters);
		List<PerformanceVO> PerformanceVOs = new ArrayList<PerformanceVO>();
		
		for (PerformancePO performancePO : PerformancePOs) {
			
			PerformanceVO performanceVO = new PerformanceVO(new UserBaseVO());
			
			BeanUtil.copyProperties(performancePO, performanceVO, Arrays.asList("user"));
		    
			BeanUtil.copyProperties(performancePO.getUser(), performanceVO.getUser(), Arrays.asList("role", "dept", "duty"));
			
			PerformanceVOs.add(performanceVO);
		}
		
		paging.setData(PerformanceVOs);
		
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addPreformance(PerformanceVO performance)throws FLException {
		
		UserPO userPO = userDao.queryUserByUserId(performance.getUser().getUserId());
		PerformancePO performancePO = new PerformancePO(userPO);
		BeanUtil.copyProperties(performance, performancePO, Arrays.asList("user"));
		
		performanceDao.save(performancePO);
		
	}


}
