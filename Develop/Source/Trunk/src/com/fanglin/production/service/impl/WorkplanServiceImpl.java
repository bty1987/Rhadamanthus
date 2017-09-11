package com.fanglin.production.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;

import com.fanglin.production.dao.WorkplanDao;
import com.fanglin.production.po.WorkplanPO;
import com.fanglin.production.po.WorkshopPO;
import com.fanglin.production.service.WorkplanService;
import com.fanglin.production.vo.WorkshopVO;
import com.fanglin.production.vo.WorkplanVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("workplanService")
@Transactional(readOnly = true)
public class WorkplanServiceImpl implements WorkplanService {
	@Autowired
	private WorkplanDao workplanDao;

	@Override
	public void pageWorkplan(Paging paging, List<Filter> filters,int company) {
		List<WorkplanPO> workplanPOs = workplanDao.pageWorkplan(paging, filters,company);
		List<WorkplanVO> workplanVOs = new ArrayList<WorkplanVO>();

		for (WorkplanPO workplanPO : workplanPOs) {
			WorkplanVO workplanVO = new WorkplanVO(new WorkshopVO());
			BeanUtil.copyProperties(workplanPO, workplanVO,Arrays.asList("workshop"));
			BeanUtil.copyProperties(workplanPO.getWorkshop(),workplanVO.getWorkshop());
			workplanVOs.add(workplanVO);
		}
		paging.setData(workplanVOs);
	}

	@Override
	public List<WorkplanVO> queryWorkplan(int company) {

		List<WorkplanPO> workplanPOs = workplanDao.queryWorkplan(company);
		List<WorkplanVO> workplanVOs = new ArrayList<WorkplanVO>();

		for (WorkplanPO workplanPO : workplanPOs) {
			WorkplanVO workplanVO = new WorkplanVO(new WorkshopVO());
			BeanUtil.copyProperties(workplanPO, workplanVO,Arrays.asList("workshop"));
			BeanUtil.copyProperties(workplanPO.getWorkshop(),workplanVO.getWorkshop());

			workplanVOs.add(workplanVO);
		}
		return workplanVOs;
	}
	
	@Override
	public  List<WorkplanVO> queryWorkplanByWsid(WorkplanVO workplanVO,int company){

		 List<WorkplanPO> workplanPOs = workplanDao.queryWorkplanByWsid(workplanVO.getWorkshop().getWsid(),company);
		 List<WorkplanVO> workplanVOs = new ArrayList<WorkplanVO>();
		
		 for(WorkplanPO workplanPO:workplanPOs){
			workplanVO = new WorkplanVO(new WorkshopVO());
			BeanUtil.copyProperties(workplanPO, workplanVO,Arrays.asList("workshop"));
			BeanUtil.copyProperties(workplanPO.getWorkshop(),workplanVO.getWorkshop());
			workplanVOs.add(workplanVO);
		}
		return workplanVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addWorkplan(WorkplanVO workplanVO, int company) throws FLException {

		WorkplanPO workplanPO = new WorkplanPO();
		
		BeanUtil.copyProperties(workplanVO, workplanPO,Arrays.asList("workshop"));
		workplanPO.setCompany(company);
		workplanPO.setWorkshop(new WorkshopPO());
		BeanUtil.copyProperties(workplanVO.getWorkshop(),workplanPO.getWorkshop());
		
		workplanDao.save(workplanPO);
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateWorkplan(WorkplanVO workplanVO) throws FLException {
	
		WorkplanPO workplanPO = workplanDao.get(workplanVO.getWpid());
		if (workplanPO == null) {
			throw new FLException(220018 , "工序组不存在");
		}
		
		BeanUtil.copyProperties(workplanVO, workplanPO,Arrays.asList("workshop"));
		workplanPO.setWorkshop(new WorkshopPO());
		BeanUtil.copyProperties(workplanVO.getWorkshop(),workplanPO.getWorkshop());
		workplanDao.update(workplanPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateWorkplanForStatus(WorkplanVO workplanVO) throws FLException {

		WorkplanPO workplanPO = workplanDao.get(workplanVO.getWpid());
		if (workplanPO == null) {
			throw new FLException(220018 , "工序组不存在");
		}
		BeanUtil.copyProperties(workplanVO, workplanPO,Arrays.asList("workshop"));
		workplanPO.setStatus(workplanVO.getStatus());
		workplanDao.update(workplanPO);

		return 0;
	}


}
