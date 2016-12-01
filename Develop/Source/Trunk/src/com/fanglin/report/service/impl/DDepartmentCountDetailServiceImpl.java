/**
 * @File Name		: DDepartmentCountDetailServiceImpl.java
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

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.report.dao.DDepartmentCountDetailDao;
import com.fanglin.report.po.DDepartmentCountDetailPO;
import com.fanglin.report.service.DDepartmentCountDetailService;
import com.fanglin.report.vo.DDepartmentCountDetailVO;
import com.fanglin.utils.BeanUtil;

@Service("dDepartmentCountDetailService")
public class DDepartmentCountDetailServiceImpl implements DDepartmentCountDetailService {
	
	@Autowired
	private DDepartmentCountDetailDao dDepartmentCountDetailDao;
	
	@Autowired
	private UserDao userDao;

	@Override
	public List<DDepartmentCountDetailVO> queryDDepartmentCountDetail(List<Filter> filters, String userId) throws FLException, ParseException {
		
		if(filters.size() == 0) return null;
		
		UserPO userPO = userDao.get(userId);
		
		if(userPO == null){
			throw new FLException(220005, "员工不存在");
		}
		
		if(userPO.getDuty().contains("设计")){
			filters.add(new Filter("designDepartmentId", userPO.getDept().getDeptId(), "eq"));
		}else if(userPO.getDuty().contains("业务")){
			filters.add(new Filter("salesmanDepartmentId", userPO.getDept().getDeptId(), "eq"));
		}
		
		List<DDepartmentCountDetailPO> dDepartmentCountDetailPOs = dDepartmentCountDetailDao.queryDDepartmentCountDetail(filters);
		List<DDepartmentCountDetailVO> dDepartmentCountDetailVOs = new ArrayList<DDepartmentCountDetailVO>();
		
		DDepartmentCountDetailVO dDepartmentCountDetailVO;
		
		for(DDepartmentCountDetailPO dDepartmentCountDetailPO: dDepartmentCountDetailPOs){
			dDepartmentCountDetailVO = new DDepartmentCountDetailVO();
			
			BeanUtil.copyProperties(dDepartmentCountDetailPO, dDepartmentCountDetailVO);
			
			dDepartmentCountDetailVO.setDesignDepartmentName(dDepartmentCountDetailPO.getDesignDepartment().getDeptName());
			dDepartmentCountDetailVO.setSalesmanDepartmentName(dDepartmentCountDetailPO.getSalesmanDepartment().getDeptName());
			
			dDepartmentCountDetailVOs.add(dDepartmentCountDetailVO);
		}
		
		return dDepartmentCountDetailVOs;
	}

}
