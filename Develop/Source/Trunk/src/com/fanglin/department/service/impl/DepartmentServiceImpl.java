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

import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
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
import com.fanglin.utils.PinYin4Util;
import com.fanglin.utils.SystemConfig;

@Service("departmentService")
@Transactional(readOnly = true)
public class DepartmentServiceImpl implements DepartmentService {

	@Autowired
	private DepartmentDao departmentDao;
	
	@Autowired
	private UserDao userDao;
	
	
	@Autowired
	private CountingService countingService;
	
	@Override
	public void pageDepartment(Paging paging, List<Filter> filters, DepartmentVO departmentVO, int company) throws FLException{
		
		if(company != CompanyPO.TYPE_HEADQUARTER_INT){
			filters.add(new Filter("company", String.valueOf(company), "eq"));
		}
		
		if(departmentVO != null && departmentVO.getType() != null){
			filters.add(new Filter("type", departmentVO.getType(), "eq"));
		}
		
		List<DepartmentPO> departmentPOs = departmentDao.pageDepartment(paging, filters, company);
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
				company =  Integer.parseInt(FormatUtil.encodeCompany(departmentPO.getCompany()));
				companys.put(departmentPO.getCompany(), company);
			}
			
			departmentVO = convertBean(departmentPO);
		 
			
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
 
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addDepartment(DepartmentVO departmentVO, String userId) throws FLException{
		
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
		
		BeanUtil.copyProperties(departmentVO, departmentPO, Arrays.asList("dId", "deptId", "fatherDept", "cityProper", "company"));
		
		if(departmentVO.getFatherDept() != null){
			departmentPO.setFatherDept(new DepartmentPO());
			BeanUtil.copyProperties(departmentVO.getFatherDept(), departmentPO.getFatherDept());
		}
		
		if(departmentVO.getCityProper() != null){
			departmentPO.setCityProper(new CityProperPO());
			BeanUtil.copyProperties(departmentVO.getCityProper(), departmentPO.getCityProper());
		}
		
		UserPO userPO = userDao.queryUserByUserId(userId);

		if(userPO == null){
			throw new FLException(220005, "员工不存在");
		}
		
		departmentPO.setStatus(DepartmentPO.STATUS_ENABLE_INT);
		departmentPO.setCompany(userPO.getCompany());
		
		List<String> pinyins = PinYin4Util.getPinyin(departmentVO.getDeptName());
		departmentPO.setPinyin(pinyins.subList(0, pinyins.size() >= 2 ? 2 : pinyins.size()).toString());

		departmentDao.save(departmentPO);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateDepartment(DepartmentVO departmentVO) throws FLException {
		
		DepartmentPO departmentPO = departmentDao.get(departmentVO.getDeptId());
		
		if(departmentPO == null){
			throw new FLException(310001, "部门不存在");
		}
		
		BeanUtil.copyProperties(departmentVO, departmentPO, Arrays.asList("deptId", "fatherDept", "cityProper", "did", "company"));
		
		if(departmentVO.getFatherDept() != null){
			departmentPO.setFatherDept(new DepartmentPO());
			BeanUtil.copyProperties(departmentVO.getFatherDept(), departmentPO.getFatherDept());
		}
		
		if(departmentVO.getCityProper() != null){
			departmentPO.setCityProper(new CityProperPO());
			BeanUtil.copyProperties(departmentVO.getCityProper(), departmentPO.getCityProper());
		}
		
		List<String> pinyins = PinYin4Util.getPinyin(departmentVO.getDeptName());
		departmentPO.setPinyin(pinyins.subList(0, pinyins.size() >= 2 ? 2 : pinyins.size()).toString());
		
		departmentDao.update(departmentPO);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateDepartmentForStatus(DepartmentVO departmentVO) throws FLException {
		
		DepartmentPO departmentPO = departmentDao.get(departmentVO.getDeptId());
		
		if(departmentPO == null){
			throw new FLException(310001, "部门不存在");
		}
		
		departmentPO.setStatus(departmentVO.getStatus());
		
		departmentDao.update(departmentPO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteDepartment(DepartmentVO departmentVO) throws FLException{
		 
		DepartmentPO departmentPO = departmentDao.get(departmentVO.getDid());
		
		if(departmentPO == null){
			throw new FLException(310001, "部门不存在");
		}
		
		departmentPO.setStatus(DepartmentPO.STATUS_DISABLE_INT);
		
		departmentDao.update(departmentPO);
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
