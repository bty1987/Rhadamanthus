package com.fanglin.communion.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.DepartmentTypeDao;
import com.fanglin.communion.dao.DutyDao;
import com.fanglin.communion.po.DepartmentTypePO;
import com.fanglin.communion.po.DutyPO;
import com.fanglin.communion.service.DutyService;
import com.fanglin.communion.vo.DepartmentTypeVO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("dutyService")
@Transactional(readOnly = true)
public class DutyServiceImpl implements DutyService {
	@Autowired
	private DutyDao dutyDao;
	
	@Autowired
	private DepartmentTypeDao departmentTypeDao;

	@Override
	public void pageDuty(Paging paging, List<Filter> filters) {
		List<DutyPO> dutyPOs = dutyDao.pageDuty(paging, filters);
		List<DutyVO> dutyVOs = new ArrayList<DutyVO>();
		
		for (DutyPO dutyPO : dutyPOs) {
			DutyVO dutyVO = new DutyVO(new DepartmentTypeVO());
			
			BeanUtil.copyProperties(dutyPO, dutyVO,Arrays.asList("departmentType"));
			
						
			BeanUtil.copyProperties(dutyPO.getDepartmentType(),dutyVO.getDepartmentType());
			
			
			dutyVOs.add(dutyVO);
		}
		
		paging.setData(dutyVOs);
	}

	@Override
	public List<DutyVO> queryDuty() {

		List<DutyPO> dutyPOs = dutyDao.queryDuty();
		List<DutyVO> dutyVOs = new ArrayList<DutyVO>();
		
		DutyVO dutyVO;

		for (DutyPO dutyPO : dutyPOs) {
			dutyVO = new DutyVO(new DepartmentTypeVO());
			
			BeanUtil.copyProperties(dutyPO, dutyVO, Arrays.asList("departmentType"));
			dutyVO.getDepartmentType().setDtid(dutyPO.getDepartmentType().getDtid());
			dutyVO.getDepartmentType().setName(dutyPO.getDepartmentType().getName());
			

			dutyVOs.add(dutyVO);
		}
		return dutyVOs;
		
	}
	
	@Override
	public  List<DutyVO> queryDutyByDtid(DutyVO duty){
		List<DutyPO> dutyPOs = dutyDao.queryDutyByDtid(duty.getDepartmentType().getDtid());
		List<DutyVO> dutyVOs = new ArrayList<DutyVO>();
		
		DutyVO dutyVO;
		for (DutyPO dutyPO : dutyPOs) {
			dutyVO = new DutyVO(new DepartmentTypeVO());
			
			BeanUtil.copyProperties(dutyPO, dutyVO, Arrays.asList("departmentType"));
		   
			if(dutyPO.getDepartmentType() != null){
			  
			   BeanUtil.copyProperties(dutyPO.getDepartmentType(), dutyVO.getDepartmentType());  
		   }
			
			dutyVOs.add(dutyVO);
		}
		return dutyVOs;
	}
	
	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addDuty(DutyVO dutyVO) throws FLException {

		DutyPO dutyPO = dutyDao.queryDutyByName(dutyVO.getName());
		if (dutyPO != null) {
			throw new FLException(130016, "职位已存在");
		}
		
		dutyPO = new DutyPO(new DepartmentTypePO());
		BeanUtil.copyProperties(dutyVO, dutyPO, Arrays.asList("departmentType"));
		BeanUtil.copyProperties(dutyVO.getDepartmentType(), dutyPO.getDepartmentType());
		
		dutyPO.setStatus((short)0);

		
		dutyDao.save(dutyPO);
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateDuty(DutyVO dutyVO) throws FLException {
		 
		DutyPO dutyPO = dutyDao.get(dutyVO.getDid());
		
		if (dutyPO == null) {
			throw new FLException(130015, "职位不存在");
		}
		
		DepartmentTypePO departmentTypePO = departmentTypeDao.get(dutyVO.getDepartmentType().getDtid());
		
		BeanUtil.copyProperties(dutyVO, dutyPO, Arrays.asList("departmentType"));
		
		dutyPO.setDepartmentType(departmentTypePO);
		
		dutyDao.update(dutyPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateDutyForStatus(DutyVO dutyVO) throws FLException {

		DutyPO dutyPO = dutyDao.get(dutyVO.getDid());
		if (dutyPO == null) {
			throw new FLException(130015, "职位不存在");
		}
		BeanUtil.copyProperties(dutyVO, dutyPO);
		dutyPO.setStatus(dutyVO.getStatus());
		dutyDao.update(dutyPO);

		return 0;
	}
}
