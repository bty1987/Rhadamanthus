package com.fanglin.construction.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
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
import com.fanglin.customer.service.DecorationService;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.salary.dao.WorkerSalaryDao;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service("constructerService")
@Transactional(readOnly = true)
public class ConstructerServiceImpl implements ConstructerService {

	private static final Logger log = LoggerFactory.getLogger(ConstructerServiceImpl.class);

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

	@Autowired
	private DecorationService decorationService;

	@Autowired
	private com.fanglin.information.dao.MessageQueuingDao messageQueuingDao;

	@Override
	public List<ConstructerVO> queryConstructerByOrderId(ConstructerVO constructerVO) {

		String orderId = constructerVO.getOrderId();
		Long csid = constructerVO.getCsid();

		List<ConstructerPO> constructerPOs = constructerDao.queryConstructerByOrderId(orderId, csid);
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

		Long cid = constructerVO.getCid();
		Long csid = constructerVO.getCsid();

		List<ConstructerPO> constructerPOs = constructerDao.queryConstructerByCid(cid, csid);
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
	public ConstructerVO queryConstructerByCrid(ConstructerVO constructerVO) {

		Long crid = constructerVO.getCrid();

		ConstructerPO constructerPO = constructerDao.queryConstructerByCrid(crid);

		constructerVO.setUser(new UserVO(new DutyVO()));

		BeanUtil.copyProperties(constructerPO, constructerVO, Arrays.asList("user", "creater"));

		BeanUtil.copyProperties(constructerPO.getUser(), constructerVO.getUser(), Arrays.asList("role", "dept", "duty"));
		BeanUtil.copyProperties(constructerPO.getUser().getDuty(), constructerVO.getUser().getDuty(), Arrays.asList("departmentType"));

		return constructerVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addConstructer(ConstructerVO constructerVO, String createrId) throws FLException {

		Long cid = constructerVO.getCid();
		Long csid = constructerVO.getCsid();

		ConstructionPO constructionPO = constructionDao.queryConstructionByCid(cid);

		if (constructionPO == null) {
			throw new FLException(120020, "工程信息不存在");
		}

		ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.get(csid);

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

		if (constructerDao.countConstructer(cid, userPO.getUid(), csid) > 0) {
			throw new FLException(120001, "当前工人已经添加,不能重复添加同一工人");
		}

		UserPO creater = userDao.queryUserByUserId(createrId);

		ConstructerPO constructerPO = new ConstructerPO(userPO, creater);

		BeanUtil.copyProperties(constructerVO, constructerPO, Arrays.asList("user", "creater"));

		constructerPO.setCid(cid);
		constructerPO.setCsid(csid);

		constructerPO.setOrderId(constructionPO.getDecoration().getOrderId());
		constructerPO.setCnid(constructionSchedulePO.getNode().getCnid());
		constructerPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		constructerPO.setStatus(ConstructerPO.STATUS_INIT_INT);

		constructerDao.save(constructerPO);

		// 生成消息队列数据
		com.fanglin.information.po.MessageQueuingPO mq = new com.fanglin.information.po.MessageQueuingPO();
		mq.setOperation("addConstructer");
		mq.setOrderId(constructionPO.getDecoration().getOrderId());
		mq.setArgs("{\"orderId\":\"" + constructionPO.getDecoration().getOrderId() + "\",\"csid\":" + csid + ",\"createrId\":\"" + createrId + "\"}");
		mq.setCreateTime(new java.sql.Timestamp(System.currentTimeMillis()));
		mq.setStatus(com.fanglin.information.po.MessageQueuingPO.STATUS_PENDING_INT);
		messageQueuingDao.save(mq);

		constructerVO.setCid(cid);
		constructerVO.setCsid(csid);

		constructerVO.setCrid(constructerPO.getCrid());
		constructerVO.setOrderId(constructerPO.getOrderId());

		constructerVO.setCnid(constructerPO.getCnid());
		constructerVO.setUser(new UserVO().setBaseInfo(userPO));
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateConstructerForRate(List<ConstructerVO> constructerVOs) throws FLException {

		ConstructerPO constructerPO;

		for (ConstructerVO constructerVO : constructerVOs) {

			constructerPO = constructerDao.get(constructerVO.getCrid());

			if (constructerPO == null) {
				throw new FLException(120021, "施工人员不存在");
			}

			short rate = constructerVO.getRate();
			short rate1 = constructerVO.getRate1();
			short rate2 = constructerVO.getRate2();

			constructerPO.setRate(rate);
			constructerPO.setRate1(rate1);
			constructerPO.setRate2(rate2);

			constructerPO.setAssessment(constructerVO.getAssessment());

			constructerPO.setFinishTime(DateUtil.getDateToTimestamp(new Date()));
			constructerPO.setStatus(ConstructerPO.STATUS_FINISH_INT);

			constructerDao.update(constructerPO);
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void rateConstructer(ConstructerVO constructerVO) throws FLException {

		ConstructerPO constructerPO = constructerDao.get(constructerVO.getCrid());

		if (constructerPO == null) {
			throw new FLException(120021, "施工人员不存在");
		}

		if (constructerPO.getStatus() != ConstructerPO.STATUS_SEND_INT) {
			throw new FLException(120022, "施工人员状态不可操作");
		}

		short rate = constructerVO.getRate();
		short rate1 = constructerVO.getRate1();
		short rate2 = constructerVO.getRate2();

		constructerPO.setRate(rate);
		constructerPO.setRate1(rate1);
		constructerPO.setRate2(rate2);

		constructerPO.setAssessment(constructerVO.getAssessment());

		constructerPO.setFinishTime(DateUtil.getDateToTimestamp(new Date()));
		constructerPO.setStatus(ConstructerPO.STATUS_FINISH_INT);

		constructerDao.update(constructerPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void sendConstructer(ConstructerVO constructerVO) throws FLException {

		ConstructerPO constructerPO = constructerDao.get(constructerVO.getCrid());

		if (constructerPO == null) {
			throw new FLException(120021, "施工人员不存在");
		}

		if (constructerPO.getStatus() != ConstructerPO.STATUS_INIT_INT) {
			throw new FLException(120022, "施工人员状态不可操作");
		}

		String orderId = constructerPO.getOrderId();

		log.info(String.format("pages/construction/constructer/valuation/valuation?orderId=%s&csid=%s&crid=%s", orderId, constructerPO.getCsid(), constructerPO.getCrid()));
		decorationService.sendMessage(orderId, "装修单", String.format("装修单号:%s, 工人评分", orderId), String.format("pages/construction/constructer/valuation/valuation?orderId=%s&csid=%s&crid=%s", orderId, constructerPO.getCsid(), constructerPO.getCrid()));

		constructerPO.setSendTime(DateUtil.getDateToTimestamp(new Date()));
		constructerPO.setStatus(ConstructerPO.STATUS_SEND_INT);

		constructerDao.update(constructerPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteConstructer(ConstructerVO constructerVO) throws FLException {

		ConstructerPO constructerPO = constructerDao.get(constructerVO.getCrid());

		if (constructerPO == null) {
			throw new FLException(120021, "施工人员不存在");
		}

		if (constructerPO.getStatus() != ConstructerPO.STATUS_INIT_INT) {
			throw new FLException(120022, "施工人员状态不可操作");
		}

		Long cid = Long.valueOf(constructerPO.getCid());
		int uid = constructerPO.getUser().getUid();

		Integer workerSalaryCount = workerSalaryDao.countWorkerSalary(cid, uid);

		if (workerSalaryCount > 0) {
			throw new FLException(120023, "施工人员存在工费,不可删除");
		}

		constructerPO.setStatus(ConstructerPO.STATUS_DISABLE_INT);

		constructerDao.update(constructerPO);

		// 生成消息队列数据
		com.fanglin.information.po.MessageQueuingPO mq = new com.fanglin.information.po.MessageQueuingPO();
		mq.setOperation("deleteConstructer");
		mq.setOrderId(constructerPO.getOrderId());
		mq.setArgs("{\"crid\":" + constructerVO.getCrid() + "}");
		mq.setCreateTime(new java.sql.Timestamp(System.currentTimeMillis()));
		mq.setStatus(com.fanglin.information.po.MessageQueuingPO.STATUS_PENDING_INT);
		messageQueuingDao.save(mq);
	}
}
