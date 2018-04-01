package com.fanglin.communion.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.DepartmentTypeDao;
import com.fanglin.communion.po.DepartmentTypePO;
import com.fanglin.communion.service.DepartmentTypeService;
import com.fanglin.communion.vo.DepartmentTypeVO;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("departmentTypeService")
@Transactional(readOnly = true)
public class DepartmentTypeServiceImpl implements DepartmentTypeService{
	
	@Autowired 
	DepartmentTypeDao  departmentTypeDao;
	
	@Override
	public void pageDepartmentType(Paging paging, List<Filter> filter) {
		
		List<DepartmentTypePO> deptTypePOs = departmentTypeDao.pageDepartmentType(paging, filter);
		List<DepartmentTypeVO> deptTypeVOs = new ArrayList<DepartmentTypeVO>();
		
		for (DepartmentTypePO deptTypePO : deptTypePOs) {
			
			DepartmentTypeVO deptTypeVO = new DepartmentTypeVO();
			
			BeanUtil.copyProperties(deptTypePO, deptTypeVO);
		
			deptTypeVOs.add(deptTypeVO);
		}
		
		paging.setData(deptTypeVOs);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public List<DepartmentTypeVO> queryDepartmentType() {
		
		List<DepartmentTypePO> depttypePOs = departmentTypeDao.queryDepartmentType();
		List<DepartmentTypeVO> depttypeVOs = new ArrayList<DepartmentTypeVO>();
		
		DepartmentTypeVO depttypeVO;
		
		for (DepartmentTypePO deptPO : depttypePOs) {
			
			depttypeVO = new DepartmentTypeVO();
			
			BeanUtil.copyProperties(deptPO, depttypeVO);
			
			depttypeVOs.add(depttypeVO);
		}
		
		return depttypeVOs;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addDepartmentType(DepartmentTypeVO departmentTypeVO) {
		
		DepartmentTypePO departmentTypePO=new DepartmentTypePO();
		
		departmentTypePO.setName(departmentTypeVO.getName()); 
		
		departmentTypeDao.save(departmentTypePO);		
	}

}
