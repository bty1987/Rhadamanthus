/**
 * @File Name		: DUserCountDetailServiceImpl.java
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
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.report.dao.DUserCountDetailDao;
import com.fanglin.report.po.DUserCountDetailPO;
import com.fanglin.report.service.DUserCountDetailService;
import com.fanglin.report.vo.DUserCountDetailVO;
import com.fanglin.utils.BeanUtil;

@Service("dUserCountDetailService")
@Transactional(readOnly=true)
public class DUserCountDetailServiceImpl implements DUserCountDetailService {
	
	@Autowired
	private DUserCountDetailDao dUserCountDetailDao;
	
	@Autowired
	private UserDao userDao;

	@Override
	public List<DUserCountDetailVO> queryDUserCountDetail(List<Filter> filters, String userId) throws FLException, ParseException {
		
		if(filters.size() == 0) return null;
		
		UserPO userPO = userDao.get(userId);
		
		if(userPO == null){
			throw new FLException(220005, "员工不存在");
		}
		
		if(userPO.getDuty().contains("设计师")){
			filters.add(new Filter("designerUserId", userPO.getUserId(), "eq"));
		}else if(userPO.getDuty().contains("业务员")){
			filters.add(new Filter("salesmanUserId", userPO.getUserId(), "eq"));
		}
		
		List<DUserCountDetailPO> dUserCountDetailPOs = dUserCountDetailDao.queryDUserCountDetail(filters);
		List<DUserCountDetailVO> dUserCountDetailVOs = new ArrayList<DUserCountDetailVO>();
		
		DUserCountDetailVO dUserCountDetailVO;
		
		for(DUserCountDetailPO dUserCountDetailPO: dUserCountDetailPOs){
			dUserCountDetailVO = new DUserCountDetailVO();
			
			BeanUtil.copyProperties(dUserCountDetailPO, dUserCountDetailVO);
			
			dUserCountDetailVO.setDesignerName(dUserCountDetailPO.getDesigner().getUserName());
			dUserCountDetailVO.setSalesmanName(dUserCountDetailPO.getSalesman().getUserName());
			
			dUserCountDetailVOs.add(dUserCountDetailVO);
		}
		
		return dUserCountDetailVOs;
	}
	
}
