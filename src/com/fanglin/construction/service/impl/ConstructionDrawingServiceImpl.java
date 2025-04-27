package com.fanglin.construction.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.construction.dao.ConstructionDao;
import com.fanglin.construction.dao.ConstructionDrawingDao;
import com.fanglin.construction.dao.ConstructionScheduleDao;
import com.fanglin.construction.po.ConstructionDrawingPO;
import com.fanglin.construction.po.ConstructionPO;
import com.fanglin.construction.po.ConstructionSchedulePO;
import com.fanglin.construction.service.ConstructionDrawingService;
import com.fanglin.construction.vo.ConstructionDrawingVO;
import com.fanglin.construction.vo.ConstructionScheduleVO;
import com.fanglin.construction.vo.ConstructionVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.BeanUtil;

@Service("constructionDrawingService")
@Transactional(readOnly = true)
public class ConstructionDrawingServiceImpl implements ConstructionDrawingService {

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Autowired
	private ConstructionDrawingDao constructionDrawingDao;

	@Autowired
	private ConstructionDao constructionDao;

	@Autowired
	private ConstructionScheduleDao constructionScheduleDao;

	@Autowired
	private UserDao userDao;

	@Override
	public List<ConstructionDrawingVO> queryConstructionDrawingByOrderId(ConstructionVO constructionVO, ConstructionDrawingVO constructionDrawingVO) throws FLException {

		ConstructionPO constructionPO = constructionDao.queryConstructionByOrderId(constructionVO.getOrderId());

		if (constructionPO == null) {
			throw new FLException(120020, "工程信息不存在");
		}

		Long cid = constructionPO.getCid();

		Short schedule = null;

		if (constructionDrawingVO != null) {
			schedule = constructionDrawingVO.getSchedule();
		}

		List<ConstructionDrawingPO> constructionDrawingPOs = constructionDrawingDao.queryConstructionDrawingByCid(cid, schedule);
		List<ConstructionDrawingVO> constructionDrawingVOs = new ArrayList<ConstructionDrawingVO>();

		for (ConstructionDrawingPO constructionDrawingPO : constructionDrawingPOs) {

			ConstructionDrawingVO _constructionDrawingVO = new ConstructionDrawingVO();

			BeanUtil.copyProperties(constructionDrawingPO, _constructionDrawingVO, Arrays.asList("creater"));

			constructionDrawingVOs.add(_constructionDrawingVO);
		}

		return constructionDrawingVOs;
	}

	@Override
	public List<ConstructionDrawingVO> queryConstructionDrawingByCid(ConstructionDrawingVO constructionDrawingVO) {

		Long cid = constructionDrawingVO.getCid();
		Short schedule = constructionDrawingVO.getSchedule();

		List<ConstructionDrawingPO> constructionDrawingPOs = constructionDrawingDao.queryConstructionDrawingByCid(cid, schedule);
		List<ConstructionDrawingVO> constructionDrawingVOs = new ArrayList<ConstructionDrawingVO>();

		for (ConstructionDrawingPO constructionDrawingPO : constructionDrawingPOs) {

			ConstructionDrawingVO _constructionDrawingVO = new ConstructionDrawingVO();

			BeanUtil.copyProperties(constructionDrawingPO, _constructionDrawingVO, Arrays.asList("creater"));

			constructionDrawingVOs.add(_constructionDrawingVO);
		}

		return constructionDrawingVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addConstructionDrawing(ConstructionDrawingVO constructionDrawingVO, String userId, int company) throws FLException {

		long cid = constructionDrawingVO.getCid();
		short type = constructionDrawingVO.getType();

		SystemConfigPO constructionDrawingLimit = systemConfigDao.querySystemConfig("constructiondrawinglimit", company);

		if (constructionDrawingDao.countConstructionDrawing(cid, type) >= (constructionDrawingLimit == null ? 5 : Integer.valueOf(constructionDrawingLimit.getValue()))) {
			throw new FLException(110017, "资源数已达上限");
		}

		ConstructionDrawingPO constructionDrawingPO = new ConstructionDrawingPO();

		BeanUtil.copyProperties(constructionDrawingVO, constructionDrawingPO, Arrays.asList("creater"));

		constructionDrawingPO.setCreater(userDao.queryUserByUserId(userId));
		constructionDrawingPO.setCreateTime(new Timestamp(System.currentTimeMillis()));

		ConstructionSchedulePO constructionSchedulePO = null;

		if (constructionDrawingVO.getCsid() != null) {
			constructionSchedulePO = constructionScheduleDao.get(constructionDrawingVO.getCsid());
		}

		if (constructionSchedulePO == null) {
			constructionSchedulePO = constructionScheduleDao.queryConstructionScheduleByCid(constructionDrawingVO.getCid(), constructionDrawingVO.getSchedule());
		}

		if (constructionSchedulePO == null) {
			throw new FLException(120024, "工程环节不存在");
		}

		constructionDrawingPO.setCsid(constructionSchedulePO.getCsid());
		constructionDrawingPO.setCnid(constructionSchedulePO.getCnid());

		constructionDrawingDao.save(constructionDrawingPO);

		constructionDrawingVO.setCdId(constructionDrawingPO.getCdId());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public List<ConstructionDrawingVO> addConstructionDrawings(ConstructionScheduleVO constructionScheduleVO, List<ConstructionDrawingVO> constructionDrawings, String userId) {

		List<ConstructionDrawingVO> constructionDrawingVOs = new ArrayList<ConstructionDrawingVO>();

		UserPO creater = userDao.queryUserByUserId(userId);

		ConstructionSchedulePO constructionSchedulePO = null;

		if (constructionScheduleVO.getCsid() != null) {
			constructionSchedulePO = constructionScheduleDao.get(constructionScheduleVO.getCsid());
		}

		if (constructionSchedulePO == null) {
			constructionSchedulePO = constructionScheduleDao.queryConstructionScheduleByCid(constructionScheduleVO.getCid(), constructionScheduleVO.getSchedule());
		}

		for (ConstructionDrawingVO constructionDrawingVO : constructionDrawings) {

			ConstructionDrawingPO constructionDrawingPO = new ConstructionDrawingPO();

			BeanUtil.copyProperties(constructionDrawingVO, constructionDrawingPO, Arrays.asList("creater"));

			constructionDrawingPO.setCreater(creater);
			constructionDrawingPO.setCreateTime(new Timestamp(System.currentTimeMillis()));

			if (constructionSchedulePO == null) continue;

			constructionDrawingPO.setCsid(constructionSchedulePO.getCsid());
			constructionDrawingPO.setCnid(constructionSchedulePO.getCnid());

			constructionDrawingDao.save(constructionDrawingPO);

			BeanUtil.copyProperties(constructionDrawingPO, constructionDrawingVO, Arrays.asList("creater"));

		}

		return constructionDrawingVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteConstructionDrawingByCdId(ConstructionDrawingVO constructionDrawingVO) {

		constructionDrawingDao.deleteById(constructionDrawingVO.getCdId());

	}

}
