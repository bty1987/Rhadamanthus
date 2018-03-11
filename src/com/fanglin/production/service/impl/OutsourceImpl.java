package com.fanglin.production.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.dao.OutsourceDao;
import com.fanglin.production.po.OutsourcePO;
import com.fanglin.production.service.OutsourceService;
import com.fanglin.production.vo.OutsourceVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;


@Service("outsourceService")
@Transactional(readOnly = true)
public class OutsourceImpl implements OutsourceService{

	@Autowired
	private OutsourceDao outsourceDao;
	
	@Override
	public void pageOutsource(Paging paging, List<Filter> filter,long pid) {
		
		filter.add(new Filter(OutsourcePO.COLMU_PID, String.valueOf(pid), "eq"));
		
		List<OutsourcePO> OutsourcePOs = outsourceDao.pageOutsource(paging, filter);
		List<OutsourceVO> OutsourceVOs = new ArrayList<OutsourceVO>();
		
		for (OutsourcePO outsourcePO : OutsourcePOs) {
			
			OutsourceVO  outsourceVO = new OutsourceVO();
			BeanUtil.copyPropertie(outsourcePO, outsourceVO);
			
			OutsourceVOs.add(outsourceVO);
		}
		
		paging.setData(OutsourceVOs);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addOutsource(OutsourceVO outsourceVO) {
		
		OutsourcePO outsourcePO = new OutsourcePO();
		outsourcePO.setPid(outsourceVO.getPid());
		outsourcePO.setComment(outsourceVO.getComment());
		outsourcePO.setStatus(OutsourcePO.COLMU_STATUS);
		outsourcePO.setPath(OutsourcePO.COLMU_PATH);
		
		outsourceDao.save(outsourcePO);
		
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateOutsource(OutsourceVO outsource) throws FLException {
		
		OutsourcePO	 outsourcePO = outsourceDao.get(outsource.getOid());
		
		if (outsourcePO == null){
			throw new FLException(220006, "外协单不存在");
		}
		if(outsource.getPath() != null){
			outsourcePO.setPath(outsource.getPath());	
		}
		if(outsource.getComment() != null){
			outsourcePO.setComment(outsource.getComment());
		}
									
		outsourceDao.update(outsourcePO);
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateOutsourceForStatus(OutsourceVO outsource)throws FLException {
		
		OutsourcePO outsourcePO = outsourceDao.get(outsource.getOid());
		
		if (outsourcePO == null){
			throw new FLException(220006, "外协单不存在");
		}
		
		outsourcePO.setStatus(outsource.getStatus());
		outsourceDao.update(outsourcePO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteOutsource(OutsourceVO outsource) throws FLException {
		
		OutsourcePO	 outsourcePO = outsourceDao.get(outsource.getOid());
		
		if (outsourcePO == null){
			throw new FLException(220006, "外协单不存在");
		}
		outsourceDao.delete(outsourcePO);
		
		return 0;
	}
	
}
