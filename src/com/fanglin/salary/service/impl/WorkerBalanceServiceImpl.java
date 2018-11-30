package com.fanglin.salary.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.salary.dao.WorkerBalanceDao;
import com.fanglin.salary.po.WorkerBalancePO;
import com.fanglin.salary.service.WorkerBalanceService;
import com.fanglin.salary.vo.WorkerBalanceVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("workerBalanceService")
@Transactional(readOnly = true)
public class WorkerBalanceServiceImpl implements WorkerBalanceService {
	
	@Autowired
	private WorkerBalanceDao workerBalanceDao;

	@Override
	public void pageWorkerBalance(Paging paging, List<Filter> filters) {
		
		List<WorkerBalancePO> workerBalancePOs=workerBalanceDao.pageWorkerBalance(paging, filters);
		List<WorkerBalanceVO> workerBalanceVOs=new ArrayList<WorkerBalanceVO>();
		
		for(WorkerBalancePO workerBalancePO:workerBalancePOs){
			
			WorkerBalanceVO workerBalanceVO = new WorkerBalanceVO(new UserBaseVO(new DutyVO(),new DepartmentVO()));
			
			BeanUtil.copyProperties(workerBalancePO, workerBalanceVO,Arrays.asList("user"));
			BeanUtil.copyProperties(workerBalancePO.getUser(), workerBalanceVO.getUser(),Arrays.asList("duty","dept","role"));
			BeanUtil.copyProperties(workerBalancePO.getUser().getDuty(), workerBalanceVO.getUser().getDuty(),Arrays.asList("departmentType"));
			BeanUtil.copyProperties(workerBalancePO.getUser().getDept(), workerBalanceVO.getUser().getDept(),Arrays.asList("type", "fatherDept", "manager"));
			
			workerBalanceVOs.add(workerBalanceVO);
			
		}
		paging.setData(workerBalanceVOs);
	}

}
