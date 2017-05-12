package com.fanglin.inventory.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.WorkTypeVO;
import com.fanglin.data.po.WorkTypePO;
import com.fanglin.inventory.dao.AssisTypeDao;
import com.fanglin.inventory.po.AssisTypePO;
import com.fanglin.inventory.service.AssisTypeService;
import com.fanglin.inventory.vo.AssisTypeVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("assistypeService")
@Transactional(readOnly=true)
public class AssisTypeServiceImpl implements AssisTypeService{
	
	@Autowired
	private AssisTypeDao assistypeDao;
	
	@Override
	public void pageAssisType(Paging paging, List<Filter> filters) {
		List<AssisTypePO> assisTypePOs = assistypeDao.pageAssisType(paging, filters);
		List<AssisTypeVO> assisTypeVOs = new ArrayList<AssisTypeVO>();
		
		AssisTypeVO assisTypeVO;
		
		for(AssisTypePO assisTypePO: assisTypePOs){
			
			assisTypeVO = new AssisTypeVO(new WorkTypeVO());
			
			BeanUtil.copyProperties(assisTypePO, assisTypeVO, Arrays.asList("workType"));
			BeanUtil.copyProperties(assisTypePO.getWorkType(), assisTypeVO.getWorkType());
			
			assisTypeVOs.add(assisTypeVO);
		}

		paging.setData(assisTypeVOs);
		
	}
	
	@Override
	public List<AssisTypeVO> queryAssisType() {
		
		List<AssisTypePO> assisTypePOs = assistypeDao.queryAssisType();;
		List<AssisTypeVO> assisTypeVOs = new ArrayList<AssisTypeVO>();
		
		AssisTypeVO assisTypeVO;
		
		for(AssisTypePO assisTypePO: assisTypePOs){
			
			assisTypeVO = new AssisTypeVO(new WorkTypeVO());
			
			BeanUtil.copyProperties(assisTypePO, assisTypeVO,Arrays.asList("workType"));
			BeanUtil.copyProperties(assisTypePO.getWorkType(), assisTypeVO.getWorkType());
			
			assisTypeVOs.add(assisTypeVO);
		}
		return assisTypeVOs;
	}
	
	@Override
	public List<AssisTypeVO> queryAssisTypeByWtid(AssisTypeVO assisTypeVO) {
		
		List<AssisTypePO> assisTypePOs = assistypeDao.queryAssisTypeByWtid(assisTypeVO.getWorkType().getId());
		List<AssisTypeVO> assisTypeVOs = new ArrayList<AssisTypeVO>();
		
		 for(AssisTypePO assisTypePO: assisTypePOs){
			 
		      assisTypeVO = new AssisTypeVO(new WorkTypeVO());
		      
		      BeanUtil.copyProperties(assisTypePO, assisTypeVO,Arrays.asList("workType"));
		      BeanUtil.copyProperties(assisTypePO.getWorkType(), assisTypeVO.getWorkType());

		      assisTypeVOs.add(assisTypeVO);
		    }
		
		return assisTypeVOs;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addAssisType(AssisTypeVO assisTypeVO) throws FLException {
		
		AssisTypePO assisTypePO = new AssisTypePO(new WorkTypePO());
		
		BeanUtil.copyProperties(assisTypeVO, assisTypePO,Arrays.asList("workType"));
		BeanUtil.copyProperties(assisTypeVO.getWorkType(), assisTypePO.getWorkType());
		
		assisTypePO.setStatus(AssisTypePO.STATUS_ENABLE_INT);
		
		assistypeDao.save(assisTypePO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateAssisType(AssisTypeVO assisTypeVO) throws FLException {
		
		AssisTypePO assisTypePO = assistypeDao.get(assisTypeVO.getAtid());
		
		if(assisTypePO == null){
			throw new FLException(260020, "辅类不存在");
		}
		
		BeanUtil.copyProperties(assisTypeVO, assisTypePO,Arrays.asList("workType","atid","status") );
		
		assisTypePO.setWorkType(new WorkTypePO(assisTypeVO.getWorkType().getId()));
		
		assistypeDao.update(assisTypePO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateAssisTypeForStatus(AssisTypeVO assisTypeVO)
			throws FLException {
		AssisTypePO assisTypePO = assistypeDao.get(assisTypeVO.getAtid());
		
		if(assisTypePO == null){
			throw new FLException(260020, "辅类不存在");
		}
		
		assisTypePO.setStatus(assisTypeVO.getStatus());
		
		assistypeDao.update(assisTypePO);
		
		return 0;
	}

}
