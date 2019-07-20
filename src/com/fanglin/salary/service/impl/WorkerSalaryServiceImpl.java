package com.fanglin.salary.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.DutyVO;
import com.fanglin.construction.dao.ConstructionDao;
import com.fanglin.construction.dao.ConstructionScheduleDao;
import com.fanglin.construction.po.ConstructionPO;
import com.fanglin.construction.po.ConstructionSchedulePO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.salary.dao.WorkerBalanceDao;
import com.fanglin.salary.dao.WorkerSalaryDao;
import com.fanglin.salary.po.WorkerBalancePO;
import com.fanglin.salary.po.WorkerSalaryPO;
import com.fanglin.salary.service.WorkerSalaryService;
import com.fanglin.salary.vo.WorkerSalaryVO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("workerSalaryService")
@Transactional(readOnly = true)
public class WorkerSalaryServiceImpl implements WorkerSalaryService {

	@Autowired
	private WorkerSalaryDao workerSalaryDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private ConstructionDao constructionDao;

	@Autowired
	private ConstructionScheduleDao constructionScheduleDao;

	@Autowired
	private WorkerBalanceDao workerBalanceDao;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Override
	public void pageWorkerSalary(Paging paging, List<Filter> filters, int company) {

		List<WorkerSalaryPO> WorkerSalaryPOs = workerSalaryDao.pageWorkerSalary(paging, filters, company);

		List<WorkerSalaryVO> WorkerSalaryVOs = new ArrayList<WorkerSalaryVO>();

		for (WorkerSalaryPO workerSalaryPO : WorkerSalaryPOs) {

			WorkerSalaryVO workerSalaryVO = new WorkerSalaryVO(new DecorationVO(), new UserBaseVO(new DutyVO()), new UserBaseVO(), new UserBaseVO());

			if (workerSalaryPO.getDecoration() != null) {

				workerSalaryVO.setDecoration(new DecorationVO());
				workerSalaryPO.getDecoration().ptvcascade(workerSalaryVO.getDecoration());
				if (workerSalaryPO.getDecoration().getSupervisor() != null) {

					UserBaseVO supervisorVO = new UserBaseVO();
					supervisorVO.setUserName(workerSalaryPO.getDecoration().getSupervisor().getUserName());
					workerSalaryVO.getDecoration().setSupervisor(supervisorVO);
				}
			}

			BeanUtil.copyProperties(workerSalaryPO.getApprover(), workerSalaryVO.getApprover(), Arrays.asList("dept", "role", "duty"));
			BeanUtil.copyProperties(workerSalaryPO.getCreater(), workerSalaryVO.getCreater(), Arrays.asList("dept", "role", "duty"));
			BeanUtil.copyProperties(workerSalaryPO, workerSalaryVO, Arrays.asList("decoration", "user", "creater", "approver"));
			BeanUtil.copyProperties(workerSalaryPO.getUser(), workerSalaryVO.getUser(), Arrays.asList("dept", "role", "duty"));
			BeanUtil.copyProperties(workerSalaryPO.getUser().getDuty(), workerSalaryVO.getUser().getDuty(), Arrays.asList("departmentType"));

			WorkerSalaryVOs.add(workerSalaryVO);
		}
		paging.setData(WorkerSalaryVOs);
	}

	@Override
	public void pageWorkerSalaryByUserId(Paging paging, List<Filter> filters) {

		String userId = null;

		if (filters != null) {
			for (Filter filter : filters) {

				String filet = filter.getField();
				String data = filter.getData();

				if ("userId".equals(filet)) {
					userId = data;
				}
			}
		}

		int uid = userDao.queryUserByUserId(userId).getUid();

		filters.add(new Filter("uid", String.valueOf(uid), "eq"));

		List<WorkerSalaryPO> workerSalaryPOs = workerSalaryDao.pageWorkerSalaryByUserId(paging, filters);

		List<WorkerSalaryVO> workerSalaryVOs = new ArrayList<WorkerSalaryVO>();

		for (WorkerSalaryPO workerSalaryPO : workerSalaryPOs) {

			WorkerSalaryVO workerSalaryVO = new WorkerSalaryVO(new DecorationVO(), new UserBaseVO(new DutyVO()), new UserBaseVO(), new UserBaseVO());

			if (workerSalaryPO.getDecoration() != null) {

				workerSalaryVO.setDecoration(new DecorationVO());
				workerSalaryPO.getDecoration().ptvcascade(workerSalaryVO.getDecoration());
				if (workerSalaryPO.getDecoration().getSupervisor() != null) {

					UserBaseVO supervisorVO = new UserBaseVO();
					supervisorVO.setUserName(workerSalaryPO.getDecoration().getSupervisor().getUserName());
					workerSalaryVO.getDecoration().setSupervisor(supervisorVO);
				}

			}

			BeanUtil.copyProperties(workerSalaryPO.getApprover(), workerSalaryVO.getApprover(), Arrays.asList("dept", "role", "duty"));
			BeanUtil.copyProperties(workerSalaryPO.getCreater(), workerSalaryVO.getCreater(), Arrays.asList("dept", "role", "duty"));
			BeanUtil.copyProperties(workerSalaryPO, workerSalaryVO, Arrays.asList("decoration", "user", "creater", "approver"));
			BeanUtil.copyProperties(workerSalaryPO.getUser(), workerSalaryVO.getUser(), Arrays.asList("dept", "role", "duty"));
			BeanUtil.copyProperties(workerSalaryPO.getUser().getDuty(), workerSalaryVO.getUser().getDuty(), Arrays.asList("departmentType"));

			workerSalaryVOs.add(workerSalaryVO);
		}

		paging.setData(workerSalaryVOs);
	}

	@Override
	public List<WorkerSalaryVO> queryWorkerSalary(WorkerSalaryVO workerSalaryVO) {

		List<WorkerSalaryPO> workerSalaryPOs = new ArrayList<WorkerSalaryPO>();
		
		workerSalaryPOs = workerSalaryDao.queryWorkerSalary(workerSalaryVO.getUser().getUserId(), workerSalaryVO.getCsid());

		List<WorkerSalaryVO> workerSalarys = new ArrayList<WorkerSalaryVO>();

		for (WorkerSalaryPO workerSalaryPO : workerSalaryPOs) {

			WorkerSalaryVO workerSalaryvo = new WorkerSalaryVO(new DecorationVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO());

			BeanUtil.copyProperties(workerSalaryPO, workerSalaryvo, Arrays.asList("user", "decoration", "creater", "approver"));
			BeanUtil.copyProperties(workerSalaryPO.getUser(), workerSalaryvo.getUser(), Arrays.asList("dept", "role", "duty"));
			workerSalarys.add(workerSalaryvo);
		}
		return workerSalarys;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addWorkerSalary(WorkerSalaryVO workerSalaryVO, String userId, int company) throws FLException {

		UserPO worker = userDao.queryUserByUserId(workerSalaryVO.getUser().getUserId());

		UserPO creater = userDao.queryUserByUserId(userId);

		WorkerSalaryPO workerSalaryPO = new WorkerSalaryPO(worker, creater);

		if (workerSalaryVO.getCsid() != null && workerSalaryVO.getCsid() != 0) {

			ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.get(workerSalaryVO.getCsid());

			if (constructionSchedulePO.getStatus() != ConstructionSchedulePO.STATUS_FINISH_INT) {
				throw new FLException(280003, "施工环节未完工");
			}

			long cid = constructionSchedulePO.getCid();
			ConstructionPO constructionPO = constructionDao.queryConstructionByCid(cid);

			if (constructionPO == null) {
				throw new FLException(120020, "工程信息不存在");
			}

			DecorationPO decorationPO = constructionPO.getDecoration();

			company = decorationPO.getCompany();

			workerSalaryPO.setDecoration(decorationPO);
			workerSalaryPO.setCid(cid);

			workerSalaryPO.setSchedule(constructionSchedulePO.getSchedule());
			workerSalaryPO.setCsid(workerSalaryVO.getCsid());
		} else {
			workerSalaryPO.setCid(0);
			workerSalaryPO.setCsid(0);
		}

		WorkerBalancePO workerBalancePO = workerBalanceDao.queryWorkerBalanceByUserId(worker.getUid(), company);
		SystemConfigPO systemConfigPO = systemConfigDao.querySystemConfig("workerDepositLimit", company);

		short _type = 0;
		float _money = Math.abs(workerSalaryVO.getMoney());

		if (workerBalancePO == null) {

			workerBalancePO = new WorkerBalancePO();

			workerBalancePO.setUser(worker);
			workerBalancePO.setToplimit(systemConfigPO == null ? 0f : Float.parseFloat(systemConfigPO.getValue()));
			workerBalancePO.setDeposit(0f);
			workerBalancePO.setSalary(0f);
			workerBalancePO.setStatus(WorkerBalancePO.STATUS_VALID_INT);
			workerBalancePO.setCompany(company);

			workerBalanceDao.save(workerBalancePO);
		}

		addSalary(_type, _money, workerSalaryVO, workerBalancePO, workerSalaryPO, company);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int adoptWorkerSalary(List<WorkerSalaryVO> workerSalarys, String userId, int company) throws FLException {

		UserPO approval = userDao.queryUserByUserId(userId);

		for (WorkerSalaryVO workerSalaryVO : workerSalarys) {

			WorkerSalaryPO workerSalaryPO = workerSalaryDao.get(workerSalaryVO.getWsId());

			if (workerSalaryPO.getStatus() != WorkerSalaryPO.STATUS_INIT_INT) {
				throw new FLException(280002, "工费状态不可操作");
			}

			List<WorkerSalaryPO> workerSalary = workerSalaryDao.queryWorkerSalaryByCwsid(workerSalaryPO.getWsId());

			for (WorkerSalaryPO _workerSalary : workerSalary) {

				WorkerBalancePO workerCollect = workerBalanceDao.queryWorkerBalanceByUserId(_workerSalary.getUser().getUid(), company);

				if (workerCollect == null) {
					throw new FLException(280004, "工人帐户不存在");
				}

				if (_workerSalary.getType() == WorkerSalaryPO.TYPE_ADD_INT) {

					if (Arith.sub(workerCollect.getDeposit(), workerCollect.getToplimit()) < 0) {

						if (Arith.sub(Arith.add(workerCollect.getDeposit(), _workerSalary.getMoney()), workerCollect.getToplimit()) > 0) { // 超过质保金上限

							_workerSalary.setSalary(Arith.sub(Arith.add(workerCollect.getDeposit(), _workerSalary.getMoney()), workerCollect.getToplimit()));
							_workerSalary.setDeposit(Arith.sub(workerCollect.getToplimit(), workerCollect.getDeposit()));
							workerCollect.setSalary(Arith.add(workerCollect.getSalary(), Arith.sub(Arith.add(workerCollect.getDeposit(), _workerSalary.getMoney()), workerCollect.getToplimit())));
							workerCollect.setDeposit(workerCollect.getToplimit());

						} else {
							_workerSalary.setDeposit(_workerSalary.getMoney());
							workerCollect.setDeposit(Arith.add(workerCollect.getDeposit(), _workerSalary.getMoney()));
						}
					} else {
						_workerSalary.setSalary(_workerSalary.getMoney());
						_workerSalary.setDeposit(0f);
						workerCollect.setSalary(Arith.add(workerCollect.getSalary(), _workerSalary.getMoney()));
					}
				}

				workerBalanceDao.update(workerCollect);

				_workerSalary.setApproveTime(new Timestamp(System.currentTimeMillis()));
				_workerSalary.setStatus(WorkerSalaryPO.STATUS_PASS_INT);
				_workerSalary.setApprover(approval);

				workerSalaryDao.update(_workerSalary);
			}
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int rejectWorkerSalary(WorkerSalaryVO workerSalarys, String userId, int company) throws FLException {

		UserPO approval = userDao.queryUserByUserId(userId);

		WorkerSalaryPO workerSalaryPO = workerSalaryDao.get(workerSalarys.getWsId());

		if (workerSalaryPO.getStatus() != WorkerSalaryPO.STATUS_PASS_INT) {
			throw new FLException(280002, "工费状态不可操作");
		}

		List<WorkerSalaryPO> _workerSalaryPO = workerSalaryDao.queryWorkerSalaryByCwsid(workerSalaryPO.getWsId());

		for (WorkerSalaryPO _workerSalary : _workerSalaryPO) {

			WorkerBalancePO workerBalancePO = workerBalanceDao.queryWorkerBalanceByUserId(_workerSalary.getUser().getUid(), company);

			if (workerBalancePO == null) {
				throw new FLException(280004, "工人帐户不存在");
			}

			if (_workerSalary.getType() == WorkerSalaryPO.TYPE_ADD_INT) {// 类型加 减操作
				if (Arith.sub(workerBalancePO.getSalary(), _workerSalary.getMoney()) < 0) {
					workerBalancePO.setDeposit(Arith.sub(workerBalancePO.getDeposit(), Arith.sub(_workerSalary.getMoney(), workerBalancePO.getSalary())));
					workerBalancePO.setSalary(0f);
				} else {
					workerBalancePO.setSalary(Arith.sub(workerBalancePO.getSalary(), _workerSalary.getMoney()));
					workerBalancePO.setDeposit(workerBalancePO.getDeposit());
				}
			}

			if (_workerSalary.getType() == WorkerSalaryPO.TYPE_SUB_INT) {// 类型减 加操作
				if (Arith.sub(Arith.add(workerBalancePO.getDeposit(), _workerSalary.getMoney()), workerBalancePO.getToplimit()) > 0) {
					workerBalancePO.setSalary(Arith.add(workerBalancePO.getSalary(), Arith.sub(Arith.add(workerBalancePO.getDeposit(), _workerSalary.getMoney()), workerBalancePO.getToplimit())));
					workerBalancePO.setDeposit(workerBalancePO.getToplimit());
				} else {
					workerBalancePO.setDeposit(Arith.add(workerBalancePO.getDeposit(), _workerSalary.getMoney()));
				}
			}

			workerBalanceDao.update(workerBalancePO);

			_workerSalary.setStatus(WorkerSalaryPO.STATUS_REJECT_INT);
			_workerSalary.setApproveTime(new Timestamp(System.currentTimeMillis()));
			_workerSalary.setApprover(approval);

			workerSalaryDao.update(_workerSalary);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteWorkerSalary(WorkerSalaryVO workerSalarys, String userId, int company) throws FLException {

		UserPO approval = userDao.queryUserByUserId(userId);

		updateWorkerSalary(workerSalarys.getWsId(), approval, WorkerSalaryPO.STATUS_REPEAL_INT, company);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int collectWorkerDeposit(WorkerSalaryVO workerSalarys, String userId, int company) throws FLException {

		UserPO user = userDao.queryUserByUserId(workerSalarys.getUser().getUserId());
		UserPO userPO = userDao.queryUserByUserId(userId);

		WorkerBalancePO workerBalancePO = workerBalanceDao.queryWorkerBalanceByUserId(user.getUid(), company);

		WorkerSalaryPO workSalaryPO = new WorkerSalaryPO();

		if (workerBalancePO == null) {
			throw new FLException(280004, "工人帐户不存在");
		}

		if (Arith.sub(workerBalancePO.getDeposit(), workerBalancePO.getToplimit()) < 0) {

			if (Arith.sub(Arith.add(workerBalancePO.getDeposit(), workerSalarys.getMoney()), workerBalancePO.getToplimit()) > 0) {

				workSalaryPO.setDeposit(Arith.sub(workerBalancePO.getToplimit(), workerBalancePO.getDeposit()));
				workSalaryPO.setSalary(Arith.sub(Arith.add(workerBalancePO.getDeposit(), workerSalarys.getMoney()), workerBalancePO.getToplimit()));
				workerBalancePO.setSalary(Arith.add(workerBalancePO.getSalary(), Arith.sub(Arith.add(workerBalancePO.getDeposit(), workerSalarys.getMoney()), workerBalancePO.getToplimit())));
				workerBalancePO.setDeposit(workerBalancePO.getToplimit());

			} else {

				workSalaryPO.setDeposit(workerSalarys.getMoney());
				workSalaryPO.setSalary(0f);
				workerBalancePO.setDeposit(Arith.add(workerBalancePO.getDeposit(), workerSalarys.getMoney()));
			}

		} else {// 超过质保金上限

			workSalaryPO.setSalary(workerSalarys.getMoney());
			workSalaryPO.setDeposit(0f);
			workerBalancePO.setSalary(Arith.add(workerBalancePO.getSalary(), workerSalarys.getMoney()));

		}

		workerBalanceDao.update(workerBalancePO);

		workSalaryPO.setCompany(company);
		workSalaryPO.setMoney(workerSalarys.getMoney());
		workSalaryPO.setComment(workerSalarys.getComment());
		workSalaryPO.setCreater(new UserPO(userPO.getUid()));
		workSalaryPO.setUser(new UserPO(user.getUid()));
		workSalaryPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		workSalaryPO.setCsid(0);
		workSalaryPO.setType(WorkerSalaryPO.TYPE_ADD_INT);
		workSalaryPO.setOnetype(WorkerSalaryPO.ONETYPE_ELSE_INT);
		workSalaryPO.setTwotype(WorkerSalaryPO.TWOTYPE_PROJECT_INT);
		workSalaryPO.setStatus(WorkerSalaryPO.STATUS_PASS_INT);
		workSalaryPO.setCwsid(0);
		workSalaryPO.setApproveTime(new Timestamp(System.currentTimeMillis()));
		workSalaryPO.setApprover(userPO);

		workerSalaryDao.save(workSalaryPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int drawWorkerDeposit(WorkerSalaryVO workerSalaryVO, String userId, int company) throws FLException {

		UserPO user = userDao.queryUserByUserId(workerSalaryVO.getUser().getUserId());
		UserPO userPO = userDao.queryUserByUserId(userId);

		WorkerBalancePO workerBalancePO = workerBalanceDao.queryWorkerBalanceByUserId(user.getUid(), company);

		WorkerSalaryPO workSalaryPO = new WorkerSalaryPO();

		if (workerBalancePO == null) {
			throw new FLException(280004, "工人帐户不存在");
		}

		workerBalancePO.setDeposit(Arith.sub(workerBalancePO.getDeposit(), workerSalaryVO.getMoney()));
		workerBalanceDao.update(workerBalancePO);

		workSalaryPO.setCompany(company);
		workSalaryPO.setMoney(workerSalaryVO.getMoney());
		workSalaryPO.setComment(workerSalaryVO.getComment());
		workSalaryPO.setCreater(userPO);
		workSalaryPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		workSalaryPO.setUser(user);
		workSalaryPO.setDeposit(workerSalaryVO.getMoney());
		workSalaryPO.setCsid(0);
		workSalaryPO.setType(WorkerSalaryPO.TYPE_SUB_INT);
		workSalaryPO.setOnetype(WorkerSalaryPO.ONETYPE_ELSE_INT);
		workSalaryPO.setTwotype(WorkerSalaryPO.TWOTYPE_PROJECT_INT);
		workSalaryPO.setStatus(WorkerSalaryPO.STATUS_PASS_INT);
		workSalaryPO.setCwsid(0);
		workSalaryPO.setApproveTime(new Timestamp(System.currentTimeMillis()));
		workSalaryPO.setApprover(userPO);

		workerSalaryDao.save(workSalaryPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int cutWorkerSalary(WorkerSalaryVO workerSalaryVO, String userId, int company) throws FLException {

		UserPO cutWorker = userDao.queryUserByUserId(workerSalaryVO.getUser().getUserId());

		UserPO createWorker = userDao.queryUserByUserId(userId);

		WorkerBalancePO workerBalancePO = workerBalanceDao.queryWorkerBalanceByUserId(cutWorker.getUid(), company);
		WorkerSalaryPO workerSalaryPO = new WorkerSalaryPO();

		if (workerSalaryVO.getCsid() != null && workerSalaryVO.getCsid() != 0) {

			ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.get(workerSalaryVO.getCsid());

			if (constructionSchedulePO.getStatus() != ConstructionSchedulePO.STATUS_FINISH_INT) {
				throw new FLException(280003, "施工环节未完工");
			}

			long cid = constructionSchedulePO.getCid();
			ConstructionPO constructionPO = constructionDao.queryConstructionByCid(cid);

			if (constructionPO == null) {
				throw new FLException(120020, "工程信息不存在");
			}
			workerSalaryPO.setDecoration(new DecorationPO());
			workerSalaryPO.getDecoration().setOrderId(constructionPO.getDecoration().getOrderId());
			workerSalaryPO.setCid(cid);

			workerSalaryPO.setCsid(workerSalaryVO.getCsid());
		} else {
			workerSalaryPO.setCid(0);
			workerSalaryPO.setCsid(0);
		}

		if (workerBalancePO == null) {
			throw new FLException(280004, "工人帐户不存在");
		}

		chargeWorkerSalary(workerSalaryPO, workerSalaryVO, workerBalancePO);

		workerSalaryPO.setCompany(company);
		workerSalaryPO.setComment(workerSalaryVO.getComment());
		workerSalaryPO.setCreater(createWorker);
		workerSalaryPO.setUser(cutWorker);
		workerSalaryPO.setStatus(WorkerSalaryPO.STATUS_INIT_INT);
		workerSalaryPO.setType(WorkerSalaryPO.TYPE_SUB_INT);
		workerSalaryPO.setOnetype(WorkerSalaryPO.ONETYPE_CUT_INT);
		workerSalaryPO.setTwotype(WorkerSalaryPO.TWOTYPE_CUT_INT);
		workerSalaryPO.setCwsid(0);
		workerSalaryPO.setCreateTime(new Timestamp(System.currentTimeMillis()));

		workerSalaryDao.save(workerSalaryPO);

		workerSalaryVO.setCreateTime(workerSalaryPO.getCreateTime());
		workerSalaryVO.setStatus(workerSalaryPO.getStatus());
		workerSalaryVO.setTwotype(workerSalaryPO.getTwotype());
		workerSalaryVO.setWsId(workerSalaryPO.getWsId());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int tranWorkerSalary(WorkerSalaryVO workerSalarys, String userId, String sourceId, String targetId, int company) throws FLException {

		UserPO source = userDao.queryUserByUserId(sourceId);
		UserPO target = userDao.queryUserByUserId(targetId);

		UserPO createWorker = userDao.queryUserByUserId(userId);

		WorkerBalancePO workerBalanceSource = workerBalanceDao.queryWorkerBalanceByUserId(source.getUid(), company);
		WorkerBalancePO workerBalancetTarget = workerBalanceDao.queryWorkerBalanceByUserId(target.getUid(), company);

		WorkerSalaryPO workerSalaryPO = new WorkerSalaryPO();
		WorkerSalaryPO workSalary = new WorkerSalaryPO();
		
		SystemConfigPO systemConfigPO = systemConfigDao.querySystemConfig("workerDepositLimit", company);
	
		if (workerBalanceSource == null) {
		
			workerBalanceSource = new WorkerBalancePO();
			workerBalanceSource.setUser(source);
			workerBalanceSource.setToplimit(systemConfigPO==null?0f:Float.parseFloat(systemConfigPO.getValue()));
			workerBalanceSource.setDeposit(0f);
			workerBalanceSource.setSalary(0f);
			workerBalanceSource.setStatus(WorkerBalancePO.STATUS_VALID_INT);
			workerBalanceSource.setCompany(company);

			workerBalanceDao.save(workerBalanceSource);
		} 
	
		tranWorkerSalaryTOpayWorkerSalary(workerSalaryPO, workerSalarys, workerBalanceSource);
		
		if (workerBalancetTarget == null) {
			
			workerBalancetTarget = new WorkerBalancePO();
			workerBalancetTarget.setUser(target);
			workerBalanceSource.setToplimit(systemConfigPO==null?0f:Float.parseFloat(systemConfigPO.getValue()));
			workerBalancetTarget.setDeposit(0f);
			workerBalancetTarget.setSalary(0f);
			workerBalancetTarget.setStatus(WorkerBalancePO.STATUS_VALID_INT);
			workerBalancetTarget.setCompany(company);
		
			workerBalanceDao.save(workerBalancetTarget);
		}
	
		workerSalaryPO.setCompany(company);
		workerSalaryPO.setComment(workerSalarys.getComment());
		workerSalaryPO.setCreater(createWorker);
		workerSalaryPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		workerSalaryPO.setUser(source);
		workerSalaryPO.setStatus(WorkerSalaryPO.STATUS_INIT_INT);
		workerSalaryPO.setType(WorkerSalaryPO.TYPE_SUB_INT);
		workerSalaryPO.setOnetype(WorkerSalaryPO.ONETYPE_TRAN_INT);
		workerSalaryPO.setTwotype(WorkerSalaryPO.TWOTYPE_MAINTAIN_INT);

		workerSalaryDao.save(workerSalaryPO);

		workSalary.setCompany(company);
		workSalary.setMoney(workerSalarys.getMoney());
		workSalary.setComment(workerSalarys.getComment());
		workSalary.setCreater(createWorker);
		workSalary.setCreateTime(new Timestamp(System.currentTimeMillis()));
		workSalary.setUser(target);
		workSalary.setStatus(WorkerSalaryPO.STATUS_INIT_INT);
		workSalary.setType(WorkerSalaryPO.TYPE_ADD_INT);
		workSalary.setOnetype(WorkerSalaryPO.ONETYPE_TRAN_INT);
		workSalary.setTwotype(WorkerSalaryPO.TWOTYPE_MAINTAIN_INT);
		workSalary.setCwsid(workerSalaryPO.getWsId());
		workSalary.setDeposit(0f);
		workSalary.setSalary(0f);

		workerSalaryDao.save(workSalary);

		workerSalaryPO.setCwsid(workSalary.getWsId());

		workerSalaryDao.update(workerSalaryPO);

		return 0;

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int payWorkerSalary(WorkerSalaryVO workerSalaryVO, String userId, int company) throws FLException {

		UserPO user = userDao.queryUserByUserId(workerSalaryVO.getUser().getUserId());

		UserPO userPO = userDao.queryUserByUserId(userId);

		WorkerSalaryPO workerSalaryPO = new WorkerSalaryPO(user, userPO);

		WorkerBalancePO workerBalancePO = workerBalanceDao.queryWorkerBalanceByUserId(user.getUid(), company);

		if (workerBalancePO == null) {
			throw new FLException(280004, "工人帐户不存在");
		}

		tranWorkerSalaryTOpayWorkerSalary(workerSalaryPO, workerSalaryVO, workerBalancePO);

		workerSalaryPO.setCompany(company);
		workerSalaryPO.setCreater(userPO);
		workerSalaryPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		workerSalaryPO.setUser(user);
		workerSalaryPO.setType(WorkerSalaryPO.TYPE_SUB_INT);
		workerSalaryPO.setOnetype(WorkerSalaryPO.ONETYPE_CUT_INT);
		workerSalaryPO.setTwotype(WorkerSalaryPO.TWOTYPE_MAINTAIN_INT);
		workerSalaryPO.setComment(workerSalaryVO.getComment());
		workerSalaryPO.setStatus(WorkerSalaryPO.STATUS_PASS_INT);
		workerSalaryPO.setApproveTime(new Timestamp(System.currentTimeMillis()));
		workerSalaryPO.setApprover(userPO);

		workerSalaryDao.save(workerSalaryPO);

		return 0;
	}

	public void updateWorkerSalary(long wsid, UserPO approval, short status, int company) throws FLException {

		WorkerSalaryPO workerSalaryPO = workerSalaryDao.get(wsid);

		if (workerSalaryPO.getStatus() != WorkerSalaryPO.STATUS_INIT_INT) {
			throw new FLException(280002, "工费状态不可操作");
		}

		List<WorkerSalaryPO> workerSalary = workerSalaryDao.queryWorkerSalaryByCwsid(workerSalaryPO.getWsId());

		for (WorkerSalaryPO _workerSalary : workerSalary) {

			WorkerBalancePO workerCollect = workerBalanceDao.queryWorkerBalanceByUserId(_workerSalary.getUser().getUid(), company);

			if (workerCollect == null) {
				throw new FLException(280004, "工人帐户不存在");
			}

			if (_workerSalary.getType() == WorkerSalaryPO.TYPE_SUB_INT) {

				workerCollect.setDeposit(Arith.add(_workerSalary.getDeposit(), workerCollect.getDeposit()));
				workerCollect.setSalary(Arith.add(_workerSalary.getSalary(), workerCollect.getSalary()));

			}
			workerBalanceDao.update(workerCollect);

			_workerSalary.setApproveTime(new Timestamp(System.currentTimeMillis()));
			_workerSalary.setStatus(status);
			_workerSalary.setApprover(approval);

			workerSalaryDao.update(_workerSalary);
		}
	}

	public void chargeWorkerSalary(WorkerSalaryPO workerSalaryPO, WorkerSalaryVO workerSalarys, WorkerBalancePO workerBalancePO) throws FLException {

		Float money = workerSalarys.getMoney(); // 操作金额
		Float workerBalance = workerBalancePO.getDeposit(); // 工人账户质保金
		Float workerSalary = workerBalancePO.getSalary(); // 工人账户工费

		Float _salary = 0f;
		Float difference = 0f;

		if (Arith.sub(workerSalary, money) < 0) {

			difference = Arith.sub(money, workerSalary); // 操作金额大于工人账户工费的剩余操作金额

			_salary = workerSalary;
			workerBalancePO.setSalary(0f);
			workerBalancePO.setDeposit(Arith.sub(workerBalance, difference));
			workerBalanceDao.update(workerBalancePO);

		} else {

			_salary = money;
			workerBalancePO.setSalary(Arith.sub(workerSalary, money));

			workerBalanceDao.update(workerBalancePO);

		}

		workerSalaryPO.setMoney(money);
		workerSalaryPO.setSalary(_salary);
		workerSalaryPO.setDeposit(difference);

	}

	public void tranWorkerSalaryTOpayWorkerSalary(WorkerSalaryPO workerSalaryPO, WorkerSalaryVO workerSalarys, WorkerBalancePO workerBalancePO) throws FLException {

		Float money = workerSalarys.getMoney(); // 操作金额
		Float workerBalance = workerBalancePO.getDeposit(); // 扣款人工人账户质保金
		Float workerSalary = workerBalancePO.getSalary(); // 扣款人工人账户工费

		Float _salary = 0f;
		Float difference = 0f;

		if (Arith.sub(workerSalary, money) < 0) {

			difference = Arith.sub(money, workerSalary); // 操作金额大于工人账户工费的剩余操作金额

			_salary = workerSalary;
			workerBalancePO.setSalary(0f);
			workerBalancePO.setDeposit(Arith.sub(workerBalance, difference));

		} else {

			_salary = money;
			workerBalancePO.setSalary(Arith.sub(workerSalary, money));

		}
		workerBalanceDao.update(workerBalancePO);

		workerSalaryPO.setMoney(money);
		workerSalaryPO.setSalary(_salary);
		workerSalaryPO.setDeposit(difference);
	}

	public void addSalary(short _type, float _money, WorkerSalaryVO workerSalaryVO, WorkerBalancePO workerBalancePO, WorkerSalaryPO workerSalaryPO, int company) {
		
		if (workerSalaryVO.getMoney() < 0) {

			_type = WorkerSalaryPO.TYPE_SUB_INT;

			Float workerBalanceDeposit = workerBalancePO.getDeposit(); // 工人账户质保金
			Float workerSalary = workerBalancePO.getSalary(); // 工人账户工费

			Float difference = 0f;

			if (Arith.sub(workerSalary, _money) < 0) {

				difference = Arith.sub(_money, workerSalary); // 操作金额大于工人账户工费的剩余操作金额

				workerSalaryPO.setSalary(workerSalary);
				workerSalaryPO.setDeposit(difference);
				workerBalancePO.setSalary(0f);
				workerBalancePO.setDeposit(Arith.sub(workerBalanceDeposit, difference));

				workerBalanceDao.update(workerBalancePO);
			} else {

				workerSalaryPO.setSalary(_money);
				workerSalaryPO.setDeposit(0f);
				workerBalancePO.setSalary(Arith.sub(workerSalary, _money));

				workerBalanceDao.update(workerBalancePO);
			}
		} else {
			workerSalaryPO.setSalary(0f);
			workerSalaryPO.setDeposit(0f);
			_type = WorkerSalaryPO.TYPE_ADD_INT;
		}

		workerSalaryPO.setType(_type);
		workerSalaryPO.setCompany(company);
		workerSalaryPO.setMoney(_money);
		workerSalaryPO.setComment(workerSalaryVO.getComment());
		workerSalaryPO.setOnetype(workerSalaryVO.getOnetype());
		workerSalaryPO.setStatus(WorkerSalaryPO.STATUS_INIT_INT);
		workerSalaryPO.setTwotype(workerSalaryVO.getTwotype());
		workerSalaryPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		workerSalaryPO.setBalanceTime(new Timestamp(System.currentTimeMillis()));

		workerSalaryDao.save(workerSalaryPO);

		workerSalaryVO.setCreateTime(workerSalaryPO.getCreateTime());
		workerSalaryVO.setStatus(workerSalaryPO.getStatus());
		workerSalaryVO.setTwotype(workerSalaryPO.getTwotype());
		workerSalaryVO.setWsId(workerSalaryPO.getWsId());
	}

}
