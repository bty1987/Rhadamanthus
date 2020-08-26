package com.fanglin.salary.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.salary.dao.WorkerBalanceDao;
import com.fanglin.salary.po.WorkerBalancePO;
import com.fanglin.salary.service.WorkerBalanceService;
import com.fanglin.salary.vo.WorkerBalanceVO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("workerBalanceService")
@Transactional(readOnly = true)
public class WorkerBalanceServiceImpl implements WorkerBalanceService {
	
	@Autowired
	private WorkerBalanceDao workerBalanceDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private SystemConfigDao systemConfigDao;

	@Override
	public void pageWorkerBalance(Paging paging, List<Filter> filters,int company) {
		
		List<WorkerBalancePO> workerBalancePOs=workerBalanceDao.pageWorkerBalance(paging, filters,company);
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
	
	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addWorkerBalance(WorkerBalanceVO workerBalanceVO, int company) throws FLException {
		
		UserPO user = userDao.queryUserByUserId(workerBalanceVO.getUser().getUserId());
		
		WorkerBalancePO workerBalancePO = workerBalanceDao.queryWorkerBalance(user.getUid(), company);
		
		if(workerBalancePO != null){
			throw new FLException(280008, "工人帐户已存在");
		}
		
		SystemConfigPO workerDepositLimit = systemConfigDao.querySystemConfig("workerDepositLimit", company);

		workerBalancePO = new WorkerBalancePO(new UserPO());

		workerBalancePO.setUser(user);
		workerBalancePO.setToplimit(workerDepositLimit == null ? 0 : Arith.mul(Integer.valueOf(workerDepositLimit.getValue()), 1000));
		workerBalancePO.setDeposit(0);
		workerBalancePO.setSalary(0);
		workerBalancePO.setStatus(WorkerBalancePO.STATUS_VALID_INT);
		workerBalancePO.setCompany(company);
		
		workerBalanceDao.save(workerBalancePO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateWorkerBalance(WorkerBalanceVO workerBalanceVO)throws FLException {
		
		WorkerBalancePO workerBalancePO = workerBalanceDao.get(workerBalanceVO.getWbid());
		
		if (workerBalancePO == null) {
			throw new FLException(280004, "工人帐户不存在");
		}
		
		workerBalancePO.setToplimit(workerBalanceVO.getToplimit());
		
		workerBalanceDao.update(workerBalancePO);
		
		return 0;
	}

}
