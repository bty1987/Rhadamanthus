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

		List<WorkerSalaryPO> workerSalaryPOs = workerSalaryDao.pageWorkerSalary(paging, filters);
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

			long salaryTotal = Arith.add(constructionPO.getSalaryTotal(), workerSalaryVO.getMoney());

			if (salaryTotal > constructionPO.getSalaryLimit()) {
				throw new FLException(280007, "工费已达上限");
			}

			constructionPO.setSalaryTotal(salaryTotal);

			constructionDao.update(constructionPO);

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

		WorkerBalancePO workerBalancePO = workerBalanceDao.queryWorkerBalance(worker.getUid(), company);

		if (workerBalancePO == null) {

			SystemConfigPO workerDepositLimit = systemConfigDao.querySystemConfig("workerDepositLimit", company);

			workerBalancePO = new WorkerBalancePO();

			workerBalancePO.setUser(worker);
			workerBalancePO.setToplimit(workerDepositLimit == null ? 0 : Arith.mul(Integer.valueOf(workerDepositLimit.getValue()), 1000));
			workerBalancePO.setDeposit(0);
			workerBalancePO.setSalary(0);
			workerBalancePO.setStatus(WorkerBalancePO.STATUS_VALID_INT);
			workerBalancePO.setCompany(company);

			workerBalanceDao.save(workerBalancePO);
		}

		workerSalaryPO.init(worker, creater, workerSalaryVO.getComment(), company);

		workerSalaryPO.setCount(workerSalaryDao.countWorkerSalary(workerSalaryPO.getDecoration().getOrderId(), workerSalaryPO.getCsid()) + 1);

		addSalary(workerSalaryVO, workerBalancePO, workerSalaryPO, company);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int adoptWorkerSalary(List<WorkerSalaryVO> workerSalaryVOs, String userId, int company) throws FLException {

		UserPO approval = userDao.queryUserByUserId(userId);

		for (WorkerSalaryVO workerSalaryVO : workerSalaryVOs) {

			WorkerSalaryPO workerSalaryPO = workerSalaryDao.get(workerSalaryVO.getWsId());

			if (workerSalaryPO.getStatus() != WorkerSalaryPO.STATUS_INIT_INT) {
				throw new FLException(280002, "工费状态不可操作");
			}

			List<WorkerSalaryPO> workerSalaryPOs = workerSalaryDao.queryWorkerSalaryByCwsid(workerSalaryPO.getWsId());

			for (WorkerSalaryPO _workerSalary : workerSalaryPOs) {

				WorkerBalancePO workerCollect = workerBalanceDao.queryWorkerBalance(_workerSalary.getUser().getUid(), company);

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
						_workerSalary.setDeposit(0);
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
	public int rejectWorkerSalary(WorkerSalaryVO workerSalaryVO, String userId, int company) throws FLException {

		UserPO approver = userDao.queryUserByUserId(userId);

		List<WorkerSalaryPO> workerSalaryPOs = workerSalaryDao.queryWorkerSalaryByCwsid(workerSalaryVO.getWsId());

		for (WorkerSalaryPO workerSalaryPO : workerSalaryPOs) {

			if (workerSalaryPO.getStatus() != WorkerSalaryPO.STATUS_PASS_INT) {
				throw new FLException(280002, "工费状态不可操作");
			}

			WorkerBalancePO workerBalancePO = workerBalanceDao.queryWorkerBalance(workerSalaryPO.getUser().getUid(), company);

			if (workerBalancePO == null) {
				throw new FLException(280004, "工人帐户不存在");
			}

			if (workerSalaryPO.getType() == WorkerSalaryPO.TYPE_ADD_INT) {// 类型加 , 减操作
				if (Arith.sub(workerBalancePO.getSalary(), workerSalaryPO.getMoney()) < 0) {
					workerBalancePO.setDeposit(Arith.sub(workerBalancePO.getDeposit(), Arith.sub(workerSalaryPO.getMoney(), workerBalancePO.getSalary())));
					workerBalancePO.setSalary(0);
				} else {
					workerBalancePO.setSalary(Arith.sub(workerBalancePO.getSalary(), workerSalaryPO.getMoney()));
					workerBalancePO.setDeposit(workerBalancePO.getDeposit());
				}
			}

			if (workerSalaryPO.getType() == WorkerSalaryPO.TYPE_SUB_INT) {// 类型减 , 加操作
				if (Arith.sub(Arith.add(workerBalancePO.getDeposit(), workerSalaryPO.getMoney()), workerBalancePO.getToplimit()) > 0) {
					workerBalancePO.setSalary(Arith.add(workerBalancePO.getSalary(), Arith.sub(Arith.add(workerBalancePO.getDeposit(), workerSalaryPO.getMoney()), workerBalancePO.getToplimit())));
					workerBalancePO.setDeposit(workerBalancePO.getToplimit());
				} else {
					workerBalancePO.setDeposit(Arith.add(workerBalancePO.getDeposit(), workerSalaryPO.getMoney()));
				}
			}

			workerBalanceDao.update(workerBalancePO);

			workerSalaryPO.setStatus(WorkerSalaryPO.STATUS_REJECT_INT);
			workerSalaryPO.setApproveTime(new Timestamp(System.currentTimeMillis()));
			workerSalaryPO.setApprover(approver);
			workerSalaryPO.setCount(0);

			workerSalaryDao.update(workerSalaryPO);

			workerSalaryDao.updateWorkerSalary(workerSalaryPO.getDecoration().getOrderId(), workerSalaryPO.getCsid());
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteWorkerSalary(WorkerSalaryVO workerSalaryVO, String userId, int company) throws FLException {

		UserPO approver = userDao.queryUserByUserId(userId);

		List<WorkerSalaryPO> workerSalaryPOs = workerSalaryDao.queryWorkerSalaryByCwsid(workerSalaryVO.getWsId());

		for (WorkerSalaryPO workerSalaryPO : workerSalaryPOs) {

			if (workerSalaryPO.getStatus() != WorkerSalaryPO.STATUS_INIT_INT) {
				throw new FLException(280002, "工费状态不可操作");
			}

			WorkerBalancePO workerCollect = workerBalanceDao.queryWorkerBalance(workerSalaryPO.getUser().getUid(), company);

			if (workerCollect == null) {
				throw new FLException(280004, "工人帐户不存在");
			}

			if (workerSalaryPO.getType() == WorkerSalaryPO.TYPE_SUB_INT) {
				workerCollect.setDeposit(Arith.add(workerSalaryPO.getDeposit(), workerCollect.getDeposit()));
				workerCollect.setSalary(Arith.add(workerSalaryPO.getSalary(), workerCollect.getSalary()));
			}

			workerBalanceDao.update(workerCollect);

			workerSalaryPO.setApproveTime(new Timestamp(System.currentTimeMillis()));
			workerSalaryPO.setStatus(WorkerSalaryPO.STATUS_REPEAL_INT);
			workerSalaryPO.setApprover(approver);

			workerSalaryDao.update(workerSalaryPO);

			workerSalaryDao.updateWorkerSalary(workerSalaryPO.getDecoration().getOrderId(), workerSalaryPO.getCsid());
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int collectWorkerDeposit(WorkerSalaryVO workerSalaryVO, String userId, int company) throws FLException {

		UserPO worker = userDao.queryUserByUserId(workerSalaryVO.getUser().getUserId());
		UserPO creater = userDao.queryUserByUserId(userId);

		WorkerBalancePO workerBalancePO = workerBalanceDao.queryWorkerBalance(worker.getUid(), company);

		if (workerBalancePO == null) {
			throw new FLException(280004, "工人帐户不存在");
		}

		WorkerSalaryPO workerSalaryPO = new WorkerSalaryPO();

		if (Arith.sub(workerBalancePO.getDeposit(), workerBalancePO.getToplimit()) < 0) {

			if (Arith.sub(Arith.add(workerBalancePO.getDeposit(), workerSalaryVO.getMoney()), workerBalancePO.getToplimit()) > 0) {
				workerSalaryPO.setDeposit(Arith.sub(workerBalancePO.getToplimit(), workerBalancePO.getDeposit()));
				workerSalaryPO.setSalary(Arith.sub(Arith.add(workerBalancePO.getDeposit(), workerSalaryVO.getMoney()), workerBalancePO.getToplimit()));

				workerBalancePO.setSalary(Arith.add(workerBalancePO.getSalary(), Arith.sub(Arith.add(workerBalancePO.getDeposit(), workerSalaryVO.getMoney()), workerBalancePO.getToplimit())));
				workerBalancePO.setDeposit(workerBalancePO.getToplimit());
			} else {
				workerSalaryPO.setDeposit(workerSalaryVO.getMoney());
				workerSalaryPO.setSalary(0);

				workerBalancePO.setDeposit(Arith.add(workerBalancePO.getDeposit(), workerSalaryVO.getMoney()));
			}

		} else {// 超过质保金上限

			workerSalaryPO.setSalary(workerSalaryVO.getMoney());
			workerSalaryPO.setDeposit(0);

			workerBalancePO.setSalary(Arith.add(workerBalancePO.getSalary(), workerSalaryVO.getMoney()));
		}

		workerBalanceDao.update(workerBalancePO);

		workerSalaryPO.setMoney(workerSalaryVO.getMoney());
		workerSalaryPO.setApproveTime(new Timestamp(System.currentTimeMillis()));
		workerSalaryPO.setApprover(creater);

		workerSalaryPO.init(worker, creater, workerSalaryVO.getComment(), company);
		workerSalaryPO.init(WorkerSalaryPO.TYPE_ADD_INT, WorkerSalaryPO.ONETYPE_ELSE_INT, WorkerSalaryPO.TWOTYPE_PROJECT_INT, WorkerSalaryPO.STATUS_PASS_INT);

		workerSalaryPO.approve(creater);

		workerSalaryDao.save(workerSalaryPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int drawWorkerDeposit(WorkerSalaryVO workerSalaryVO, String userId, int company) throws FLException {

		UserPO worker = userDao.queryUserByUserId(workerSalaryVO.getUser().getUserId());
		UserPO creater = userDao.queryUserByUserId(userId);

		WorkerBalancePO workerBalancePO = workerBalanceDao.queryWorkerBalance(worker.getUid(), company);

		WorkerSalaryPO workerSalaryPO = new WorkerSalaryPO();

		if (workerBalancePO == null) {
			throw new FLException(280004, "工人帐户不存在");
		}

		workerBalancePO.setDeposit(Arith.sub(workerBalancePO.getDeposit(), workerSalaryVO.getMoney()));

		workerBalanceDao.update(workerBalancePO);

		long money = workerSalaryVO.getMoney();

		workerSalaryPO.init(worker, creater, workerSalaryVO.getComment(), company);
		workerSalaryPO.init(money, money, 0);
		workerSalaryPO.init(WorkerSalaryPO.TYPE_SUB_INT, WorkerSalaryPO.ONETYPE_ELSE_INT, WorkerSalaryPO.TWOTYPE_PROJECT_INT, WorkerSalaryPO.STATUS_PASS_INT);

		workerSalaryPO.approve(creater);

		workerSalaryDao.save(workerSalaryPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int cutWorkerSalary(WorkerSalaryVO workerSalaryVO, String userId, int company) throws FLException {

		long money = workerSalaryVO.getMoney();

		UserPO worker = userDao.queryUserByUserId(workerSalaryVO.getUser().getUserId());
		UserPO creater = userDao.queryUserByUserId(userId);

		WorkerBalancePO workerBalancePO = workerBalanceDao.queryWorkerBalance(worker.getUid(), company);

		if (workerBalancePO == null) {
			throw new FLException(280004, "工人帐户不存在");
		}

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

			workerSalaryPO.setDecoration(constructionPO.getDecoration());
			workerSalaryPO.setCid(cid);
			workerSalaryPO.setCsid(workerSalaryVO.getCsid());
		} else {
			workerSalaryPO.setCid(0);
			workerSalaryPO.setCsid(0);
		}

		tranSalaryToBalance(money, workerSalaryPO, workerBalancePO);

		workerSalaryPO.init(worker, creater, workerSalaryVO.getComment(), company);
		workerSalaryPO.init(WorkerSalaryPO.TYPE_SUB_INT, WorkerSalaryPO.ONETYPE_CUT_INT, WorkerSalaryPO.TWOTYPE_CUT_INT, WorkerSalaryPO.STATUS_INIT_INT);

		workerSalaryDao.save(workerSalaryPO);

		workerSalaryVO.setCreateTime(workerSalaryPO.getCreateTime());
		workerSalaryVO.setStatus(workerSalaryPO.getStatus());
		workerSalaryVO.setTwotype(workerSalaryPO.getTwotype());
		workerSalaryVO.setWsId(workerSalaryPO.getWsId());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int tranWorkerSalary(WorkerSalaryVO workerSalaryVO, String userId, String sourceId, String targetId, int company) throws FLException {

		long money = workerSalaryVO.getMoney();

		UserPO source = userDao.queryUserByUserId(sourceId);
		UserPO target = userDao.queryUserByUserId(targetId);

		UserPO creater = userDao.queryUserByUserId(userId);

		WorkerBalancePO workerBalanceSource = workerBalanceDao.queryWorkerBalance(source.getUid(), company);
		WorkerBalancePO workerBalancetTarget = workerBalanceDao.queryWorkerBalance(target.getUid(), company);

		WorkerSalaryPO workerSalarySource = new WorkerSalaryPO();
		WorkerSalaryPO workerSalaryTarget = new WorkerSalaryPO();

		SystemConfigPO systemConfigPO = systemConfigDao.querySystemConfig("workerDepositLimit", company);

		if (workerBalanceSource == null) {

			workerBalanceSource = new WorkerBalancePO();
			workerBalanceSource.setUser(source);
			workerBalanceSource.setToplimit(systemConfigPO == null ? 0 : Arith.mul(Integer.valueOf(systemConfigPO.getValue()), 1000));
			workerBalanceSource.setDeposit(0);
			workerBalanceSource.setSalary(0);
			workerBalanceSource.setStatus(WorkerBalancePO.STATUS_VALID_INT);
			workerBalanceSource.setCompany(company);

			workerBalanceDao.save(workerBalanceSource);
		}

		tranSalaryToBalance(money, workerSalarySource, workerBalanceSource);

		if (workerBalancetTarget == null) {

			workerBalanceSource.setToplimit(systemConfigPO == null ? 0 : Arith.mul(Integer.valueOf(systemConfigPO.getValue()), 1000));

			workerBalancetTarget = new WorkerBalancePO();

			workerBalancetTarget.setUser(target);
			workerBalancetTarget.setDeposit(0);
			workerBalancetTarget.setSalary(0);
			workerBalancetTarget.setStatus(WorkerBalancePO.STATUS_VALID_INT);
			workerBalancetTarget.setCompany(company);

			workerBalanceDao.save(workerBalancetTarget);
		}

		workerSalarySource.init(source, creater, workerSalaryVO.getComment(), company);
		workerSalarySource.init(WorkerSalaryPO.TYPE_SUB_INT, WorkerSalaryPO.ONETYPE_TRAN_INT, WorkerSalaryPO.TWOTYPE_MAINTAIN_INT, WorkerSalaryPO.STATUS_INIT_INT);

		workerSalaryDao.save(workerSalarySource);

		workerSalaryTarget.init(target, creater, workerSalaryVO.getComment(), company);
		workerSalaryTarget.init(money, 0, 0);
		workerSalaryTarget.init(WorkerSalaryPO.TYPE_ADD_INT, WorkerSalaryPO.ONETYPE_TRAN_INT, WorkerSalaryPO.TWOTYPE_MAINTAIN_INT, WorkerSalaryPO.STATUS_INIT_INT);
		workerSalaryTarget.setCwsid(workerSalarySource.getWsId());

		workerSalaryDao.save(workerSalaryTarget);

		workerSalarySource.setCwsid(workerSalaryTarget.getWsId());

		workerSalaryDao.update(workerSalarySource);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int payWorkerSalary(WorkerSalaryVO workerSalaryVO, String userId, int company) throws FLException {

		long money = workerSalaryVO.getMoney();

		UserPO worker = userDao.queryUserByUserId(workerSalaryVO.getUser().getUserId());

		UserPO creater = userDao.queryUserByUserId(userId);

		WorkerSalaryPO workerSalaryPO = new WorkerSalaryPO(worker, creater);

		WorkerBalancePO workerBalancePO = workerBalanceDao.queryWorkerBalance(worker.getUid(), company);

		if (workerBalancePO == null) {
			throw new FLException(280004, "工人帐户不存在");
		}

		tranSalaryToBalance(money, workerSalaryPO, workerBalancePO);

		workerSalaryPO.init(worker, creater, workerSalaryVO.getComment(), company);
		workerSalaryPO.init(WorkerSalaryPO.TYPE_SUB_INT, WorkerSalaryPO.ONETYPE_CUT_INT, WorkerSalaryPO.TWOTYPE_MAINTAIN_INT, WorkerSalaryPO.STATUS_PASS_INT);

		workerSalaryPO.approve(creater);

		workerSalaryDao.save(workerSalaryPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int sendWorkerSalary(WorkerSalaryVO workerSalaryVO) throws FLException {

		WorkerSalaryPO workerSalaryPO = workerSalaryDao.get(workerSalaryVO.getWsId());

		if (workerSalaryPO == null) {
			throw new FLException(280001, "薪资信息不存在");
		}

		if (workerSalaryPO.getIsSend() != WorkerSalaryPO.ISSEND_UNSEND_INT) {
			throw new FLException(280002, "工费状态不可操作");
		}

		workerSalaryPO.setIsSend(WorkerSalaryPO.ISSEND_SEND_INT);

		workerSalaryDao.update(workerSalaryPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int cancelWorkerSalary(WorkerSalaryVO workerSalaryVO) throws FLException {

		WorkerSalaryPO workerSalaryPO = workerSalaryDao.get(workerSalaryVO.getWsId());

		if (workerSalaryPO == null) {
			throw new FLException(280001, "薪资信息不存在");
		}

		if (workerSalaryPO.getIsSend() != WorkerSalaryPO.ISSEND_SEND_INT) {
			throw new FLException(280002, "工费状态不可操作");
		}

		workerSalaryPO.setIsSend(WorkerSalaryPO.ISSEND_UNSEND_INT);

		workerSalaryDao.update(workerSalaryPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int batchWorkerSalary(WorkerSalaryVO workerSalaryVO, int company) throws FLException {

		workerSalaryDao.updateWorkerSalary(workerSalaryVO.getCreateTime(), workerSalaryVO.getFinishTime(), company);

		return 0;
	}

	private void tranSalaryToBalance(long money, WorkerSalaryPO workerSalaryPO, WorkerBalancePO workerBalancePO) throws FLException {

		long workerBalance = workerBalancePO.getDeposit(); // 扣款人工人账户质保金
		long workerSalary = workerBalancePO.getSalary(); // 扣款人工人账户工费

		long salary = 0;
		long difference = 0;

		if (Arith.sub(workerSalary, money) < 0) {

			difference = Arith.sub(money, workerSalary); // 操作金额大于工人账户工费的剩余操作金额

			salary = workerSalary;
			workerBalancePO.setSalary(0);
			workerBalancePO.setDeposit(Arith.sub(workerBalance, difference));

		} else {

			salary = money;
			workerBalancePO.setSalary(Arith.sub(workerSalary, money));

		}

		workerBalanceDao.update(workerBalancePO);

		workerSalaryPO.setMoney(money);
		workerSalaryPO.setSalary(salary);
		workerSalaryPO.setDeposit(difference);
	}

	private void addSalary(WorkerSalaryVO workerSalaryVO, WorkerBalancePO workerBalancePO, WorkerSalaryPO workerSalaryPO, int company) {

		short type = 0;
		long amount = Math.abs(workerSalaryVO.getMoney());

		if (workerSalaryVO.getMoney() < 0) {

			type = WorkerSalaryPO.TYPE_SUB_INT;

			long deposit = workerBalancePO.getDeposit(); // 工人账户质保金
			long salary = workerBalancePO.getSalary(); // 工人账户工费

			long difference = 0;

			if (Arith.sub(salary, amount) < 0) {

				difference = Arith.sub(amount, salary); // 操作金额大于工人账户工费的剩余操作金额

				workerSalaryPO.setSalary(salary);
				workerSalaryPO.setDeposit(difference);

				workerBalancePO.setSalary(0);
				workerBalancePO.setDeposit(Arith.sub(deposit, difference));
			} else {

				workerSalaryPO.setSalary(amount);
				workerSalaryPO.setDeposit(0);

				workerBalancePO.setSalary(Arith.sub(salary, amount));
			}
		} else {
			workerSalaryPO.setSalary(0);
			workerSalaryPO.setDeposit(0);
			type = WorkerSalaryPO.TYPE_ADD_INT;
		}

		workerBalanceDao.update(workerBalancePO);

		workerSalaryPO.setMoney(amount);

		workerSalaryPO.init(type, workerSalaryVO.getOnetype(), workerSalaryVO.getTwotype(), WorkerSalaryPO.STATUS_INIT_INT);

		workerSalaryDao.save(workerSalaryPO);

		workerSalaryVO.setCreateTime(workerSalaryPO.getCreateTime());
		workerSalaryVO.setStatus(workerSalaryPO.getStatus());
		workerSalaryVO.setTwotype(workerSalaryPO.getTwotype());
		workerSalaryVO.setWsId(workerSalaryPO.getWsId());
		workerSalaryVO.setType(workerSalaryPO.getType());

	}

}
