package com.fanglin.salary.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fanglin.construction.dao.ConstructionScheduleDao;
import com.fanglin.construction.po.ConstructionSchedulePO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.salary.dao.WorkerSalaryDao;
import com.fanglin.salary.po.WorkerSalaryPO;
import com.fanglin.salary.service.WorkerSalaryService;
import com.fanglin.salary.vo.WorkerSalaryVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("workerSalaryService")
@Transactional(readOnly = true)
public class WorkerSalaryServiceImpl implements WorkerSalaryService {

	@Autowired
	private WorkerSalaryDao workerSalaryDao;

	@Autowired
	private ConstructionScheduleDao constructionScheduleDao;

	@Override
	public void pageWorkerSalary(Paging paging, List<Filter> filters) {
		
		List<WorkerSalaryPO> WorkerSalaryPOs = workerSalaryDao.pageWorkerSalary(paging,filters);
		List<WorkerSalaryVO> WorkerSalaryVOs = new ArrayList<WorkerSalaryVO>();
		
		for (WorkerSalaryPO po : WorkerSalaryPOs) {
			WorkerSalaryVO vo = new WorkerSalaryVO(new UserVO());
			BeanUtil.copyProperties(po, vo, Arrays.asList("user"));
			BeanUtil.copyProperties(po.getUser(), vo.getUser(),Arrays.asList("dept", "role"));
			WorkerSalaryVOs.add(vo);
		}
		
		paging.setData(WorkerSalaryVOs);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public List<WorkerSalaryVO> queryWorkerSalary(WorkerSalaryVO workerSalaryVO) {
		
		List<WorkerSalaryPO> workerSalaryPOs = workerSalaryDao.queryWorkerSalary(workerSalaryVO.getUser().getUserId(),workerSalaryVO.getCsId());
		List<WorkerSalaryVO> workerSalarys = new ArrayList<WorkerSalaryVO>();
		
		for (WorkerSalaryPO workerSalaryPO : workerSalaryPOs) {
			WorkerSalaryVO workerSalaryvo = new WorkerSalaryVO(new UserVO());
			BeanUtil.copyProperties(workerSalaryPO, workerSalaryvo,Arrays.asList("user"));
			BeanUtil.copyProperties(workerSalaryPO.getUser(),workerSalaryvo.getUser(), Arrays.asList("dept", "role"));
			workerSalarys.add(workerSalaryvo);
		}
		return workerSalarys;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addWorkerSalary(WorkerSalaryVO workerSalaryVO) throws FLException {
		
		long csId = workerSalaryVO.getCsId();
		ConstructionSchedulePO  constructionSchedulePO=	constructionScheduleDao.queryConstructionScheduleByCsId(csId);
		
		if (constructionSchedulePO == null) {
			throw new FLException(120020, "工程信息不存在");
		}
		WorkerSalaryPO workerSalaryPO = new WorkerSalaryPO(new UserPO(workerSalaryVO.getUser().getUserId()));
		workerSalaryPO.setOrderId(constructionSchedulePO.getDecorationOrderPO().getOrderId());
		workerSalaryPO.setType(workerSalaryVO.getType());
		workerSalaryPO.setSalary(workerSalaryVO.getSalary());
		workerSalaryPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		workerSalaryPO.setBalanceTime(new Timestamp(System.currentTimeMillis()));
		workerSalaryPO.setCsId(workerSalaryVO.getCsId());
		workerSalaryDao.save(workerSalaryPO);
		
		workerSalaryVO.setWsId(workerSalaryPO.getWsId());

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateWorkerSalary(WorkerSalaryVO workerSalaryVO) throws FLException {
		
		WorkerSalaryPO workerSalaryPO = workerSalaryDao.queryWorkSalaryByWsId(workerSalaryVO.getWsId());
		
		if (workerSalaryPO == null) {
			throw new FLException(280001, "薪资信息不存在");
		}
		if (workerSalaryPO.getStatus() != WorkerSalaryPO.STATUS_INIT_STR) {
			throw new FLException(280002, "工费状态不可操作");
		}
		BeanUtil.copyProperties(workerSalaryVO, workerSalaryPO,Arrays.asList("user"));
		BeanUtil.copyProperties(workerSalaryVO.getUser(),workerSalaryPO.getUser(), Arrays.asList("dept", "role"));
		workerSalaryDao.update(workerSalaryPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteWorkerSalary(WorkerSalaryVO workerSalaryVO) throws FLException {
		
		WorkerSalaryPO worksalarypo = workerSalaryDao.queryWorkSalaryByWsId(workerSalaryVO.getWsId());
		
		if (worksalarypo == null) {
			throw new FLException(280001, "薪资信息不存在");
		}
		if (worksalarypo.getStatus() != WorkerSalaryPO.STATUS_INIT_STR) {
			throw new FLException(280002, "工费状态不可操作");
		}
		
		workerSalaryDao.delete(worksalarypo);
	}

}
