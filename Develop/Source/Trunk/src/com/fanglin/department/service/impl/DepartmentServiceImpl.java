/**
 * Title: DepartmentServiceImpl
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: JH Corporation, China, Ltd.
 * @author Howard
 *
 */

package com.fanglin.department.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.department.dao.DepartmentDao;
import com.fanglin.department.po.DepartmentPO;
import com.fanglin.department.service.DepartmentService;
import com.fanglin.department.vo.DepartmentVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.system.po.CityProperPO;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.system.vo.CityProperVO;
import com.fanglin.system.vo.CityVO;
import com.fanglin.system.vo.RegionVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.SystemConfig;

@Service("departmentService")
@Transactional(readOnly = true)
public class DepartmentServiceImpl implements DepartmentService {

	@Autowired
	private DepartmentDao departmentDao;
	
	@Autowired
	private CountingService countingService;
	
	@Autowired
	private UserDao userDao;
	
	@Override
	public void pageDepartment(Paging paging, List<FilterVO> filters, String userId) throws FLException{
		
		UserPO userPO = userDao.get(userId);
		
		if(userPO == null){
			throw new FLException(190005, "人员不存在");
		}
		
		if(userPO.getCompany() != CompanyPO.TYPE_HEADQUARTER_INT){
			filters.add(new FilterVO("company", String.valueOf(userPO.getCompany()), "eq"));
		}
		
		List<DepartmentPO> departmentPOs = departmentDao.pageDepartment(paging, filters);
		List<DepartmentVO> departmentVOs = new ArrayList<DepartmentVO>();
		
		for(DepartmentPO departmentPO: departmentPOs){
			departmentVOs.add(convertBean(departmentPO));
		}
		
		paging.setData(departmentVOs);
	}
	
	@Override
	public List<DepartmentVO> queryDepartment(String type, String userId) throws FLException{

		Integer company = null;
		UserPO userPO = userDao.get(userId);
		
		if(userPO == null){
			throw new FLException(190005, "人员不存在");
		}
		
		if(userPO.getCompany() != CompanyPO.TYPE_HEADQUARTER_INT){
			company = userPO.getCompany();
		}
		
		List<DepartmentPO> departmentPOs = departmentDao.queryDepartment(type, company);
		List<DepartmentVO> departmentVOs = new ArrayList<DepartmentVO>();
		
		for(DepartmentPO departmentPO: departmentPOs){
			departmentVOs.add(convertBean(departmentPO));
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
	@Transactional(rollbackFor=Exception.class)
	public void addDepartment(DepartmentVO departmentVO){
		if(departmentVO.getCreateTime() == null || departmentVO.getCreateTime().trim().equals("")){
			departmentVO.setCreateTime(DateUtil.current());
		}
		
		DepartmentPO departmentPO = new DepartmentPO();
		
		int count = countingService.queryCountingByTypeDate(departmentVO.getIdent(), CountingPO.COUNTING_DATE_SILNLE_STR);
		
		StringBuffer deptId = new StringBuffer();
		deptId.append(SystemConfig.getString("companyIdent", ""));
		deptId.append(SystemConfig.getString("departmentIdent", "FL_"));
		deptId.append(departmentVO.getDeptId());
		deptId.append(FormatUtil.fillZero(count, "00"));
		
		departmentPO.setDeptId(deptId.toString());
		
		BeanUtil.copyProperties(departmentVO, departmentPO, Arrays.asList("deptId", "fatherDept", "cityProper"));
		
		if(departmentVO.getFatherDept() != null){
			departmentPO.setFatherDept(new DepartmentPO());
			BeanUtil.copyProperties(departmentVO.getFatherDept(), departmentPO.getFatherDept());
		}
		
		if(departmentVO.getCityProper() != null){
			departmentPO.setCityProper(new CityProperPO());
			BeanUtil.copyProperties(departmentVO.getCityProper(), departmentPO.getCityProper());
		}

		departmentDao.saveOrUpdate(departmentPO);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateDepartment(DepartmentVO departmentVO) {
		
		DepartmentPO departmentPO = departmentDao.get(departmentVO.getDeptId());
		
		if(departmentPO != null){
			BeanUtil.copyProperties(departmentVO, departmentPO, Arrays.asList("deptId", "fatherDept", "cityProper", "dId"));
			
			if(departmentVO.getFatherDept() != null){
				departmentPO.setFatherDept(new DepartmentPO());
				BeanUtil.copyProperties(departmentVO.getFatherDept(), departmentPO.getFatherDept());
			}
			
			if(departmentVO.getCityProper() != null){
				departmentPO.setCityProper(new CityProperPO());
				BeanUtil.copyProperties(departmentVO.getCityProper(), departmentPO.getCityProper());
			}
			
			departmentDao.update(departmentPO);
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteDepartment(List<String> ids){
		for(String id: ids)
			deleteDepartmentById(id);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteDepartmentById(String id){
		departmentDao.deleteById(id);
	}

	public DepartmentVO convertBean(DepartmentPO departmentPO){
		DepartmentVO departmentVO = new DepartmentVO();
		BeanUtil.copyProperties(departmentPO, departmentVO, Arrays.asList("fatherDept", "cityProper"));
		
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
