/**
 * @File Name		: DRegionCountDetailServiceImpl.java
 * @Package   	: com.fanglin.report.service.impl
 * @Version		: 1.0
 * @Date			: 2016-11-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.report.service.impl;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.report.dao.DRegionCountDetailDao;
import com.fanglin.report.po.DRegionCountDetailPO;
import com.fanglin.report.service.DRegionCountDetailService;
import com.fanglin.report.vo.DRegionCountDetailVO;
import com.fanglin.utils.BeanUtil;

@Service("dRegionCountDetailService")
@Transactional(readOnly=true)
public class DRegionCountDetailServiceImpl implements DRegionCountDetailService {
	
	@Autowired
	private DRegionCountDetailDao dRegionCountDetailDao;
	
	@Autowired
	private UserDao userDao;

	@Override
	public List<DRegionCountDetailVO> queryDRegionCountDetail(List<FilterVO> filters, String userId) throws FLException, ParseException {
		
		if(filters.size() == 0) return null;
		
		UserPO userPO = userDao.get(userId);
		
		if(userPO == null){
			throw new FLException(220005, "员工不存在");
		}
		
		if(userPO.getDept().getFatherDept() == null){
			return null;
		}else if(userPO.getDuty().contains("设计")){
			filters.add(new FilterVO("designRegionId", userPO.getDept().getDeptId(), "eq"));
		}else if(userPO.getDuty().contains("业务")){
			filters.add(new FilterVO("salesmanRegionId", userPO.getDept().getDeptId(), "eq"));
		}
		
		List<DRegionCountDetailPO> dRegionCountDetailPOs = dRegionCountDetailDao.queryDRegionCountDetail(filters);
		List<DRegionCountDetailVO> dRegionCountDetailVOs = new ArrayList<DRegionCountDetailVO>();
		
		DRegionCountDetailVO dRegionCountDetailVO;
		
		for(DRegionCountDetailPO dRegionCountDetailPO: dRegionCountDetailPOs){
			dRegionCountDetailVO = new DRegionCountDetailVO();
			
			BeanUtil.copyProperties(dRegionCountDetailPO, dRegionCountDetailVO);
			
			dRegionCountDetailVO.setDesignRegionName(dRegionCountDetailPO.getDesignRegion().getDeptName());
			dRegionCountDetailVO.setSalemanRegionName(dRegionCountDetailPO.getSalesmanRegion().getDeptName());
			
			dRegionCountDetailVOs.add(dRegionCountDetailVO);
		}
		
		return dRegionCountDetailVOs;
	}

}
