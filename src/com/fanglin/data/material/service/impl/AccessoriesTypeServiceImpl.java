package com.fanglin.data.material.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.po.WorkTypePO;
import com.fanglin.communion.vo.WorkTypeVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.material.dao.AccessoriesTypeDao;
import com.fanglin.data.material.service.AccessoriesTypeService;
import com.fanglin.data.material.vo.AccessoriesTypeVO;
import com.fanglin.data.po.AccessoriesTypePO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("accessoriesTypeService")
@Transactional(readOnly=true)
public class AccessoriesTypeServiceImpl implements AccessoriesTypeService{
	
	@Autowired
	private AccessoriesTypeDao accessoriesTypeDao;
	
	@Override
	public void pageAccessoriesType(Paging paging, List<Filter> filters) {
		
		List<AccessoriesTypePO> accessoriesTypePOs = accessoriesTypeDao.pageAccessoriesType(paging, filters);
		List<AccessoriesTypeVO> accessoriesTypeVOs = new ArrayList<AccessoriesTypeVO>();
		
		AccessoriesTypeVO accessoriesTypeVO;
		
		for(AccessoriesTypePO accessoriesTypePO: accessoriesTypePOs){
			
			accessoriesTypeVO = new AccessoriesTypeVO(new WorkTypeVO());
			
			BeanUtil.copyProperties(accessoriesTypePO, accessoriesTypeVO, Arrays.asList("workType"));
			BeanUtil.copyProperties(accessoriesTypePO.getWorkType(), accessoriesTypeVO.getWorkType());
			
			accessoriesTypeVOs.add(accessoriesTypeVO);
		}

		paging.setData(accessoriesTypeVOs);
		
	}
	
	@Override
	public List<AccessoriesTypeVO> queryAccessoriesType() {
		
		List<AccessoriesTypePO> accessoriesTypePOs = accessoriesTypeDao.queryAccessoriesType();;
		List<AccessoriesTypeVO> accessoriesTypeVOs = new ArrayList<AccessoriesTypeVO>();
		
		AccessoriesTypeVO accessoriesTypeVO;
		
		for(AccessoriesTypePO accessoriesTypePO: accessoriesTypePOs){
			
			accessoriesTypeVO = new AccessoriesTypeVO(new WorkTypeVO());
			
			BeanUtil.copyProperties(accessoriesTypePO, accessoriesTypeVO,Arrays.asList("workType"));
			BeanUtil.copyProperties(accessoriesTypePO.getWorkType(), accessoriesTypeVO.getWorkType());
			
			accessoriesTypeVOs.add(accessoriesTypeVO);
		}
		return accessoriesTypeVOs;
	}
	
	@Override
	public List<AccessoriesTypeVO> queryAccessoriesTypeByWtid(AccessoriesTypeVO accessoriesTypeVO) {
		
		List<AccessoriesTypePO> accessoriesTypePOs = accessoriesTypeDao.queryAccessoriesTypeByWtid(accessoriesTypeVO.getWorkType().getId());
		List<AccessoriesTypeVO> accessoriesTypeVOs = new ArrayList<AccessoriesTypeVO>();
		
		 for(AccessoriesTypePO accessoriesTypePO: accessoriesTypePOs){
			 
			 accessoriesTypeVO = new AccessoriesTypeVO(new WorkTypeVO());
		      
		      BeanUtil.copyProperties(accessoriesTypePO, accessoriesTypeVO,Arrays.asList("workType"));
		      BeanUtil.copyProperties(accessoriesTypePO.getWorkType(), accessoriesTypeVO.getWorkType());

		      accessoriesTypeVOs.add(accessoriesTypeVO);
		    }
		
		return accessoriesTypeVOs;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addAccessoriesType(AccessoriesTypeVO accessoriesTypeVO) throws FLException {
		
		AccessoriesTypePO accessoriesTypePO = new AccessoriesTypePO(new WorkTypePO());
		
		BeanUtil.copyProperties(accessoriesTypeVO, accessoriesTypePO,Arrays.asList("workType"));
		BeanUtil.copyProperties(accessoriesTypeVO.getWorkType(), accessoriesTypePO.getWorkType());
		
		accessoriesTypePO.setStatus(AccessoriesTypePO.STATUS_ENABLE_INT);
		
		accessoriesTypeDao.save(accessoriesTypePO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateAccessoriesType(AccessoriesTypeVO accessoriesTypeVO) throws FLException {
		
		AccessoriesTypePO accessoriesTypePO = accessoriesTypeDao.get(accessoriesTypeVO.getAtid());
		
		if(accessoriesTypePO == null){
			throw new FLException(260020, "辅类不存在");
		}
		
		BeanUtil.copyProperties(accessoriesTypeVO, accessoriesTypePO,Arrays.asList("workType","atid","status") );
		
		accessoriesTypePO.setWorkType(new WorkTypePO(accessoriesTypeVO.getWorkType().getId()));
		
		accessoriesTypeDao.update(accessoriesTypePO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateAccessoriesTypeForStatus(AccessoriesTypeVO accessoriesTypeVO) throws FLException {
		
		AccessoriesTypePO accessoriesTypePO = accessoriesTypeDao.get(accessoriesTypeVO.getAtid());
		
		if(accessoriesTypePO == null){
			throw new FLException(260020, "辅类不存在");
		}
		
		accessoriesTypePO.setStatus(accessoriesTypeVO.getStatus());
		
		accessoriesTypeDao.update(accessoriesTypePO);
		
		return 0;
	}

}
