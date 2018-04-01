package com.fanglin.production.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.dao.WorkshopDao;
import com.fanglin.production.po.WorkshopPO;
import com.fanglin.production.service.WorkshopService;
import com.fanglin.production.vo.WorkshopVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("workshopService")
@Transactional(readOnly = true)
public class WorkshopServiceImpl implements WorkshopService {

	@Autowired
	private WorkshopDao workshopDao;

	@Override
	public void pageWorkshop(Paging paging, List<Filter> filters, int company) {

		List<WorkshopPO> workshopPOs = workshopDao.pageWorkshop(paging, filters, company);
		List<WorkshopVO> workshopVOs = new ArrayList<WorkshopVO>();

		for (WorkshopPO workshopPO : workshopPOs) {
			WorkshopVO workshopVO = new WorkshopVO();
			BeanUtil.copyProperties(workshopPO, workshopVO);

			workshopVOs.add(workshopVO);
		}

		paging.setData(workshopVOs);
	}

	@Override
	public List<WorkshopVO> queryWorkshop(int company) {

		List<WorkshopPO> workshopPOs = workshopDao.queryWorkshop(company);
		List<WorkshopVO> workshopVOs = new ArrayList<WorkshopVO>();

		for (WorkshopPO workshopPO : workshopPOs) {
			WorkshopVO workshopVO = new WorkshopVO();

			BeanUtil.copyProperties(workshopPO, workshopVO);

			workshopVOs.add(workshopVO);
		}

		return workshopVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addWorkshop(WorkshopVO workshopVO, int company) {

		WorkshopPO workshopPO = new WorkshopPO();

		BeanUtil.copyProperties(workshopVO, workshopPO);
		workshopPO.setCompany(company);

		workshopDao.save(workshopPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateWorkshop(WorkshopVO workshopVO) throws FLException {

		WorkshopPO workshopPO = workshopDao.get(workshopVO.getWsid());
		
		if (workshopPO == null) {
			throw new FLException(220016, "车间不存在");
		}

		BeanUtil.copyProperties(workshopVO, workshopPO);
		workshopPO.setName(workshopVO.getName());
		
		workshopDao.update(workshopPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateWorkshopForStatus(WorkshopVO workshopVO) throws FLException {

		WorkshopPO workshopPO = workshopDao.get(workshopVO.getWsid());
		
		if (workshopPO == null) {
			throw new FLException(220016, "车间不存在");
		}
		
		BeanUtil.copyProperties(workshopVO, workshopPO);
		workshopPO.setStatus(workshopVO.getStatus());
		
		workshopDao.update(workshopPO);

		return 0;
	}

}
