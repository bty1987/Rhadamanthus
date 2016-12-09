/**
 * Title: DepartmentServiceImpl
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.department.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.department.dao.DepartmentDao;
import com.fanglin.department.po.DepartmentPO;
import com.fanglin.department.service.DepartmentService;
import com.fanglin.department.vo.DepartmentVO;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.system.vo.CityProperVO;
import com.fanglin.system.vo.CityVO;
import com.fanglin.system.vo.RegionVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;

@Service("departmentService")
@Transactional(readOnly = true)
public class DepartmentServiceImpl implements DepartmentService {

	@Autowired
	private DepartmentDao departmentDao;
	
	@Override
	public void pageDepartment(Paging paging, List<Filter> filters, DepartmentVO departmentVO, int company) throws FLException{
		
		if(company != CompanyPO.TYPE_HEADQUARTER_INT){
			filters.add(new Filter("company", String.valueOf(company), "eq"));
		}
		
		if(departmentVO != null && departmentVO.getType() != null){
			filters.add(new Filter("type", departmentVO.getType(), "eq"));
		}
		
		List<DepartmentPO> departmentPOs = departmentDao.pageDepartment(paging, filters);
		List<DepartmentVO> departmentVOs = new ArrayList<DepartmentVO>();
		
		for(DepartmentPO departmentPO: departmentPOs){
			departmentVOs.add(convertBean(departmentPO));
		}
		
		paging.setData(departmentVOs);
	}
	
	@Override
	public List<DepartmentVO> queryDepartment(String type, Integer company) throws FLException{
		
		Integer _company = company != CompanyPO.TYPE_HEADQUARTER_INT ? company : null;
		
		List<DepartmentPO> departmentPOs = departmentDao.queryDepartment(type, _company);
		List<DepartmentVO> departmentVOs = new ArrayList<DepartmentVO>();
		
		Map<Integer, Integer> companys = new HashMap<Integer, Integer>();
		
		DepartmentVO departmentVO;
		
		for(DepartmentPO departmentPO: departmentPOs){
			
			company = companys.get(departmentPO.getCompany());
			
			if(company == null){
				company = FormatUtil.encodeCompanu(departmentPO.getCompany());
				companys.put(departmentPO.getCompany(), company);
			}
			
			departmentVO = convertBean(departmentPO);
			departmentVO.setCompany(company);
			
			departmentVOs.add(departmentVO);
		}
		
		return departmentVOs;
	}
	
	@Override
	public DepartmentVO queryDepartmentById(String id){
		DepartmentPO departmentPO = departmentDao.get(id);
		DepartmentVO departmentVO = null;
		
		if(departmentPO != null){
			departmentVO = convertBean(departmentPO);
		}
		
		return departmentVO;
	}

	@Override
	public List<DepartmentVO> queryDepartmentByName(DepartmentVO departmentVO, int company) {
		
		Integer _company = null;
		
		if(company != CompanyPO.TYPE_HEADQUARTER_INT){
			_company = company;
		}
		
		List<DepartmentPO> departmentPOs = departmentDao.pageDepartmentByName(new Paging(0, 50), departmentVO.getDeptName(), _company, departmentVO.getType());
		List<DepartmentVO> departmentVOs = new ArrayList<DepartmentVO>();
		
		for(DepartmentPO departmentPO: departmentPOs){
			departmentVOs.add(convertBean(departmentPO));
		}
		
		return departmentVOs;
	}

	public DepartmentVO convertBean(DepartmentPO departmentPO){
		DepartmentVO departmentVO = new DepartmentVO();
		BeanUtil.copyProperties(departmentPO, departmentVO, Arrays.asList("fatherDept", "cityProper", "company"));
		
		if(departmentPO.getFatherDept() != null){
			departmentVO.setFatherDept(new DepartmentVO());
			BeanUtil.copyProperties(departmentPO.getFatherDept(), departmentVO.getFatherDept());
		}
		
		if(departmentPO.getCityProper() != null){
			departmentVO.setCityProper(new CityProperVO());
			BeanUtil.copyProperties(departmentPO.getCityProper(), departmentVO.getCityProper(), Arrays.asList("city"));
			departmentVO.getCityProper().setCity(new CityVO());
			BeanUtil.copyProperties(departmentPO.getCityProper().getCity(), departmentVO.getCityProper().getCity(), Arrays.asList("region"));
			departmentVO.getCityProper().getCity().setRegion(new RegionVO());
			BeanUtil.copyProperties(departmentPO.getCityProper().getCity().getRegion(), departmentVO.getCityProper().getCity().getRegion());
		}
		
		return departmentVO;
	}

}
