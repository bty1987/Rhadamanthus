package com.fanglin.department.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.department.dao.DepartmentTypeDao;
import com.fanglin.department.po.DepartmentTypePO;
import com.fanglin.department.service.DepartmentTypeService;
import com.fanglin.department.vo.DepartmentTypeVO;
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
	public void addDepartmentType(DepartmentTypeVO departmenttypevo) {
		
		DepartmentTypePO departmenttypepo=new DepartmentTypePO();
		
		departmenttypepo.setName(departmenttypevo.getName()); 
		
		departmentTypeDao.save(departmenttypepo);		
	}

}
