package com.fanglin.construction.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.ConstructionNodeDao;
import com.fanglin.communion.po.ConstructionNodePO;
import com.fanglin.construction.dao.ConstructionDao;
import com.fanglin.construction.dao.ConstructionScheduleDao;
import com.fanglin.construction.po.ConstructionPO;
import com.fanglin.construction.po.ConstructionSchedulePO;
import com.fanglin.construction.service.ConstructionScheduleService;
import com.fanglin.construction.vo.ConstructionScheduleVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.service.DecorationService;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("constructionScheduleService")
@Transactional(readOnly = true)
public class ConstructionScheduleServiceImpl implements ConstructionScheduleService {

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private ConstructionNodeDao constructionNodeDao;

	@Autowired
	private ConstructionScheduleDao constructionScheduleDao;

	@Autowired
	private ConstructionDao constructionDao;
	
	@Autowired
	private DecorationService decorationService;

	@Override
	public List<ConstructionScheduleVO> queryConstructionScheduleByOrderId(ConstructionScheduleVO constructionScheduleVO) {

		List<ConstructionSchedulePO> constructionSchedulePOs = constructionScheduleDao.queryConstructionScheduleByOrderId(constructionScheduleVO.getOrderId());
		List<ConstructionScheduleVO> constructionScheduleVOs = new ArrayList<ConstructionScheduleVO>();
		
		ConstructionScheduleVO constructionSchedule;

		for (ConstructionSchedulePO constructionSchedulePO : constructionSchedulePOs) {
			
			constructionSchedule = new ConstructionScheduleVO();
			
			BeanUtil.copyProperties(constructionSchedulePO, constructionSchedule);
			
			constructionScheduleVOs.add(constructionSchedule);
		}

		return constructionScheduleVOs;
	}

	@Override
	public List<ConstructionScheduleVO> queryConstructionScheduleByCid(ConstructionScheduleVO constructionScheduleVO) {

		List<ConstructionSchedulePO> constructionSchedulePOs = constructionScheduleDao.queryConstructionScheduleByCid(constructionScheduleVO.getCid());
		List<ConstructionScheduleVO> constructionScheduleVOs = new ArrayList<ConstructionScheduleVO>();

		ConstructionScheduleVO constructionSchedule;

		for (ConstructionSchedulePO constructionSchedulePO : constructionSchedulePOs) {
			constructionSchedule = new ConstructionScheduleVO();

			BeanUtil.copyProperties(constructionSchedulePO, constructionSchedule);

			constructionScheduleVOs.add(constructionSchedule);
		}

		return constructionScheduleVOs;
	}

	@Override
	public ConstructionScheduleVO queryConstructionScheduleByOrderIdASchedule(ConstructionScheduleVO constructionScheduleVO) throws FLException {
		
		ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.queryConstructionScheduleByOrderId(constructionScheduleVO.getOrderId(), constructionScheduleVO.getSchedule());
		
		if (constructionSchedulePO == null) {
			throw new FLException(120024, "工程环节不存在");
		}
		
		ConstructionScheduleVO constructionSchedule = new ConstructionScheduleVO();
		
		BeanUtil.copyProperties(constructionSchedulePO, constructionSchedule);
		
		return constructionSchedule;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int beginConstructionSchedule(ConstructionScheduleVO constructionScheduleVO) throws FLException {

		ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.get(constructionScheduleVO.getCsid());

		if (constructionSchedulePO == null) {
			throw new FLException(120024, "工程环节不存在");
		}

		ConstructionPO constructionPO = constructionDao.get(constructionSchedulePO.getCid());

		if (constructionPO == null) {
			throw new FLException(120020, "工程信息不存在");
		}

		if (constructionSchedulePO.getStatus() != ConstructionSchedulePO.STATUS_INIT_INT) {
			throw new FLException(120025, "工程环节不可操作");
		}

		short schedule = constructionSchedulePO.getSchedule();

		DecorationPO decorationPO = constructionPO.getDecoration();
		
		ConstructionNodePO constructionNodePO = constructionNodeDao.queryConstructionNodeBySort(schedule, decorationPO.getCompany());
		
		if(constructionNodePO == null){
			throw new FLException(130026, "工程节点不存在");
		}
		
		if (constructionSchedulePO.getCheckout() == ConstructionSchedulePO.CHECKOUT_VALID_INT && decorationPO.getPaySacle() < constructionNodePO.getPrecheck()) {
			throw new FLException(120018, "装修款比例不足");
		}

		constructionSchedulePO.setStatus(ConstructionSchedulePO.STATUS_BEGIN_INT);
		constructionSchedulePO.setStartTime(DateUtil.getDateToTimestamp(new Date()));

		constructionScheduleDao.update(constructionSchedulePO);
		
		Short projectStatus = decorationPO.getProjectStatus();

		if (projectStatus != DecorationPO.PROJECTSTATUS_FINISH_INT && projectStatus < schedule) {
			decorationPO.setProjectStatus(schedule);
			decorationDao.update(decorationPO);

			constructionPO.setSchedule(schedule);
			constructionDao.update(constructionPO);
		}
		
		decorationService.sendMessage(decorationPO.getOrderId(), "工程", String.format("%s已开工", constructionNodePO.getName()));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int finishConstructionSchedule(ConstructionScheduleVO constructionScheduleVO) throws FLException {

		ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.get(constructionScheduleVO.getCsid());

		if (constructionSchedulePO == null) {
			throw new FLException(120024, "工程环节不存在");
		}

		ConstructionPO constructionPO = constructionDao.get(constructionSchedulePO.getCid());

		if (constructionPO == null) {
			throw new FLException(120020, "工程信息不存在");
		}

		if (constructionSchedulePO.getStatus() != ConstructionSchedulePO.STATUS_BEGIN_INT) {
			throw new FLException(120025, "工程环节不可操作");
		}

		short schedule = constructionSchedulePO.getSchedule();

		DecorationPO decorationPO = constructionPO.getDecoration();

		ConstructionNodePO constructionNodePO = constructionNodeDao.queryConstructionNodeBySort(schedule, decorationPO.getCompany());
		
		if(constructionNodePO == null){
			throw new FLException(130026, "工程节点不存在");
		}

		if (constructionSchedulePO.getCheckout() == ConstructionSchedulePO.CHECKOUT_VALID_INT && decorationPO.getPaySacle() < constructionNodePO.getPostcheck()) {
			throw new FLException(120018, "装修款比例不足");
		}

		constructionSchedulePO.setStatus(ConstructionSchedulePO.STATUS_FINISH_INT);
		constructionSchedulePO.setEndTime(DateUtil.getDateToTimestamp(new Date()));

		constructionScheduleDao.update(constructionSchedulePO);
		
		decorationService.sendMessage(decorationPO.getOrderId(), "工程", String.format("%s已完工", constructionNodePO.getName()));

		return 0;
	}

	@Override
	public int checkoutConstructionSchedule(ConstructionScheduleVO constructionScheduleVO) throws FLException {

		ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.get(constructionScheduleVO.getCsid());

		if (constructionSchedulePO == null) {
			throw new FLException(120024, "工程环节不存在");
		}

		if (constructionScheduleVO.getCheckout() == ConstructionSchedulePO.CHECKOUT_PASS_INT) {
			constructionSchedulePO.setCheckout(ConstructionSchedulePO.CHECKOUT_PASS_INT);
		} else {
			ConstructionPO constructionPO = constructionDao.get(constructionSchedulePO.getCid());

			if (constructionPO == null) {
				throw new FLException(120020, "工程信息不存在");
			}

			long cnid = constructionSchedulePO.getSchedule();

			DecorationPO decorationPO = constructionPO.getDecoration();
			ConstructionNodePO constructionNodePO = constructionNodeDao.get(cnid);

			if (constructionSchedulePO.getCheckout() == ConstructionSchedulePO.CHECKOUT_VALID_INT && decorationPO.getPaySacle() < constructionNodePO.getPostcheck()) {
				throw new FLException(120018, "装修款比例不足");
			}

			constructionSchedulePO.setCheckout(ConstructionSchedulePO.CHECKOUT_VALID_INT);
		}

		constructionScheduleDao.update(constructionSchedulePO);

		return 0;
	}

	// @Override
	// @SuppressWarnings("static-access")
	// @Transactional(rollbackFor = Exception.class)
	// public void setConstructionScheduleForStatus(ConstructionScheduleVO
	// constructionScheduleVO) {
	//
	// short status = constructionScheduleVO.getStatus();
	//
	// ConstructionSchedulePO constructionSchedulePO =
	// constructionScheduleDao.get(constructionScheduleVO.getCsId());
	// ConstructionPO _constructionPO =
	// constructionDao.queryConstructionByOrderId(constructionScheduleVO.getOrderId());
	//
	// DecorationPO decorationPO =
	// decorationDao.queryDecorationByOrderId(constructionSchedulePO.getOrderId());
	//
	// Short projectStatus = decorationPO.getProjectStatus();
	// Short schedule = constructionSchedulePO.getSchedule();
	//
	// ConstructionNodePO _constructionNodePO = constructionNodeDao.get((long)
	// (constructionSchedulePO.getSchedule()));
	//
	// if (projectStatus != decorationPO.PROJECTSTATUS_FINISH_INT) {
	// if (projectStatus < _constructionNodePO.getSort()) {
	//
	// decorationPO.setProjectStatus((short) schedule);
	// decorationDao.update(decorationPO);
	//
	// if (_constructionPO != null) {
	// _constructionPO.setSchedule(schedule);
	// constructionDao.update(_constructionPO);
	// }
	//
	// }
	// }
	//
	// if (constructionSchedulePO != null) {
	// constructionSchedulePO.setStatus(status);
	//
	// if (constructionSchedulePO.getSchedule() ==
	// ConstructionSchedulePO.COLUMN_SCHEDULE_ONE) {
	// ConstructionPO constructionPO =
	// constructionDao.get(constructionSchedulePO.getCid());
	// if (constructionPO != null) {
	// constructionScheduleDao.update(constructionSchedulePO);
	//
	// }
	//
	// if (status == ConstructionSchedulePO.STATUS_TYPE_FAIL_INT) {
	// List<DrawLinePO> drawLinePOs =
	// drawLineDao.queryDrawLineByOrderId(constructionSchedulePO.getOrderId());
	// if (drawLinePOs != null && drawLinePOs.size() > 0) {
	// drawLinePOs.get(0).setStatus(DrawLinePO.DRAWLINE_STATUS_FAIL_SHORT);
	// drawLineDao.update(drawLinePOs.get(0));
	// }
	// }
	// }
	//
	// if (constructionSchedulePO.getSchedule() ==
	// ConstructionSchedulePO.COLUMN_SCHEDULE_TWO) {
	// List<DrawLinePO> drawLinePOs =
	// drawLineDao.queryDrawLineByOrderId(constructionSchedulePO.getOrderId());
	//
	// if (drawLinePOs != null && drawLinePOs.size() > 0) {
	//
	// DrawLinePO drawLinePO = drawLinePOs.get(0);
	//
	// if (constructionScheduleVO.getStatus() ==
	// ConstructionSchedulePO.STATUS_TYPE_SUCCESS_INT) {
	// drawLinePO.setStatus(DrawLinePO.DRAWLINE_STATUS_SUCCESS_SHORT);
	//
	// } else if (constructionScheduleVO.getStatus() ==
	// ConstructionSchedulePO.STATUS_TYPE_FAIL_INT) {
	// drawLinePO.setStatus(DrawLinePO.DRAWLINE_STATUS_FAIL_SHORT);
	// }
	//
	// drawLineDao.update(drawLinePO);
	// }
	// }
	//
	// constructionScheduleDao.update(constructionSchedulePO);
	// }
	// }

}
