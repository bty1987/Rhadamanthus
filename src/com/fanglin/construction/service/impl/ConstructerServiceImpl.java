package com.fanglin.construction.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.DutyVO;
import com.fanglin.construction.dao.ConstructerDao;
import com.fanglin.construction.dao.ConstructionDao;
import com.fanglin.construction.dao.ConstructionScheduleDao;
import com.fanglin.construction.po.ConstructerPO;
import com.fanglin.construction.po.ConstructionPO;
import com.fanglin.construction.po.ConstructionSchedulePO;
import com.fanglin.construction.service.ConstructerService;
import com.fanglin.construction.vo.ConstructerVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.salary.dao.WorkerSalaryDao;
import com.fanglin.utils.BeanUtil;

@Service("constructerService")
@Transactional(readOnly = true)
public class ConstructerServiceImpl implements ConstructerService {

	@Autowired
	private ConstructerDao constructerDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private ConstructionDao constructionDao;

	@Autowired
	private ConstructionScheduleDao constructionScheduleDao;

	@Autowired
	private WorkerSalaryDao workerSalaryDao;

	@Override
	public List<ConstructerVO> queryConstructerByOrderId(ConstructerVO constructerVO) {

		// 通过订单编号获取施工人员信息 , 同时可以利用schedule获取具体施工环节人员信息
		// 如果schedule没有传值将返回订单编号对应的所有施工人员信息

		String orderId = constructerVO.getOrderId();
		Short schedule = constructerVO.getSchedule();

		List<ConstructerPO> constructerPOs = constructerDao.queryConstructerByOrderId(orderId, schedule);
		List<ConstructerVO> constructerVOs = new ArrayList<ConstructerVO>();

		for (ConstructerPO constructerPO : constructerPOs) {

			ConstructerVO constructer = new ConstructerVO(new UserVO(new DutyVO()));

			BeanUtil.copyProperties(constructerPO, constructer, Arrays.asList("user", "creater"));
			BeanUtil.copyProperties(constructerPO.getUser(), constructer.getUser(), Arrays.asList("role", "dept", "duty"));
			BeanUtil.copyProperties(constructerPO.getUser().getDuty(), constructer.getUser().getDuty(), Arrays.asList("departmentType"));

			constructerVOs.add(constructer);
		}

		return constructerVOs;
	}

	@Override
	public List<ConstructerVO> queryConstructerByCid(ConstructerVO constructerVO) {

		long cid = constructerVO.getCid();
		short schedule = constructerVO.getSchedule();

		List<ConstructerPO> constructerPOs = constructerDao.queryConstructerByCid(cid, schedule);
		List<ConstructerVO> constructerVOs = new ArrayList<ConstructerVO>();

		for (ConstructerPO constructerPO : constructerPOs) {

			ConstructerVO constructer = new ConstructerVO(new UserVO(new DutyVO()));

			BeanUtil.copyProperties(constructerPO, constructer, Arrays.asList("user", "creater"));
			BeanUtil.copyProperties(constructerPO.getUser(), constructer.getUser(), Arrays.asList("role", "dept", "duty"));
			BeanUtil.copyProperties(constructerPO.getUser().getDuty(), constructer.getUser().getDuty(), Arrays.asList("departmentType"));

			constructerVOs.add(constructer);
		}

		return constructerVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addConstructer(ConstructerVO constructerVO, String createrId) throws FLException {

		long cid = constructerVO.getCid();
		short schedule = constructerVO.getSchedule();

		ConstructionPO constructionPO = constructionDao.queryConstructionByCid(cid);

		if (constructionPO == null) {
			throw new FLException(120020, "工程信息不存在");
		}

		ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.queryConstructionScheduleByCid(cid, schedule);

		if (constructionSchedulePO == null) {
			throw new FLException(120024, "工程环节不存在");
		}

		if (constructionSchedulePO.getStatus() == ConstructionSchedulePO.STATUS_INIT_INT) {
			throw new FLException(120026, "工程环节未开工");
		}

		UserPO userPO = userDao.queryUserByUserId(constructerVO.getUser().getUserId());

		if (userPO == null) {
			throw new FLException(220005, "员工不存在");
		}

		if (constructerDao.countConstructer(cid, userPO.getUid(), schedule, ConstructerPO.STATUS_ENABLE_SHORT) > 0) {
			throw new FLException(120001, "当前工人已经添加,不能重复添加同一工人");
		}

		UserPO creater = userDao.queryUserByUserId(createrId);

		ConstructerPO constructerPO = new ConstructerPO(userPO, creater);

		BeanUtil.copyProperties(constructerVO, constructerPO, Arrays.asList("user", "creater"));

		constructerPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		constructerPO.setOrderId(constructionPO.getDecoration().getOrderId());

		constructerDao.save(constructerPO);

		constructerVO.setCrid(constructerPO.getCrid());
		constructerVO.setUser(new UserVO().setBaseInfo(userPO));
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateConstructerForRate(List<ConstructerVO> constructerVOs) throws FLException {

		ConstructerPO constructerPO;

		for (ConstructerVO constructerVO : constructerVOs) {
			constructerPO = constructerDao.queryConstructerByCrId(constructerVO.getCrid());

			if (constructerPO == null) {
				throw new FLException(120021, "施工人员不存在");
			}

			short rate = constructerVO.getRate();
			constructerPO.setRate(rate);
			constructerPO.setAssessment(constructerVO.getAssessment());

			constructerDao.update(constructerPO);
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteConstructer(ConstructerVO constructerVO) throws FLException {
		long crid = constructerVO.getCrid();
		ConstructerPO constructerPO = constructerDao.queryConstructerByCrId(crid);

		if (constructerPO == null) {
			throw new FLException(120021, "施工人员不存在");
		}

		Long cid = Long.valueOf(constructerPO.getCid());
		int uid = constructerPO.getUser().getUid();

		Integer workerSalaryCount = workerSalaryDao.countWorkerSalary(cid, uid);

		if (workerSalaryCount > 0) {
			throw new FLException(120023, "施工人员存在工费,不可删除");
		}

		constructerPO.setStatus(ConstructerPO.STATUS_DISABLE_SHORT);
		constructerDao.update(constructerPO);
	}

}
